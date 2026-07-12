import fs from 'node:fs';
import path from 'node:path';
import type { AIConfig } from './types.js';

const CONFIG_PATH = path.join(process.cwd(), 'data/ai-config.json');

const DEFAULT_CONFIG: AIConfig = {
  extractionProvider: 'gemini',
  synthesisProvider: 'openrouter',
  auditProvider: 'grok',
  ollamaEndpoint: 'http://localhost:11434',
  ollamaExtractionModel: 'llama3.2',
  ollamaSynthesisModel: 'llama3.2',
  ollamaAuditModel: 'llama3.2',
};

function ensureDir(): void {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function getAIConfig(): AIConfig {
  ensureDir();
  try {
    if (!fs.existsSync(CONFIG_PATH)) return { ...DEFAULT_CONFIG };
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) } as AIConfig;
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveAIConfig(config: AIConfig): void {
  ensureDir();
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}
