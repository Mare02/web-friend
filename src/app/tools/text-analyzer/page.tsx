import type { Metadata } from "next";
import TextAnalyzerClient from "./text-analyzer-client";

export const metadata: Metadata = {
  title: "Text Analyzer | Readability, SEO & Content Quality Analysis Tool",
  description: "Free text analyzer tool for writers, marketers, and content creators. Check readability scores, SEO keywords, content metrics, and grammar analysis. Improve your writing quality instantly.",
  keywords: ["text analyzer", "readability checker", "SEO content analysis", "content quality", "grammar checker", "writing tool", "keyword density", "text metrics", "free writing tool"],
  openGraph: {
    title: "Text Analyzer | Readability, SEO & Content Quality Analysis Tool",
    description: "Free text analyzer tool for writers, marketers, and content creators. Check readability scores, SEO keywords, content metrics, and grammar analysis.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Analyzer | Readability, SEO & Content Quality Analysis Tool",
    description: "Free text analyzer tool for writers, marketers, and content creators. Check readability scores, SEO keywords, content metrics, and grammar analysis.",
  },
};

export default function TextAnalyzerPage() {
  return <TextAnalyzerClient />;
}
