import type { Metadata } from "next";
import WebsiteAnalyzerClient from "./website-analyzer-client";

import { getCanonicalUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "AI Website Analyzer | SEO, Performance & Accessibility Analysis Tool",
  description: "Free AI-powered website analyzer tool. Analyze SEO, performance, accessibility, content quality, and get actionable recommendations. Perfect for developers, marketers, and business owners.",
  keywords: ["website analyzer", "SEO analyzer", "website audit", "performance analysis", "accessibility checker", "AI website analysis", "free SEO tool", "website optimization"],
  robots: "index, follow",
  alternates: {
    canonical: getCanonicalUrl("/tools/website-analyzer"),
  },
  openGraph: {
    title: "AI Website Analyzer | SEO, Performance & Accessibility Analysis Tool",
    description: "Free AI-powered website analyzer tool. Analyze SEO, performance, accessibility, content quality, and get actionable recommendations.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Website Analyzer | SEO, Performance & Accessibility Analysis Tool",
    description: "Free AI-powered website analyzer tool. Analyze SEO, performance, accessibility, content quality, and get actionable recommendations.",
  },
};

export default function WebsiteAnalyzerPage() {
  return <WebsiteAnalyzerClient />;
}
