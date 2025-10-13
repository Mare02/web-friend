import { AIProvider, AIProviderConfig } from "./providers/base";
import { GroqProvider } from "./providers/groq";

/**
 * Supported AI provider types
 * Extend this as you add more providers (OpenAI, Claude, etc.)
 */
export type AIProviderType = "groq" | "openai" | "claude";

/**
 * Factory function to create AI provider instances
 * This pattern makes it easy to add new providers without changing consumer code
 */
export function createAIProvider(
  type: AIProviderType,
  config: AIProviderConfig
): AIProvider {
  switch (type) {
    case "groq":
      return new GroqProvider(config);
    case "openai":
      // TODO: Implement OpenAI provider
      throw new Error("OpenAI provider not yet implemented");
    case "claude":
      // TODO: Implement Claude provider
      throw new Error("Claude provider not yet implemented");
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}

// Re-export types for convenience
export type { AIProvider, AIProviderConfig } from "./providers/base";

