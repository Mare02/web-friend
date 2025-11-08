"use client";

import { useState } from "react";
import {
  convertXmlToJson,
  convertJsonToXml,
  isValidXml,
  isValidJson,
  formatXml,
  formatJson,
} from "@/lib/services/xml-converter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileCode,
  ArrowRightLeft,
  Copy,
  Download,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Wand2,
} from "lucide-react";

export function XmlJsonConverter() {
  const [direction, setDirection] = useState<"xml-to-json" | "json-to-xml">("xml-to-json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  // Validation states
  const isInputValid = direction === "xml-to-json"
    ? input.trim() ? isValidXml(input) : null
    : input.trim() ? isValidJson(input) : null;

  const handleConvert = async () => {
    if (!input.trim()) {
      setError("Please enter some input to convert");
      return;
    }

    setIsConverting(true);
    setError(null);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    let result;
    if (direction === "xml-to-json") {
      result = convertXmlToJson(input);
    } else {
      result = convertJsonToXml(input);
    }

    if (result.success) {
      setOutput(result.formatted);
      setError(null);
    } else {
      setError(result.error);
      setOutput("");
    }

    setIsConverting(false);
  };

  const handleSwapDirection = () => {
    // Swap direction
    const newDirection = direction === "xml-to-json" ? "json-to-xml" : "xml-to-json";
    setDirection(newDirection);

    // Swap input and output if output exists
    if (output) {
      const temp = input;
      setInput(output);
      setOutput(temp);
    }

    setError(null);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleCopyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  const handleDownloadOutput = () => {
    if (!output) return;

    const extension = direction === "xml-to-json" ? "json" : "xml";
    const mimeType = direction === "xml-to-json"
      ? "application/json"
      : "application/xml";

    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFormatInput = () => {
    if (!input.trim()) return;

    let result;
    if (direction === "xml-to-json") {
      result = formatXml(input);
    } else {
      result = formatJson(input);
    }

    if (result.success) {
      setInput(result.formatted);
      setError(null);
    } else {
      setError(result.error);
    }
  };

  const loadSampleXml = () => {
    const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title lang="en">The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price>10.99</price>
  </book>
  <book category="non-fiction">
    <title lang="en">Sapiens</title>
    <author>Yuval Noah Harari</author>
    <year>2011</year>
    <price>14.99</price>
  </book>
</bookstore>`;
    setInput(sampleXml);
    setOutput("");
    setError(null);
    setDirection("xml-to-json");
  };

  const loadSampleJson = () => {
    const sampleJson = `{
  "bookstore": {
    "book": [
      {
        "@_category": "fiction",
        "title": {
          "@_lang": "en",
          "#text": "The Great Gatsby"
        },
        "author": "F. Scott Fitzgerald",
        "year": 1925,
        "price": 10.99
      },
      {
        "@_category": "non-fiction",
        "title": {
          "@_lang": "en",
          "#text": "Sapiens"
        },
        "author": "Yuval Noah Harari",
        "year": 2011,
        "price": 14.99
      }
    ]
  }
}`;
    setInput(sampleJson);
    setOutput("");
    setError(null);
    setDirection("json-to-xml");
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              <FileCode className="h-8 w-8" />
              XML/JSON Converter
            </h1>
            <p className="text-muted-foreground">
              Convert between XML and JSON formats with validation and formatting
            </p>
          </div>

          {/* Direction Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5" />
                Conversion Direction
              </CardTitle>
              <CardDescription>
                Choose which direction to convert your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={direction} onValueChange={(v) => {
                setDirection(v as typeof direction);
                setInput("");
                setOutput("");
                setError(null);
              }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="xml-to-json">XML to JSON</TabsTrigger>
                  <TabsTrigger value="json-to-xml">JSON to XML</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex gap-2 mt-4">
                {direction === "xml-to-json" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSampleXml}
                  >
                    Load Sample XML
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSampleJson}
                  >
                    Load Sample JSON
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Input/Output Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Input ({direction === "xml-to-json" ? "XML" : "JSON"})
                      {isInputValid !== null && (
                        isInputValid ? (
                          <Badge variant="default" className="ml-2">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Valid
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="ml-2">
                            <XCircle className="h-3 w-3 mr-1" />
                            Invalid
                          </Badge>
                        )
                      )}
                    </CardTitle>
                    <CardDescription>
                      Paste your {direction === "xml-to-json" ? "XML" : "JSON"} data here
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder={`Enter your ${direction === "xml-to-json" ? "XML" : "JSON"} here...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[400px] font-mono text-sm resize-y"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleConvert}
                    disabled={!input.trim() || isConverting || isInputValid === false}
                    className="flex items-center gap-2"
                  >
                    {isConverting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Converting...
                      </>
                    ) : (
                      <>
                        <ArrowRightLeft className="h-4 w-4" />
                        Convert
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleFormatInput}
                    disabled={!input.trim()}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Format
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSwapDirection}
                    disabled={!output}
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Swap
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Output ({direction === "xml-to-json" ? "JSON" : "XML"})</CardTitle>
                    <CardDescription>
                      Converted {direction === "xml-to-json" ? "JSON" : "XML"} output
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="Converted output will appear here..."
                    value={output}
                    readOnly
                    className="min-h-[400px] font-mono text-sm resize-y bg-muted/50"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCopyOutput}
                    disabled={!output}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownloadOutput}
                    disabled={!output}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
