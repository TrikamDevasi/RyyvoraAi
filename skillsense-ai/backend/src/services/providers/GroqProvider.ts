// backend/src/services/providers/GroqProvider.ts
import Groq from 'groq-sdk';
import { AIProvider, ChatMessage, CompletionOptions, ProviderHealth } from './types';
import logger from '../../utils/logger';

export class GroqProvider implements AIProvider {
  name = 'Groq';
  private client: Groq | null = null;
  private candidateModels = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'llama-3.3-70b-specdec',
  ];

  private isModelError(err: any): boolean {
    if (!err) return false;
    const msg = `${err?.status || ''} ${err?.message || ''}`;
    return (
      err?.status === 404 ||
      err?.message?.includes('model_not_found') ||
      err?.message?.includes('model_decommissioned') ||
      err?.message?.includes('does not exist') ||
      err?.message?.includes('is not supported') ||
      err?.error?.code === 'model_decommissioned' ||
      err?.error?.code === 'model_not_found'
    );
  }

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GROQ_API_KEY;
    if (key && !key.includes('your_') && key !== 'gsk_your_groq_key') {
      this.client = new Groq({ apiKey: key });
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
        message: 'GROQ_API_KEY not configured or is placeholder',
        lastChecked: new Date().toISOString(),
      };
    }

    for (const model of this.candidateModels) {
      try {
        const completion = await this.client.chat.completions.create({
          model,
          messages: [{ role: 'user', content: 'OK' }],
          max_tokens: 5,
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
        // If it's a model not found/decommissioned error, try next candidate
        if (this.isModelError(err)) {
          continue;
        }
        // If auth error or other error, return error
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
      message: 'No supported Groq models available with current API key',
      lastChecked: new Date().toISOString(),
    };
  }

  async generateCompletion(messages: ChatMessage[], options: CompletionOptions = {}): Promise<string> {
    if (!this.client) {
      throw new Error('Groq provider is not configured with an active API key');
    }

    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.max_tokens ?? 1024;
    const responseFormat = options.response_format;

    for (const model of this.candidateModels) {
      try {
        const response = await this.client.chat.completions.create({
          model,
          messages: messages as any,
          temperature,
          max_tokens: maxTokens,
          ...(responseFormat ? { response_format: responseFormat } : {}),
        });

        const text = response.choices[0]?.message?.content?.trim();
        if (text) return text;
      } catch (err: any) {
        if (this.isModelError(err)) {
          continue;
        }
        logger.warn(`Groq model (${model}) failed: ${err.message}. Trying next candidate...`);
      }
    }

    throw new Error('All Groq candidate models failed or returned empty response');
  }

  async *generateStream(messages: ChatMessage[], options: CompletionOptions = {}): AsyncGenerator<string, void, unknown> {
    if (!this.client) {
      throw new Error('Groq provider is not configured with an active API key');
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
        }) as any;

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
        if (this.isModelError(err)) {
          continue;
        }
        logger.warn(`Groq streaming with ${model} failed: ${err.message}. Trying next candidate...`);
      }
    }
  }
}
