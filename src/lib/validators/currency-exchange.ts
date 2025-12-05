import { z } from "zod";

const currencyCodeMessage = "Currency code must be a 3-letter ISO code (e.g., USD)";

/**
 * Common currency list for dropdown defaults
 */
export const COMMON_CURRENCIES = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "INR", name: "Indian Rupee" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "DKK", name: "Danish Krone" },
] as const;

export const currencyCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, { message: currencyCodeMessage });

export const currencyExchangeRequestSchema = z.object({
  base: currencyCodeSchema,
  target: currencyCodeSchema,
  amount: z
    .number()
    .finite({ message: "Amount must be a valid number" })
    .nonnegative({ message: "Amount cannot be negative" }),
});

export type CurrencyExchangeRequest = z.infer<typeof currencyExchangeRequestSchema>;

export const currencyExchangeResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    base: currencyCodeSchema,
    target: currencyCodeSchema,
    amount: z.number(),
    rate: z.number(),
    convertedAmount: z.number(),
    lastUpdated: z.string(),
    nextUpdate: z.string().optional(),
    provider: z.literal("ExchangeRate-API"),
    availableCurrencies: z.array(currencyCodeSchema).optional(),
  }),
});

export type CurrencyExchangeResponse = z.infer<typeof currencyExchangeResponseSchema>;
