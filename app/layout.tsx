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

const SITE_DESCRIPTION =
  "Baidas & Baidas AG entwickelt exklusive Immobilien in besonders ausgewählten und werthaltigen Lagen in Zürich, Dubai und Abu Dhabi. Gegründet von Andreas Baidas.";

export const metadata: Metadata = {
  metadataBase: new URL("https://baidas.ch"),
  title: {
    default: "Baidas & Baidas AG — Immobilienentwicklung & Investments",
    template: "%s | Baidas & Baidas AG",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Baidas & Baidas AG",
  keywords: [
    "Baidas & Baidas",
    "Baidas und Baidas",
    "Baidas & Baidas AG",
    "Andreas Baidas",
    "Immobilienentwicklung",
    "Immobilien Zürich",
    "Real Estate Dubai",
    "Real Estate Abu Dhabi",
    "Immobilien Investment",
    "Projektentwicklung",
    "Co-Investment",
    "Luxusimmobilien",
    "Grundstück verkaufen",
  ],
  authors: [{ name: "Andreas Baidas" }, { name: "Baidas & Baidas AG" }],
  creator: "Andreas Baidas",
  publisher: "Baidas & Baidas AG",
  alternates: { canonical: "/" },
  robots: "index, follow",
  openGraph: {
    title: "Baidas & Baidas AG — Immobilienentwicklung & Investments",
    description: SITE_DESCRIPTION,
    url: "https://baidas.ch",
    siteName: "Baidas & Baidas AG",
    locale: "de_CH",
    alternateLocale: ["en_US", "fr_FR", "ar_AE"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baidas & Baidas AG — Immobilienentwicklung & Investments",
    description: SITE_DESCRIPTION,
  },
};

// Structured data (JSON-LD) so search engines understand the brand entity
// "Baidas & Baidas AG" and the person "Andreas Baidas".
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://baidas.ch/#organization",
      name: "Baidas & Baidas AG",
      alternateName: ["Baidas & Baidas", "Baidas und Baidas"],
      url: "https://baidas.ch",
      logo: "https://baidas.ch/logo-black.png",
      email: "info@baidas.ch",
      description: SITE_DESCRIPTION,
      areaServed: ["Zürich", "Dubai", "Abu Dhabi"],
      address: [
        { "@type": "PostalAddress", streetAddress: "Baarerstrasse 12", postalCode: "6300", addressLocality: "Zug", addressCountry: "CH" },
        { "@type": "PostalAddress", streetAddress: "Central Park Tower, DIFC", addressLocality: "Dubai", addressCountry: "AE" },
      ],
      founder: { "@id": "https://baidas.ch/#andreas-baidas" },
    },
    {
      "@type": "Person",
      "@id": "https://baidas.ch/#andreas-baidas",
      name: "Andreas Baidas",
      jobTitle: "Immobilienentwickler & Investor",
      worksFor: { "@id": "https://baidas.ch/#organization" },
      image: "https://baidas.ch/team/andreas-portrait-final.jpg",
      url: "https://baidas.ch",
      description: "Andreas Baidas is a real estate developer, investor, and founder of Baidas & Baidas.",
    },
    {
      "@type": "WebSite",
      "@id": "https://baidas.ch/#website",
      name: "Baidas & Baidas AG",
      url: "https://baidas.ch",
      publisher: { "@id": "https://baidas.ch/#organization" },
      inLanguage: ["de", "en", "fr", "ar"],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${GeistSans.variable} ${cormorant.variable} ${poppins.variable} ${amiri.variable} ${notoArabic.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
