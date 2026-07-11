import fs from 'node:fs';
import path from 'node:path';
import type { KnowledgeGraph, KnowledgeNode, KnowledgeLink, SynthesisProposal } from './types.js';

const DATA_PATH = path.join(process.cwd(), process.env.DB_PATH || 'data/knowledge_graph.json');

function ensureDir() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function emptyGraph(): KnowledgeGraph {
  return { nodes: [], links: [], proposals: [] };
}

export function getGraph(): KnowledgeGraph {
  ensureDir();
  try {
    if (!fs.existsSync(DATA_PATH)) return emptyGraph();
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw) as KnowledgeGraph;
  } catch {
    return emptyGraph();
  }
}

export function saveGraph(graph: KnowledgeGraph): void {
  ensureDir();
  fs.writeFileSync(DATA_PATH, JSON.stringify(graph, null, 2), 'utf-8');
}

export function addNode(node: KnowledgeNode): boolean {
  const graph = getGraph();
  if (graph.nodes.some((n) => n.id === node.id)) return false; // CID uniqueness
  graph.nodes.push(node);
  saveGraph(graph);
  return true;
}

export function addLink(link: KnowledgeLink): void {
  const graph = getGraph();
  const exists = graph.links.some(
    (l) => l.source === link.source && l.target === link.target
  );
  if (!exists) {
    graph.links.push(link);
    saveGraph(graph);
  }
}

export function addProposal(proposal: SynthesisProposal): void {
  const graph = getGraph();
  graph.proposals.push(proposal);
  saveGraph(graph);
}

export function updateProposal(id: string, updates: Partial<SynthesisProposal>): boolean {
  const graph = getGraph();
  const idx = graph.proposals.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  graph.proposals[idx] = { ...graph.proposals[idx], ...updates };
  saveGraph(graph);
  return true;
}
