import fs from 'node:fs';
import path from 'node:path';
import type { KnowledgeGraph, KnowledgeNode, KnowledgeLink, SynthesisProposal, FileSource } from './types.js';

const DATA_PATH = path.join(process.cwd(), process.env.DB_PATH || 'data/knowledge_graph.json');

function ensureDir() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function emptyGraph(): KnowledgeGraph {
  return { nodes: [], links: [], proposals: [], fileSources: [] };
}

export function getGraph(): KnowledgeGraph {
  ensureDir();
  try {
    if (!fs.existsSync(DATA_PATH)) return emptyGraph();
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    const graph = JSON.parse(raw) as KnowledgeGraph;
    if (!graph.fileSources) graph.fileSources = [];
    return graph;
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

export function addFileSource(fs_: FileSource): void {
  const graph = getGraph();
  graph.fileSources.push(fs_);
  saveGraph(graph);
}

export function getFileSources(): FileSource[] {
  return getGraph().fileSources;
}

export function mergeNodes(sourceId: string, targetId: string): KnowledgeNode | null {
  const graph = getGraph();
  const sourceNode = graph.nodes.find((n) => n.id === sourceId);
  const targetNode = graph.nodes.find((n) => n.id === targetId);
  if (!sourceNode || !targetNode) return null;

  // Merge: combine descriptions, keep source node's id
  const mergedNode: KnowledgeNode = {
    ...sourceNode,
    description: `${sourceNode.description} | ${targetNode.description}`,
  };

  // Update all links that referenced targetId to use sourceId
  graph.links = graph.links.map((l) => {
    const updatedSource = l.source === targetId ? sourceId : l.source;
    const updatedTarget = l.target === targetId ? sourceId : l.target;
    return { ...l, source: updatedSource, target: updatedTarget };
  });

  // Remove duplicate self-links and exact duplicate links
  const seen = new Set<string>();
  graph.links = graph.links.filter((l) => {
    if (l.source === l.target) return false; // remove self-links
    const key = `${l.source}::${l.target}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Remove targetId node and replace source node with merged
  graph.nodes = graph.nodes.filter((n) => n.id !== targetId && n.id !== sourceId);
  graph.nodes.push(mergedNode);

  // Update proposals referencing targetId
  graph.proposals = graph.proposals.map((p) => ({
    ...p,
    sourceNodeId: p.sourceNodeId === targetId ? sourceId : p.sourceNodeId,
    targetNodeId: p.targetNodeId === targetId ? sourceId : p.targetNodeId,
  }));

  saveGraph(graph);
  return mergedNode;
}

export function deleteNode(id: string): boolean {
  const graph = getGraph();
  const idx = graph.nodes.findIndex((n) => n.id === id);
  if (idx === -1) return false;

  graph.nodes.splice(idx, 1);
  graph.links = graph.links.filter((l) => l.source !== id && l.target !== id);
  saveGraph(graph);
  return true;
}
