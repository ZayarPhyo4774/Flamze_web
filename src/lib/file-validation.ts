const JPEG = [0xff, 0xd8, 0xff] as const;
const PNG = [0x89, 0x50, 0x4e, 0x47] as const;
const WEBM = [0x1a, 0x45, 0xdf, 0xa3] as const;

function startsWithBytes(buffer: Buffer, bytes: readonly number[]) {
  if (buffer.length < bytes.length) return false;
  return bytes.every((byte, index) => buffer[index] === byte);
}

export function detectImageMime(buffer: Buffer): string | null {
  if (startsWithBytes(buffer, JPEG)) return "image/jpeg";
  if (startsWithBytes(buffer, PNG)) return "image/png";
  if (
    buffer.length >= 12 &&
    buffer.slice(0, 4).toString("ascii") === "RIFF" &&
    buffer.slice(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

export function detectVideoMime(buffer: Buffer): string | null {
  if (startsWithBytes(buffer, WEBM)) return "video/webm";
  if (buffer.length >= 12 && buffer.slice(4, 8).toString("ascii") === "ftyp") {
    return "video/mp4";
  }
  return null;
}
