import { Hono } from 'hono';
import { getGraph, updateProposal } from '../../core/store.js';
import type { ValidationVote } from '../../core/types.js';

const synthesisRoutes = new Hono();

// GET /api/v1/synthesis/graph
synthesisRoutes.get('/graph', (c) => {
  const graph = getGraph();
  return c.json({
    success: true,
    data: {
      nodes: graph.nodes,
      links: graph.links,
      proposals: graph.proposals,
    },
    meta: {
      nodeCount: graph.nodes.length,
      linkCount: graph.links.length,
      proposalCount: graph.proposals.length,
    },
  });
});

// GET /api/v1/synthesis/proposals
synthesisRoutes.get('/proposals', (c) => {
  const graph = getGraph();
  return c.json({
    success: true,
    data: graph.proposals,
  });
});

// POST /api/v1/synthesis/:id/validate
synthesisRoutes.post('/:id/validate', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({})) as Record<string, unknown>;

  const { approve, reasoning, expert_did } = body as {
    approve?: boolean;
    reasoning?: string;
    expert_did?: string;
  };

  if (typeof approve !== 'boolean') {
    return c.json({ success: false, error: 'approve (boolean) is required' }, 400);
  }

  const graph = getGraph();
  const proposal = graph.proposals.find((p) => p.id === id);

  if (!proposal) {
    return c.json({ success: false, error: 'Proposal not found' }, 404);
  }

  const vote: ValidationVote = {
    expertDid: (expert_did as string) || 'anonymous',
    approve: approve as boolean,
    reasoning: (reasoning as string) || '',
    timestamp: new Date().toISOString(),
  };

  const updatedValidations = [...proposal.validations, vote];
  const approvals = updatedValidations.filter((v) => v.approve).length;
  const newTrustScore = Math.min(1, proposal.trustScore + (approve ? 0.1 : -0.1));

  updateProposal(id, {
    validations: updatedValidations,
    trustScore: newTrustScore,
  });

  return c.json({
    success: true,
    data: {
      proposalId: id,
      totalVotes: updatedValidations.length,
      approvals,
      newTrustScore,
    },
  });
});

export default synthesisRoutes;
