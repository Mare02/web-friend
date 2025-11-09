import type { Metadata } from "next";
import MarkdownPreviewClient from "./markdown-preview-client";
import { getCanonicalUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "Markdown Preview | Live Markdown Editor with Instant Preview",
  description: "Free markdown preview tool for writers, developers, and content creators. Live editor with instant preview, GitHub Flavored Markdown support, and export options. Perfect for writing README files, documentation, and blog posts.",
  keywords: ["markdown preview", "markdown editor", "live preview", "markdown renderer", "GitHub markdown", "documentation tool", "README editor", "free markdown tool"],
  robots: "index, follow",
  alternates: {
    canonical: getCanonicalUrl("/tools/markdown-preview"),
  },
  openGraph: {
    title: "Markdown Preview | Live Markdown Editor with Instant Preview",
    description: "Free markdown preview tool for writers, developers, and content creators. Live editor with instant preview, GitHub Flavored Markdown support, and export options.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Preview | Live Markdown Editor with Instant Preview",
    description: "Free markdown preview tool for writers, developers, and content creators. Live editor with instant preview, GitHub Flavored Markdown support, and export options.",
  },
};

export default function MarkdownPreviewPage() {
  return <MarkdownPreviewClient />;
}
