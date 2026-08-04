import type { Metadata } from "next";
import Site from "@/components/Site";
import { LanguageProvider } from "@/context/LanguageContext";

const languages = { "de-CH": "/", en: "/en", fr: "/fr", ar: "/ar", "x-default": "/" };

export const metadata: Metadata = {
  title: "Baidas & Baidas AG — Real Estate Development & Investments",
  description:
    "Baidas & Baidas AG develops exclusive real estate in specially selected, value-retaining locations in Zurich, Dubai and Abu Dhabi. Founded by Andreas Baidas.",
  alternates: { canonical: "/en", languages },
};

export default function Page() {
  return (
    <LanguageProvider initial="en">
      <Site />
    </LanguageProvider>
  );
}
