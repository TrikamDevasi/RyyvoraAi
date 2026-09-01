// backend/src/services/providers/index.ts
import { AIProvider, ChatMessage, CompletionOptions, ProviderHealth } from './types';
import { GroqProvider } from './GroqProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { PerplexityProvider } from './PerplexityProvider';
import logger from '../../utils/logger';

export * from './types';
export * from './jsonRepair';
export * from './GroqProvider';
export * from './OpenAIProvider';
export * from './PerplexityProvider';

export class AIProviderManager {
  private providers: AIProvider[] = [];

  constructor() {
    this.reloadProviders();
  }

  reloadProviders(): void {
    this.providers = [
      new GroqProvider(),
      new OpenAIProvider(),
      new PerplexityProvider(),
    ];
  }

  getProviders(): AIProvider[] {
    return this.providers;
  }

  getConfiguredProviders(): AIProvider[] {
    return this.providers.filter((p) => p.isConfigured());
  }

  async checkAllHealth(): Promise<Record<string, ProviderHealth>> {
    const results: Record<string, ProviderHealth> = {};
    for (const provider of this.providers) {
      try {
        results[provider.name.toLowerCase()] = await provider.healthCheck();
      } catch (err: any) {
        results[provider.name.toLowerCase()] = {
          name: provider.name,
          configured: provider.isConfigured(),
          healthy: false,
          model: 'unknown',
          latencyMs: 0,
          message: err.message || 'Health check error',
          lastChecked: new Date().toISOString(),
        };
      }
    }
    return results;
  }

  /**
   * Executes completion with fallback across all configured providers.
   * Order: Groq -> OpenAI -> Perplexity (or specific preferred provider).
   */
  async executeWithFallback(
    messages: ChatMessage[],
    options: CompletionOptions = {},
    preferredProviderName?: string
  ): Promise<{ content: string; providerName: string }> {
    const configured = this.getConfiguredProviders();
    if (configured.length === 0) {
      throw new Error('AI_SERVICE_UNAVAILABLE: No AI provider keys (GROQ_API_KEY, OPENAI_API_KEY, PERPLEXITY_API_KEY) are configured.');
    }

    // Order providers: preferred first, then remainder
    let ordered = [...configured];
    if (preferredProviderName) {
      const preferred = ordered.find(p => p.name.toLowerCase() === preferredProviderName.toLowerCase());
      if (preferred) {
        ordered = [preferred, ...ordered.filter(p => p !== preferred)];
      }
    }

    const errors: string[] = [];

    for (const provider of ordered) {
      try {
        const content = await provider.generateCompletion(messages, options);
        if (content && content.trim()) {
          return { content: content.trim(), providerName: provider.name };
        }
      } catch (err: any) {
        logger.warn(`Provider ${provider.name} failed: ${err.message}. Trying next provider...`);
        errors.push(`${provider.name}: ${err.message}`);
      }
    }

    throw new Error(`All configured AI providers failed. Details: ${errors.join(' | ')}`);
  }

  /**
   * Streams completion from primary available provider with graceful fallback.
   */
  async *executeStreamWithFallback(
    messages: ChatMessage[],
    options: CompletionOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    const configured = this.getConfiguredProviders();
    if (configured.length === 0) {
      const msg = "SkillSense AI is currently running in offline mode. Please configure GROQ_API_KEY or OPENAI_API_KEY to enable live AI responses.";
      for (const word of msg.split(' ')) {
        yield word + ' ';
      }
      return;
    }

    for (const provider of configured) {
      if (!provider.generateStream) continue;

      try {
        let hasYielded = false;
        for await (const chunk of provider.generateStream(messages, options)) {
          hasYielded = true;
          yield chunk;
        }
        if (hasYielded) return;
      } catch (err: any) {
        logger.warn(`Streaming failed on ${provider.name}: ${err.message}. Trying next...`);
      }
    }

    // Fallback if all streams fail
    try {
      const { content } = await this.executeWithFallback(messages, options);
      for (const word of content.split(' ')) {
        yield word + ' ';
      }
    } catch {
      yield "I'm having trouble connecting to the AI services right now. Please check back shortly or try another topic.";
    }
  }
}

export const providerManager = new AIProviderManager();
