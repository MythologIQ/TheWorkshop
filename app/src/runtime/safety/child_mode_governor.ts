// Simple heuristics to keep AI output calm, encouraging, and readable for children.
const DISCOURAGED_TERMS: [RegExp, string][] = [
  [/\bdon't\b/gi, 'do'],
  [/\bcan't\b/gi, 'can'],
  [/\bshouldn't\b/gi, 'might'],
  [/\bisn't\b/gi, 'can be'],
];

const DISALLOWED_PATTERNS = [/suicide/i, /self-harm/i, /violence/i, /kill/i, /weapon/i];

const SENTENCE_SPLIT = /[.!?]+/;

/**
 * enforceChildTone replaces direct negatives with gentler phrasing so the text keeps a calm,
 * encouraging voice. This guardrail is intentional but not exhaustive; future improvements may add
 * more advanced rewriting or context awareness.
 */
export const enforceChildTone = (text: string): string => {
  if (!text) return text;
  let normalized = text;
  DISCOURAGED_TERMS.forEach(([pattern, replacement]) => {
    normalized = normalized.replace(pattern, replacement);
  });
  return normalized;
};

/**
 * clampReadingLevel keeps the response to a few short sentences and trims any sentence that is too long.
 * This is a lightweight safety net; it may drop detail and should be refined with schools-based feedback.
 */
export const clampReadingLevel = (text: string): string => {
  if (!text) return text;
  const pieces = text
    .split(SENTENCE_SPLIT)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 3);
  if (pieces.length === 0) return '';
  const clamped = pieces.map((sentence) =>
    sentence.length > 120 ? `${sentence.slice(0, 117).trim()}…` : sentence,
  );
  return `${clamped.join('. ')}.`;
};

/**
 * redactDisallowedContent replaces any blocked keywords with a placeholder to avoid exposing
 * age-inappropriate topics. The current implementation is a basic keyword filter and may be
 * replaced with a more nuanced policy engine later.
 */
export const redactDisallowedContent = (text: string): string => {
  if (!text) return text;
  let sanitized = text;
  DISALLOWED_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '[filtered]');
  });
  return sanitized;
};
