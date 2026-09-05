import { AIProvider, ChatMessage, CompletionOptions, ProviderHealth, ProviderState } from './types';
import { GeminiProvider } from './GeminiProvider';
import { GroqProvider } from './GroqProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { PerplexityProvider } from './PerplexityProvider';
import logger from '../../utils/logger';

export * from './types';
export * from './jsonRepair';
export * from './GeminiProvider';
export * from './GroqProvider';
export * from './OpenAIProvider';
export * from './PerplexityProvider';

interface ProviderRuntimeState {
  state: ProviderState;
  consecutiveFailures: number;
  cooldownUntil: number; // timestamp in ms
  lastLatencyMs: number;
  lastError?: string;
}

export class AIProviderManager {
  private providers: AIProvider[] = [];
  private runtimeStates: Map<string, ProviderRuntimeState> = new Map();
  private validationPromise: Promise<void> | null = null;

  constructor() {
    this.reloadProviders();
    // Launch non-blocking startup health check
    this.validationPromise = this.validateOnStartup();
  }

  reloadProviders(): void {
    const groq = new GroqProvider();
    const gemini = new GeminiProvider();
    const openai = new OpenAIProvider();
    const perplexity = new PerplexityProvider();

    // Prioritize configured and operational providers: Groq is primary
    const primary = (process.env.PRIMARY_AI_PROVIDER || 'groq').toLowerCase();
    if (primary === 'gemini') {
      this.providers = [gemini, groq, openai, perplexity];
    } else if (primary === 'openai') {
      this.providers = [openai, groq, gemini, perplexity];
    } else {
      this.providers = [groq, gemini, openai, perplexity];
    }

    for (const p of this.providers) {
      if (!this.runtimeStates.has(p.name.toLowerCase())) {
        this.runtimeStates.set(p.name.toLowerCase(), {
          state: p.isConfigured() ? 'HEALTHY' : 'UNAVAILABLE',
          consecutiveFailures: 0,
          cooldownUntil: 0,
          lastLatencyMs: 0,
        });
      }
    }
  }

  /**
   * Non-blocking background health check on application startup.
   * Marks bad credentials (e.g. expired key) as INVALID_CREDENTIALS so requests don't waste 2s timeouts.
   */
  async validateOnStartup(): Promise<void> {
    logger.info('Initializing AI Provider Manager startup validation...');
    for (const provider of this.providers) {
      if (!provider.isConfigured()) {
        this.setProviderState(provider.name, 'UNAVAILABLE', 'API key not configured in environment');
        continue;
      }

      try {
        const start = Date.now();
        const health = await provider.healthCheck();
        const latency = Date.now() - start;

        if (health.healthy) {
          this.setProviderState(provider.name, 'HEALTHY', 'Operational', latency);
          logger.info(`AI Provider [${provider.name}]: HEALTHY (${latency}ms)`);
        } else {
          const isAuth = health.message?.toLowerCase().includes('key') || health.message?.toLowerCase().includes('auth') || health.message?.includes('401');
          const isQuota = health.message?.toLowerCase().includes('quota') || health.message?.includes('429');
          const state: ProviderState = isAuth ? 'INVALID_CREDENTIALS' : isQuota ? 'RATE_LIMITED' : 'DEGRADED';
          this.setProviderState(provider.name, state, health.message, latency);
          logger.warn(`AI Provider [${provider.name}]: ${state} - ${health.message}`);
        }
      } catch (err: any) {
        this.setProviderState(provider.name, 'DEGRADED', err.message || 'Validation failed');
      }
    }
  }

  private setProviderState(name: string, state: ProviderState, errorMsg?: string, latencyMs = 0): void {
    const key = name.toLowerCase();
    const current = this.runtimeStates.get(key) || {
      state: 'UNAVAILABLE',
      consecutiveFailures: 0,
      cooldownUntil: 0,
      lastLatencyMs: 0,
    };

    current.state = state;
    current.lastLatencyMs = latencyMs;
    current.lastError = errorMsg;

    if (state === 'RATE_LIMITED') {
      current.cooldownUntil = Date.now() + 60000; // 60s cooldown
    } else if (state === 'HEALTHY') {
      current.consecutiveFailures = 0;
      current.cooldownUntil = 0;
    }

    this.runtimeStates.set(key, current);
  }

  getProviders(): AIProvider[] {
    return this.providers;
  }

  getConfiguredProviders(): AIProvider[] {
    return this.providers.filter((p) => p.isConfigured());
  }

  /**
   * Returns healthy / available providers, filtering out known bad credentials and active cooldowns.
   */
  getEligibleProviders(): AIProvider[] {
    const now = Date.now();
    return this.providers.filter((p) => {
      if (!p.isConfigured()) return false;
      const state = this.runtimeStates.get(p.name.toLowerCase());
      if (!state) return true;
      if (state.state === 'INVALID_CREDENTIALS') return false;
      if (state.state === 'RATE_LIMITED' && state.cooldownUntil > now) return false;
      return true;
    });
  }

