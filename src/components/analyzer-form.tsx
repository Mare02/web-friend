"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

interface AnalyzerFormProps {
  onAnalyze: (url: string) => Promise<void>;
  isLoading: boolean;
  compact?: boolean;
}

export function AnalyzerForm({ onAnalyze, isLoading, compact = false }: AnalyzerFormProps) {
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<{ url?: string }>({});

  const validateForm = () => {
    const newErrors: { url?: string } = {};

    // Validate URL
    if (!url.trim()) {
      newErrors.url = "URL is required";
    } else {
      try {
        new URL(url);
      } catch {
        newErrors.url = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onAnalyze(url);
  };

  // Compact mode for sticky header
  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-1 w-full">
        <Input
          id="url-compact"
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (errors.url) setErrors({ ...errors, url: undefined });
          }}
          disabled={isLoading}
          className={errors.url ? "border-red-500 flex-1" : "flex-1"}
        />
        <Button type="submit" disabled={isLoading} className="shrink-0">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline ml-2">Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Analyze</span>
            </>
          )}
        </Button>
      </form>
    );
  }

  // Full card mode for landing page
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Analyze Website
        </CardTitle>
        <CardDescription>
          Enter a URL to analyze SEO, content, performance, and accessibility
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              Website URL
            </label>
            <Input
              id="url"
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errors.url) setErrors({ ...errors, url: undefined });
              }}
              disabled={isLoading}
              className={errors.url ? "border-red-500" : ""}
            />
            {errors.url && (
              <p className="text-sm text-red-500">{errors.url}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Website"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

