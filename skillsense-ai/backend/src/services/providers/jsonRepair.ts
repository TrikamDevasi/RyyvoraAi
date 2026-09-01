// backend/src/services/providers/jsonRepair.ts
import { z } from 'zod';
import logger from '../../utils/logger';

/**
 * Extracts and cleans a JSON substring from raw LLM output.
 * Handles markdown backticks (```json ... ```), raw objects, and trailing commas.
 */
export function extractJsonString(raw: string): string {
  if (!raw || typeof raw !== 'string') return '{}';

  let cleaned = raw.trim();

  // Strip markdown code fences if present
  const markdownMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (markdownMatch && markdownMatch[1]) {
    cleaned = markdownMatch[1].trim();
  }

  // Find outermost curly braces or square brackets
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');

  if (firstBrace !== -1 && lastBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  } else if (firstBracket !== -1 && lastBracket !== -1) {
    cleaned = cleaned.substring(firstBracket, lastBracket + 1);
  }

  // Remove trailing commas before closing braces/brackets (common LLM hallucination)
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

  return cleaned;
}

/**
 * Parses and validates raw LLM output against a Zod schema.
 * Attempts safe repairs and falls back gracefully if unparseable.
 */
export function parseAndValidateAIOutput<TOutput>(
  raw: string,
  schema: z.ZodType<TOutput, any, any>,
  fallback?: TOutput
): { success: boolean; data: TOutput; error?: string } {
  try {
    const jsonStr = extractJsonString(raw);
    const parsedObj = JSON.parse(jsonStr);
    const result = schema.safeParse(parsedObj);

    if (result.success) {
      return { success: true, data: result.data };
    }

    logger.warn('AI Output failed Zod validation:', result.error.format());
    
    if (fallback !== undefined) {
      return {
        success: false,
        data: fallback,
        error: `Schema validation failed: ${result.error.issues.map(i => i.message).join('; ')}`,
      };
    }

    throw new Error(`Schema validation failed: ${JSON.stringify(result.error.issues)}`);
  } catch (err: any) {
    logger.warn('Failed to parse LLM JSON output:', { error: err.message, rawSnippet: raw.slice(0, 200) });
    
    if (fallback !== undefined) {
      return {
        success: false,
        data: fallback,
        error: `JSON parse error: ${err.message}`,
      };
    }

    throw new Error(`Invalid JSON in LLM response: ${err.message}`);
  }
}
