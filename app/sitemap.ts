import type { MetadataRoute } from "next";

const BASE = "https://baidas.ch";
const languages = {
  "de-CH": `${BASE}/`,
  en: `${BASE}/en`,
  fr: `${BASE}/fr`,
  ar: `${BASE}/ar`,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/en", "/fr", "/ar"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.9,
    alternates: { languages },
  }));
}
