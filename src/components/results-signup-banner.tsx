"use client";

import { SignUpButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, ArrowRight } from "lucide-react";

export function ResultsSignupBanner() {
  const { isSignedIn } = useUser();

  // Don't show banner if user is already signed in
  if (isSignedIn) {
    return null;
  }

  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
            <Save className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">Don&apos;t lose this analysis!</h3>
            <p className="text-sm text-muted-foreground">
              Sign up free to save your results, track tasks, and measure your progress over time
            </p>
          </div>
        </div>
        <SignUpButton mode="modal">
          <Button size="lg" className="group shrink-0">
            Sign Up Free
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </SignUpButton>
      </div>
    </Card>
  );
}

