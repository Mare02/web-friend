import Groq from "groq-sdk";
import { AIProvider, AIProviderConfig } from "./base";

/**
 * Groq AI Provider Implementation
 * Fast inference using open-source models
 */
export class GroqProvider implements AIProvider {
  name = "groq";
  private client: Groq;
  private model: string;

  constructor(config: AIProviderConfig) {
    this.client = new Groq({
      apiKey: config.apiKey,
    });
    // Default to llama-3.3-70b-versatile for balanced performance
    // this.model = config.model || "llama-3.3-70b-versatile";
    this.model = config.model || "openai/gpt-oss-120b";
  }

  async analyze(prompt: string, context: string, options?: { jsonMode?: boolean }): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: context,
          },
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 4096, // Increased for longer responses like action plans
        ...(options?.jsonMode && { response_format: { type: "json_object" } }),
      });

      const result = completion.choices[0]?.message?.content;

      if (!result) {
        throw new Error("No response from Groq API");
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Groq API error: ${error.message}`);
      }
      throw new Error("Unknown error occurred during Groq analysis");
    }
  }
}

