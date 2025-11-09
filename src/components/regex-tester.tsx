"use client";

import { useState, useMemo } from "react";
import {
  testRegex,
  replaceWithRegex,
  getPatternCategories,
  getPatternsByCategory,
  highlightMatches,
  validateRegexPattern,
  escapeRegex,
  unescapeRegex,
  type RegexFlags,
  type CommonRegexPattern,
  type RegexTestResult,
  type RegexReplaceResult
} from "@/lib/services/regex-tester";
import {
  DEFAULT_REGEX_FLAGS,
  FLAG_DESCRIPTIONS,
  REGEX_OPERATIONS,
  validateRegexFormData,
  type RegexFormData
} from "@/lib/validators/regex-tester";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Regex,
  Play,
  RotateCcw,
  Copy,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Target,
  FileText,
  Settings,
  Zap
} from "lucide-react";

interface RegexTesterProps {
  onBack?: () => void;
}

export function RegexTester({ onBack }: RegexTesterProps) {
  const [formData, setFormData] = useState<RegexFormData>({
    pattern: '',
    testString: '',
    replacement: '',
    flags: { ...DEFAULT_REGEX_FLAGS }
  });

  const [operation, setOperation] = useState<'test' | 'replace'>('test');
  const [selectedCategory, setSelectedCategory] = useState<string>('Email');
  const [results, setResults] = useState<RegexTestResult | RegexReplaceResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = useMemo(() => getPatternCategories(), []);
  const commonPatterns = useMemo(() => getPatternsByCategory(selectedCategory), [selectedCategory]);

  const validation = useMemo(() => validateRegexFormData(formData), [formData]);
  const patternValidation = useMemo(() => validateRegexPattern(formData.pattern), [formData.pattern]);
  const isReadyToProcess = validation.isValid && patternValidation.isValid;

  // Derive processing state from validation - no need for useEffect with setState

  const handleInputChange = (field: keyof RegexFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFlagChange = (flag: keyof RegexFlags, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      flags: { ...prev.flags, [flag]: checked }
    }));
  };

  const handlePatternSelect = (pattern: CommonRegexPattern) => {
    setFormData(prev => ({ ...prev, pattern: pattern.pattern }));
  };

  const handleProcess = async () => {
    if (!isReadyToProcess) return;

    setIsProcessing(true);
    setResults(null);

    try {
      // Small delay to show processing state
      await new Promise(resolve => setTimeout(resolve, 100));

      const result = operation === 'test'
        ? testRegex(formData.pattern, formData.testString, formData.flags)
        : replaceWithRegex(formData.pattern, formData.testString, formData.replacement, formData.flags);

      setResults(result);
    } catch (error) {
      console.error('Regex processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setFormData({
      pattern: '',
      testString: '',
      replacement: '',
      flags: { ...DEFAULT_REGEX_FLAGS }
    });
    setResults(null);
  };

  const handleCopyPattern = () => {
    navigator.clipboard.writeText(formData.pattern);
  };

  const handleCopyResults = () => {
    if (!results) return;

    let resultText = '';

    if (operation === 'test' && 'matches' in results) {
      resultText = `Regex Pattern: ${formData.pattern}\n`;
      resultText += `Test String: ${formData.testString}\n`;
      resultText += `Matches Found: ${results.totalMatches}\n\n`;

      if (results.matches.length > 0) {
        resultText += 'Matches:\n';
        results.matches.forEach((match, index) => {
          resultText += `${index + 1}. "${match.match}" at position ${match.index}`;
          if (match.groups && match.groups.length > 0) {
            resultText += ` (groups: ${match.groups.join(', ')})`;
          }
          resultText += '\n';
        });
      }
    } else if (operation === 'replace' && 'replacedText' in results) {
      resultText = `Original: ${results.originalText}\n`;
      resultText += `Replaced: ${results.replacedText}\n`;
      resultText += `Replacements: ${results.replacementCount}\n`;
    }

    navigator.clipboard.writeText(resultText);
  };

  const handleEscapePattern = () => {
    setFormData(prev => ({ ...prev, pattern: escapeRegex(prev.pattern) }));
  };

  const handleUnescapePattern = () => {
    setFormData(prev => ({ ...prev, pattern: unescapeRegex(prev.pattern) }));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          {onBack && (
            <div className="flex justify-start">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <Regex className="h-4 w-4" />
                Back to Regex Tester
              </Button>
            </div>
          )}

          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Regex className="h-5 w-5" />
                Regex Pattern Tester
              </CardTitle>
              <CardDescription>
                Test regular expressions against text strings. Supports find, replace, and advanced pattern matching.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Operation Selector */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Operation Mode</Label>
                <Select value={operation} onValueChange={(value: 'test' | 'replace') => setOperation(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGEX_OPERATIONS.map(op => (
                      <SelectItem key={op.value} value={op.value}>
                        <div className="flex flex-col">
                          <span>{op.label}</span>
                          <span className="text-xs text-muted-foreground">{op.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {/* Pattern Input */}
                <div className="space-y-2">
                  <Label htmlFor="pattern" className="text-sm font-medium">Regex Pattern</Label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        id="pattern"
                        placeholder="Enter your regex pattern..."
                        value={formData.pattern}
                        onChange={(e) => handleInputChange('pattern', e.target.value)}
                        className={`font-mono ${!patternValidation.isValid ? 'border-red-500' : ''}`}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleEscapePattern}
                          className="h-6 w-6 p-0"
                          title="Escape special characters"
                        >
                          \
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleUnescapePattern}
                          className="h-6 w-6 p-0"
                          title="Unescape characters"
                        >
                          /
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCopyPattern}
                          className="h-6 w-6 p-0"
                          title="Copy pattern"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {!patternValidation.isValid && patternValidation.error && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {patternValidation.error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>

                {/* Test String Input */}
                <div className="space-y-2">
                  <Label htmlFor="testString" className="text-sm font-medium">Test String</Label>
                  <Textarea
                    id="testString"
                    placeholder="Enter text to test against..."
                    value={formData.testString}
                    onChange={(e) => handleInputChange('testString', e.target.value)}
                    className="min-h-[100px] font-mono"
                  />
                </div>
              </div>

              {/* Replacement Input (for replace mode) */}
              {operation === 'replace' && (
                <div className="space-y-2">
                  <Label htmlFor="replacement" className="text-sm font-medium">Replacement Text</Label>
                  <Input
                    id="replacement"
                    placeholder="Enter replacement text..."
                    value={formData.replacement}
                    onChange={(e) => handleInputChange('replacement', e.target.value)}
                  />
                </div>
              )}

              {/* Regex Flags */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Regex Flags</Label>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(FLAG_DESCRIPTIONS).map(([flag, description]) => (
                    <div key={flag} className="flex items-start space-x-2">
                      <Checkbox
                        id={flag}
                        checked={formData.flags[flag as keyof RegexFlags]}
                        onCheckedChange={(checked) => handleFlagChange(flag as keyof RegexFlags, checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor={flag}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {flag.charAt(0).toUpperCase() + flag.slice(1)} ({flag.charAt(0)})
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleProcess}
                  disabled={!isReadyToProcess || isProcessing}
                  className="flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      {operation === 'test' ? 'Test Pattern' : 'Replace'}
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
                {results && (
                  <Button variant="outline" onClick={handleCopyResults}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Results
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {results && (
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="results" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Results
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-4 mt-4">
                {operation === 'test' && 'matches' in results ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {results.isValid ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        Test Results
                      </CardTitle>
                      <CardDescription>
                        {results.totalMatches} match{results.totalMatches !== 1 ? 'es' : ''} found
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({results.executionTime.toFixed(2)}ms)
                        </span>
                        {results.warning && (
                          <div className="mt-2">
                            <Alert variant="default" className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <AlertDescription className="text-sm text-yellow-800 dark:text-yellow-200">
                                {results.warning}
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Highlighted Text */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Highlighted Matches</Label>
                        <div
                          className="p-4 border rounded-lg bg-muted/30 font-mono text-sm whitespace-pre-wrap wrap-break-word"
                          dangerouslySetInnerHTML={{
                            __html: highlightMatches(formData.testString, results.matches)
                          }}
                        />
                      </div>

                      {/* Match List */}
                      {results.matches.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Match Details</Label>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {results.matches.map((match, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
                                <Badge variant="outline">#{index + 1}</Badge>
                                <div className="flex-1 font-mono text-sm">
                                  &ldquo;{match.match}&rdquo;
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Position: {match.index}, Length: {match.length}
                                </div>
                                {match.groups && match.groups.length > 0 && (
                                  <div className="text-xs text-muted-foreground">
                                    Groups: {match.groups.join(', ')}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : operation === 'replace' && 'replacedText' in results ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-500" />
                        Replace Results
                      </CardTitle>
                      <CardDescription>
                        {results.replacementCount} replacement{results.replacementCount !== 1 ? 's' : ''} made
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({results.executionTime.toFixed(2)}ms)
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Original Text</Label>
                          <Textarea
                            value={results.originalText}
                            readOnly
                            className="font-mono min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Replaced Text</Label>
                          <Textarea
                            value={results.replacedText}
                            readOnly
                            className="font-mono min-h-[100px]"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Pattern Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Pattern</Label>
                        <code className="block p-3 bg-muted rounded font-mono text-sm break-all">
                          {formData.pattern}
                        </code>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Active Flags</Label>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(formData.flags).map(([flag, enabled]) =>
                            enabled ? (
                              <Badge key={flag} variant="secondary">
                                {flag} ({flag.charAt(0)})
                              </Badge>
                            ) : null
                          )}
                        </div>
                        {Object.values(formData.flags).every(f => !f) && (
                          <p className="text-sm text-muted-foreground">No flags enabled</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Common Patterns Library */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Common Regex Patterns
              </CardTitle>
              <CardDescription>
                Pre-built regex patterns for common use cases. Click to use.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Category:</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  {commonPatterns.map((pattern, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{pattern.name}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{pattern.description}</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {pattern.pattern}
                        </code>
                        <p className="text-xs text-muted-foreground mt-1">
                          Example: {pattern.example}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePatternSelect(pattern)}
                        className="ml-2"
                      >
                        Use
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