  async checkAllHealth(): Promise<Record<string, ProviderHealth>> {
    const results: Record<string, ProviderHealth> = {};
    for (const provider of this.providers) {
      const key = provider.name.toLowerCase();
      const rState = this.runtimeStates.get(key);

      try {
        const health = await provider.healthCheck();
        results[key] = {
          ...health,
          state: health.healthy ? 'HEALTHY' : (rState?.state || 'DEGRADED'),
          consecutiveFailures: rState?.consecutiveFailures || 0,
          cooldownUntil: rState?.cooldownUntil || 0,
        };
      } catch (err: any) {
        results[key] = {
          name: provider.name,
          configured: provider.isConfigured(),
          healthy: false,
          state: rState?.state || 'DEGRADED',
          model: 'unknown',
          latencyMs: 0,
          message: err.message || 'Health check error',
          lastChecked: new Date().toISOString(),
          consecutiveFailures: rState?.consecutiveFailures || 1,
        };
      }
    }
    return results;
  }

  /**
   * Executes completion with intelligent fallback across all eligible providers.
   */
  async executeWithFallback(
    messages: ChatMessage[],
    options: CompletionOptions = {},
    preferredProviderName?: string
  ): Promise<{ content: string; providerName: string }> {
    let eligible = this.getEligibleProviders();

    // If all filtered out (e.g., all cooldowns active), fallback to any configured provider
    if (eligible.length === 0) {
      eligible = this.getConfiguredProviders();
    }

    if (eligible.length === 0) {
      throw new Error('AI_SERVICE_UNAVAILABLE: No AI provider keys (GROQ_API_KEY, OPENAI_API_KEY, PERPLEXITY_API_KEY) are configured or operational.');
    }

    // Order providers: preferred first, then remainder
    let ordered = [...eligible];
    if (preferredProviderName) {
      const preferred = ordered.find((p) => p.name.toLowerCase() === preferredProviderName.toLowerCase());
      if (preferred) {
        ordered = [preferred, ...ordered.filter((p) => p !== preferred)];
      }
    }

    const errors: string[] = [];

    for (const provider of ordered) {
      const start = Date.now();
      try {
        const content = await provider.generateCompletion(messages, options);
        if (content && content.trim()) {
          this.setProviderState(provider.name, 'HEALTHY', undefined, Date.now() - start);
          return { content: content.trim(), providerName: provider.name };
        }
      } catch (err: any) {
        const latency = Date.now() - start;
        const msg = err.message || 'Inference error';
        const isAuth = msg.includes('401') || msg.toLowerCase().includes('key');
        const isQuota = msg.includes('429') || msg.toLowerCase().includes('quota');

        const state: ProviderState = isAuth ? 'INVALID_CREDENTIALS' : isQuota ? 'RATE_LIMITED' : 'DEGRADED';
        this.setProviderState(provider.name, state, msg, latency);

        logger.warn(`AI Provider [${provider.name}] failed (${state}): ${msg}. Trying next provider...`);
        errors.push(`${provider.name}: ${msg}`);
      }
    }

    throw new Error(`AI_SERVICE_UNAVAILABLE: All configured AI providers failed. (${errors.join(' | ')})`);
  }

  /**
   * Streams completion from primary available provider with graceful fallback.
   */
  async *executeStreamWithFallback(
    messages: ChatMessage[],
    options: CompletionOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    const eligible = this.getEligibleProviders();
    if (eligible.length === 0) {
      const msg = "SkillSense AI services are currently offline or in maintenance mode. Please verify your environment configuration.";
      for (const word of msg.split(' ')) {
        yield word + ' ';
      }
      return;
    }

    for (const provider of eligible) {
      if (!provider.generateStream) continue;

      try {
        let hasYielded = false;
        for await (const chunk of provider.generateStream(messages, options)) {
          hasYielded = true;
          yield chunk;
        }
        if (hasYielded) {
          this.setProviderState(provider.name, 'HEALTHY');
          return;
        }
      } catch (err: any) {
        logger.warn(`Streaming failed on ${provider.name}: ${err.message}. Trying next eligible provider...`);
      }
    }

    // Fallback to non-streaming execution if streaming endpoints failed
    try {
      const { content } = await this.executeWithFallback(messages, options);
      for (const word of content.split(' ')) {
        yield word + ' ';
      }
    } catch {
      yield "SkillSense AI Copilot is temporarily experiencing high demand. Please retry your query in a few moments.";
    }
  }
}

export const providerManager = new AIProviderManager();
