-- AlterTable: Category parent for one-level subcategories
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "parentId" TEXT;

CREATE INDEX IF NOT EXISTS "Category_parentId_idx" ON "Category"("parentId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Category_parentId_fkey'
  ) THEN
    ALTER TABLE "Category"
      ADD CONSTRAINT "Category_parentId_fkey"
      FOREIGN KEY ("parentId") REFERENCES "Category"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- CreateTable: LandingPage
CREATE TABLE IF NOT EXISTS "LandingPage" (
    "id" TEXT NOT NULL,
    "eyebrowEn" TEXT NOT NULL DEFAULT '',
    "eyebrowMy" TEXT,
    "titleEn" TEXT NOT NULL DEFAULT '',
    "titleMy" TEXT,
    "subtitleEn" TEXT NOT NULL DEFAULT '',
    "subtitleMy" TEXT,
    "ctaLabelEn" TEXT NOT NULL DEFAULT '',
    "ctaLabelMy" TEXT,
    "ctaHref" TEXT NOT NULL DEFAULT '/menu?branch=yangon',
    "heroVideoUrl" TEXT NOT NULL DEFAULT '/video/hero.mp4',
    "heroPosterUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable: LandingSection
CREATE TABLE IF NOT EXISTS "LandingSection" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "eyebrowEn" TEXT,
    "eyebrowMy" TEXT,
    "titleEn" TEXT,
    "titleMy" TEXT,
    "descriptionEn" TEXT,
    "descriptionMy" TEXT,
    "ctaLabelEn" TEXT,
    "ctaLabelMy" TEXT,
    "ctaHref" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingSection_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "LandingSection_key_key" ON "LandingSection"("key");

-- CreateTable: NavLink
CREATE TABLE IF NOT EXISTS "NavLink" (
    "id" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "labelMy" TEXT,
    "href" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavLink_pkey" PRIMARY KEY ("id")
);
