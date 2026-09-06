// backend/src/services/providers/PerplexityProvider.ts
import OpenAI from 'openai';
import { AIProvider, ChatMessage, CompletionOptions, ProviderHealth } from './types';
import logger from '../../utils/logger';

export class PerplexityProvider implements AIProvider {
  name = 'Perplexity';
  private client: OpenAI | null = null;
  private primaryModel = 'sonar';

  constructor(apiKey?: string) {
    const key = apiKey || process.env.PERPLEXITY_API_KEY;
    if (key && !key.includes('your_') && !key.includes('pplx-your') && key !== 'ppl') {
      this.client = new OpenAI({
        apiKey: key,
        baseURL: 'https://api.perplexity.ai',
      });
    }
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  async healthCheck(): Promise<ProviderHealth> {
    const startTime = Date.now();
    if (!this.isConfigured() || !this.client) {
      return {
        name: this.name,
        configured: false,
        healthy: false,
        model: this.primaryModel,
        latencyMs: 0,
        message: 'PERPLEXITY_API_KEY not configured or is placeholder',
        lastChecked: new Date().toISOString(),
      };
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: this.primaryModel,
        messages: [{ role: 'user', content: 'Respond with OK' }],
        max_tokens: 5,
        temperature: 0.1,
      });

      const latencyMs = Date.now() - startTime;
      const responseText = completion.choices[0]?.message?.content?.trim() || '';

      return {
        name: this.name,
        configured: true,
        healthy: true,
        model: this.primaryModel,
        latencyMs,
        message: `Connected (${latencyMs}ms). Response: ${responseText}`,
        lastChecked: new Date().toISOString(),
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      return {
        name: this.name,
        configured: true,
        healthy: false,
        model: this.primaryModel,
        latencyMs,
        message: err.message || 'Health check failed',
        lastChecked: new Date().toISOString(),
      };
    }
  }

  async generateCompletion(messages: ChatMessage[], options: CompletionOptions = {}): Promise<string> {
    if (!this.client) {
      throw new Error('Perplexity provider is not configured with an active API key');
    }

    const completion = await this.client.chat.completions.create({
      model: this.primaryModel,
      messages: messages as any,
      temperature: options.temperature ?? 0.2,
      max_tokens: options.max_tokens ?? 800,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) {
      throw new Error('Perplexity returned empty response');
    }

    return text;
  }
}
