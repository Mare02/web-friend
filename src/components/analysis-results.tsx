"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnalyzeResponse, ActionPlan } from "@/lib/validators/schema";
import {
  FileText,
  Search,
  Zap,
  Accessibility,
  CheckCircle2,
  AlertCircle,
  Info,
  ListTodo,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ActionPlanView } from "./action-plan-view";

interface AnalysisResultsProps {
  result: AnalyzeResponse;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!result.success || !result.data) {
    return null;
  }

  const { websiteData, analysis } = result.data;

  // Calculate some quick metrics
  const seoScore = calculateSEOScore(websiteData);
  const accessibilityScore = calculateAccessibilityScore(websiteData);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
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

      if (!data.success) {
        setError(data.error || "Failed to generate action plan");
        return;
      }

      setActionPlan(data.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate action plan"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Overview</CardTitle>
          <CardDescription>{websiteData.url}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">SEO Score</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{seoScore}%</p>
                {seoScore >= 80 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : seoScore >= 50 ? (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Accessibility</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{accessibilityScore}%</p>
                {accessibilityScore >= 80 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : accessibilityScore >= 50 ? (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Word Count</p>
              <p className="text-2xl font-bold">{websiteData.wordCount.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {websiteData.framework && (
              <Badge variant="secondary">
                <Info className="mr-1 h-3 w-3" />
                {websiteData.framework}
              </Badge>
            )}
            <Badge variant="outline">{websiteData.images.total} images</Badge>
            <Badge variant="outline">{websiteData.scripts} scripts</Badge>
            <Badge variant="outline">{websiteData.stylesheets} stylesheets</Badge>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      <Accordion type="single" collapsible className="w-full space-y-2">
        {/* Content Analysis */}
        <AccordionItem value="content" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span className="font-semibold">Content Analysis</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis.content}</ReactMarkdown>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SEO Analysis */}
        <AccordionItem value="seo" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              <span className="font-semibold">SEO Insights</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis.seo}</ReactMarkdown>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Performance Analysis */}
        <AccordionItem value="performance" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="font-semibold">Performance</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis.performance}</ReactMarkdown>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Accessibility Analysis */}
        <AccordionItem value="accessibility" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Accessibility className="h-5 w-5" />
              <span className="font-semibold">Accessibility</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis.accessibility}</ReactMarkdown>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Raw Data */}
        <AccordionItem value="raw" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              <span className="font-semibold">Extracted Data</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium mb-1">Title</p>
                <p className="text-muted-foreground">{websiteData.title || "No title found"}</p>
              </div>

              <div>
                <p className="font-medium mb-1">Meta Description</p>
                <p className="text-muted-foreground">
                  {websiteData.metaDescription || "No meta description found"}
                </p>
              </div>

              <div>
                <p className="font-medium mb-1">Headings</p>
                <div className="space-y-2">
                  {Object.entries(websiteData.headings).map(([tag, headings]) => {
                    if (headings.length === 0) return null;
                    return (
                      <div key={tag}>
                        <Badge variant="outline" className="mb-1">
                          {tag.toUpperCase()} ({headings.length})
                        </Badge>
                        <ul className="list-disc list-inside text-muted-foreground ml-2">
                          {headings.slice(0, 3).map((heading, i) => (
                            <li key={i}>{heading}</li>
                          ))}
                          {headings.length > 3 && (
                            <li className="text-xs">...and {headings.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              {websiteData.openGraph && (
                <div>
                  <p className="font-medium mb-1">Open Graph</p>
                  <div className="space-y-1 text-muted-foreground">
                    {websiteData.openGraph.title && (
                      <p>Title: {websiteData.openGraph.title}</p>
                    )}
                    {websiteData.openGraph.description && (
                      <p>Description: {websiteData.openGraph.description}</p>
                    )}
                    {websiteData.openGraph.image && (
                      <p>Image: {websiteData.openGraph.image}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Generate Action Plan Button */}
      {!actionPlan && (
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex items-center gap-2">
                <ListTodo className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg">Ready for next steps?</h3>
              </div>
              <p className="text-sm text-muted-foreground max-w-xl">
                Get a prioritized action plan with specific tasks to improve your website.
                We&apos;ll convert the analysis insights into trackable, actionable items.
              </p>
              <Button 
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                size="lg"
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Action Plan...
                  </>
                ) : (
                  <>
                    <ListTodo className="h-4 w-4" />
                    Generate Action Plan
                  </>
                )}
              </Button>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Plan Display */}
      {actionPlan && <ActionPlanView plan={actionPlan} />}
    </div>
  );
}

/**
 * Calculate a basic SEO score based on key metrics
 */
function calculateSEOScore(data: NonNullable<AnalyzeResponse["data"]>["websiteData"]): number {
  let score = 0;
  let maxScore = 0;

  // Title (20 points)
  maxScore += 20;
  if (data.title) {
    const titleLength = data.title.length;
    if (titleLength >= 30 && titleLength <= 60) {
      score += 20;
    } else if (titleLength > 0) {
      score += 10;
    }
  }

  // Meta description (20 points)
  maxScore += 20;
  if (data.metaDescription) {
    const descLength = data.metaDescription.length;
    if (descLength >= 120 && descLength <= 160) {
      score += 20;
    } else if (descLength > 0) {
      score += 10;
    }
  }

  // H1 tags (20 points) - should have exactly 1
  maxScore += 20;
  if (data.headings.h1.length === 1) {
    score += 20;
  } else if (data.headings.h1.length > 0) {
    score += 10;
  }

  // Heading hierarchy (20 points)
  maxScore += 20;
  if (data.headings.h2.length > 0) {
    score += 20;
  }

  // Open Graph (20 points)
  maxScore += 20;
  if (data.openGraph?.title && data.openGraph?.description) {
    score += 20;
  } else if (data.openGraph?.title || data.openGraph?.description) {
    score += 10;
  }

  return Math.round((score / maxScore) * 100);
}

/**
 * Calculate a basic accessibility score
 */
function calculateAccessibilityScore(
  data: NonNullable<AnalyzeResponse["data"]>["websiteData"]
): number {
  let score = 0;
  let maxScore = 0;

  // Image alt text (40 points)
  maxScore += 40;
  if (data.images.total > 0) {
    const altPercentage = (data.images.withAlt / data.images.total) * 100;
    score += Math.round((altPercentage / 100) * 40);
  } else {
    score += 40; // No images is fine
  }

  // Title presence (30 points)
  maxScore += 30;
  if (data.title) {
    score += 30;
  }

  // Proper H1 usage (30 points)
  maxScore += 30;
  if (data.headings.h1.length === 1) {
    score += 30;
  } else if (data.headings.h1.length > 0) {
    score += 15;
  }

  return Math.round((score / maxScore) * 100);
}

