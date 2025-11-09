"use client";

import { JsonFormatter } from "@/components/json-formatter";
import { Braces } from "lucide-react";

export default function JsonFormatterClient() {
  return (
    <div>
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 md:pt-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Braces className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            JSON Formatter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
            Format, validate, and beautify JSON data with syntax highlighting and error detection.
            Perfect for developers working with APIs and JSON data.
          </p>
        </div>
      </div>

      {/* JSON Formatter Tool */}
      <JsonFormatter />
    </div>
  );
}
