// Lightweight ID helper for Workshop entities.
// Prefers crypto.randomUUID when available; falls back to a simple timestamp-based id.
export const newId = (prefix = 'id'): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${(crypto as { randomUUID: () => string }).randomUUID()}`;
  }
  const rand = Math.floor(Math.random() * 1e6);
  return `${prefix}_${Date.now()}_${rand}`;
};
