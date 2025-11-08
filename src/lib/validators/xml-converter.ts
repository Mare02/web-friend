import { z } from "zod";

/**
 * Schema for conversion options
 */
export const ConversionOptionsSchema = z.object({
  // Common options
  ignoreAttributes: z.boolean().default(false),
  textNodeName: z.string().default("#text"),

  // XML to JSON specific
  ignoreDeclaration: z.boolean().default(false),
  trimValues: z.boolean().default(true),
  parseAttributeValue: z.boolean().default(false),
  parseTagValue: z.boolean().default(false),

  // JSON to XML specific
  format: z.boolean().default(true),
  indentBy: z.string().default("  "),
  suppressEmptyNode: z.boolean().default(false),
});

export type ConversionOptions = z.infer<typeof ConversionOptionsSchema>;

/**
 * Schema for conversion direction
 */
export const ConversionDirectionSchema = z.enum(["xml-to-json", "json-to-xml"]);

export type ConversionDirection = z.infer<typeof ConversionDirectionSchema>;

