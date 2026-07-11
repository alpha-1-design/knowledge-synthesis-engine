import crypto from 'node:crypto';
import type { ArXivPaper } from './arxiv.js';
import type { KnowledgeNode } from './types.js';
import { extractJSON } from '../utils/json.js';
import { logger } from '../utils/logger.js';

export function generateCID(name: string, domain: string): string {
  return crypto
    .createHash('sha256')
    .update(`${name.toLowerCase().trim()}::${domain.toLowerCase().trim()}`)
    .digest('hex')
    .slice(0, 16);
}

interface ExtractedConcept {
  name: string;
  domain: string;
  description: string;
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.warn('[Ingestion] No GEMINI_API_KEY set — skipping LLM extraction');
    return '';
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const errText = await res.text();
      logger.error('[Gemini] API error', { status: res.status, body: errText });
      return '';
    }

    const data = (await res.json()) as any;
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  } catch (err) {
    logger.error('[Gemini] Request failed', { err: String(err) });
    return '';
  }
}

export async function extractConceptsFromPaper(paper: ArXivPaper): Promise<KnowledgeNode[]> {
  const prompt = `You are a scientific concept extractor. Given this research paper abstract, extract 1-3 core scientific concepts that could be nodes in a knowledge graph.

Title: ${paper.title}
Abstract: ${paper.abstract}

Return ONLY a JSON array like:
[
  { "name": "Concept Name", "domain": "Physics|Biology|Chemistry|CS|Math|Medicine|Engineering|Other", "description": "One sentence description." }
]

Rules:
- Each concept must be a specific, reusable scientific concept (not the paper itself)
- Domain must be one of the listed options
- Names should be 2-5 words, specific and technical`;

  const raw = await callGemini(prompt);
  if (!raw) return fallbackExtraction(paper);

  try {
    const concepts = extractJSON<ExtractedConcept[]>(raw);
    return concepts.slice(0, 3).map((c): KnowledgeNode => ({
      id: generateCID(c.name, c.domain),
      name: c.name,
      domain: c.domain,
      description: c.description,
      sourceId: paper.id,
      sourceUrl: paper.url,
      createdAt: new Date().toISOString(),
    }));
  } catch (err) {
    logger.warn('[Ingestion] Failed to parse Gemini response, using fallback', { err: String(err) });
    return fallbackExtraction(paper);
  }
}

/** Fallback when Gemini is unavailable: derive a simple node from the paper title */
function fallbackExtraction(paper: ArXivPaper): KnowledgeNode[] {
  const name = paper.title.split(':')[0].trim().slice(0, 60);
  const domain = guessDomain(paper.title + ' ' + paper.abstract);
  return [
    {
      id: generateCID(name, domain),
      name,
      domain,
      description: paper.abstract.slice(0, 200),
      sourceId: paper.id,
      sourceUrl: paper.url,
      createdAt: new Date().toISOString(),
    },
  ];
}

function guessDomain(text: string): string {
  const t = text.toLowerCase();
  if (/neural|machine learning|deep learning|transformer|llm/.test(t)) return 'CS';
  if (/quantum|particle|relativity|photon|laser/.test(t)) return 'Physics';
  if (/gene|protein|cell|dna|rna|enzyme/.test(t)) return 'Biology';
  if (/molecule|catalyst|reaction|synthesis|polymer/.test(t)) return 'Chemistry';
  if (/clinical|patient|drug|therapy|cancer|disease/.test(t)) return 'Medicine';
  if (/theorem|proof|algebra|topology|calculus/.test(t)) return 'Math';
  if (/material|alloy|semiconductor|battery|circuit/.test(t)) return 'Engineering';
  return 'Other';
}
