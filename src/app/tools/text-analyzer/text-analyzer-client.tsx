"use client";

import { TextAnalyzer } from "@/components/text-analyzer";
import { FileText } from "lucide-react";

export default function TextAnalyzerClient() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 md:pt-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Text Analyzer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
            Analyze your text for readability, SEO optimization, and content quality.
            Get detailed statistics and insights without using AI.
          </p>
        </div>
      </div>

      {/* Analyzer Tool */}
      <TextAnalyzer />
    </div>
  );
}
