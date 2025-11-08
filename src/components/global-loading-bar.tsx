"use client";

import { useEffect, useState } from "react";
import { useLoading } from "@/contexts/loading-context";
import { cn } from "@/lib/utils";

export function GlobalLoadingBar() {
  const { isLoading } = useLoading();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const frameId = requestAnimationFrame(() => {
        setIsVisible(true);
        setProgress(0);
      });
      // Simulate progress
      const timer1 = setTimeout(() => setProgress(30), 100);
      const timer2 = setTimeout(() => setProgress(60), 300);
      const timer3 = setTimeout(() => setProgress(80), 600);

      return () => {
        cancelAnimationFrame(frameId);
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      // Complete the progress bar
      const completeFrame = requestAnimationFrame(() => setProgress(100));

      // Hide after animation completes
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 400);

      return () => {
        cancelAnimationFrame(completeFrame);
        clearTimeout(hideTimer);
      };
    }
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <div
        className={cn(
          "h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-300 ease-out",
          "shadow-lg shadow-primary/50"
        )}
        style={{
          width: `${progress}%`,
          transition: progress === 100 ? "width 0.3s ease-out" : "width 0.5s ease-in-out",
        }}
      />
    </div>
  );
}

