"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Copy, Maximize } from "lucide-react";
import type { ResponseData } from "@/lib/validators/api-tester";
import { formatResponse } from "@/lib/services/api-tester-utils";

interface ResponseSectionProps {
  response: ResponseData;
  responseView: 'pretty' | 'raw' | 'headers';
  onResponseViewChange: (view: 'pretty' | 'raw' | 'headers') => void;
  onCopyToClipboard: (text: string) => void;
  onFullscreenToggle: () => void;
}

export function ResponseSection({
  response,
  responseView,
  onResponseViewChange,
  onCopyToClipboard,
  onFullscreenToggle,
}: ResponseSectionProps) {
  const formattedResponse = formatResponse(response.data);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            {response.status >= 200 && response.status < 300 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            Response
          </CardTitle>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span>Status: {response.status} {response.statusText}</span>
              <span>Time: {response.responseTime}ms</span>
              <span>Size: {response.size} bytes</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onFullscreenToggle}
              className="h-8 w-8 p-0 self-start sm:self-center shrink-0"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={responseView} onValueChange={(value: string) => onResponseViewChange(value as 'pretty' | 'raw' | 'headers')}>
          <TabsList>
            <TabsTrigger value="pretty">Pretty</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>

          <TabsContent value="pretty">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => onCopyToClipboard(formattedResponse)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm max-h-[600px] overflow-y-auto">
                {formattedResponse}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="raw">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => onCopyToClipboard(formattedResponse)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm max-h-[600px] overflow-y-auto whitespace-pre-wrap">
                {formattedResponse}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="headers">
            <div className="space-y-2">
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-medium">{key}:</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
