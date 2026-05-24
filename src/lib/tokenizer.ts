import { getEncoding } from 'js-tiktoken';

let encoder: ReturnType<typeof getEncoding> | null = null;

export function countTokens(text: string): number {
  if (!encoder) {
    encoder = getEncoding('cl100k_base');
  }
  // Using standard cl100k_base encoding used by OpenAI models
  const tokens = encoder.encode(text);
  return tokens.length;
}
