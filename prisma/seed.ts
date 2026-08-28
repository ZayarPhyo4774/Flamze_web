import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const prisma = new PrismaClient({
  adapter: connectionString.includes("neon.tech")
    ? new PrismaNeon({ connectionString })
    : new PrismaPg(new Pool({ connectionString })),
});

const CATEGORIES = [
  { slug: "hotpot", name: "Hotpot", sortOrder: 1 },
  { slug: "bbq", name: "BBQ", sortOrder: 2 },
  { slug: "drinks", name: "Drinks", sortOrder: 3 },
  { slug: "specials", name: "Specials", sortOrder: 4 },
];

const BRANCHES = [
  {
    slug: "yangon",
    name: "Flamze Yangon",
    address: "Downtown Yangon",
    phone: "+95 9 123 456 789",
    openingHours: "Daily, 11:00 AM - 10:00 PM",
    mapUrl: "https://maps.google.com/?q=Downtown+Yangon",
  },
  {
    slug: "mandalay",
    name: "Flamze Mandalay",
    address: "Chan Aye Thar Zan",
    phone: "+95 9 234 567 890",
    openingHours: "Daily, 11:00 AM - 10:00 PM",
    mapUrl: "https://maps.google.com/?q=Chan+Aye+Thar+Zan+Mandalay",
  },
  {
    slug: "naypyidaw",
    name: "Flamze Naypyidaw",
    address: "Hotel Zone",
    phone: "+95 9 345 678 901",
    openingHours: "Daily, 11:00 AM - 10:00 PM",
    mapUrl: "https://maps.google.com/?q=Hotel+Zone+Naypyidaw",
  },
];

const MENU_ITEMS = [
  {
    name: "Signature Spicy Broth",
    description: "Rich Sichuan-style broth with aromatic spices",
    price: 15000,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80",
    categorySlug: "hotpot",
  },
  {
    name: "Tom Yum Hotpot",
    description: "Thai-inspired tangy and spicy soup base",
    price: 14000,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    categorySlug: "hotpot",
  },
  {
    name: "Premium Wagyu Slices",
    description: "Thinly sliced marbled beef, 120g",
    price: 28000,
    image: "https://images.unsplash.com/photo-1603048588665-791ca794aea5?w=800&q=80",
    categorySlug: "hotpot",
  },
  {
    name: "Fresh Seafood Platter",
    description: "Prawns, squid, fish fillet & mussels",
    price: 32000,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    categorySlug: "hotpot",
  },
  {
    name: "BBQ Beef Short Ribs",
    description: "Char-grilled with house marinade",
    price: 22000,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    categorySlug: "bbq",
  },
  {
    name: "Grilled Lamb Skewers",
    description: "Four skewers with cumin spice rub",
    price: 18000,
    image: "https://images.unsplash.com/photo-1529042410799-b584c5c22a67?w=800&q=80",
    categorySlug: "bbq",
  },
  {
    name: "Honey Glazed Chicken Wings",
    description: "Crispy wings with sweet chili glaze",
    price: 12000,
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&q=80",
    categorySlug: "bbq",
  },
  {
    name: "Thai Milk Tea",
    description: "Classic creamy Thai cha yen",
    price: 3500,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
    categorySlug: "drinks",
  },
  {
    name: "Fresh Mango Smoothie",
    description: "Blended with seasonal Myanmar mangoes",
    price: 4500,
    image: "https://images.unsplash.com/photo-1505252585467-126054a33009?w=800&q=80",
    categorySlug: "drinks",
  },
  {
    name: "Lychee Sparkling",
    description: "Refreshing lychee soda with mint",
    price: 4000,
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=800&q=80",
    categorySlug: "drinks",
  },
  {
    name: "Chef's Combo Feast",
    description: "Hotpot + BBQ platter for 2–3 guests",
    price: 55000,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    categorySlug: "specials",
  },
  {
    name: "Weekend Seafood Tower",
    description: "Limited weekend special — book ahead",
    price: 68000,
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
    categorySlug: "specials",
  },
];

