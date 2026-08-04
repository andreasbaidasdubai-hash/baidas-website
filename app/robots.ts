import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://baidas.ch/sitemap.xml",
    host: "https://baidas.ch",
  };
}
