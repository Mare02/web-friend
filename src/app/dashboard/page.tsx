"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { NewAnalysisDialog } from "@/components/new-analysis-dialog";
import { AnalysisResults } from "@/components/analysis-results";
import { AnalysisLoadingModal } from "@/components/analysis-loading-modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHistory } from "@/contexts/history-context";
import { useLoading } from "@/contexts/loading-context";
import { AnalyzeResponse } from "@/lib/validators/schema";
import { AlertCircle, Sparkles, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const { invalidateHistory } = useHistory();
  const { startLoading, stopLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const userName = user?.firstName || user?.username;

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    startLoading();
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

      // Invalidate history cache to refetch with new analysis
      invalidateHistory();

      // Close the dialog on success
      setDialogOpen(false);

      // If analysis was saved (has ID), navigate to the analysis page
      if (data.data?.analysisId) {
        router.push(`/analysis/${data.data.analysisId}`);
      } else {
        // If not saved (unauthenticated user), scroll to top to see results
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze website"
      );
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  };

  const handleNewAnalysis = () => {
    setDialogOpen(true);
  };

  return (
    <DashboardLayout
      onNewAnalysis={handleNewAnalysis}
    >
      <div className="p-6">
        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result ? (
          // Results View
          <div className="animate-in fade-in duration-500">
            <AnalysisResults result={result} />
          </div>
        ) : (
          // Welcome View
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-primary" />
                {userName ? `Welcome ${userName}!` : "Welcome to Web Friend"}
              </h1>
              <p className="text-lg text-muted-foreground">
                Get AI-powered insights to improve your website&apos;s SEO, content, performance, and accessibility.
              </p>
            </div>

            {/* Getting Started Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Getting Started
                </CardTitle>
                <CardDescription>
                  Click the &quot;New Analysis&quot; button in the sidebar to analyze your first website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-semibold">SEO Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Get insights on meta tags, headings, and search engine optimization
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Content Quality</h3>
                    <p className="text-sm text-muted-foreground">
                      Analyze readability, structure, and content effectiveness
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Performance</h3>
                    <p className="text-sm text-muted-foreground">
                      Check load times, resource optimization, and speed metrics
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Accessibility</h3>
                    <p className="text-sm text-muted-foreground">
                      Ensure your site is usable by everyone, including people with disabilities
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* New Analysis Dialog */}
      <NewAnalysisDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAnalyze={handleAnalyze}
        isLoading={isLoading}
      />

      {/* Loading Modal */}
      <AnalysisLoadingModal isOpen={isLoading} isLoading={isLoading} />
    </DashboardLayout>
  );
}

