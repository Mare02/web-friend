"use client";

import { useState } from "react";
import { AnalyzerForm } from "@/components/analyzer-form";
import { AnalysisResults } from "@/components/analysis-results";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnalyzeResponse } from "@/lib/validators/schema";
import { AlertCircle, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data: AnalyzeResponse = await response.json();

      if (!data.success) {
        setError(data.error || "An unexpected error occurred");
        return;
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze website"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {result ? (
        // Results View with Compact Header
        <>
          {/* Compact Sticky Header */}
          <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b shadow-sm">
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-base sm:text-lg">AI Website Optimizer</h2>
                  </div>
                  <div className="sm:hidden">
                    <ThemeToggle />
                  </div>
                </div>
                <AnalyzerForm onAnalyze={handleAnalyze} isLoading={isLoading} compact />
                <div className="hidden sm:block shrink-0">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="container mx-auto px-4 pt-4">
              <Alert variant="destructive" className="max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Results */}
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-center animate-in fade-in duration-500">
              <AnalysisResults result={result} />
            </div>
          </div>
        </>
      ) : (
        // Landing View with Full Hero
        <>
          {/* Landing Header with Theme Toggle */}
          <div className="container mx-auto px-4 pt-4">
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
          </div>

          {/* Hero Section */}
          <div className="container mx-auto px-4 py-8 md:py-16">
            <div className="text-center mb-12 space-y-4">
              <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                AI Website Optimizer
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Analyze your website for SEO, content quality, performance, and accessibility.
                Get AI-powered insights and actionable recommendations.
              </p>
            </div>

            {/* Analyzer Form */}
            <div className="flex justify-center mb-12">
              <AnalyzerForm onAnalyze={handleAnalyze} isLoading={isLoading} />
            </div>

            {/* Error State */}
            {error && (
              <div className="flex justify-center mb-8">
                <Alert variant="destructive" className="max-w-2xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="border-t mt-24">
            <div className="container mx-auto px-4 py-8">
              <p className="text-center text-sm text-muted-foreground">
                Powered by AI • Built with Next.js, shadcn/ui, and Tailwind CSS
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
