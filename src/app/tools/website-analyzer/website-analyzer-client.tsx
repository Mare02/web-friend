"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AnalyzerForm } from "@/components/analyzer-form";
import { AnalysisResults } from "@/components/analysis-results";
import { AnalysisLoadingModal } from "@/components/analysis-loading-modal";
import { SignupCTA } from "@/components/signup-cta";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnalyzeResponse } from "@/lib/validators/schema";
import { AlertCircle, Sparkles } from "lucide-react";

export default function WebsiteAnalyzerClient() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect authenticated users to workspace
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/tools/website-analyzer/workspace");
    }
  }, [isSignedIn, isLoaded, router]);

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

      // Scroll to top to see results
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze website"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen ">
      {result ? (
        // Results View
        <>
          {/* Re-analyze Form */}
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto">
              <AnalyzerForm onAnalyze={handleAnalyze} isLoading={isLoading} />
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
          {/* Hero Section */}
          <div className="container mx-auto px-4 py-8 md:py-16">
            <div className="text-center mb-12 space-y-4">
              <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                AI Website Analyzer
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

            {/* Sign Up CTA */}
            <div className="max-w-5xl mx-auto mt-16">
              <SignupCTA />
            </div>
          </div>
        </>
      )}

      {/* Loading Modal */}
      <AnalysisLoadingModal isOpen={isLoading} isLoading={isLoading} />
    </div>
  );
}
