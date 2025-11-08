import type { Metadata } from "next";
import XmlJsonConverterClient from "./xml-json-converter-client";
import { getCanonicalUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "XML/JSON Converter | Free Bidirectional Data Format Converter",
  description: "Free online XML to JSON and JSON to XML converter. Convert between XML and JSON formats with validation, formatting, and pretty-printing. No signup required.",
  keywords: ["xml to json", "json to xml", "xml converter", "json converter", "data format converter", "xml parser", "json parser", "free converter tool", "online converter"],
  robots: "index, follow",
  alternates: {
    canonical: getCanonicalUrl("/tools/xml-json-converter"),
  },
  openGraph: {
    title: "XML/JSON Converter | Free Bidirectional Data Format Converter",
    description: "Free online XML to JSON and JSON to XML converter. Convert between XML and JSON formats with validation, formatting, and pretty-printing.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "XML/JSON Converter | Free Bidirectional Data Format Converter",
    description: "Free online XML to JSON and JSON to XML converter. Convert between XML and JSON formats with validation, formatting, and pretty-printing.",
  },
};

export default function XmlJsonConverterPage() {
  return <XmlJsonConverterClient />;
}