async function seedSiteContent() {
  const { translations } = await import("../src/i18n/translations");
  const en = translations.en;
  const my = translations.my;

  await prisma.landingPage.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      eyebrowEn: en.hero.eyebrow,
      eyebrowMy: my.hero.eyebrow,
      titleEn: en.hero.title,
      titleMy: my.hero.title,
      subtitleEn: en.hero.subtitle,
      subtitleMy: my.hero.subtitle,
      ctaLabelEn: en.hero.viewMenu,
      ctaLabelMy: my.hero.viewMenu,
      ctaHref: "/menu?branch=yangon",
      heroVideoUrl: "/video/hero.mp4",
    },
  });

  const sections = [
    {
      key: "signature",
      sortOrder: 10,
      eyebrowEn: en.landing.signatureEyebrow,
      eyebrowMy: my.landing.signatureEyebrow,
      titleEn: en.landing.signatureTitle,
      titleMy: my.landing.signatureTitle,
      ctaLabelEn: en.landing.viewFullMenu,
      ctaLabelMy: my.landing.viewFullMenu,
      ctaHref: "/#branches",
    },
    {
      key: "branches",
      sortOrder: 20,
      eyebrowEn: en.landing.branchesEyebrow,
      eyebrowMy: my.landing.branchesEyebrow,
      titleEn: en.landing.branchesTitle,
      titleMy: my.landing.branchesTitle,
      descriptionEn: en.landing.branchesDescription,
      descriptionMy: my.landing.branchesDescription,
    },
    {
      key: "locations",
      sortOrder: 30,
      eyebrowEn: en.landing.locationsEyebrow,
      eyebrowMy: my.landing.locationsEyebrow,
      titleEn: en.landing.locationsTitle,
      titleMy: my.landing.locationsTitle,
      descriptionEn: en.landing.locationsDescription,
      descriptionMy: my.landing.locationsDescription,
    },
    {
      key: "about",
      sortOrder: 40,
      eyebrowEn: en.landing.aboutEyebrow,
      eyebrowMy: my.landing.aboutEyebrow,
      titleEn: en.landing.aboutTitle,
      titleMy: my.landing.aboutTitle,
      descriptionEn: en.landing.aboutDescription,
      descriptionMy: my.landing.aboutDescription,
    },
    {
      key: "cta",
      sortOrder: 50,
      eyebrowEn: en.landing.ctaEyebrow,
      eyebrowMy: my.landing.ctaEyebrow,
      titleEn: en.landing.ctaTitle,
      titleMy: my.landing.ctaTitle,
      ctaLabelEn: en.landing.viewFullMenu,
      ctaLabelMy: my.landing.viewFullMenu,
      ctaHref: "/#branches",
    },
    {
      key: "footer",
      sortOrder: 60,
      descriptionEn: en.landing.footerDescription,
      descriptionMy: my.landing.footerDescription,
    },
  ];

  for (const section of sections) {
    await prisma.landingSection.upsert({
      where: { key: section.key },
      update: {},
      create: section,
    });
  }

  const navCount = await prisma.navLink.count();
  if (navCount === 0) {
    await prisma.navLink.createMany({
      data: [
        { labelEn: en.nav.home, labelMy: my.nav.home, href: "/", sortOrder: 10 },
        { labelEn: en.nav.menu, labelMy: my.nav.menu, href: "/#signature", sortOrder: 20 },
        { labelEn: en.nav.branches, labelMy: my.nav.branches, href: "/#branches", sortOrder: 30 },
        { labelEn: en.nav.locations, labelMy: my.nav.locations, href: "/#locations", sortOrder: 40 },
        { labelEn: en.nav.about, labelMy: my.nav.about, href: "/#about", sortOrder: 50 },
      ],
    });
  }
}

async function main() {
  console.log("Seeding database...");

  await seedSiteContent();

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  const categories = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  for (const branch of BRANCHES) {
    const created = await prisma.branch.upsert({
      where: { slug: branch.slug },
      update: branch,
      create: branch,
    });

    for (const item of MENU_ITEMS) {
      const priceMultiplier =
        branch.slug === "yangon" ? 1 : branch.slug === "mandalay" ? 0.95 : 1.05;
      const existing = await prisma.menuItem.findFirst({
        where: { name: item.name, branchId: created.id },
      });

      if (existing) {
        await prisma.menuItem.update({
          where: { id: existing.id },
          data: {
            description: item.description,
            price: Math.round(item.price * priceMultiplier),
            image: item.image,
            categoryId: categoryMap[item.categorySlug],
          },
        });
      } else {
        await prisma.menuItem.create({
          data: {
            name: item.name,
            description: item.description,
            price: Math.round(item.price * priceMultiplier),
            image: item.image,
            branchId: created.id,
            categoryId: categoryMap[item.categorySlug],
          },
        });
      }
    }
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
