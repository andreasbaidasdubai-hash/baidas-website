import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Baidas & Baidas AG — Baukunst & Projektentwicklung",
  description:
    "Exklusive Immobilien in besonders ausgewählten und werthaltigen Lagen. Zürich · Dubai · Abu Dhabi.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${GeistSans.variable} ${cormorant.variable} ${poppins.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
