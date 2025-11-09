import type { Metadata } from "next";
import XmlJsonConverterClient from "./xml-json-converter-client";
import { getCanonicalUrl } from "@/lib/config";

const toolTitle = "XML/JSON Converter | Free Bidirectional Data Format Converter";
const toolDescription = "Free online XML to JSON and JSON to XML converter. Convert between XML and JSON formats with validation, formatting, and pretty-printing. No signup required.";
const toolDescriptionShort = "Free online XML to JSON and JSON to XML converter. Convert between XML and JSON formats with validation, formatting, and pretty-printing.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: toolTitle,
    description: toolDescription,
    keywords: ["xml to json", "json to xml", "xml converter", "json converter", "data format converter", "xml parser", "json parser", "free converter tool", "online converter"],
    robots: "index, follow",
    alternates: {
      canonical: getCanonicalUrl("/tools/xml-json-converter"),
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

export default function XmlJsonConverterPage() {
  return <XmlJsonConverterClient />;
}

