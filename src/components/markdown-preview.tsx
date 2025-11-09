"use client";

import { useState, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResizablePanel as Panel,
  ResizablePanelGroup as PanelGroup,
  ResizableHandle as PanelResizeHandle,
} from "@/components/ui/resizable";
import {
  Download,
  RotateCcw,
  Eye,
  Edit3,
  FileText,
} from "lucide-react";

const defaultMarkdown = `# Welcome to Markdown Preview

This is a **live markdown editor** with instant preview. Start typing in the editor on the left and see the rendered output on the right!

## Features

- ✅ Live preview as you type
- ✅ GitHub Flavored Markdown support
- ✅ Syntax highlighting
- ✅ Export options
- ✅ Responsive design

## Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, Markdown!");
  return "Welcome";
}
\`\`\`

## Tables

| Feature | Status |
|---------|--------|
| Live Preview | ✅ |
| GitHub Flavored | ✅ |
| Export | ✅ |

## Links and Images

[Visit our website](https://example.com)

![Markdown Logo](https://markdown-here.com/img/icon256.png)

> **Tip:** This tool is perfect for writing README files, documentation, and blog posts!

---

*Start editing to see the magic happen!* ✨`;

export function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint in Tailwind
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleDownloadMarkdown = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [markdown]);

  const handleClear = useCallback(() => {
    setMarkdown("");
  }, []);

  const handleReset = useCallback(() => {
    setMarkdown(defaultMarkdown);
  }, []);

  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const charCount = markdown.length;

  return (
    <div className="container mx-auto px-4">
      {/* Controls */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Markdown Editor
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {wordCount} words
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {charCount} characters
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadMarkdown}
              disabled={!markdown.trim()}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Editor and Preview */}
      <Card>
        <PanelGroup direction={isMobile ? "vertical" : "horizontal"} className="min-h-[600px]">
          {/* Editor Panel */}
          <Panel defaultSize={50} minSize={30} className={isMobile ? "min-h-[500px] mb-4" : "h-screen"}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  <span className="font-medium">Editor</span>
                </div>
              </div>
              <div className="flex-1 p-4">
                <Textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="Start typing your markdown here..."
                  className="h-full resize-none border-0 focus:ring-0 focus:ring-offset-0 font-mono text-sm"
                  style={{ minHeight: "500px" }}
                />
              </div>
            </div>
          </Panel>

          {/* Invisible handle on mobile */}
          {!isMobile ? (
            <PanelResizeHandle withHandle className="w-2 hidden md:flex" />
          ) : (
            <div className="h-1 w-full dark:bg-border"></div>
          )}

          {/* Preview Panel */}
          <Panel defaultSize={50} minSize={30} className={isMobile ? "min-h-[500px]" : "h-screen"}> 
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">Preview</span>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Custom components for better styling
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold mb-3 mt-5 first:mt-0">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-medium mb-2 mt-4 first:mt-0">{children}</h3>
                      ),
                      code: ({ children, className }) => {
                        const isInline = !className?.includes('language-');
                        return isInline ? (
                          <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
                            {children}
                          </code>
                        ) : (
                          <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                            {children}
                          </code>
                        );
                      },
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {markdown || "*Start typing to see the preview...*"}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </Card>
    </div>
  );
}
