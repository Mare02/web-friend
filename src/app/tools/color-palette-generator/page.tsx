import type { Metadata } from "next";
import ColorPaletteGeneratorClient from "./color-palette-generator-client";

export const metadata: Metadata = {
  title: "Color Palette Generator | Create Beautiful Color Schemes Online",
  description: "Free color palette generator for designers and developers. Create monochromatic, analogous, complementary, triadic, and tetradic color schemes. Export palettes in CSS, HEX, RGB formats.",
  keywords: ["color palette generator", "color scheme generator", "color picker", "design tools", "color theory", "monochromatic palette", "complementary colors", "analogous colors", "free design tool"],
  openGraph: {
    title: "Color Palette Generator | Create Beautiful Color Schemes Online",
    description: "Free color palette generator for designers and developers. Create monochromatic, analogous, complementary, triadic, and tetradic color schemes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Palette Generator | Create Beautiful Color Schemes Online",
    description: "Free color palette generator for designers and developers. Create monochromatic, analogous, complementary, triadic, and tetradic color schemes.",
  },
};

export default function ColorPaletteGeneratorPage() {
  return <ColorPaletteGeneratorClient />;
}
