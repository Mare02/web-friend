"use client";

import { FaviconGenerator } from "@/components/favicon-generator";
import { ImageIcon } from "lucide-react";

export default function FaviconGeneratorClient() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 md:pt-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <ImageIcon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Favicon Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
            Create complete favicon packs from your images. Generate multiple PNG sizes,
            ICO files, and get ready-to-use HTML link tags for your website.
          </p>
        </div>
      </div>

      {/* Tool */}
      <FaviconGenerator />
    </div>
  );
}