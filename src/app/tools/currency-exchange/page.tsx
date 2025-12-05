import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/config";
import CurrencyExchangeClient from "@/app/tools/currency-exchange/currency-exchange-client";

const toolTitle =
  "Currency Converter | Live Exchange Rates, Real-Time FX Calculator - Web Friend";
const toolDescription =
  "Convert currencies instantly with live rates. Enter an amount, choose currencies, and get real-time results with an easy swap option—no signups or limits.";
const toolDescriptionShort =
  "Real-time currency converter with live rates and instant results.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: toolTitle,
    description: toolDescription,
    keywords: [
      "currency converter",
      "exchange rates",
      "fx calculator",
      "money converter",
      "usd to eur",
      "eur to usd",
      "real-time rates",
      "forex rates",
      "live currency",
      "exchange rate api",
    ],
    robots: "index, follow",
    alternates: {
      canonical: getCanonicalUrl("/tools/currency-exchange"),
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

export default function CurrencyExchangePage() {
  return <CurrencyExchangeClient />;
}
