/**
 * JSON formatting service providing validation, beautification, and minification functionality
 */

export interface JsonValidationResult {
  isValid: boolean;
  error?: string;
  parsed?: any;
  executionTime: number;
}

export interface JsonFormatResult {
  formatted: string;
  originalSize: number;
  formattedSize: number;
  executionTime: number;
}

export interface JsonMinifyResult {
  minified: string;
  originalSize: number;
  minifiedSize: number;
  compressionRatio: number;
  executionTime: number;
}

export interface JsonFormatterOptions {
  indentSize: number;
  useTabs: boolean;
  sortKeys: boolean;
  maxLineLength?: number;
}

/**
 * Default formatting options
 */
export const DEFAULT_FORMAT_OPTIONS: JsonFormatterOptions = {
  indentSize: 2,
  useTabs: false,
  sortKeys: false
};

/**
 * Validate JSON string
 */
export function validateJson(jsonString: string): JsonValidationResult {
  const startTime = performance.now();

  if (!jsonString.trim()) {
    return {
      isValid: false,
      error: 'JSON string cannot be empty',
      executionTime: performance.now() - startTime
    };
  }

  try {
    const parsed = JSON.parse(jsonString);
    return {
      isValid: true,
      parsed,
      executionTime: performance.now() - startTime
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
    return {
      isValid: false,
      error: errorMessage,
      executionTime: performance.now() - startTime
    };
  }
}

/**
 * Format JSON with pretty printing
 */
export function formatJson(
  jsonString: string,
  options: Partial<JsonFormatterOptions> = {}
): JsonFormatResult {
  const startTime = performance.now();
  const opts = { ...DEFAULT_FORMAT_OPTIONS, ...options };
  const originalSize = new Blob([jsonString]).size;

  // First validate the JSON
  const validation = validateJson(jsonString);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  try {
    const indentChar = opts.useTabs ? '\t' : ' '.repeat(opts.indentSize);

    let formatted: string;

    if (opts.sortKeys) {
      // Sort object keys alphabetically
      const sorted = sortJsonKeys(validation.parsed);
      formatted = JSON.stringify(sorted, null, indentChar);
    } else {
      formatted = JSON.stringify(validation.parsed, null, indentChar);
    }

    const formattedSize = new Blob([formatted]).size;

    return {
      formatted,
      originalSize,
      formattedSize,
      executionTime: performance.now() - startTime
    };
  } catch (error) {
    throw new Error(`Formatting failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Minify JSON by removing whitespace
 */
export function minifyJson(jsonString: string): JsonMinifyResult {
  const startTime = performance.now();
  const originalSize = new Blob([jsonString]).size;

  // First validate the JSON
  const validation = validateJson(jsonString);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  try {
    const minified = JSON.stringify(validation.parsed);
    const minifiedSize = new Blob([minified]).size;
    const compressionRatio = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize) * 100 : 0;

    return {
      minified,
      originalSize,
      minifiedSize,
      compressionRatio: Math.round(compressionRatio * 100) / 100,
      executionTime: performance.now() - startTime
    };
  } catch (error) {
    throw new Error(`Minification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Sort JSON object keys alphabetically (recursive)
 */
function sortJsonKeys(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortJsonKeys);
  }

  const sorted: { [key: string]: any } = {};
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    sorted[key] = sortJsonKeys(obj[key]);
  }

  return sorted;
}

/**
 * Detect if a string is likely JSON
 */
export function isJsonString(str: string): boolean {
  if (!str.trim()) return false;

  const trimmed = str.trim();
  return (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
         (trimmed.startsWith('[') && trimmed.endsWith(']'));
}

/**
 * Get JSON statistics
 */
export function getJsonStats(jsonString: string): {
  isValid: boolean;
  size: number;
  lines: number;
  keys?: number;
  depth?: number;
} {
  const stats: {
    isValid: boolean;
    size: number;
    lines: number;
    keys?: number;
    depth?: number;
  } = {
    isValid: false,
    size: new Blob([jsonString]).size,
    lines: jsonString.split('\n').length
  };

  const validation = validateJson(jsonString);
  if (validation.isValid && validation.parsed) {
    stats.isValid = true;
    stats.keys = countJsonKeys(validation.parsed);
    stats.depth = getJsonDepth(validation.parsed);
  }

  return stats;
}

/**
 * Count total number of keys in JSON object/array
 */
function countJsonKeys(obj: any): number {
  if (obj === null || typeof obj !== 'object') {
    return 0;
  }

  if (Array.isArray(obj)) {
    return obj.reduce((count, item) => count + countJsonKeys(item), 0);
  }

  let count = Object.keys(obj).length;
  for (const value of Object.values(obj)) {
    count += countJsonKeys(value);
  }

  return count;
}

/**
 * Get maximum depth of JSON structure
 */
function getJsonDepth(obj: any, currentDepth = 0): number {
  if (obj === null || typeof obj !== 'object') {
    return currentDepth;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return currentDepth + 1;
    return Math.max(...obj.map(item => getJsonDepth(item, currentDepth + 1)));
  }

  const values = Object.values(obj);
  if (values.length === 0) return currentDepth + 1;

  return Math.max(...values.map(value => getJsonDepth(value, currentDepth + 1)));
}
