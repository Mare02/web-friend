"use client";

import { useState } from "react";
import { analyzeText, TextAnalysisResult } from "@/lib/services/text-analyzer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, BarChart3, BookOpen, Search, Copy, RotateCcw } from "lucide-react";

interface TextAnalyzerProps {
  onBack?: () => void;
}

export function TextAnalyzer({ onBack }: TextAnalyzerProps) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<TextAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));

    const analysisResult = analyzeText(text);
    setResult(analysisResult);
    setIsAnalyzing(false);
  };

  const handleClear = () => {
    setText("");
    setResult(null);
  };

  const handleCopyResults = () => {
    if (!result) return;

    const summary = generateSummaryText(result);
    navigator.clipboard.writeText(summary);
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back Button */}
          {onBack && (
            <div className="flex justify-start">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Back to Text Analyzer
              </Button>
            </div>
          )}

          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Text Input
              </CardTitle>
              <CardDescription>
                Paste or type your text below to analyze it for readability, SEO, and content quality metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your text here... (minimum 10 words for meaningful analysis)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] resize-y"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleAnalyze}
                  disabled={!text.trim() || isAnalyzing}
                  className="flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4" />
                      Analyze Text
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleClear} disabled={!text && !result}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                {result && (
                  <Button variant="outline" onClick={handleCopyResults}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Summary
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Basic Stats</span>
                  <span className="sm:hidden">Stats</span>
                </TabsTrigger>
                <TabsTrigger value="readability" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Readability</span>
                  <span className="sm:hidden">Reading</span>
                </TabsTrigger>
                <TabsTrigger value="seo" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">SEO Analysis</span>
                  <span className="sm:hidden">SEO</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-2">
                <BasicStatsTab result={result} />
              </TabsContent>

              <TabsContent value="readability" className="space-y-4 mt-2">
                <ReadabilityTab result={result} />
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 mt-2">
                <SEOAnalysisTab result={result} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}

function BasicStatsTab({ result }: { result: TextAnalysisResult }) {
  const { basicStats } = result;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Word Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{basicStats.wordCount.total.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {basicStats.wordCount.unique} unique words
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Character Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{basicStats.characterCount.withSpaces.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {basicStats.characterCount.withoutSpaces.toLocaleString()} without spaces
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Sentences & Paragraphs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{basicStats.sentenceCount}</div>
          <p className="text-xs text-muted-foreground">
            {basicStats.paragraphCount} paragraphs
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Avg Words/Sentence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{basicStats.averageWordsPerSentence}</div>
          <p className="text-xs text-muted-foreground">
            Words per sentence
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Reading Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{basicStats.readingTimeMinutes.toFixed(1)}m</div>
          <p className="text-xs text-muted-foreground">
            At 225 words/minute
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Speaking Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{basicStats.speakingTimeMinutes.toFixed(1)}m</div>
          <p className="text-xs text-muted-foreground">
            At 150 words/minute
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ReadabilityTab({ result }: { result: TextAnalysisResult }) {
  const { readability } = result;

  const getReadabilityColor = (score: number) => {
    if (score >= 60) return "text-green-600";
    if (score >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeColor = (grade: number) => {
    if (grade <= 6) return "text-green-600";
    if (grade <= 12) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Flesch Reading Ease</CardTitle>
          <CardDescription>How easy to read (0-100)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getReadabilityColor(readability.fleschReadingEase.score)}`}>
            {readability.fleschReadingEase.score}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {readability.fleschReadingEase.level}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Flesch-Kincaid Grade</CardTitle>
          <CardDescription>US grade level needed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getGradeColor(readability.fleschKincaidGradeLevel)}`}>
            {readability.fleschKincaidGradeLevel}
          </div>
          <p className="text-xs text-muted-foreground">
            Grade level
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Gunning Fog Index</CardTitle>
          <CardDescription>Years of education needed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getGradeColor(readability.gunningFogIndex)}`}>
            {readability.gunningFogIndex}
          </div>
          <p className="text-xs text-muted-foreground">
            Years of education
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">ARI Grade Level</CardTitle>
          <CardDescription>Automated Readability Index</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getGradeColor(readability.automatedReadabilityIndex)}`}>
            {readability.automatedReadabilityIndex}
          </div>
          <p className="text-xs text-muted-foreground">
            Grade level
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">SMOG Index</CardTitle>
          <CardDescription>For health content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getGradeColor(readability.smogIndex)}`}>
            {readability.smogIndex}
          </div>
          <p className="text-xs text-muted-foreground">
            Grade level
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Readability Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant={readability.fleschReadingEase.score >= 60 ? "default" : readability.fleschReadingEase.score >= 30 ? "secondary" : "destructive"}>
              {readability.fleschReadingEase.score >= 60 ? "Easy" : readability.fleschReadingEase.score >= 30 ? "Medium" : "Hard"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Overall readability assessment based on multiple metrics
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function SEOAnalysisTab({ result }: { result: TextAnalysisResult }) {
  const { seoContent } = result;

  return (
    <div className="space-y-6">
      {/* Top Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Top Keywords
          </CardTitle>
          <CardDescription>
            Most frequent words (excluding common stop words)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {seoContent.topKeywords.length > 0 ? (
            <div className="space-y-3">
              {seoContent.topKeywords.slice(0, 10).map((keyword, index) => (
                <div key={keyword.word} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="font-medium">{keyword.word}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{keyword.count}x</span>
                    <span>({keyword.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No significant keywords found</p>
          )}
        </CardContent>
      </Card>

      {/* Keyword Density */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword Density</CardTitle>
          <CardDescription>
            Most frequent phrases (1-3 words) with density percentages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {seoContent.keywordDensity.length > 0 ? (
            <div className="space-y-3">
              {seoContent.keywordDensity.slice(0, 10).map((phrase, index) => (
                <div key={phrase.phrase} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium">"{phrase.phrase}"</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{phrase.count}x</span>
                      <span>({phrase.density}%)</span>
                    </div>
                  </div>
                  <Progress value={Math.min(phrase.density * 10, 100)} className="h-2" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No repeated phrases found</p>
          )}
        </CardContent>
      </Card>

      {/* Long-tail Keywords */}
      <Card>
        <CardHeader>
          <CardTitle>Long-tail Keywords</CardTitle>
          <CardDescription>
            2-3 word phrases that appear multiple times
          </CardDescription>
        </CardHeader>
        <CardContent>
          {seoContent.longTailKeywords.length > 0 ? (
            <div className="space-y-3">
              {seoContent.longTailKeywords.slice(0, 10).map((phrase, index) => (
                <div key={phrase.phrase} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="font-medium">"{phrase.phrase}"</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{phrase.count}x</span>
                    <span>({phrase.density}%)</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No long-tail keywords found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function generateSummaryText(result: TextAnalysisResult): string {
  const { basicStats, readability, seoContent } = result;

  return `Text Analysis Summary
==================

Basic Statistics:
- Total Words: ${basicStats.wordCount.total}
- Unique Words: ${basicStats.wordCount.unique}
- Characters (with spaces): ${basicStats.characterCount.withSpaces}
- Characters (without spaces): ${basicStats.characterCount.withoutSpaces}
- Sentences: ${basicStats.sentenceCount}
- Paragraphs: ${basicStats.paragraphCount}
- Average Words per Sentence: ${basicStats.averageWordsPerSentence}
- Estimated Reading Time: ${basicStats.readingTimeMinutes.toFixed(1)} minutes
- Estimated Speaking Time: ${basicStats.speakingTimeMinutes.toFixed(1)} minutes

Readability Scores:
- Flesch Reading Ease: ${readability.fleschReadingEase.score} (${readability.fleschReadingEase.level})
- Flesch-Kincaid Grade Level: ${readability.fleschKincaidGradeLevel}
- Gunning Fog Index: ${readability.gunningFogIndex}
- Automated Readability Index: ${readability.automatedReadabilityIndex}
- SMOG Index: ${readability.smogIndex}

Top Keywords:
${seoContent.topKeywords.slice(0, 5).map(k => `- ${k.word}: ${k.count}x (${k.percentage}%)`).join('\n')}

Keyword Density:
${seoContent.keywordDensity.slice(0, 5).map(k => `- "${k.phrase}": ${k.count}x (${k.density}%)`).join('\n')}`;
}
