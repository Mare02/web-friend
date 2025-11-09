/**
 * Regex testing service providing comprehensive pattern matching and replacement functionality
 */

export interface RegexMatch {
  match: string;
  index: number;
  groups?: string[];
  length: number;
}

export interface RegexTestResult {
  isValid: boolean;
  matches: RegexMatch[];
  error?: string;
  totalMatches: number;
  executionTime: number;
  warning?: string;
}

export interface RegexReplaceResult {
  originalText: string;
  replacedText: string;
  replacementCount: number;
  executionTime: number;
}

export interface RegexFlags {
  global: boolean;
  ignoreCase: boolean;
  multiline: boolean;
  dotAll: boolean;
  sticky: boolean;
  unicode: boolean;
}

export interface CommonRegexPattern {
  name: string;
  pattern: string;
  description: string;
  category: string;
  example: string;
}

/**
 * Test a regex pattern against input text
 */
export function testRegex(
  pattern: string,
  testString: string,
  flags: RegexFlags = { global: false, ignoreCase: false, multiline: false, dotAll: false, sticky: false, unicode: false }
): RegexTestResult {
  const startTime = performance.now();

  try {
    // Build flags string
    let flagsStr = '';
    if (flags.global) flagsStr += 'g';
    if (flags.ignoreCase) flagsStr += 'i';
    if (flags.multiline) flagsStr += 'm';
    if (flags.dotAll) flagsStr += 's';
    if (flags.sticky) flagsStr += 'y';
    if (flags.unicode) flagsStr += 'u';

    // Create regex
    const regex = new RegExp(pattern, flagsStr);

    // Find matches
    const matches: RegexMatch[] = [];
    let match;

    if (flags.global) {
      // Add timeout protection for infinite loops
      const maxIterations = 10000; // Reasonable limit for matches
      let iterations = 0;

      while ((match = regex.exec(testString)) !== null && iterations < maxIterations) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
          length: match[0].length
        });

        iterations++;

        // Prevent infinite loop on zero-length matches at the same position
        if (match[0].length === 0) {
          // Move to next character to avoid infinite loop
          if (regex.lastIndex === match.index) {
            regex.lastIndex = match.index + 1;
          }
          // If we're at the end of the string, break
          if (regex.lastIndex >= testString.length) {
            break;
          }
        }
      }

      // If we hit the iteration limit, add a warning
      if (iterations >= maxIterations) {
        const executionTime = performance.now() - startTime;
        return {
          isValid: true,
          matches,
          totalMatches: matches.length,
          executionTime,
          warning: 'Maximum match limit reached (10,000). Pattern may match too many times.'
        };
      }
    } else {
      match = regex.exec(testString);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
          length: match[0].length
        });
      }
    }

    const executionTime = performance.now() - startTime;

    return {
      isValid: true,
      matches,
      totalMatches: matches.length,
      executionTime
    };
  } catch (error) {
    const executionTime = performance.now() - startTime;
    return {
      isValid: false,
      matches: [],
      error: error instanceof Error ? error.message : 'Invalid regex pattern',
      totalMatches: 0,
      executionTime
    };
  }
}

/**
 * Replace text using regex pattern
 */
export function replaceWithRegex(
  pattern: string,
  testString: string,
  replacement: string,
  flags: RegexFlags = { global: false, ignoreCase: false, multiline: false, dotAll: false, sticky: false, unicode: false }
): RegexReplaceResult {
  const startTime = performance.now();

  try {
    // Build flags string
    let flagsStr = '';
    if (flags.global) flagsStr += 'g';
    if (flags.ignoreCase) flagsStr += 'i';
    if (flags.multiline) flagsStr += 'm';
    if (flags.dotAll) flagsStr += 's';
    if (flags.sticky) flagsStr += 'y';
    if (flags.unicode) flagsStr += 'u';

    // Create regex
    const regex = new RegExp(pattern, flagsStr);

    // Perform replacement
    const replacedText = testString.replace(regex, replacement);
    const replacementCount = flags.global ? (testString.match(regex) || []).length : (testString.match(regex) ? 1 : 0);

    const executionTime = performance.now() - startTime;

    return {
      originalText: testString,
      replacedText,
      replacementCount,
      executionTime
    };
  } catch (error) {
    const executionTime = performance.now() - startTime;
    return {
      originalText: testString,
      replacedText: testString,
      replacementCount: 0,
      executionTime
    };
  }
}

/**
 * Validate regex pattern syntax
 */
export function validateRegexPattern(pattern: string): { isValid: boolean; error?: string } {
  try {
    new RegExp(pattern);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid regex pattern'
    };
  }
}

/**
 * Escape special regex characters
 */
export function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Unescape regex characters
 */
export function unescapeRegex(string: string): string {
  return string.replace(/\\(.)/g, '$1');
}

/**
 * Get common regex patterns library
 */
