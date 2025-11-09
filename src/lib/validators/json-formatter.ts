import { z } from "zod";

// Re-export types from service for consistency
export type {
  JsonValidationResult,
  JsonFormatResult,
  JsonMinifyResult,
  JsonFormatterOptions
} from '@/lib/services/json-formatter';

/**
 * Schema for JSON formatter options
 */
export const JsonFormatterOptionsSchema = z.object({
  indentSize: z.number().min(0).max(8).default(2),
  useTabs: z.boolean().default(false),
  sortKeys: z.boolean().default(false),
  maxLineLength: z.number().optional()
});

/**
 * Schema for JSON formatter operation
 */
export const JsonFormatterOperationSchema = z.enum(["format", "minify", "validate"]);

export type JsonFormatterOperation = z.infer<typeof JsonFormatterOperationSchema>;

/**
 * Schema for JSON formatter form data
 */
export const JsonFormatterFormDataSchema = z.object({
  jsonInput: z.string().min(1, "JSON input cannot be empty"),
  options: JsonFormatterOptionsSchema,
  operation: JsonFormatterOperationSchema
});

export type JsonFormatterFormData = z.infer<typeof JsonFormatterFormDataSchema>;

/**
 * Validate JSON formatter form data
 */
export function validateJsonFormatterFormData(data: Partial<JsonFormatterFormData>): {
  isValid: boolean;
  errors: Record<string, string>;
  data?: JsonFormatterFormData;
} {
  const errors: Record<string, string> = {};

  try {
    const validatedData = JsonFormatterFormDataSchema.parse(data);
    return {
      isValid: true,
      errors: {},
      data: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.issues.forEach((err: any) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
    } else {
      errors.general = 'Validation failed';
    }

    return {
      isValid: false,
      errors
    };
  }
}

/**
 * Default JSON formatter options
 */
export const DEFAULT_JSON_FORMATTER_OPTIONS: import('@/lib/services/json-formatter').JsonFormatterOptions = {
  indentSize: 2,
  useTabs: false,
  sortKeys: false
};

/**
 * JSON formatter operations with descriptions
 */
export const JSON_FORMATTER_OPERATIONS = [
  {
    value: 'format' as const,
    label: 'Format',
    description: 'Pretty print JSON with proper indentation'
  },
  {
    value: 'minify' as const,
    label: 'Minify',
    description: 'Remove all whitespace and compress JSON'
  },
  {
    value: 'validate' as const,
    label: 'Validate',
    description: 'Check if JSON is valid and show statistics'
  }
] as const;

/**
 * JSON formatting presets
 */
export const JSON_FORMAT_PRESETS = [
  {
    name: 'Standard (2 spaces)',
    options: { indentSize: 2, useTabs: false, sortKeys: false }
  },
  {
    name: 'Compact (1 space)',
    options: { indentSize: 1, useTabs: false, sortKeys: false }
  },
  {
    name: 'Tab Indented',
    options: { indentSize: 4, useTabs: true, sortKeys: false }
  },
  {
    name: 'Sorted Keys',
    options: { indentSize: 2, useTabs: false, sortKeys: true }
  }
] as const;
