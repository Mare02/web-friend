"use client";

import { useState } from "react";
import {
  generateColorPalettes,
  generateRandomPalette,
  isValidHexColor,
  ColorPalette,
  ColorInfo,
  ColorPaletteResult,
  generateLinearGradient,
  generateRadialGradient,
  generateConicGradient,
  generateTailwindGradient,
  generateCSSVariables
} from "@/lib/services/color-palette-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Palette,
  Shuffle,
  Copy,
  Download,
  RotateCcw,
  Palette as PaletteIcon,
  Sparkles,
  ChevronDown,
  Code
} from "lucide-react";

export function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#3B82F6");
  const [result, setResult] = useState<ColorPaletteResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Gradient state
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [gradientAngle, setGradientAngle] = useState(90);
  const [angleInputValue, setAngleInputValue] = useState('90');


  const handleGenerateFromBase = async () => {
    if (!isValidHexColor(baseColor)) {
      setError("Please enter a valid hex color (e.g., #FF5733)");
      return;
    }

    setIsGenerating(true);
    setError(null);

    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const palettesResult = generateColorPalettes(baseColor);
      setResult(palettesResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate palettes");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateRandom = async () => {
    setIsGenerating(true);
    setError(null);

    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const randomPalette = generateRandomPalette(5);
      setResult({ palettes: [randomPalette], generatedAt: new Date() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate random palette");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyColor = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error("Failed to copy color:", err);
    }
  };

  const handleCopyPalette = async (palette: ColorPalette) => {
    const paletteText = palette.colors.map(color => color.hex).join(', ');
    try {
      await navigator.clipboard.writeText(paletteText);
      setCopiedColor('palette');
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error("Failed to copy palette:", err);
    }
  };

  const handleExportPalette = (palette: ColorPalette) => {
    const data = {
      name: palette.name,
      type: palette.type,
      baseColor: palette.baseColor.hex,
      colors: palette.colors.map(color => ({
        hex: color.hex,
        rgb: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
        hsl: `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`,
        name: color.name
      })),
      gradients: {
        linear: generateLinearGradient(palette.colors),
        radial: generateRadialGradient(palette.colors),
        conic: generateConicGradient(palette.colors)
      },
      tailwind: {
        linear: generateTailwindGradient(palette.colors, 'linear'),
        radial: generateTailwindGradient(palette.colors, 'radial'),
        conic: generateTailwindGradient(palette.colors, 'conic')
      },
      cssVariables: generateCSSVariables(palette.colors)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${palette.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setBaseColor("#3B82F6");
    setResult(null);
    setError(null);
  };

  const handleApplyAngle = () => {
    const numValue = Number(angleInputValue);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 360) {
      setGradientAngle(numValue);
      setAngleInputValue(numValue.toString()); // Sync input after successful apply
    } else {
      // Reset to current valid angle if input is invalid
      setAngleInputValue(gradientAngle.toString());
    }
  };

  const generateGradientCode = (colors: ColorInfo[]): string => {
    switch (gradientType) {
      case 'linear':
        return generateLinearGradient(colors, gradientAngle);
      case 'radial':
        return generateRadialGradient(colors);
      case 'conic':
        return generateConicGradient(colors, gradientAngle);
      default:
        return generateLinearGradient(colors, gradientAngle);
    }
  };

  const ColorSwatch = ({ color, size = "large" }: { color: ColorInfo; size?: "small" | "large" }) => {
    const sizeClasses = size === "large"
      ? "h-24 w-24 sm:h-32 sm:w-32"
      : "h-12 w-12 sm:h-16 sm:w-16";

    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className={`${sizeClasses} rounded-lg border-2 border-white shadow-lg`}
          style={{ backgroundColor: color.hex }}
        />
        {size === "large" && (
          <div className="text-center text-xs text-muted-foreground">
            <div className="font-mono font-medium">{color.hex}</div>
            <div>RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})</div>
            <div>HSL({color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%)</div>
            {color.name && <div className="font-medium">{color.name}</div>}
          </div>
        )}
      </div>
    );
  };

  const PaletteCard = ({ palette }: { palette: ColorPalette }) => (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <PaletteIcon className="h-5 w-5" />
              {palette.name}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyPalette(palette)}
            >
              <Copy className="h-4 w-4 mr-1" />
              {copiedColor === 'palette' ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportPalette(palette)}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {palette.colors.map((color, index) => (
            <ColorSwatch key={`${palette.type}-${index}`} color={color} />
          ))}
        </div>

        {/* Gradient Section */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center gap-2 mb-4">
            <Code className="h-4 w-4" />
            <span className="font-medium">CSS Gradients</span>
          </div>

          {/* Gradient Controls */}
          <div className="flex flex-wrap gap-2 mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  {gradientType.charAt(0).toUpperCase() + gradientType.slice(1)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setGradientType('linear')}>
                  Linear
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGradientType('radial')}>
                  Radial
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGradientType('conic')}>
                  Conic
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {(gradientType === 'linear' || gradientType === 'conic') && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Angle:</span>
                <Input
                  type="number"
                  value={angleInputValue}
                  onChange={(e) => {
                    setAngleInputValue(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleApplyAngle();
                    }
                  }}
                  className="w-16 h-8 text-sm"
                  placeholder="90"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApplyAngle}
                  className="h-8 px-3 text-xs"
                >
                  Apply
                </Button>
                <span className="text-sm text-muted-foreground">°</span>
              </div>
            )}
          </div>

          {/* Gradient Preview */}
          <div className="space-y-3">
            <div
              className="h-16 rounded-lg border-2 border-gray-200"
              style={{ background: generateGradientCode(palette.colors) }}
            />

            {/* Gradient Code */}
            <div className="flex gap-2">
              <Input
                value={generateGradientCode(palette.colors)}
                readOnly
                className="font-mono text-sm flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyColor(generateGradientCode(palette.colors))}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
                {/* {copiedColor === generateGradientCode(palette.colors) ? "Copied!" : "Copy"} */}
              </Button>
            </div>

            {/* Additional Code Formats */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-medium text-muted-foreground">Tailwind:</span>
                <div className="flex gap-2 mt-1">
                  <code className="flex-1 font-mono bg-muted px-2 py-1 rounded text-xs break-all">
                    {generateTailwindGradient(palette.colors, gradientType)}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs shrink-0"
                    onClick={() => handleCopyColor(generateTailwindGradient(palette.colors, gradientType))}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">CSS Variables:</span>
                <div className="flex gap-2 mt-1">
                  <textarea
                    value={generateCSSVariables(palette.colors)}
                    readOnly
                    className="flex-1 font-mono bg-muted px-2 py-1 rounded text-xs resize-none h-16 break-all"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs shrink-0"
                    onClick={() => handleCopyColor(generateCSSVariables(palette.colors))}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Palette Generator
              </CardTitle>
              <CardDescription>
                Generate beautiful color palettes from a base color or create random palettes.
                Use the color picker or enter hex codes. Supports monochromatic, analogous, complementary, triadic, tetradic, and split-complementary harmonies.
                Export ready-to-use CSS gradients, Tailwind classes, and design tokens.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="base-color" className="block text-sm font-medium mb-2">
                    Base Color (Hex)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="base-color"
                      type="text"
                      placeholder="#3B82F6"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="font-mono"
                    />
                    <input
                      type="color"
                      value={isValidHexColor(baseColor) ? baseColor : '#3B82F6'}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="w-12 h-10 rounded border-2 border-gray-300 cursor-pointer"
                      title="Pick a color"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleGenerateFromBase}
                  disabled={isGenerating || !baseColor.trim()}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Palettes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGenerateRandom}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  <Shuffle className="h-4 w-4" />
                  Random Palette
                </Button>
                <Button variant="outline" onClick={handleClear} disabled={!result && baseColor === "#3B82F6"}>
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
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Generated Palettes</h2>
                <p className="text-muted-foreground">
                  Click on any color to copy its hex value. Use the export button to download palette data.
                </p>
              </div>

              <div className="grid gap-6">
                {result.palettes.map((palette, index) => (
                  <PaletteCard key={`${palette.type}-${index}`} palette={palette} />
                ))}
              </div>

            </div>
          )}

          {/* Empty State */}
          {!result && !error && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Palette className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Ready to Generate Colors</h3>
                    <p className="text-muted-foreground">
                      Enter a hex color above and generate beautiful color palettes, or try a random palette for inspiration.
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
