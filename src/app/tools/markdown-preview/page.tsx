import type { Metadata } from "next";
import MarkdownPreviewClient from "./markdown-preview-client";
import { getCanonicalUrl } from "@/lib/config";

const toolTitle = "Markdown Preview | Live Markdown Editor with Instant Preview";
const toolDescription = "Free markdown preview tool for writers, developers, and content creators. Live editor with instant preview, GitHub Flavored Markdown support, and export options. Perfect for writing README files, documentation, and blog posts.";
const toolDescriptionShort = "Free markdown preview tool for writers, developers, and content creators. Live editor with instant preview, GitHub Flavored Markdown support, and export options.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: toolTitle,
    description: toolDescription,
    keywords: ["markdown preview", "markdown editor", "live preview", "markdown renderer", "GitHub markdown", "documentation tool", "README editor", "free markdown tool"],
    robots: "index, follow",
    alternates: {
      canonical: getCanonicalUrl("/tools/markdown-preview"),
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

export default function MarkdownPreviewPage() {
  return <MarkdownPreviewClient />;
}
