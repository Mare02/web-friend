import type { Metadata } from "next";
import RobotsValidatorClient from "./indexability-validator-client";
import { getCanonicalUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "Indexability Validator | SEO Crawling Analysis Tool",
  description: "Free robots.txt validator and indexability checker. Analyze crawling configuration, indexability blockers, sitemap validation, and get SEO recommendations. Perfect for SEO professionals and webmasters.",
  keywords: ["robots.txt validator", "indexability checker", "SEO crawler analysis", "sitemap validator", "crawling configuration", "search engine indexing", "robots.txt checker", "SEO audit tool", "crawl budget optimization"],
  robots: "index, follow",
  alternates: {
    canonical: getCanonicalUrl("/tools/indexability-validator"),
  },
  openGraph: {
    title: "Indexability Validator | SEO Crawling Analysis Tool",
    description: "Free robots.txt validator and indexability checker. Analyze crawling configuration, indexability blockers, sitemap validation, and get SEO recommendations.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indexability Validator | SEO Crawling Analysis Tool",
    description: "Free robots.txt validator and indexability checker. Analyze crawling configuration, indexability blockers, sitemap validation, and get SEO recommendations.",
  },
};

export default function RobotsValidatorPage() {
  return <RobotsValidatorClient />;
}
