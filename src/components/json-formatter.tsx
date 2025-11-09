"use client";

import { useState, useMemo, useCallback } from "react";
import {
  formatJson,
  minifyJson,
  validateJson,
  getJsonStats,
  type JsonValidationResult,
  type JsonFormatResult,
  type JsonMinifyResult
} from "@/lib/services/json-formatter";
import {
  DEFAULT_JSON_FORMATTER_OPTIONS,
  JSON_FORMATTER_OPERATIONS,
  JSON_FORMAT_PRESETS,
  validateJsonFormatterFormData,
  type JsonFormatterFormData,
  type JsonFormatterOperation,
  type JsonFormatterOptions
} from "@/lib/validators/json-formatter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Braces,
  Copy,
  Download,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  FileText,
  AlertTriangle,
  RotateCcw
} from "lucide-react";

interface JsonFormatterProps {
  className?: string;
}

export function JsonFormatter({ className }: JsonFormatterProps) {
  const [formData, setFormData] = useState<JsonFormatterFormData>({
    jsonInput: '',
    options: DEFAULT_JSON_FORMATTER_OPTIONS,
    operation: 'format'
  });

  const [result, setResult] = useState<{
    type: 'validate' | 'format' | 'minify';
    data?: JsonValidationResult | JsonFormatResult | JsonMinifyResult;
    error?: string;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, jsonInput: value }));
    setResult(null); // Clear previous results when input changes
  }, []);

  // Handle operation change
  const handleOperationChange = useCallback((operation: JsonFormatterOperation) => {
    setFormData(prev => ({ ...prev, operation }));
    setResult(null);
  }, []);

  // Handle options change
  const handleOptionChange = useCallback((key: keyof JsonFormatterOptions, value: any) => {
    setFormData(prev => ({
      ...prev,
      options: { ...prev.options, [key]: value }
    }));
  }, []);

  // Handle preset selection
  const handlePresetSelect = useCallback((presetName: string) => {
    const preset = JSON_FORMAT_PRESETS.find(p => p.name === presetName);
    if (preset) {
      setFormData(prev => ({ ...prev, options: preset.options }));
    }
  }, []);

  // Process JSON based on current operation
  const processJson = useCallback(async () => {
    const validation = validateJsonFormatterFormData(formData);
    if (!validation.isValid) {
      setResult({ type: 'validate', error: 'Invalid form data' });
      return;
    }

    setIsProcessing(true);
    try {
      let resultData: JsonValidationResult | JsonFormatResult | JsonMinifyResult;

      switch (formData.operation) {
        case 'format':
          resultData = formatJson(formData.jsonInput, formData.options);
          break;
        case 'minify':
          resultData = minifyJson(formData.jsonInput);
          break;
        case 'validate':
          resultData = validateJson(formData.jsonInput);
          break;
        default:
          throw new Error('Unknown operation');
      }

      setResult({ type: formData.operation, data: resultData });
    } catch (error) {
      setResult({
        type: formData.operation,
        error: error instanceof Error ? error.message : 'Processing failed'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [formData]);

  // Copy result to clipboard
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (error) {
      alert('Failed to copy to clipboard');
    }
  }, []);

  // Download result as file
  const downloadResult = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('File downloaded!');
  }, []);

  // Clear all data
  const clearAll = useCallback(() => {
    setFormData({
      jsonInput: '',
      options: DEFAULT_JSON_FORMATTER_OPTIONS,
      operation: 'format'
    });
    setResult(null);
  }, []);

  // Get output content based on result
  const getOutputContent = useCallback(() => {
    if (!result || result.error) return '';

    switch (result.type) {
      case 'format':
        return (result.data as JsonFormatResult).formatted;
      case 'minify':
        return (result.data as JsonMinifyResult).minified;
      case 'validate':
        return JSON.stringify((result.data as JsonValidationResult).parsed, null, 2);
      default:
        return '';
    }
  }, [result]);

  // Get stats for display
  const stats = useMemo(() => {
    if (!formData.jsonInput.trim()) return null;
    return getJsonStats(formData.jsonInput);
  }, [formData.jsonInput]);

  const outputContent = getOutputContent();

  return (
    <div className="min-h-screen pb-20">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className={`max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Header with stats */}
      {stats && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                {stats.isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className={stats.isValid ? 'text-green-600' : 'text-red-600'}>
                  {stats.isValid ? 'Valid JSON' : 'Invalid JSON'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{stats.size} bytes</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{stats.lines} lines</span>
              </div>
              {stats.isValid && (
                <>
                  <div className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-muted-foreground" />
                    <span>{stats.keys} keys</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>Depth: {stats.depth}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Operation Tabs */}
      <Tabs value={formData.operation} onValueChange={(value) => handleOperationChange(value as JsonFormatterOperation)}>
        <TabsList className="grid w-full grid-cols-3">
          {JSON_FORMATTER_OPERATIONS.map((op) => (
            <TabsTrigger key={op.value} value={op.value} className="flex items-center gap-2">
              {op.value === 'format' && <Braces className="h-4 w-4" />}
              {op.value === 'minify' && <Zap className="h-4 w-4" />}
              {op.value === 'validate' && <CheckCircle className="h-4 w-4" />}
              {op.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              JSON Input
            </CardTitle>
            <CardDescription>
              Paste your JSON data here. The input will be validated in real-time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your JSON here..."
              value={formData.jsonInput}
              onChange={(e) => handleInputChange(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* Options Section (for format operation) */}
        {formData.operation === 'format' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Formatting Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sortKeys"
                    checked={formData.options.sortKeys}
                    onCheckedChange={(checked) => handleOptionChange('sortKeys', checked)}
                  />
                  <Label htmlFor="sortKeys">Sort keys alphabetically</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useTabs"
                    checked={formData.options.useTabs}
                    onCheckedChange={(checked) => handleOptionChange('useTabs', checked)}
                  />
                  <Label htmlFor="useTabs">Use tabs instead of spaces</Label>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="indentSize"className="mb-2">Indent size</Label>
                  <Select
                    value={formData.options.indentSize.toString()}
                    onValueChange={(value) => handleOptionChange('indentSize', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label htmlFor="preset" className="mb-2">Preset</Label>
                  <Select onValueChange={handlePresetSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose preset" />
                    </SelectTrigger>
                    <SelectContent>
                      {JSON_FORMAT_PRESETS.map((preset) => (
                        <SelectItem key={preset.name} value={preset.name}>
                          {preset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={processJson}
            disabled={!formData.jsonInput.trim() || isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                {JSON_FORMATTER_OPERATIONS.find(op => op.value === formData.operation)?.label}
              </>
            )}
          </Button>
          <Button variant="outline" onClick={clearAll}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        {/* Results Section */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {result?.error ? 'Error' : 'Result'}
                </div>
                {outputContent && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(outputContent)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadResult(outputContent, `formatted-${Date.now()}.json`)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result?.error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{result.error}</AlertDescription>
                </Alert>
              )}

              {result && !result.error && result.data && (
                <div className="space-y-4">
                  {/* Stats for format/minify operations */}
                  {(result.type === 'format' || result.type === 'minify') && (
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{(result.data as any).executionTime.toFixed(2)}ms</span>
                      </div>
                      {result.type === 'format' && (
                        <>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>{(result.data as JsonFormatResult).originalSize} → {(result.data as JsonFormatResult).formattedSize} bytes</span>
                          </div>
                        </>
                      )}
                      {result.type === 'minify' && (
                        <>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>{(result.data as JsonMinifyResult).originalSize} → {(result.data as JsonMinifyResult).minifiedSize} bytes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-muted-foreground" />
                            <span>{(result.data as JsonMinifyResult).compressionRatio}% saved</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Validation status for validate operation */}
                  {result.type === 'validate' && (
                    <div className="flex items-center gap-2">
                      {(result.data as JsonValidationResult).isValid ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-green-600 font-medium">Valid JSON</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span className="text-red-600 font-medium">Invalid JSON</span>
                        </>
                      )}
                      <div className="flex items-center gap-2 ml-4">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {(result.data as JsonValidationResult).executionTime.toFixed(2)}ms
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Output */}
                  <ScrollArea className="h-[400px] w-full rounded-md border">
                    <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-all">
                      {outputContent}
                    </pre>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </Tabs>
        </div>
      </div>
    </div>
  );
}