export function getCommonRegexPatterns(): CommonRegexPattern[] {
  return [
    // Email patterns
    {
      name: "Email Address",
      pattern: "^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$",
      description: "Matches standard email addresses",
      category: "Email",
      example: "user@example.com"
    },
    {
      name: "Email (Simple)",
      pattern: "[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}",
      description: "Simple email matching without boundaries",
      category: "Email",
      example: "user@example.com"
    },

    // Phone patterns
    {
      name: "US Phone Number",
      pattern: "\\(\\d{3}\\) \\d{3}-\\d{4}",
      description: "Matches US phone numbers in (123) 456-7890 format",
      category: "Phone",
      example: "(555) 123-4567"
    },
    {
      name: "International Phone",
      pattern: "\\+\\d{1,3}\\s?\\(?\\d{1,4}\\)?\\s?\\d{1,4}\\s?\\d{1,4}",
      description: "Matches international phone numbers",
      category: "Phone",
      example: "+1 (555) 123-4567"
    },

    // URL patterns
    {
      name: "URL (HTTP/HTTPS)",
      pattern: "https?://[\\w.-]+\\.[a-zA-Z]{2,}[\\w./?=&%-]*",
      description: "Matches HTTP and HTTPS URLs",
      category: "URL",
      example: "https://example.com/path?query=value"
    },
    {
      name: "URL (General)",
      pattern: "(https?://)?[\\w.-]+\\.[a-zA-Z]{2,}[\\w./?=&%-]*",
      description: "Matches URLs with or without protocol",
      category: "URL",
      example: "example.com/path"
    },

    // Date patterns
    {
      name: "Date (MM/DD/YYYY)",
      pattern: "\\d{1,2}/\\d{1,2}/\\d{4}",
      description: "Matches dates in MM/DD/YYYY format",
      category: "Date",
      example: "12/25/2023"
    },
    {
      name: "Date (YYYY-MM-DD)",
      pattern: "\\d{4}-\\d{2}-\\d{2}",
      description: "Matches dates in ISO format YYYY-MM-DD",
      category: "Date",
      example: "2023-12-25"
    },
    {
      name: "Date (DD/MM/YYYY)",
      pattern: "\\d{1,2}/\\d{1,2}/\\d{4}",
      description: "Matches dates in DD/MM/YYYY format",
      category: "Date",
      example: "25/12/2023"
    },

    // Number patterns
    {
      name: "Integer Numbers",
      pattern: "\\b\\d+\\b",
      description: "Matches whole numbers",
      category: "Numbers",
      example: "42"
    },
    {
      name: "Decimal Numbers",
      pattern: "\\b\\d+\\.\\d+\\b",
      description: "Matches decimal numbers",
      category: "Numbers",
      example: "3.14159"
    },
    {
      name: "Currency (USD)",
      pattern: "\\$\\d+(?:,\\d{3})*(?:\\.\\d{2})?",
      description: "Matches US currency format",
      category: "Numbers",
      example: "$1,234.56"
    },

    // Text patterns
    {
      name: "Words (Letters Only)",
      pattern: "\\b[a-zA-Z]+\\b",
      description: "Matches words containing only letters",
      category: "Text",
      example: "Hello"
    },
    {
      name: "Alphanumeric Words",
      pattern: "\\b\\w+\\b",
      description: "Matches alphanumeric words",
      category: "Text",
      example: "word123"
    },
    {
      name: "Capitalized Words",
      pattern: "\\b[A-Z][a-z]+\\b",
      description: "Matches properly capitalized words",
      category: "Text",
      example: "Hello"
    },

    // Code patterns
    {
      name: "Hex Color",
      pattern: "#[0-9a-fA-F]{3,6}\\b",
      description: "Matches hexadecimal color codes",
      category: "Code",
      example: "#FF5733"
    },
    {
      name: "IPv4 Address",
      pattern: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b",
      description: "Matches IPv4 addresses",
      category: "Code",
      example: "192.168.1.1"
    },
    {
      name: "CSS Class/ID",
      pattern: "\\.[\\w-]+|#\\w+",
      description: "Matches CSS class and ID selectors",
      category: "Code",
      example: ".my-class"
    },

    // Validation patterns
    {
      name: "Strong Password",
      pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
      description: "Matches strong passwords (8+ chars, upper, lower, number, special)",
      category: "Validation",
      example: "MyPass123!"
    },
    {
      name: "ZIP Code (US)",
      pattern: "\\b\\d{5}(?:-\\d{4})?\\b",
      description: "Matches US ZIP codes with optional +4",
      category: "Validation",
      example: "12345-6789"
    },
    {
      name: "Credit Card Number",
      pattern: "\\b\\d{4}[ -]?\\d{4}[ -]?\\d{4}[ -]?\\d{4}\\b",
      description: "Matches credit card number format",
      category: "Validation",
      example: "1234 5678 9012 3456"
    },

    // Social patterns
    {
      name: "Twitter Handle",
      pattern: "@[a-zA-Z0-9_]{1,15}\\b",
      description: "Matches Twitter usernames",
      category: "Social",
      example: "@username"
    },
    {
      name: "Hashtag",
      pattern: "#[a-zA-Z0-9_]+\\b",
      description: "Matches hashtags",
      category: "Social",
      example: "#hashtag"
    }
  ];
}

/**
 * Get categories for common patterns
 */
export function getPatternCategories(): string[] {
  const patterns = getCommonRegexPatterns();
  const categories = new Set(patterns.map(p => p.category));
  return Array.from(categories).sort();
}

/**
 * Get patterns by category
 */
export function getPatternsByCategory(category: string): CommonRegexPattern[] {
  return getCommonRegexPatterns().filter(p => p.category === category);
}

/**
 * Highlight matches in text
 */
export function highlightMatches(text: string, matches: RegexMatch[]): string {
  if (matches.length === 0) return text;

  let result = '';
  let lastIndex = 0;

  matches.forEach(match => {
    // Add text before match
    result += text.slice(lastIndex, match.index);
    // Add highlighted match
    result += `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${match.match}</mark>`;
    lastIndex = match.index + match.length;
  });

  // Add remaining text
  result += text.slice(lastIndex);

  return result;
}
