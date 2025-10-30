"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useLoadingMessages } from "@/lib/use-loading-messages";

interface AnalysisLoadingModalProps {
  isOpen: boolean;
  isLoading: boolean;
}

export function AnalysisLoadingModal({ isOpen, isLoading }: AnalysisLoadingModalProps) {
  const loadingMessage = useLoadingMessages(isLoading);

  return (
    <Dialog open={isOpen} modal>
      <DialogContent
        className="sm:max-w-[400px]"
        showCloseButton={false}
        onInteractOutside={(e) => {
          // Prevent closing by clicking outside or pressing escape during loading
          if (isLoading) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing with escape key during loading
          if (isLoading) {
            e.preventDefault();
          }
        }}
      >
        <DialogTitle className="sr-only">Analyzing Website</DialogTitle>
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Analyzing Website</h3>
            <p className="text-sm text-muted-foreground animate-pulse">
              {loadingMessage}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
