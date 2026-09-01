// backend/src/services/providers/GeminiProvider.ts
import OpenAI from 'openai';
import { AIProvider, ChatMessage, CompletionOptions, ProviderHealth } from './types';
import logger from '../../utils/logger';

export class GeminiProvider implements AIProvider {
  name = 'Gemini';
  private client: OpenAI | null = null;
  private candidateModels = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.7-flash',
  ];

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (key && !key.includes('your_') && key !== 'placeholder') {
      this.client = new OpenAI({
        apiKey: key,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
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
        model: this.candidateModels[0],
        latencyMs: 0,
        message: 'GEMINI_API_KEY not configured or is placeholder',
        lastChecked: new Date().toISOString(),
      };
    }

    for (const model of this.candidateModels) {
      try {
        const completion = await this.client.chat.completions.create({
          model,
          messages: [{ role: 'user', content: 'Respond with OK' }],
          max_tokens: 30,
          temperature: 0.1,
        });

        const latencyMs = Date.now() - startTime;
        const responseText = completion.choices[0]?.message?.content?.trim() || '';

        return {
          name: this.name,
          configured: true,
          healthy: true,
          model,
          latencyMs,
          message: `Connected (${latencyMs}ms). Model: ${model}. Response: ${responseText}`,
          lastChecked: new Date().toISOString(),
        };
      } catch (err: any) {
        if (err?.status === 404 || err?.message?.includes('not found') || err?.message?.includes('no longer available')) {
          continue;
        }
        const latencyMs = Date.now() - startTime;
        return {
          name: this.name,
          configured: true,
          healthy: false,
          model,
          latencyMs,
          message: err.message || 'Health check failed',
          lastChecked: new Date().toISOString(),
        };
      }
    }

    const latencyMs = Date.now() - startTime;
    return {
      name: this.name,
      configured: true,
      healthy: false,
      model: this.candidateModels[0],
      latencyMs,
      message: 'No supported Gemini models found',
      lastChecked: new Date().toISOString(),
    };
  }

  async generateCompletion(messages: ChatMessage[], options: CompletionOptions = {}): Promise<string> {
    if (!this.client) {
      throw new Error('Gemini provider is not configured with an active API key');
    }

    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.max_tokens ?? 1024;
    const responseFormat = options.response_format;

    for (const model of this.candidateModels) {
      try {
        const completion = await this.client.chat.completions.create({
          model,
          messages: messages as any,
          temperature,
          max_tokens: maxTokens,
          ...(responseFormat ? { response_format: responseFormat } : {}),
        });

        const text = completion.choices[0]?.message?.content?.trim();
        if (text) return text;
      } catch (err: any) {
        logger.warn(`Gemini completion with ${model} failed: ${err.message}. Trying next candidate...`);
      }
    }

    throw new Error('All Gemini candidate models failed or returned empty response');
  }

  async *generateStream(messages: ChatMessage[], options: CompletionOptions = {}): AsyncGenerator<string, void, unknown> {
    if (!this.client) {
      throw new Error('Gemini provider is not configured with an active API key');
    }

    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.max_tokens ?? 1024;

    for (const model of this.candidateModels) {
      try {
        const stream = await this.client.chat.completions.create({
          model,
          messages: messages as any,
          temperature,
          max_tokens: maxTokens,
          stream: true,
        });

        let yielded = false;
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || '';
          if (delta) {
            yielded = true;
            yield delta;
          }
        }
        if (yielded) return;
      } catch (err: any) {
        logger.warn(`Gemini streaming with ${model} failed: ${err.message}. Trying next candidate...`);
      }
    }
  }
}
