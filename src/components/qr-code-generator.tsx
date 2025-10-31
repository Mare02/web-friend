"use client";

import { useState } from "react";
import Image from "next/image";
import { generateQRCode, QRCodeResult, QR_TEMPLATES, formatQRContent, validateQRContent } from "@/lib/services/qr-code-service";
import { QRCodeOptions } from "@/lib/validators/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Download,
  Copy,
  RotateCcw,
  Settings,
  Zap,
} from "lucide-react";

interface QRCodeGeneratorProps {
  onBack?: () => void;
}

export function QRCodeGenerator({ onBack }: QRCodeGeneratorProps) {
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("text");
  const [result, setResult] = useState<QRCodeResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Advanced options
  const [size, setSize] = useState([256]);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [margin, setMargin] = useState([4]);
  const [format, setFormat] = useState<'png' | 'svg' | 'jpeg'>('png');
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#FFFFFF');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = async () => {
    const formattedContent = formatQRContent(contentType, content);

    if (!validateQRContent(contentType, content)) {
      setError(`Invalid ${contentType} format`);
      return;
    }

    const options: QRCodeOptions = {
      text: formattedContent,
      size: size[0],
      errorCorrectionLevel: errorCorrection,
      format,
      margin: margin[0],
      color: {
        dark: darkColor,
        light: lightColor,
      },
    };

    setIsGenerating(true);
    setError(null);

    try {
      const qrResult = await generateQRCode(options);
      setResult(qrResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate QR code");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;

    try {
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.${format}`;
      link.href = result.dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download QR code:", err);
    }
  };

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.dataUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy QR code:", err);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = QR_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setContentType(template.id);
      // Reset to template defaults
      setSize([256]);
      setErrorCorrection(template.defaultOptions.errorCorrectionLevel || 'M');
      setFormat(template.defaultOptions.format || 'png');
    }
  };

  const handleClear = () => {
    setContent("");
    setResult(null);
    setError(null);
  };

  const getContentPlaceholder = () => {
    switch (contentType) {
      case 'url': return 'https://example.com';
      case 'email': return 'user@example.com';
      case 'phone': return '+1234567890';
      case 'wifi': return 'SSID;WPA2;password';
      default: return 'Enter your content here...';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          {onBack && (
            <div className="flex justify-start">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                Back to QR Code Generator
              </Button>
            </div>
          )}

          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code Generator
              </CardTitle>
              <CardDescription>
                Generate QR codes for URLs, text, email addresses, phone numbers, and WiFi networks.
                Customize size, colors, and error correction levels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Content Type Selection */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="content-type" className="mb-2">Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {QR_TEMPLATES.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2">Templates</Label>
                  <Select onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Quick templates" />
                    </SelectTrigger>
                    <SelectContent>
                      {QR_TEMPLATES.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} - {template.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Content Input */}
              <div>
                <Label htmlFor="content" className="mb-2">Content</Label>
                {contentType === 'wifi' ? (
                  <Textarea
                    id="content"
                    placeholder={getContentPlaceholder()}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[80px] font-mono"
                  />
                ) : (
                  <Input
                    id="content"
                    type={contentType === 'email' ? 'email' : contentType === 'url' ? 'url' : 'text'}
                    placeholder={getContentPlaceholder()}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {contentType === 'wifi' && 'Format: SSID;SECURITY;PASSWORD (e.g., MyWiFi;WPA2;mypassword)'}
                  {contentType === 'url' && 'Enter a complete URL including https://'}
                  {contentType === 'email' && 'Enter email address only (mailto: will be added automatically)'}
                  {contentType === 'phone' && 'Enter phone number only (tel: will be added automatically)'}
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
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Size */}
                    <div>
                      <Label className="mb-2">Size: {size[0]}px</Label>
                      <Slider
                        value={size}
                        onValueChange={setSize}
                        min={128}
                        max={1024}
                        step={32}
                        className="mt-2"
                      />
                    </div>

                    {/* Margin */}
                    <div>
                      <Label className="mb-2">Margin: {margin[0]}px</Label>
                      <Slider
                        value={margin}
                        onValueChange={setMargin}
                        min={0}
                        max={10}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Error Correction */}
                    <div>
                      <Label htmlFor="error-correction" className="mb-2">Error Correction</Label>
                      <Select value={errorCorrection} onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => setErrorCorrection(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Low (7%)</SelectItem>
                          <SelectItem value="M">Medium (15%)</SelectItem>
                          <SelectItem value="Q">Quartile (25%)</SelectItem>
                          <SelectItem value="H">High (30%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Format */}
                    <div>
                      <Label htmlFor="format" className="mb-2">Format</Label>
                      <Select value={format} onValueChange={(value: 'png' | 'svg' | 'jpeg') => setFormat(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="svg">SVG</SelectItem>
                          <SelectItem value="jpeg">JPEG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Colors */}
                    <div className="space-y-2">
                      <Label className="mb-2">Colors</Label>
                      <div className="flex gap-2">
                        <div className="flex flex-col items-center gap-1">
                          <input
                            type="color"
                            value={darkColor}
                            onChange={(e) => setDarkColor(e.target.value)}
                            className="w-8 h-8 rounded border cursor-pointer"
                          />
                          <span className="text-xs text-muted-foreground">Dark</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <input
                            type="color"
                            value={lightColor}
                            onChange={(e) => setLightColor(e.target.value)}
                            className="w-8 h-8 rounded border cursor-pointer"
                          />
                          <span className="text-xs text-muted-foreground">Light</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleGenerate}
                  disabled={!content.trim() || isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Generate QR Code
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleClear} disabled={!content && !result}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results Section */}
          {result && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="h-5 w-5" />
                      Generated QR Code
                    </CardTitle>
                    <CardDescription>
                      Your QR code is ready. Download or copy it for use.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-200">
                    <Image
                      src={result.dataUrl}
                      alt="Generated QR Code"
                      width={result.options.size}
                      height={result.options.size}
                      className="max-w-full h-auto"
                      unoptimized
                    />
                  </div>

                  {/* QR Code Info */}
                  <div className="w-full max-w-md space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{result.options.size}px</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Correction:</span>
                      <Badge variant="outline">{result.options.errorCorrectionLevel}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <Badge variant="outline">{result.options.format.toUpperCase()}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Generated:</span>
                      <span>{result.generatedAt.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!result && !error && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Ready to Generate</h3>
                    <p className="text-muted-foreground">
                      Enter your content above and generate a custom QR code.
                      Choose from different content types and customize the appearance.
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
