"use client";

import { XmlJsonConverter } from "@/components/xml-json-converter";
import { FileCode } from "lucide-react";

export default function XmlJsonConverterClient() {
  return (
    <div className="min-h-screen mb-20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 md:pt-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <FileCode className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            XML/JSON Converter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
            Convert between XML and JSON formats with real-time validation, formatting,
            and pretty-printing. Fast, free, and completely client-side.
          </p>
        </div>
      </div>

      {/* Converter Tool */}
      <XmlJsonConverter />
    </div>
  );
}

