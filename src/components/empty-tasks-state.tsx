"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLoading } from "@/contexts/loading-context";
import { Loader2, Sparkles, AlertCircle, CheckSquare } from "lucide-react";
import type { WebsiteData, AnalysisResult } from "@/lib/validators/schema";

interface EmptyTasksStateProps {
  websiteData: WebsiteData;
  analysis: AnalysisResult;
}

export function EmptyTasksState({ websiteData, analysis }: EmptyTasksStateProps) {
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

      // The page will automatically refresh and show tasks since we're already on the tasks tab
      router.refresh();
    } catch (err) {
      console.error("Error generating action plan:", err);
      setError(err instanceof Error ? err.message : "Failed to generate action plan");
    } finally {
      setIsGenerating(false);
      stopLoading();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-dashed">
        <CardHeader>
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <CheckSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>No Action Plan Yet</CardTitle>
          <CardDescription>
            Generate an AI-powered action plan with prioritized tasks to improve your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-3">Your action plan will include:</p>
            <ul className="space-y-2 max-w-md">
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0">✓</span>
                <span>Prioritized tasks based on impact and effort</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0">✓</span>
                <span>Quick wins you can implement immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0">✓</span>
                <span>Detailed descriptions and recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0">✓</span>
                <span>Progress tracking and task management</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            size="lg"
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Tasks...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Tasks
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

