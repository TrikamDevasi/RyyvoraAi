// backend/src/services/providers/OpenAIProvider.ts
import OpenAI from 'openai';
import { AIProvider, ChatMessage, CompletionOptions, ProviderHealth } from './types';
import logger from '../../utils/logger';

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  private client: OpenAI | null = null;
  private primaryModel = 'gpt-4o-mini';
  private fallbackModel = 'gpt-4o';

  constructor(apiKey?: string) {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (key && !key.includes('your_') && !key.includes('sk-proj-your')) {
      this.client = new OpenAI({ apiKey: key });
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
        message: 'OPENAI_API_KEY not configured or is placeholder',
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
      throw new Error('OpenAI provider is not configured with an active API key');
    }

    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.max_tokens ?? 1024;
    const responseFormat = options.response_format;

    try {
      const completion = await this.client.chat.completions.create({
        model: this.primaryModel,
        messages: messages as any,
        temperature,
        max_tokens: maxTokens,
        ...(responseFormat ? { response_format: responseFormat } : {}),
      });

      const text = completion.choices[0]?.message?.content?.trim();
      if (text) return text;
    } catch (err: any) {
      logger.warn(`OpenAI completion with ${this.primaryModel} failed: ${err.message}. Trying ${this.fallbackModel}...`);
    }

    const fallbackCompletion = await this.client.chat.completions.create({
      model: this.fallbackModel,
      messages: messages as any,
      temperature,
      max_tokens: maxTokens,
      ...(responseFormat ? { response_format: responseFormat } : {}),
    });

    const fallbackText = fallbackCompletion.choices[0]?.message?.content?.trim();
    if (!fallbackText) {
      throw new Error('OpenAI returned empty response');
    }

    return fallbackText;
  }

  async *generateStream(messages: ChatMessage[], options: CompletionOptions = {}): AsyncGenerator<string, void, unknown> {
    if (!this.client) {
      throw new Error('OpenAI provider is not configured with an active API key');
    }

    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.max_tokens ?? 1024;

    const stream = await this.client.chat.completions.create({
      model: this.primaryModel,
      messages: messages as any,
      temperature,
      max_tokens: maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) yield delta;
    }
  }
}
