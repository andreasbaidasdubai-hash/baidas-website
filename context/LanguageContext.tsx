"use client";
import { createContext, useContext, useState } from "react";

export type Lang = "de" | "en" | "fr" | "ar";

const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "de",
  setLang: () => {},
});

export function LanguageProvider({ children, initial = "de" }: { children: React.ReactNode; initial?: Lang }) {
  const [lang, setLang] = useState<Lang>(initial);
  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  return useContext(LanguageContext);
}
