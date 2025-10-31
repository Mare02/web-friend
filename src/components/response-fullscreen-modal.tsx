"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Copy, Minimize } from "lucide-react";
import type { ResponseData } from "@/lib/validators/api-tester";
import { formatResponse } from "@/lib/services/api-tester-utils";

interface ResponseFullscreenModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  response: ResponseData;
  responseView: 'pretty' | 'raw' | 'headers';
  onResponseViewChange: (view: 'pretty' | 'raw' | 'headers') => void;
  onCopyToClipboard: (text: string) => void;
}

export function ResponseFullscreenModal({
  open,
  onOpenChange,
  response,
  responseView,
  onResponseViewChange,
  onCopyToClipboard,
}: ResponseFullscreenModalProps) {
  const formattedResponse = formatResponse(response.data);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={() => onOpenChange(false)}
      />
      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-background">
            <div className="flex items-center gap-2">
              {response.status >= 200 && response.status < 300 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <h2 className="text-lg font-semibold">Response</h2>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Status: {response.status} {response.statusText}</span>
              <span>Time: {response.responseTime}ms</span>
              <span>Size: {response.size} bytes</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <Minimize className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs value={responseView} onValueChange={(value: string) => onResponseViewChange(value as 'pretty' | 'raw' | 'headers')} className="flex-1 flex flex-col min-h-0">
              <div className="px-6 pt-4 flex-shrink-0">
                <TabsList>
                  <TabsTrigger value="pretty">Pretty</TabsTrigger>
                  <TabsTrigger value="raw">Raw</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="pretty" className="flex-1 min-h-0 mt-4 px-6 pb-6">
                <div className="relative md:h-full min-h-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => onCopyToClipboard(formattedResponse)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre className="bg-muted p-4 rounded-md overflow-auto text-sm h-full whitespace-pre-wrap">
                    {formattedResponse}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="raw" className="flex-1 min-h-0 mt-4 px-6 pb-6">
                <div className="relative h-full min-h-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => onCopyToClipboard(formattedResponse)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre className="bg-muted p-4 rounded-md overflow-auto text-sm h-full whitespace-pre-wrap">
                    {formattedResponse}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="headers" className="flex-1 min-h-0 mt-4 px-6 pb-6">
                <div className="space-y-2 h-full overflow-auto min-h-0">
                  {Object.entries(response.headers).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-2 bg-muted rounded">
                      <span className="font-medium">{key}:</span>
                      <span className="text-muted-foreground break-all">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
      </div>
    </>
  );
}
