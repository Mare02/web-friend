"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles } from "lucide-react";

interface NewAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnalyze: (url: string) => Promise<void>;
  isLoading: boolean;
}

export function NewAnalysisDialog({
  open,
  onOpenChange,
  onAnalyze,
  isLoading,
}: NewAnalysisDialogProps) {
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<{ url?: string }>({});

  const validateForm = () => {
    const newErrors: { url?: string } = {};

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

    // Reset form on success (dialog will close automatically)
    setUrl("");
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Prevent closing the dialog while analysis is loading
      if (isLoading && !newOpen) {
        return;
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent
        className="sm:max-w-[500px]"
        aria-describedby="dialog-description"
        showCloseButton={!isLoading}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            New Website Analysis
          </DialogTitle>
          <DialogDescription id="dialog-description">
            Enter a URL to analyze for SEO, content, performance, and accessibility
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
              className={errors.url ? "border-destructive" : ""}
              autoFocus
            />
            {errors.url && (
              <p className="text-sm text-destructive">{errors.url}</p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Website
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

