"use client";

import { RegexTester } from "@/components/regex-tester";
import { Regex } from "lucide-react";

export default function RegexTesterClient() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 md:pt-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Regex className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Regex Tester
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
            Test and debug regular expressions with real-time matching, replacement, and comprehensive pattern library.
            Perfect for developers and data analysts.
          </p>
        </div>
      </div>

      {/* Regex Tester Tool */}
      <RegexTester />
    </div>
  );
}
