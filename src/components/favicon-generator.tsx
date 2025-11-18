"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { FaviconPack, FaviconGeneratorOptions, FAVICON_SIZES } from "@/lib/validators/favicon-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  Download,
  Copy,
  RotateCcw,
  Settings,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function FaviconGenerator() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<FaviconPack | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Advanced options
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48, 64, 96, 128, 152, 180, 192, 256]);
  const [includeIco, setIncludeIco] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [quality, setQuality] = useState([90]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file too large. Maximum size is 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      setError(null);
      setResult(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGenerate = async () => {
    if (!selectedImage) {
      setError('Please select an image first.');
      return;
    }

    const options: FaviconGeneratorOptions = {
      sizes: selectedSizes,
      includeIco,
      backgroundColor,
      quality: quality[0]
    };

    const request = {
      image: selectedImage,
      options
    };

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/favicon-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate favicons');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate favicons");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedImage || !result) return;

    setIsDownloading(true);
    try {
      const options: FaviconGeneratorOptions = {
        sizes: selectedSizes,
        includeIco,
        backgroundColor,
        quality: quality[0]
      };

      const request = {
        image: selectedImage,
        options
      };

      // Create download using API
      const response = await fetch('/api/favicon-generator/download', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to create download');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `favicon-pack-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download favicons");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopySnippet = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.htmlSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy HTML snippet:", err);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleSize = (size: number) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size].sort((a, b) => a - b)
    );
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Favicon Generator
              </CardTitle>
              <CardDescription>
                Upload an image and generate a complete favicon pack with multiple sizes and formats.
                Includes PNG favicons, ICO file, and HTML link tags.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Upload */}
              <div>
                <Label htmlFor="image-upload" className="mb-2 block">Upload Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    ref={fileInputRef}
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose Image
                  </Button>
                  {selectedImage && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Image selected
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports JPEG, PNG, WebP, TIFF, GIF. Minimum 16x16px, maximum 2048x2048px, 10MB limit.
                </p>
              </div>

              {/* Advanced Options Toggle */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Advanced Options
                </Button>
              </div>

              {/* Advanced Options */}
              {showAdvanced && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  {/* Size Selection */}
                  <div>
                    <Label className="mb-2 block">Favicon Sizes (pixels)</Label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                      {FAVICON_SIZES.map((size) => (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox
                            id={`size-${size}`}
                            checked={selectedSizes.includes(size)}
                            onCheckedChange={() => toggleSize(size)}
                          />
                          <Label
                            htmlFor={`size-${size}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {size}×{size}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Include ICO */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-ico"
                      checked={includeIco}
                      onCheckedChange={(checked) => setIncludeIco(checked === true)}
                    />
                    <Label htmlFor="include-ico" className="text-sm font-normal">
                      Include ICO file (favicon.ico)
                    </Label>
                  </div>

                  {/* Background Color */}
                  <div>
                    <Label htmlFor="background-color" className="mb-2 block">Background Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="background-color"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-8 rounded border cursor-pointer"
                      />
                      <Input
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        placeholder="#FFFFFF"
                        className="font-mono"
                      />
                    </div>
                  </div>

                  {/* Quality */}
                  <div>
                    <Label className="mb-2">Quality: {quality[0]}%</Label>
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      min={1}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleGenerate}
                  disabled={!selectedImage || isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4" />
                      Generate Favicons
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleClear} disabled={!selectedImage && !result}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Preview Section */}
          {selectedImage && (
            <Card>
              <CardHeader>
                <CardTitle>Image Preview</CardTitle>
                <CardDescription>
                  This is how your source image will be processed for favicon generation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-200">
                    <Image
                      src={selectedImage}
                      alt="Source image preview"
                      width={200}
                      height={200}
                      className="max-w-full h-auto object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {result && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Favicon Pack Generated
                    </CardTitle>
                    <CardDescription>
                      Your favicon pack is ready. Download the ZIP file or copy the HTML snippet.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopySnippet}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {copied ? "Copied!" : "Copy HTML"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      disabled={isDownloading}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      {isDownloading ? "Downloading..." : "Download ZIP"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Generated Favicons Grid */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Generated Favicons ({result.favicons.length})</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                    {result.favicons.map((favicon) => (
                      <div key={favicon.size} className="flex flex-col items-center gap-2">
                        <div className="p-2 bg-white rounded border">
                          <Image
                            src={favicon.dataUrl}
                            alt={`${favicon.size}x${favicon.size} favicon`}
                            width={favicon.size}
                            height={favicon.size}
                            className="max-w-full h-auto"
                            unoptimized
                          />
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-medium">{favicon.size}×{favicon.size}</div>
                          <div className="text-xs text-muted-foreground">PNG</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ICO File */}
                {result.icoDataUrl && (
                  <div>
                    <h4 className="text-sm font-medium mb-3">ICO File</h4>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded">
                      <div className="w-8 h-8 bg-white rounded border flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">ICO</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">favicon.ico</div>
                        <div className="text-xs text-muted-foreground">Multi-size ICO file</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* HTML Snippet */}
                <div>
                  <h4 className="text-sm font-medium mb-3">HTML Link Tags</h4>
                  <Textarea
                    value={result.htmlSnippet}
                    readOnly
                    className="font-mono text-xs min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Copy these link tags into the &lt;head&gt; section of your HTML document.
                  </p>
                </div>

                {/* Generation Info */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Generated: {result.generatedAt.toLocaleTimeString()}</span>
                  <span>{result.favicons.length} PNG files{result.icoDataUrl ? ' + 1 ICO file' : ''}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!selectedImage && !result && !error && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Ready to Generate Favicons</h3>
                    <p className="text-muted-foreground">
                      Upload an image above and generate a complete favicon pack with multiple sizes and formats.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}