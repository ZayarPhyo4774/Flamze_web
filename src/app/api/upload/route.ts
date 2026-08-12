import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/auth";
import { detectImageMime, detectVideoMime } from "@/lib/file-validation";

const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const VIDEO_MAX_SIZE = 50 * 1024 * 1024; // 50MB
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);
const SUPABASE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "menu";
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const useCloudinary = Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);

if (useCloudinary) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

async function uploadToLocal(file: File, filename: string, folder: "menu" | "hero") {
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/${folder}/${filename}`;
}

async function uploadToCloudinary(
  file: File,
  filename: string,
  folder: "menu" | "hero",
  resourceType: "image" | "video"
) {
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const publicId = `${folder}/${path.parse(filename).name}`;

  const result = await new Promise<{ secure_url?: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: resourceType,
        folder: undefined,
        overwrite: false,
      },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(uploadResult);
      }
    );
    stream.end(fileBuffer);
  });

  if (!result.secure_url) {
    throw new Error("Cloudinary upload failed");
  }

  return result.secure_url;
}

async function uploadToSupabase(file: File, filename: string, folder: "menu" | "hero") {
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const objectPath = `${folder}/${filename}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(objectPath, fileBuffer, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicData } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(objectPath);

  if (!publicData?.publicUrl) {
    throw new Error("Failed to get public URL");
  }

  return publicData.publicUrl;
}

function extensionFor(mime: string, kind: "image" | "hero-video") {
  if (kind === "hero-video") {
    if (mime === "video/webm") return "webm";
    return "mp4";
  }
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

export async function POST(request: NextRequest) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error("Upload failed: could not parse form data", error);
    return NextResponse.json(
      {
        error:
          "Upload body too large or malformed. Hero videos must be under 50MB — restart the dev server after config changes.",
      },
      { status: 413 }
    );
  }

  try {
    const file = formData.get("file");
    const kind = String(formData.get("kind") ?? "image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isVideo = kind === "hero-video";
    const allowed = isVideo ? VIDEO_TYPES : IMAGE_TYPES;
    const maxSize = isVideo ? VIDEO_MAX_SIZE : IMAGE_MAX_SIZE;
    const folder = isVideo ? "hero" : "menu";
    const resourceType = isVideo ? "video" : "image";

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const detectedMime = isVideo ? detectVideoMime(fileBuffer) : detectImageMime(fileBuffer);

    if (!detectedMime || !allowed.has(detectedMime)) {
      return NextResponse.json(
        {
          error: isVideo
            ? "Only MP4 and WebM videos are allowed"
            : "Only JPEG, PNG, and WebP images are allowed",
        },
        { status: 400 }
      );
    }

    const nameExt = path.extname(file.name).toLowerCase();
    const allowedExts = isVideo ? new Set([".mp4", ".webm"]) : new Set([".jpg", ".jpeg", ".png", ".webp"]);
    if (nameExt && !allowedExts.has(nameExt)) {
      return NextResponse.json({ error: "Invalid file extension" }, { status: 400 });
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: isVideo ? "Video must be under 50MB" : "File must be under 5MB" },
        { status: 400 }
      );
    }

    const ext = extensionFor(detectedMime, isVideo ? "hero-video" : "image");
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const uploadFile = new File([fileBuffer], file.name, { type: detectedMime });

    if (isVideo) {
      const url = useCloudinary
        ? await uploadToCloudinary(uploadFile, filename, "hero", "video")
        : supabase
          ? await uploadToSupabase(uploadFile, filename, "hero")
          : await uploadToLocal(uploadFile, filename, "hero");
      return NextResponse.json({ url });
    }

    const url = useCloudinary
      ? await uploadToCloudinary(uploadFile, filename, folder, resourceType)
      : supabase
        ? await uploadToSupabase(uploadFile, filename, folder)
        : await uploadToLocal(uploadFile, filename, folder);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
