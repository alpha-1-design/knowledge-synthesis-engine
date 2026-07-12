import { logger } from '../utils/logger.js';

export async function callOllama(endpoint: string, model: string, prompt: string): Promise<string> {
  try {
    const res = await fetch(`${endpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false }),
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) {
      const errText = await res.text();
      logger.error('[Ollama] API error', { status: res.status, body: errText });
      return '';
    }

    const data = (await res.json()) as any;
    return data?.response ?? '';
  } catch (err) {
    logger.error('[Ollama] Request failed', { err: String(err) });
    return '';
  }
}

export async function testOllamaConnection(endpoint: string): Promise<{ ok: boolean; models: string[] }> {
  try {
    const res = await fetch(`${endpoint}/api/tags`, {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return { ok: false, models: [] };
    }

    const data = (await res.json()) as any;
    const models: string[] = (data?.models ?? []).map((m: any) => m.name as string);
    return { ok: true, models };
  } catch (err) {
    logger.error('[Ollama] Connection test failed', { err: String(err) });
    return { ok: false, models: [] };
  }
}
