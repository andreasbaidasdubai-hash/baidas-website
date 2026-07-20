import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins, Amiri, Noto_Sans_Arabic } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://baidas.ch"),
  title: "Baidas & Baidas AG — Immobilienentwicklung & Investments",
  description:
    "Exklusive Immobilien in besonders ausgewählten und werthaltigen Lagen. Zürich · Dubai · Abu Dhabi.",
  openGraph: {
    title: "Baidas & Baidas AG — Immobilienentwicklung & Investments",
    description:
      "Exklusive Immobilien in besonders ausgewählten und werthaltigen Lagen. Zürich · Dubai · Abu Dhabi.",
    url: "https://baidas.ch",
    siteName: "Baidas & Baidas AG",
    locale: "de_CH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baidas & Baidas AG",
    description: "Exklusive Immobilien in besten Lagen. Zürich · Dubai · Abu Dhabi.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${GeistSans.variable} ${cormorant.variable} ${poppins.variable} ${amiri.variable} ${notoArabic.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
