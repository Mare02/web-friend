"use client";

import { ColorPaletteGenerator } from "@/components/color-palette-generator";
import { Palette } from "lucide-react";

export default function ColorPaletteGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 md:pt-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Palette className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Color Palette Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
            Generate beautiful color palettes using color theory. Create monochromatic, analogous,
            complementary, triadic, tetradic, and split-complementary palettes from any base color.
          </p>
        </div>
      </div>

      {/* Tool */}
      <ColorPaletteGenerator />
    </div>
  );
}
