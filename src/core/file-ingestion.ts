import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import { extractConceptsFromText } from './ingestion.js';
import { addNode, addLink, addProposal, addFileSource, getGraph } from './store.js';
import { createSynthesisProposal } from './synthesis.js';
import type { FileSource, KnowledgeNode } from './types.js';
import { logger } from '../utils/logger.js';
import crypto from 'node:crypto';

export async function extractTextFromBuffer(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  if (mimeType.includes('pdf') || filename.endsWith('.pdf')) {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text;
  }
  if (mimeType.includes('officedocument.wordprocessingml') || filename.endsWith('.docx')) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  return buffer.toString('utf-8');
}

export interface IngestFileResult {
  nodesAdded: number;
  linksAdded: number;
  proposalsGenerated: number;
}

function splitIntoChunks(text: string, chunkSize: number): string[] {
  if (text.length <= chunkSize * 2) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0 && chunks.length < 5) {
    if (remaining.length <= chunkSize) {
      chunks.push(remaining);
      break;
    }
    // Try to split at paragraph boundary near chunkSize
    const slice = remaining.slice(0, chunkSize);
    const lastNewline = slice.lastIndexOf('\n\n');
    const splitAt = lastNewline > chunkSize / 2 ? lastNewline : chunkSize;
    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }

  return chunks;
}

function findCrossDomainPairs(
  newNodes: KnowledgeNode[],
  allNodes: KnowledgeNode[],
  maxPairs: number
): [KnowledgeNode, KnowledgeNode][] {
  const pairs: [KnowledgeNode, KnowledgeNode][] = [];

  for (const newNode of newNodes) {
    if (pairs.length >= maxPairs) break;

    const candidates = allNodes.filter(
      (n) => n.id !== newNode.id && n.domain !== newNode.domain
    );

    if (candidates.length === 0) continue;

    const partner = candidates[Math.floor(Math.random() * candidates.length)];
    pairs.push([newNode, partner]);
  }

  return pairs;
}

export async function ingestFile(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  onActivity?: (msg: string) => void
): Promise<IngestFileResult> {
  const log = (msg: string) => {
    logger.info(`[FileIngestion] ${msg}`);
    onActivity?.(msg);
  };

  log(`📄 Extracting text from: ${filename}`);
  const text = await extractTextFromBuffer(buffer, mimeType, filename);
  log(`📝 Extracted ${text.length} characters`);

  const chunks = splitIntoChunks(text, 2000);
  log(`🔪 Split into ${chunks.length} chunk(s) for processing`);

  const newNodes: KnowledgeNode[] = [];
  const fileSourceId = crypto.randomBytes(8).toString('hex');

  for (let i = 0; i < chunks.length; i++) {
    log(`🔬 Extracting concepts from chunk ${i + 1}/${chunks.length}`);
    const chunkTitle = `${filename} (chunk ${i + 1})`;
    const concepts = await extractConceptsFromText(chunks[i], chunkTitle);

    for (const concept of concepts) {
      const nodeWithSource: KnowledgeNode = { ...concept, fileSourceId };
      const isNew = addNode(nodeWithSource);
      if (isNew) {
        newNodes.push(nodeWithSource);
        log(`✅ Indexed node: ${concept.name} [${concept.domain}]`);
      } else {
        log(`↩️  Node already exists: ${concept.name}`);
      }
    }
  }

  // Register FileSource
  const fileSource: FileSource = {
    id: fileSourceId,
    filename,
    mimeType: mimeType || 'application/octet-stream',
    ingestedAt: new Date().toISOString(),
    nodeCount: newNodes.length,
    characterCount: text.length,
  };
  addFileSource(fileSource);
  log(`📦 Registered file source: ${filename} (${newNodes.length} nodes)`);

  // Find cross-domain synthesis pairs
  let linksAdded = 0;
  let proposalsGenerated = 0;

  if (newNodes.length > 0) {
    const graph = getGraph();
    const allNodes = graph.nodes;
    const candidates = findCrossDomainPairs(newNodes, allNodes, 3);
    log(`🧬 Found ${candidates.length} cross-domain synthesis opportunities`);

    for (const [nodeA, nodeB] of candidates) {
      log(`⚗️  Synthesizing: ${nodeA.name} × ${nodeB.name}`);
      try {
        const proposal = await createSynthesisProposal(nodeA, nodeB);
        addProposal(proposal);
        addLink({
          source: nodeA.id,
          target: nodeB.id,
          type: 'file-bridge',
          weight: proposal.trustScore,
        });
        linksAdded++;
        proposalsGenerated++;
        log(`✅ Proposal generated: ${nodeA.name} → ${nodeB.name} [${proposal.auditStatus}]`);
      } catch (err) {
        log(`⚠️  Synthesis failed for ${nodeA.name} × ${nodeB.name}: ${String(err)}`);
      }
    }
  }

  log(`🏁 File ingestion complete — ${newNodes.length} nodes, ${linksAdded} links, ${proposalsGenerated} proposals`);

  return {
    nodesAdded: newNodes.length,
    linksAdded,
    proposalsGenerated,
  };
}
