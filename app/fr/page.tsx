import type { Metadata } from "next";
import Site from "@/components/Site";
import { LanguageProvider } from "@/context/LanguageContext";

const languages = { "de-CH": "/", en: "/en", fr: "/fr", ar: "/ar", "x-default": "/" };

export const metadata: Metadata = {
  title: "Baidas & Baidas AG — Développement Immobilier & Investissements",
  description:
    "Baidas & Baidas AG développe des biens immobiliers exclusifs dans des emplacements sélectionnés et de grande valeur à Zurich, Dubaï et Abu Dhabi. Fondée par Andreas Baidas.",
  alternates: { canonical: "/fr", languages },
};

export default function Page() {
  return (
    <LanguageProvider initial="fr">
      <Site />
    </LanguageProvider>
  );
}
