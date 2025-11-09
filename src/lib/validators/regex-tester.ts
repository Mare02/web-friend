import type { RegexFlags } from '@/lib/services/regex-tester';

// Re-export types from service for consistency
export type {
  RegexMatch,
  RegexTestResult,
  RegexReplaceResult,
  RegexFlags,
  CommonRegexPattern
} from '@/lib/services/regex-tester';

/**
 * Validation schemas and utilities for regex operations
 */
export interface RegexTesterConfig {
  pattern: string;
  testString: string;
  replacement?: string;
  flags: RegexFlags;
  operation: 'test' | 'replace';
}

export interface RegexFormData {
  pattern: string;
  testString: string;
  replacement: string;
  flags: RegexFlags;
}

/**
 * Validate form data
 */
export function validateRegexFormData(data: Partial<RegexFormData>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.pattern?.trim()) {
    errors.pattern = 'Regex pattern is required';
  }

  if (!data.testString?.trim()) {
    errors.testString = 'Test string is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Default regex flags
 */
export const DEFAULT_REGEX_FLAGS: RegexFlags = {
  global: false,
  ignoreCase: false,
  multiline: false,
  dotAll: false,
  sticky: false,
  unicode: false
};

/**
 * Flag descriptions for UI
 */
export const FLAG_DESCRIPTIONS = {
  global: 'Global search - find all matches rather than stopping after the first match',
  ignoreCase: 'Case insensitive - treat upper and lower case as equivalent',
  multiline: 'Multiline - ^ and $ match the beginning/end of each line',
  dotAll: 'Dot all - . matches newlines as well as any other character',
  sticky: 'Sticky - matches only from the lastIndex position',
  unicode: 'Unicode - treat pattern as a sequence of Unicode code points'
} as const;

/**
 * Regex operation modes
 */
export const REGEX_OPERATIONS = [
  { value: 'test', label: 'Test Pattern', description: 'Find matches in the test string' },
  { value: 'replace', label: 'Find & Replace', description: 'Replace matches with replacement text' }
] as const;

/**
 * Pattern categories for organization
 */
export const PATTERN_CATEGORIES = [
  'Email',
  'Phone',
  'URL',
  'Date',
  'Numbers',
  'Text',
  'Code',
  'Validation',
  'Social'
] as const;
