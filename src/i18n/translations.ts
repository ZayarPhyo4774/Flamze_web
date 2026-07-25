export type Locale = "en" | "my";

export const locales: Locale[] = ["en", "my"];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  my: "မြန်မာ",
};

export const translations = {
  en: {
    nav: {
      admin: "Admin",
      home: "Home",
      menu: "Menu",
      branches: "Branches",
      locations: "Locations",
      about: "About",
      viewMenu: "View Menu",
    },
    hero: {
      eyebrow: "Flame grilled • Slow simmered • Crafted fresh",
      title: "Premium Hotpot & BBQ Experience",
      subtitle: "Fresh Ingredients • Unlimited Flavor",
      viewMenu: "View Menu",
      bookTable: "Book Table",
    },
    landing: {
      signatureEyebrow: "Curated favorites",
      signatureTitle: "Signature Dishes",
      viewFullMenu: "View full menu",
      noMenuItems: "No available menu items yet",
      branchesEyebrow: "Choose your table",
      branchesTitle: "Our Branches",
      branchesDescription:
        "Select a branch to explore the live menu prepared for that location.",
      branchLabel: "Branch",
      branchFallbackAddress:
        "Premium Hotpot & BBQ dining with fresh broths, grill selections, and attentive service.",
      selectBranch: "Select Your Branch",
      menuItems: "menu items",
      viewMenu: "View Menu",
      noBranches: "No branches available yet.",
      locationsEyebrow: "Find Flamez",
      locationsTitle: "Branch Locations",
      locationsDescription:
        "Choose the nearest Flamez branch, check the opening hours, and get directions before you visit.",
      directions: "Get directions",
      callBranch: "Call branch",
      openHours: "Opening hours",
      noLocationDetails: "Location details are coming soon.",
      aboutImageEyebrow: "Since day one",
      aboutImageText:
        "Built around warm tables, rich broths, and the theatre of open flame.",
      aboutEyebrow: "Our story",
      aboutTitle: "A Modern Ritual for Hotpot & BBQ",
      aboutDescription:
        "HOTPOT & BBQ brings together deeply flavored soup bases, premium sliced meats, seafood, crisp vegetables, and flame-grilled favorites in a refined dining room. Every table is designed for sharing, lingering, and building the perfect bite.",
      highlightBbq: "Fire-kissed BBQ",
      highlightIngredients: "Hand-cut ingredients",
      highlightBroths: "Premium broths",
      ctaEyebrow: "Reserve the moment",
      ctaTitle: "Experience the Best Hotpot in Town",
      footerDescription:
        "A premium destination for rich broths, fresh ingredients, and refined BBQ dining.",
      footerLinks: "Links",
      footerContact: "Contact",
      footerLocation: "The Secretariat, N1A/ Gate 9, Corner of Anawrahta Road, and Thein Phyu Rd",
      footerRights: "All rights reserved.",
      footerTagline: "Fresh Ingredients • Unlimited Flavor",
    },
    menu: {
      all: "All",
      noCategory: "No items in this category.",
      noBranch: "No branch specified. Please scan a valid QR code.",
      error: "Something went wrong",
      backHome: "← Back to home",
      backBranches: "Branches",
      upToTop: "Back to top",
      noImage: "No image",
    },
    admin: {
      signOut: "Sign Out",
    },
  },
  my: {
    nav: {
      admin: "အက်မင်",
      home: "ပင်မ",
      menu: "မီနူး",
      branches: "ဆိုင်ခွဲများ",
      locations: "တည်နေရာ",
      about: "အကြောင်း",
      viewMenu: "မီနူးများ ကြည့်ရန်",
    },
    hero: {
      eyebrow: "Flame grilled • Slow simmered • Crafted fresh",
      title: "Premium Hotpot & BBQ Experience",
      subtitle: "လတ်ဆတ်သော ပါဝင်ပစ္စည်းများ • အရသာပြည့်ဝ",
      viewMenu: "မီနူး ကြည့်ရန်",
      bookTable: "စားပွဲ ကြိုတင်မှာရန်",
    },
    landing: {
      signatureEyebrow: "ရွေးချယ်ထားသော အကြိုက်ဆုံးများ",
      signatureTitle: "ထင်ရှားသော ဟင်းလျာများ",
      viewFullMenu: "မီနူး အပြည့်အစုံ ကြည့်ရန်",
      noMenuItems: "မီနူး ပစ္စည်း မရှိသေးပါ။",
      branchesEyebrow: "သင့်စားပွဲကို ရွေးချယ်ပါ",
      branchesTitle: "ကျွန်ုပ်တို့၏ ဌာနခွဲများ",
      branchesDescription:
        "သင့်ဌာနခွဲကို ရွေးချယ်ပြီး ထိုနေရာအတွက် ပြင်ဆင်ထားသော မီနူးကို ကြည့်ရှုပါ။",
      branchLabel: "ဌာနခွဲ",
      branchFallbackAddress:
        "လတ်ဆတ်သော ဟင်းရည်များ၊ မီးကင်ရွေးချယ်စရာများနှင့် ဝန်ဆောင်မှုကောင်းများပါသော ပရီမီယံ Hotpot & BBQ အတွေ့အကြုံ။",
      selectBranch: "ဆိုင်ခွဲ ရွေးချယ်ပါ",
      menuItems: "မီနူး ပစ္စည်းများ",
      viewMenu: "မီနူး ကြည့်ရန်",
      noBranches: "ဌာနခွဲ မရှိသေးပါ။",
      locationsEyebrow: "Flamez ကို ရှာဖွေပါ",
      locationsTitle: "ဆိုင်ခွဲ တည်နေရာများ",
      locationsDescription:
        "သင့်အနီးဆုံး Flamez ဆိုင်ခွဲကို ရွေးချယ်ပြီး ဖွင့်ချိန်နှင့် လမ်းညွှန်ကို ကြည့်ရှုပါ။",
      directions: "လမ်းညွှန် ကြည့်ရန်",
      callBranch: "ဆိုင်ခွဲသို့ ဖုန်းခေါ်ရန်",
      openHours: "ဖွင့်ချိန်",
      noLocationDetails: "တည်နေရာ အသေးစိတ်ကို မကြာမီ ထည့်သွင်းပါမည်။",
      aboutImageEyebrow: "စတင်ချိန်မှစ၍",
      aboutImageText:
        "နွေးထွေးသော စားပွဲများ၊ အရသာကြွယ်ဝသော ဟင်းရည်များနှင့် မီးကင်အနုပညာကို အခြေခံထားပါသည်။",
      aboutEyebrow: "ကျွန်ုပ်တို့၏ အကြောင်း",
      aboutTitle: "Hotpot & BBQ အတွက် ခေတ်မီအလေ့အထ",
      aboutDescription:
        "HOTPOT & BBQ သည် အရသာပြည့်ဝသော ဟင်းရည်များ၊ ပရီမီယံ အသားလွှာများ၊ ပင်လယ်စာ၊ လတ်ဆတ်သော ဟင်းသီးဟင်းရွက်များနှင့် မီးကင်အကြိုက်ဆုံးများကို သပ်ရပ်သော စားသောက်ခန်းတွင် ပေါင်းစပ်ပေးထားပါသည်။ စားပွဲတိုင်းသည် မျှဝေရန်၊ အချိန်ယူခံစားရန်နှင့် အကောင်းဆုံးအရသာကို ဖန်တီးရန် ဒီဇိုင်းပြုလုပ်ထားပါသည်။",
      highlightBbq: "BBQ",
      highlightIngredients: "လက်ဖြင့် ပြင်ဆင်ထားသော ပါဝင်ပစ္စည်းများ",
      highlightBroths: "ပရီမီယံ ဟင်းရည်များ",
      ctaEyebrow: "အချိန်ကောင်းကို ကြိုတင်မှာယူပါ",
      ctaTitle: "မြို့ထဲရှိ အကောင်းဆုံး Hotpot ကို ခံစားပါ",
      footerDescription:
        "အရသာကြွယ်ဝသော ဟင်းရည်များ၊ လတ်ဆတ်သော ပါဝင်ပစ္စည်းများနှင့် သပ်ရပ်သော BBQ အတွေ့အကြုံအတွက် ပရီမီယံနေရာ။",
      footerLinks: "လင့်များ",
      footerContact: "ဆက်သွယ်ရန်",
      footerLocation: "The Secretariat, N1A/ Gate 9, Corner of Anawrahta Road, and Thein Phyu Rd",
      footerRights: "မူပိုင်ခွင့် ရယူထားပါသည်။",
      footerTagline: "လတ်ဆတ်သော ပါဝင်ပစ္စည်းများ • အရသာပြည့်ဝ",
    },
    menu: {
      all: "အားလုံး",
      noCategory: "ဤအမျိုးအစားတွင် ပစ္စည်း မရှိပါ။",
      noBranch: "ဆိုင်ခွဲ မသတ်မှတ်ထားပါ။ QR code မှန်ကန်စွာ ဖတ်ပါ။",
      error: "တစ်ခုခု မှားယွင်းနေပါသည်",
      backHome: "← ပင်မစာမျက်နှာသို့",
      upToTop: "ထိပ်သို့",
      noImage: "ပုံ မရှိပါ။",
    },
    admin: {
      signOut: "ထွက်ရန်",
    },
  },
} as const;

export type TranslationKey = typeof translations[keyof typeof translations];

export function getLocalizedField(
  locale: Locale,
  en: string,
  my?: string | null
): string {
  if (locale === "my" && my?.trim()) return my;
  return en;
}
