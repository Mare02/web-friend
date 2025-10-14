"use client";

import { ArrowRight, CheckCircle2, History, ListTodo, Save } from "lucide-react";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    icon: Save,
    title: "Save Your Analyses",
    description: "Keep all your website reports in one place, accessible anytime",
  },
  {
    icon: ListTodo,
    title: "Track Action Tasks",
    description: "Get personalized improvement tasks and mark them as you complete",
  },
  {
    icon: History,
    title: "View History & Progress",
    description: "See how your website improves over time with historical data",
  },
  {
    icon: CheckCircle2,
    title: "Re-analyze Anytime",
    description: "Check your progress after implementing improvements",
  },
];

export function SignupCTA() {
  const { isSignedIn } = useUser();

  // Don't show CTA if user is already signed in
  if (isSignedIn) {
    return null;
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-8 md:p-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Save Your Progress & Track Improvements
          </h2>
          <p className="text-lg text-muted-foreground md:text-xl">
            Sign up free to unlock powerful features and never lose your data
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <SignUpButton mode="modal">
            <Button size="lg" className="group w-full sm:w-auto">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </SignUpButton>
          <p className="text-sm text-muted-foreground">
            No credit card required • Free forever
          </p>
        </div>
      </div>
    </Card>
  );
}

