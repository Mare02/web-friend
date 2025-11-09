import type { Metadata } from "next";
import ColorPaletteGeneratorClient from "./color-palette-generator-client";
import { getCanonicalUrl } from "@/lib/config";

const toolTitle = "Color Palette Generator | Create Beautiful Color Schemes Online";
const toolDescription = "Free color palette generator for designers and developers. Create monochromatic, analogous, complementary, triadic, and tetradic color schemes. Export palettes in CSS, HEX, RGB formats.";
const toolDescriptionShort = "Free color palette generator for designers and developers. Create monochromatic, analogous, complementary, triadic, and tetradic color schemes.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: toolTitle,
    description: toolDescription,
    keywords: ["color palette generator", "color scheme generator", "color picker", "design tools", "color theory", "monochromatic palette", "complementary colors", "analogous colors", "free design tool"],
    robots: "index, follow",
    alternates: {
      canonical: getCanonicalUrl("/tools/color-palette-generator"),
    },
    openGraph: {
      title: toolTitle,
      description: toolDescriptionShort,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: toolTitle,
      description: toolDescriptionShort,
    },
  };
}

export default function ColorPaletteGeneratorPage() {
  return <ColorPaletteGeneratorClient />;
}
