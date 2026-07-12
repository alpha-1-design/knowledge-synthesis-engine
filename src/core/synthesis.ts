import crypto from 'node:crypto';
import type { KnowledgeNode, SynthesisProposal } from './types.js';
import { extractJSON } from '../utils/json.js';
import { logger } from '../utils/logger.js';
import { getAIConfig } from './config-store.js';
import { callOllama } from './ollama.js';

async function callGrok(prompt: string): Promise<string> {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    logger.warn('[Synthesis] No GROK_API_KEY set — skipping Grok audit');
    return '';
  }

  try {
    const res = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1024,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const errText = await res.text();
      logger.error('[Grok] API error', { status: res.status, body: errText });
      return '';
    }

    const data = (await res.json()) as any;
    return data?.choices?.[0]?.message?.content ?? '';
  } catch (err) {
    logger.error('[Grok] Request failed', { err: String(err) });
    return '';
  }
}

async function callOpenRouter(prompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    logger.warn('[Synthesis] No OPENROUTER_API_KEY — skipping synthesis generation');
    return '';
  }

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://replit.com',
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 512,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const errText = await res.text();
      logger.error('[OpenRouter] API error', { status: res.status, body: errText });
      return '';
    }

    const data = (await res.json()) as any;
    return data?.choices?.[0]?.message?.content ?? '';
  } catch (err) {
    logger.error('[OpenRouter] Request failed', { err: String(err) });
    return '';
  }
}

export async function generateHypothesis(
  nodeA: KnowledgeNode,
  nodeB: KnowledgeNode
): Promise<string> {
  const prompt = `You are a cross-domain scientific hypothesis generator.

Concept A: "${nodeA.name}" (${nodeA.domain}) — ${nodeA.description}
Concept B: "${nodeB.name}" (${nodeB.domain}) — ${nodeB.description}

Generate ONE specific, testable scientific hypothesis about how these two concepts from different domains could be related or how one could solve a problem in the other's domain. Be bold but grounded. Max 3 sentences.`;

  const config = getAIConfig();
  const result = config.synthesisProvider === 'ollama'
    ? await callOllama(config.ollamaEndpoint, config.ollamaSynthesisModel, prompt)
    : await callOpenRouter(prompt);

  if (!result) {
    return `Latent structural similarity detected between "${nodeA.name}" and "${nodeB.name}" — cross-domain application pending validation.`;
  }

  return result.trim();
}

export async function auditHypothesis(
  hypothesis: string,
  nodeA: KnowledgeNode,
  nodeB: KnowledgeNode
): Promise<{ status: 'clean' | 'warning' | 'rejected'; reasoning: string }> {
  const prompt = `You are a rigorous scientific auditor. Evaluate this cross-domain hypothesis for logical validity.

Hypothesis: "${hypothesis}"

Evidence A: "${nodeA.name}" (${nodeA.domain}) — ${nodeA.description}
Evidence B: "${nodeB.name}" (${nodeB.domain}) — ${nodeB.description}

Return ONLY a JSON object:
{
  "status": "clean" | "warning" | "rejected",
  "reasoning": "Brief explanation of your audit decision (1-2 sentences)"
}

Rules:
- "clean": Hypothesis is logically grounded in both evidence sources
- "warning": Hypothesis has merit but contains speculative leaps not fully supported
- "rejected": Hypothesis is logically flawed or contradicts the evidence`;

  const config = getAIConfig();
  const raw = config.auditProvider === 'ollama'
    ? await callOllama(config.ollamaEndpoint, config.ollamaAuditModel, prompt)
    : await callGrok(prompt);

  if (!raw) {
    return {
      status: 'warning',
      reasoning: 'Audit skipped — API unavailable. Manual review recommended.',
    };
  }

  try {
    const parsed = extractJSON<{ status: string; reasoning: string }>(raw);
    const status =
      parsed.status === 'clean' || parsed.status === 'rejected' ? parsed.status : 'warning';
    return { status, reasoning: parsed.reasoning || raw.slice(0, 200) };
  } catch {
    return { status: 'warning', reasoning: 'Audit parsing failed. Manual review required.' };
  }
}

export function createProposalId(): string {
  return crypto.randomBytes(8).toString('hex');
}

export async function createSynthesisProposal(
  nodeA: KnowledgeNode,
  nodeB: KnowledgeNode
): Promise<SynthesisProposal> {
  logger.info(`[Synthesis] Generating hypothesis: ${nodeA.name} × ${nodeB.name}`);

  const hypothesis = await generateHypothesis(nodeA, nodeB);
  const audit = await auditHypothesis(hypothesis, nodeA, nodeB);

  const proposal: SynthesisProposal = {
    id: createProposalId(),
    sourceNodeId: nodeA.id,
    targetNodeId: nodeB.id,
    hypothesis,
    auditStatus: audit.status,
    auditReasoning: audit.reasoning,
    trustScore: audit.status === 'clean' ? 0.8 : audit.status === 'warning' ? 0.5 : 0.1,
    createdAt: new Date().toISOString(),
    validations: [],
  };

  return proposal;
}
