import type { Metadata } from "next";
import Site from "@/components/Site";
import { LanguageProvider } from "@/context/LanguageContext";

const languages = { "de-CH": "/", en: "/en", fr: "/fr", ar: "/ar", "x-default": "/" };

export const metadata: Metadata = {
  title: "Baidas & Baidas AG — تطوير عقاري واستثمارات",
  description:
    "تطوّر بيداس آند بيداس عقارات حصرية في مواقع مختارة وذات قيمة عالية في زيورخ ودبي وأبوظبي. تأسست على يد أندرياس بيداس.",
  alternates: { canonical: "/ar", languages },
};

export default function Page() {
  return (
    <LanguageProvider initial="ar">
      <Site />
    </LanguageProvider>
  );
}
