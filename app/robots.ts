import type { MetadataRoute } from "next";

// Sidan ska inte synas i sökmotorer
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
