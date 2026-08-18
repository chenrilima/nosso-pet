import type { MetadataRoute } from "next";
import { business } from "@/config/business";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL("/", business.siteUrl).toString(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
