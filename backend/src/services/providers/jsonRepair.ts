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
  const markdownMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)(?:```|$)/i);
  if (markdownMatch && markdownMatch[1]) {
    cleaned = markdownMatch[1].trim();
  }

  // Find first opening brace or bracket
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');

  let isObject = false;
  let startIndex = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIndex = firstBrace;
    isObject = true;
  } else if (firstBracket !== -1) {
    startIndex = firstBracket;
    isObject = false;
  }

  if (startIndex === -1) return '{}';

  cleaned = cleaned.substring(startIndex);

  // If already balanced, check last matching closing token
  const lastClose = isObject ? cleaned.lastIndexOf('}') : cleaned.lastIndexOf(']');
  if (lastClose !== -1) {
    cleaned = cleaned.substring(0, lastClose + 1);
  }

  // Remove trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

  // Attempt to balance unclosed braces/brackets if cut off
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '{') openBraces++;
      else if (char === '}') openBraces = Math.max(0, openBraces - 1);
      else if (char === '[') openBrackets++;
      else if (char === ']') openBrackets = Math.max(0, openBrackets - 1);
    }
  }

  if (inString) {
    cleaned += '"';
  }
  while (openBrackets > 0) {
    cleaned += ']';
    openBrackets--;
  }
  while (openBraces > 0) {
    cleaned += '}';
    openBraces--;
  }

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
