"use client";

import { useState } from "react";
import { RobotsValidatorForm } from "@/components/robots-validator-form";
import { RobotsValidatorResults } from "@/components/robots-validator-results";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RobotsValidateResponse } from "@/lib/validators/schema";
import { AlertCircle, Shield } from "lucide-react";

export default function RobotsValidatorClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RobotsValidateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/robots-validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data: RobotsValidateResponse = await response.json();

      if (!data.success) {
        setError(data.error || "An unexpected error occurred");
        return;
      }

      setResult(data);

      // Scroll to top to see results
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to validate robots.txt and indexability"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {result ? (
        // Results View
        <>
          {/* Re-analyze Form */}
          <div className="container mx-auto px-4 py-6 flex justify-center" >
            <RobotsValidatorForm onAnalyze={handleAnalyze} isLoading={isLoading} />
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
              <RobotsValidatorResults result={result} />
            </div>
          </div>
        </>
      ) : (
        // Landing View with Full Hero
        <>
          {/* Hero Section */}
          <div className="container mx-auto px-4 py-8 md:py-16">
            <div className="text-center mb-12 space-y-4">
              <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Indexability Validator
              </h1>
              <p className="text-xl text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
                Analyze your website&apos;s crawling configuration, check for indexability blockers,
                validate sitemaps, and get actionable SEO recommendations.
              </p>
            </div>

            {/* Analyzer Form */}
            <div className="flex justify-center mb-12">
              <RobotsValidatorForm onAnalyze={handleAnalyze} isLoading={isLoading} />
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
        </>
      )}
    </div>
  );
}
