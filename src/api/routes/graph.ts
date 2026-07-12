import { Hono } from 'hono';
import { getGraph, mergeNodes, deleteNode } from '../../core/store.js';

const graphRoutes = new Hono();

// GET /api/v1/graph/node/:id/expand
graphRoutes.get('/node/:id/expand', (c) => {
  const id = c.req.param('id');
  const graph = getGraph();
  const node = graph.nodes.find(n => n.id === id);
  if (!node) return c.json({ success: false, error: 'Node not found' }, 404);
  const links = graph.links.filter(l => l.source === id || l.target === id);
  const neighborIds = new Set(links.flatMap(l => [l.source as string, l.target as string]).filter(x => x !== id));
  const neighbors = graph.nodes.filter(n => neighborIds.has(n.id));
  const proposals = graph.proposals.filter(p => p.sourceNodeId === id || p.targetNodeId === id);
  return c.json({ success: true, data: { node, neighbors, links, proposals } });
});

// POST /api/v1/graph/merge
graphRoutes.post('/merge', async (c) => {
  const { sourceId, targetId } = await c.req.json();
  if (!sourceId || !targetId) return c.json({ success: false, error: 'sourceId and targetId required' }, 400);
  const merged = mergeNodes(sourceId, targetId);
  if (!merged) return c.json({ success: false, error: 'One or both nodes not found' }, 404);
  return c.json({ success: true, data: { mergedNode: merged } });
});

// DELETE /api/v1/graph/node/:id
graphRoutes.delete('/node/:id', (c) => {
  const id = c.req.param('id');
  const ok = deleteNode(id);
  if (!ok) return c.json({ success: false, error: 'Node not found' }, 404);
  return c.json({ success: true });
});

export default graphRoutes;
