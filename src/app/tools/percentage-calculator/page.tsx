import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/config";
import PercentageCalculatorClient from "@/app/tools/percentage-calculator/percentage-calculator-client";

const toolTitle = "Percentage Calculator | Percent Change, Percent of, What Percent - Web Friend";
const toolDescription =
  "Calculate percentages instantly: percent of, what percent, percent change, and gap to target. Enter values, pick rounding, and get clear results.";
const toolDescriptionShort = "Fast percentage calculator with percent change and target gap modes.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: toolTitle,
    description: toolDescription,
    keywords: [
      "percentage calculator",
      "percent change",
      "percent of",
      "what percent",
      "gap to target",
      "percent increase",
      "percent decrease",
      "online calculator",
    ],
    robots: "index, follow",
    alternates: {
      canonical: getCanonicalUrl("/tools/percentage-calculator"),
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

export default function PercentageCalculatorPage() {
  return <PercentageCalculatorClient />;
}
