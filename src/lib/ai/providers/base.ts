/**
 * Base interface for AI providers
 * This abstraction allows easy switching between different AI services
 * (Groq, OpenAI, Claude, etc.)
 */
export interface AIProvider {
  /**
   * Analyze content with AI
   * @param prompt - The analysis instructions
   * @param context - The content to analyze
   * @param options - Optional configuration (e.g., response format)
   * @returns AI-generated analysis
   */
  analyze(prompt: string, context: string, options?: { jsonMode?: boolean }): Promise<string>;
  
  /**
   * Provider name identifier
   */
  name: string;
}

/**
 * Configuration for AI providers
 */
export interface AIProviderConfig {
  apiKey: string;
  model?: string;
}

