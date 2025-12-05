import { z } from "zod";

export const percentageModeSchema = z.enum([
  "percent-of",
  "what-percent",
  "percent-change",
  "difference-to-target",
]);

const finiteNumber = z.number().finite({ message: "Value must be a valid number" });

export const percentageCalculationSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("percent-of"),
    percentage: finiteNumber.nonnegative({ message: "Percentage cannot be negative" }),
    base: finiteNumber,
    decimals: z.number().int().min(0).max(6).default(2),
  }),
  z.object({
    mode: z.literal("what-percent"),
    part: finiteNumber,
    total: finiteNumber.gt(0, { message: "Total must be greater than zero" }),
    decimals: z.number().int().min(0).max(6).default(2),
  }),
  z.object({
    mode: z.literal("percent-change"),
    from: finiteNumber,
    to: finiteNumber,
    decimals: z.number().int().min(0).max(6).default(2),
  }),
  z.object({
    mode: z.literal("difference-to-target"),
    current: finiteNumber,
    target: finiteNumber,
    decimals: z.number().int().min(0).max(6).default(2),
  }),
]);

export type PercentageMode = z.infer<typeof percentageModeSchema>;
export type PercentageCalculationInput = z.infer<typeof percentageCalculationSchema>;
