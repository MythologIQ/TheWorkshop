export const MODEL_CATALOG = {
  phi3_mini: 'Phi-3-mini-4k-instruct-q4',
  qwen2_15b: 'Qwen2.5-1.5B-instruct-q4',
  tiny_llama: 'TinyLlama-1.1B-chat-q4',
} as const;

export type ModelCatalogKey = keyof typeof MODEL_CATALOG;

export const DEFAULT_MODEL_ID = MODEL_CATALOG.phi3_mini;
