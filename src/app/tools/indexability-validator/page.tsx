import type { Metadata } from "next";
import RobotsValidatorClient from "./indexability-validator-client";
import { getCanonicalUrl } from "@/lib/config";

const toolTitle = "Indexability Validator | SEO Crawling Analysis Tool";
const toolDescription = "Free robots.txt validator and indexability checker. Analyze crawling configuration, indexability blockers, sitemap validation, and get SEO recommendations. Perfect for SEO professionals and webmasters.";
const toolDescriptionShort = "Free robots.txt validator and indexability checker. Analyze crawling configuration, indexability blockers, sitemap validation, and get SEO recommendations.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: toolTitle,
    description: toolDescription,
    keywords: ["robots.txt validator", "indexability checker", "SEO crawler analysis", "sitemap validator", "crawling configuration", "search engine indexing", "robots.txt checker", "SEO audit tool", "crawl budget optimization"],
    robots: "index, follow",
    alternates: {
      canonical: getCanonicalUrl("/tools/indexability-validator"),
    },
    openGraph: {
      title: toolTitle,
      description: toolDescriptionShort,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: toolTitle,
      description: toolDescriptionShort,
    },
  };
}

export default function RobotsValidatorPage() {
  return <RobotsValidatorClient />;
}
