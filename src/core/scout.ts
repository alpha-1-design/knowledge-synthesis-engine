import { fetchArXivPapers } from './arxiv.js';
import { extractConceptsFromPaper } from './ingestion.js';
import { createSynthesisProposal } from './synthesis.js';
import { getGraph, addNode, addLink, addProposal } from './store.js';
import { logger } from '../utils/logger.js';
import type { KnowledgeNode } from './types.js';

type ActivityCallback = (msg: string, type?: 'info' | 'warn' | 'ai') => void;

class Scout {
  private running = false;

  async runScoutCycle(
    seedQuery?: string,
    onActivity?: ActivityCallback
  ): Promise<void> {
    if (this.running) {
      logger.warn('[Scout] Cycle already in progress — skipping');
      return;
    }

    this.running = true;
    const log = (msg: string, type: 'info' | 'warn' | 'ai' = 'info') => {
      logger.info(`[Scout] ${msg}`);
      onActivity?.(msg, type);
    };

    try {
      const query = seedQuery || process.env.DEFAULT_RESEARCH_DOMAIN || 'interdisciplinary science discovery';
      log(`🔭 Scout cycle initiated — query: "${query}"`, 'ai');

      // Phase 1: Fetch ArXiv papers
      log(`📡 Querying ArXiv for: "${query}"`, 'info');
      const papers = await fetchArXivPapers(query, 5);

      if (papers.length === 0) {
        log('⚠️ No papers returned from ArXiv', 'warn');
        return;
      }

      log(`📚 Retrieved ${papers.length} papers from ArXiv`, 'info');

      // Phase 2: Extract concepts and build nodes
      const newNodes: KnowledgeNode[] = [];

      for (const paper of papers) {
        log(`🔬 Extracting concepts from: "${paper.title.slice(0, 60)}..."`, 'ai');
        const concepts = await extractConceptsFromPaper(paper);

        for (const node of concepts) {
          const isNew = addNode(node);
          if (isNew) {
            newNodes.push(node);
            log(`✅ Indexed node: ${node.name} [${node.domain}] — CID: ${node.id}`, 'ai');
          } else {
            log(`↩️  Node already exists: ${node.name}`, 'info');
          }
        }
      }

      if (newNodes.length === 0) {
        log('ℹ️  No new concepts discovered this cycle', 'info');
        return;
      }

      log(`🌐 ${newNodes.length} new nodes added to the Semantic Mesh`, 'ai');

      // Phase 3: Detect cross-domain synthesis opportunities
      const graph = getGraph();
      const allNodes = graph.nodes;

      if (allNodes.length < 2) {
        log('ℹ️  Not enough nodes for synthesis yet', 'info');
        return;
      }

      // Find cross-domain pairs from new nodes + existing nodes
      const candidates = findCrossDomainPairs(newNodes, allNodes, 3);
      log(`🧬 Found ${candidates.length} cross-domain synthesis opportunities`, 'ai');

      for (const [nodeA, nodeB] of candidates) {
        log(`⚗️  Synthesizing: ${nodeA.name} × ${nodeB.name}`, 'ai');

        try {
          const proposal = await createSynthesisProposal(nodeA, nodeB);

          addProposal(proposal);
          addLink({
            source: nodeA.id,
            target: nodeB.id,
            type: 'synthesis',
            weight: proposal.trustScore,
          });

          const statusEmoji =
            proposal.auditStatus === 'clean' ? '✅' :
            proposal.auditStatus === 'warning' ? '⚠️' : '❌';

          log(
            `${statusEmoji} Audit [${proposal.auditStatus.toUpperCase()}]: ${nodeA.name} → ${nodeB.name}`,
            'ai'
          );
        } catch (err) {
          log(`⚠️  Synthesis failed for ${nodeA.name} × ${nodeB.name}: ${String(err)}`, 'warn');
        }
      }

      log(`🏁 Scout cycle complete — graph has ${graph.nodes.length + newNodes.length} nodes`, 'ai');
    } finally {
      this.running = false;
    }
  }
}

function findCrossDomainPairs(
  newNodes: KnowledgeNode[],
  allNodes: KnowledgeNode[],
  maxPairs: number
): [KnowledgeNode, KnowledgeNode][] {
  const pairs: [KnowledgeNode, KnowledgeNode][] = [];

  for (const newNode of newNodes) {
    if (pairs.length >= maxPairs) break;

    // Find a node from a different domain
    const candidates = allNodes.filter(
      (n) => n.id !== newNode.id && n.domain !== newNode.domain
    );

    if (candidates.length === 0) continue;

    // Pick a random candidate for diversity
    const partner = candidates[Math.floor(Math.random() * candidates.length)];
    pairs.push([newNode, partner]);
  }

  return pairs;
}

export const scout = new Scout();
