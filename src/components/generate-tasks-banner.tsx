"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLoading } from "@/contexts/loading-context";
import { Loader2, Sparkles, CheckSquare, ArrowRight } from "lucide-react";
import type { WebsiteData, AnalysisResult } from "@/lib/validators/schema";

interface GenerateTasksBannerProps {
  websiteData: WebsiteData;
  analysis: AnalysisResult;
}

export function GenerateTasksBanner({ websiteData, analysis }: GenerateTasksBannerProps) {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    startLoading();
    setError(null);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysis,
          websiteData,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate action plan");
      }

      // Refresh and switch to tasks tab
      const currentPath = window.location.pathname;
      router.push(`${currentPath}?tab=tasks`);
      router.refresh();
      // notify any mounted analysis page to switch tabs immediately
      try {
        window.dispatchEvent(new CustomEvent("tasks-generated"));
      } catch {
        // ignore if window is not available
      }
    } catch (err) {
      console.error("Error generating action plan:", err);
      setError(err instanceof Error ? err.message : "Failed to generate action plan");
    } finally {
      setIsGenerating(false);
      stopLoading();
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="animate-in fade-in">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-primary/5 border-primary/20 animate-in fade-in flex sm:items-center">
      <CheckSquare className="mb-1 h-4 w-4 text-primary" />
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 w-full">
        <div className="flex-1">
          <span className="font-medium">Ready for action?</span>
          <span className="text-muted-foreground ml-2">
            Generate prioritized tasks to improve your website.
          </span>
        </div>
        <Button
          onClick={handleGeneratePlan}
          disabled={isGenerating}
          size="sm"
          className="max-w-max"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Tasks
              <ArrowRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}

