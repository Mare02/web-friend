"use client";

import { MarkdownPreview } from "@/components/markdown-preview";
import { Eye } from "lucide-react";

export default function MarkdownPreviewClient() {
  return (
    <div className="min-h-screen pb-20 flex flex-col">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 md:pt-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Eye className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Markdown Preview
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
            Live markdown editor with instant preview. Write in markdown and see
            the rendered output in real-time.
          </p>
        </div>
      </div>

      {/* Markdown Preview Tool */}
      <div className="flex-1">
        <MarkdownPreview />
      </div>
    </div>
  );
}
