import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertSafeHref, clampText, CMS_TEXT_LIMITS, parseOptionalSafeHref, parseRequiredSafeHref } from "@/lib/safe-href";
import {
  DEFAULT_LANDING_PAGE,
  DEFAULT_LANDING_SECTIONS,
  LANDING_PAGE_ID,
} from "@/lib/site-content-defaults";
import { ensureSiteContentSeeded } from "@/lib/site-content";

export async function GET(request: NextRequest) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  await ensureSiteContentSeeded();

  const [landing, sections] = await Promise.all([
    prisma.landingPage.findUniqueOrThrow({ where: { id: LANDING_PAGE_ID } }),
    prisma.landingSection.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return NextResponse.json({ landing, sections });
}

export async function PUT(request: NextRequest) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  try {
    await ensureSiteContentSeeded();
    const body = await request.json();
    const { landing: landingInput, sections: sectionsInput } = body as {
      landing?: Record<string, unknown>;
      sections?: Array<Record<string, unknown>>;
    };

    if (landingInput) {
      const ctaHrefResult = parseRequiredSafeHref(
        landingInput.ctaHref,
        "ctaHref",
        DEFAULT_LANDING_PAGE.ctaHref
      );
      if ("error" in ctaHrefResult) {
        return NextResponse.json({ error: ctaHrefResult.error }, { status: 400 });
      }

      const heroVideoUrlResult = parseRequiredSafeHref(
        landingInput.heroVideoUrl,
        "heroVideoUrl",
        DEFAULT_LANDING_PAGE.heroVideoUrl
      );
      if ("error" in heroVideoUrlResult) {
        return NextResponse.json({ error: heroVideoUrlResult.error }, { status: 400 });
      }

      const heroPosterUrlResult = parseOptionalSafeHref(landingInput.heroPosterUrl, "heroPosterUrl");
      if ("error" in heroPosterUrlResult) {
        return NextResponse.json({ error: heroPosterUrlResult.error }, { status: 400 });
      }

      const heroVideoUrlMobileResult = parseOptionalSafeHref(
        landingInput.heroVideoUrlMobile,
        "heroVideoUrlMobile"
      );
      if ("error" in heroVideoUrlMobileResult) {
        return NextResponse.json({ error: heroVideoUrlMobileResult.error }, { status: 400 });
      }

      const heroPosterUrlMobileResult = parseOptionalSafeHref(
        landingInput.heroPosterUrlMobile,
        "heroPosterUrlMobile"
      );
      if ("error" in heroPosterUrlMobileResult) {
        return NextResponse.json({ error: heroPosterUrlMobileResult.error }, { status: 400 });
      }

      await prisma.landingPage.update({
        where: { id: LANDING_PAGE_ID },
        data: {
          eyebrowEn:
            clampText(String(landingInput.eyebrowEn ?? ""), CMS_TEXT_LIMITS.short) ??
            DEFAULT_LANDING_PAGE.eyebrowEn,
          eyebrowMy: clampText(
            landingInput.eyebrowMy != null ? String(landingInput.eyebrowMy) : null,
            CMS_TEXT_LIMITS.short
          ),
          titleEn:
            clampText(String(landingInput.titleEn ?? ""), CMS_TEXT_LIMITS.title) ??
            DEFAULT_LANDING_PAGE.titleEn,
          titleMy: clampText(
            landingInput.titleMy != null ? String(landingInput.titleMy) : null,
            CMS_TEXT_LIMITS.title
          ),
          subtitleEn:
            clampText(String(landingInput.subtitleEn ?? ""), CMS_TEXT_LIMITS.title) ??
            DEFAULT_LANDING_PAGE.subtitleEn,
          subtitleMy: clampText(
            landingInput.subtitleMy != null ? String(landingInput.subtitleMy) : null,
            CMS_TEXT_LIMITS.title
          ),
          ctaLabelEn:
            clampText(String(landingInput.ctaLabelEn ?? ""), CMS_TEXT_LIMITS.label) ??
            DEFAULT_LANDING_PAGE.ctaLabelEn,
          ctaLabelMy: clampText(
            landingInput.ctaLabelMy != null ? String(landingInput.ctaLabelMy) : null,
            CMS_TEXT_LIMITS.label
          ),
          ctaHref: ctaHrefResult.value,
          heroVideoUrl: heroVideoUrlResult.value,
          heroVideoUrlMobile: heroVideoUrlMobileResult.value,
          heroPosterUrl: clampText(heroPosterUrlResult.value, CMS_TEXT_LIMITS.title),
          heroPosterUrlMobile: clampText(heroPosterUrlMobileResult.value, CMS_TEXT_LIMITS.title),
        },
      });
    }

    if (Array.isArray(sectionsInput)) {
      const knownKeys = new Set(DEFAULT_LANDING_SECTIONS.map((s) => s.key));

      for (const section of sectionsInput) {
        const id = typeof section.id === "string" ? section.id : null;
        if (!id) continue;

        const current = await prisma.landingSection.findUnique({ where: { id } });
        if (!current || !knownKeys.has(current.key as (typeof DEFAULT_LANDING_SECTIONS)[number]["key"])) {
          continue;
        }

        let ctaHref: string | null | undefined = undefined;
        if (section.ctaHref !== undefined) {
          if (section.ctaHref == null || String(section.ctaHref).trim() === "") {
            ctaHref = null;
          } else {
            const href = String(section.ctaHref).trim();
            const hrefError = assertSafeHref(href, "ctaHref");
            if (hrefError) {
              return NextResponse.json({ error: hrefError }, { status: 400 });
            }
            ctaHref = href;
          }
        }

        let imageUrl: string | null | undefined = undefined;
        if (section.imageUrl !== undefined) {
          if (section.imageUrl == null || String(section.imageUrl).trim() === "") {
            imageUrl = null;
          } else {
            const imageResult = parseOptionalSafeHref(section.imageUrl, "imageUrl");
            if ("error" in imageResult) {
              return NextResponse.json({ error: imageResult.error }, { status: 400 });
            }
            imageUrl = imageResult.value;
          }
        }

        await prisma.landingSection.update({
          where: { id },
          data: {
            ...(section.sortOrder !== undefined && {
              sortOrder: Number(section.sortOrder) || 0,
            }),
            ...(section.isVisible !== undefined && {
              isVisible: Boolean(section.isVisible),
            }),
            ...(section.eyebrowEn !== undefined && {
              eyebrowEn: clampText(String(section.eyebrowEn ?? ""), CMS_TEXT_LIMITS.short),
            }),
            ...(section.eyebrowMy !== undefined && {
              eyebrowMy: clampText(
                section.eyebrowMy != null ? String(section.eyebrowMy) : null,
                CMS_TEXT_LIMITS.short
              ),
            }),
            ...(section.titleEn !== undefined && {
              titleEn: clampText(String(section.titleEn ?? ""), CMS_TEXT_LIMITS.title),
            }),
            ...(section.titleMy !== undefined && {
              titleMy: clampText(
                section.titleMy != null ? String(section.titleMy) : null,
                CMS_TEXT_LIMITS.title
              ),
            }),
            ...(section.descriptionEn !== undefined && {
              descriptionEn: clampText(
                String(section.descriptionEn ?? ""),
                CMS_TEXT_LIMITS.description
              ),
            }),
            ...(section.descriptionMy !== undefined && {
              descriptionMy: clampText(
                section.descriptionMy != null ? String(section.descriptionMy) : null,
                CMS_TEXT_LIMITS.description
              ),
            }),
            ...(section.ctaLabelEn !== undefined && {
              ctaLabelEn: clampText(
                String(section.ctaLabelEn ?? ""),
                CMS_TEXT_LIMITS.label
              ),
            }),
            ...(section.ctaLabelMy !== undefined && {
              ctaLabelMy: clampText(
                section.ctaLabelMy != null ? String(section.ctaLabelMy) : null,
                CMS_TEXT_LIMITS.label
              ),
            }),
            ...(ctaHref !== undefined && { ctaHref }),
            ...(imageUrl !== undefined && { imageUrl }),
          },
        });
      }
    }

    const [landing, sections] = await Promise.all([
      prisma.landingPage.findUniqueOrThrow({ where: { id: LANDING_PAGE_ID } }),
      prisma.landingSection.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    return NextResponse.json({ landing, sections });
  } catch (error) {
    console.error("Failed to update site content", error);
    const message =
      error instanceof Error &&
      error.name === "PrismaClientValidationError" &&
      error.message.includes("heroVideoUrlMobile")
        ? "Database schema is out of date. Run: npx prisma migrate deploy && npx prisma generate, then restart the dev server."
        : "Failed to update site content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
