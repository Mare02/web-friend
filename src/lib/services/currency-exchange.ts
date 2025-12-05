import { currencyCodeSchema } from "@/lib/validators/currency-exchange";

const EXCHANGE_RATE_API_BASE_URL = "https://v6.exchangerate-api.com/v6";

interface ExchangeRateApiResponse {
  result: string;
  "error-type"?: string;
  base_code: string;
  time_last_update_utc?: string;
  time_next_update_utc?: string;
  conversion_rates: Record<string, number>;
}

export interface CurrencyExchangeResult {
  base: string;
  target: string;
  amount: number;
  rate: number;
  convertedAmount: number;
  lastUpdated: string;
  nextUpdate?: string;
  provider: "ExchangeRate-API";
  availableCurrencies: string[];
}

/**
 * Fetch live exchange rates for a base currency using ExchangeRate-API
 */
export async function getExchangeRates(base: string): Promise<{
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
  nextUpdate?: string;
}> {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  if (!apiKey) {
    throw new Error("ExchangeRate-API key is missing. Set EXCHANGE_RATE_API_KEY.");
  }

  const validatedBase = currencyCodeSchema.parse(base);
  const url = `${EXCHANGE_RATE_API_BASE_URL}/${apiKey}/latest/${validatedBase}`;

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rates from provider.");
  }

  const data: ExchangeRateApiResponse = await response.json();

  if (data.result !== "success") {
    throw new Error(data["error-type"] || "ExchangeRate-API returned an error.");
  }

  if (!data.conversion_rates || Object.keys(data.conversion_rates).length === 0) {
    throw new Error("No conversion rates returned from provider.");
  }

  return {
    base: data.base_code,
    rates: data.conversion_rates,
    lastUpdated: parseTimestampToIso(data.time_last_update_utc) ?? new Date().toISOString(),
    nextUpdate: parseTimestampToIso(data.time_next_update_utc),
  };
}

/**
 * Convert an amount between two currencies using fresh rates (no caching)
 */
export async function convertCurrency(params: {
  base: string;
  target: string;
  amount: number;
}): Promise<CurrencyExchangeResult> {
  const validatedBase = currencyCodeSchema.parse(params.base);
  const validatedTarget = currencyCodeSchema.parse(params.target);
  const amount = Number(params.amount);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Amount must be a non-negative number.");
  }

  const { rates, lastUpdated, nextUpdate } = await getExchangeRates(validatedBase);
  const rate = rates[validatedTarget];

  if (typeof rate !== "number") {
    throw new Error(`Rate for ${validatedTarget} not available from provider.`);
  }

  const convertedAmount = Number((amount * rate).toFixed(6));

  return {
    base: validatedBase,
    target: validatedTarget,
    amount,
    rate,
    convertedAmount,
    lastUpdated,
    nextUpdate,
    provider: "ExchangeRate-API",
    availableCurrencies: Object.keys(rates),
  };
}

function parseTimestampToIso(timestamp?: string): string | undefined {
  if (!timestamp) return undefined;
  const parsed = Date.parse(timestamp);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed).toISOString();
}
