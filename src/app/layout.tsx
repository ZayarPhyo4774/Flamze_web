import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Myanmar } from "next/font/google";
import { LocaleProvider } from "@/context/LocaleContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansMyanmar = Noto_Sans_Myanmar({
  variable: "--font-noto-sans-myanmar",
  subsets: ["myanmar"],
});

export const metadata: Metadata = {
  title: "FLAMZE — Hotpot & BBQ",
  description: "Scan QR codes to explore our dynamic hotpot and BBQ menu across all branches.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansMyanmar.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
