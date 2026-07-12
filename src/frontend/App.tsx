import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Graph3D } from './components/Graph3D.js';
import { GraphErrorBoundary } from './components/GraphErrorBoundary.js';
import { ActivityFeed } from './components/ActivityFeed.js';
import { Controls } from './components/Controls.js';
import { ProposalsSidebar } from './components/ProposalsSidebar.js';
import { AuthModal } from './components/AuthModal.js';
import { NodeDetailPanel } from './components/NodeDetailPanel.js';
import { FileIngestPanel } from './components/FileIngestPanel.js';
import { AIConfigDrawer } from './components/AIConfigDrawer.js';
import type { GraphData, ActivityItem, SynthesisProposal, KnowledgeNode } from './types.js';

const SESSION_KEY = 'kse_api_key';

function MergeConfirmOverlay({ nodeA, nodeB, onConfirm, onCancel }: {
  nodeA: KnowledgeNode; nodeB: KnowledgeNode;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div style={{
      position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 30,
      background: '#0d1424', border: '2px solid #f59e0b', borderRadius: 8, padding: '12px 20px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{ color: '#f59e0b', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>⊕ MERGE</span>
      <span style={{ color: '#f1f5f9', fontSize: 12, fontFamily: 'Inter, system-ui, sans-serif' }}>
        "{nodeA.name}" + "{nodeB.name}"?
      </span>
      <button onClick={onConfirm} style={{
        background: '#f59e0b', color: '#000', border: 'none', borderRadius: 4,
        padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace',
      }}>MERGE</button>
      <button onClick={onCancel} style={{
        background: 'transparent', color: '#64748b', border: '1px solid #334155',
        borderRadius: 4, padding: '4px 10px', fontSize: 11, cursor: 'pointer',
      }}>✕</button>
    </div>
  );
}

export default function App() {
  const [apiKey, setApiKey] = useState<string | null>(() => sessionStorage.getItem(SESSION_KEY));
  const [authNeeded, setAuthNeeded] = useState(false);
  const [authError, setAuthError] = useState<string | undefined>();

  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [], proposals: [], fileSources: [] });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<SynthesisProposal | null>(null);
  const [scoutRunning, setScoutRunning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'error'>('idle');
  const [nodeCount, setNodeCount] = useState(0);
  const [linkCount, setLinkCount] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);

  // New state
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [expandedNodeData, setExpandedNodeData] = useState<{ nodes: KnowledgeNode[]; links: any[] }>({ nodes: [], links: [] });
  const [fileIngestOpen, setFileIngestOpen] = useState(false);
  const [aiConfigOpen, setAiConfigOpen] = useState(false);
  const [mergeRequest, setMergeRequest] = useState<{ nodeA: KnowledgeNode; nodeB: KnowledgeNode } | null>(null);
  const [domainFilter, setDomainFilter] = useState<Set<string> | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Authenticated fetch helper
  const apiFetch = useCallback(async (url: string, init?: RequestInit): Promise<Response> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(init?.headers as Record<string, string>),
    };
    if (apiKey) headers['X-API-KEY'] = apiKey;
    return fetch(url, { ...init, headers });
  }, [apiKey]);

  const fetchGraph = useCallback(async () => {
    try {
      const res = await apiFetch('/api/v1/synthesis/graph');
      if (res.status === 401) { setAuthNeeded(true); return; }
      if (!res.ok) return;
      const json = await res.json() as { success: boolean; data: GraphData; meta: { nodeCount: number; linkCount: number } };
      if (json.success) {
        setGraphData(json.data);
        setNodeCount(json.meta.nodeCount);
        setLinkCount(json.meta.linkCount);
        setVerifiedCount(json.data.proposals?.filter(p => p.auditStatus === 'clean').length ?? 0);
        setAuthNeeded(false);
      }
    } catch { /* silent */ }
  }, [apiFetch]);

  const fetchActivity = useCallback(async () => {
    try {
      const res = await apiFetch('/api/v1/activity');
      if (res.status === 401) { setAuthNeeded(true); return; }
      if (!res.ok) return;
      const json = await res.json() as { success: boolean; data: ActivityItem[] };
      if (json.success) setActivity(json.data);
    } catch { /* silent */ }
  }, [apiFetch]);

  // Probe on mount
  useEffect(() => {
    const probe = async () => {
      try {
        const res = await apiFetch('/api/v1/synthesis/graph');
        if (res.status === 401) {
          setAuthNeeded(true);
        } else if (res.ok) {
          const json = await res.json() as { success: boolean; data: GraphData; meta: { nodeCount: number; linkCount: number } };
          if (json.success) {
            setGraphData(json.data);
            setNodeCount(json.meta.nodeCount);
            setLinkCount(json.meta.linkCount);
            setVerifiedCount(json.data.proposals?.filter(p => p.auditStatus === 'clean').length ?? 0);
          }
          fetchActivity();
        }
      } catch { /* silent */ }
    };
    probe();
  }, [apiFetch, fetchActivity]);

  // Polling
  useEffect(() => {
    if (authNeeded) return;
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      fetchGraph();
      fetchActivity();
    }, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [authNeeded, fetchGraph, fetchActivity]);

  const handleAuthSubmit = useCallback((key: string) => {
    sessionStorage.setItem(SESSION_KEY, key);
    setApiKey(key);
    setAuthError(undefined);
    const headers: Record<string, string> = { 'Content-Type': 'application/json', 'X-API-KEY': key };
    fetch('/api/v1/synthesis/graph', { headers }).then(async (res) => {
      if (res.status === 401) {
        setAuthError('Invalid API key — please try again.');
        sessionStorage.removeItem(SESSION_KEY);
        setApiKey(null);
      } else if (res.ok) {
        const json = await res.json() as { success: boolean; data: GraphData; meta: { nodeCount: number; linkCount: number } };
        if (json.success) {
          setGraphData(json.data);
          setNodeCount(json.meta.nodeCount);
          setLinkCount(json.meta.linkCount);
          setVerifiedCount(json.data.proposals?.filter(p => p.auditStatus === 'clean').length ?? 0);
        }
        setAuthNeeded(false);
      }
    }).catch(() => setAuthError('Connection error — please try again.'));
  }, []);

  const triggerScout = useCallback(async (seedQuery: string) => {
    setScoutRunning(true);
    setStatus('scanning');
    try {
      const res = await apiFetch('/api/v1/scout/trigger', {
        method: 'POST',
        body: JSON.stringify({ seed_query: seedQuery }),
      });
      if (res.status === 401) { setAuthNeeded(true); setStatus('idle'); return; }
      if (!res.ok) setStatus('error');
      else setTimeout(() => setStatus('idle'), 30000);
    } catch {
      setStatus('error');
    } finally {
      setScoutRunning(false);
    }
  }, [apiFetch]);

  const validateProposal = useCallback(async (id: string, approve: boolean) => {
    try {
      const res = await apiFetch(`/api/v1/synthesis/${id}/validate`, {
        method: 'POST',
        body: JSON.stringify({ approve, reasoning: '', expert_did: 'user' }),
      });
      if (res.status === 401) { setAuthNeeded(true); return; }
      fetchGraph();
    } catch { /* silent */ }
  }, [apiFetch, fetchGraph]);

  const expandNode = useCallback(async (nodeId: string) => {
    try {
      const res = await apiFetch(`/api/v1/graph/node/${nodeId}/expand`);
      if (res.ok) {
        const { data } = await res.json();
        setExpandedNodeData({ nodes: data.neighbors ?? [], links: data.links ?? [] });
      }
    } catch { /* silent */ }
  }, [apiFetch]);

  const deleteNode = useCallback(async (nodeId: string) => {
    try {
      await apiFetch(`/api/v1/graph/node/${nodeId}`, { method: 'DELETE' });
      setSelectedNode(null);
      setExpandedNodeData({ nodes: [], links: [] });
      fetchGraph();
    } catch { /* silent */ }
  }, [apiFetch, fetchGraph]);

  const mergeNodes = useCallback(async (sourceId: string, targetId: string) => {
    try {
      await apiFetch('/api/v1/graph/merge', {
        method: 'POST',
        body: JSON.stringify({ sourceId, targetId }),
      });
      setMergeRequest(null);
      fetchGraph();
    } catch { /* silent */ }
  }, [apiFetch, fetchGraph]);

  return (
    <div className="scanlines relative w-full h-full flex flex-col overflow-hidden" style={{ background: '#06091a' }}>
      {/* Auth Modal */}
      {authNeeded && <AuthModal onSubmit={handleAuthSubmit} error={authError} />}

      {/* Top Bar */}
      <header
        className="glass flex items-center justify-between px-4 py-2 shrink-0 z-10"
        style={{ borderBottom: '1px solid rgba(245,158,11,0.18)' }}
      >
        <div className="flex items-center gap-3">
          {/* Network icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="3" r="2" fill="#f59e0b"/>
            <circle cx="3" cy="14" r="2" fill="#f59e0b"/>
            <circle cx="15" cy="14" r="2" fill="#f59e0b"/>
            <line x1="9" y1="5" x2="3" y2="12" stroke="#f59e0b" strokeOpacity="0.6" strokeWidth="1.2"/>
            <line x1="9" y1="5" x2="15" y2="12" stroke="#f59e0b" strokeOpacity="0.6" strokeWidth="1.2"/>
            <line x1="3" y1="14" x2="15" y2="14" stroke="#f59e0b" strokeOpacity="0.6" strokeWidth="1.2"/>
          </svg>
          <div className="flex flex-col leading-tight">
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 600, color: '#f59e0b', letterSpacing: '0.12em' }}>
              K.S.E
            </span>
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 9, color: '#64748b', letterSpacing: '0.04em' }}>
              Knowledge Synthesis Engine
            </span>
          </div>
          <span style={{
            padding: '1px 7px', borderRadius: 4,
            background: 'transparent',
            border: '1px solid rgba(245,158,11,0.35)',
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#f59e0b',
          }}>v2.0</span>
        </div>

        <div className="flex items-center gap-4 text-xs" style={{ color: '#64748b' }}>
          <StatusDot status={status} />
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11 }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#f59e0b' }}>{nodeCount}</span> nodes
          </span>
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11 }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#22d3ee' }}>{linkCount}</span> links
          </span>
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11 }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#10b981' }}>{verifiedCount}</span> verified
          </span>

          {/* Ingest button */}
          <button
            onClick={() => setFileIngestOpen(true)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(245,158,11,0.4)',
              borderRadius: 4, padding: '3px 9px',
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#f59e0b',
              cursor: 'pointer',
            }}
          >⊕ Ingest</button>

          {/* AI config button */}
          <button
            onClick={() => setAiConfigOpen(true)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: 4, padding: '3px 9px',
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#64748b',
              cursor: 'pointer',
            }}
          >⚙ AI</button>

          {/* Lock button */}
          {apiKey && (
            <button
              onClick={() => { sessionStorage.removeItem(SESSION_KEY); setApiKey(null); setAuthNeeded(true); setAuthError(undefined); }}
              style={{
                background: 'transparent',
                border: '1px solid #1e293b',
                borderRadius: 4, padding: '3px 9px',
                fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10, color: '#334155',
                cursor: 'pointer',
              }}
            >⎋ lock</button>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <div
          className="glass flex flex-col shrink-0 overflow-hidden z-10"
          style={{ width: 280, borderRight: '1px solid rgba(245,158,11,0.15)' }}
        >
          <Controls onTrigger={triggerScout} running={scoutRunning} />
          <ProposalsSidebar
            proposals={graphData.proposals ?? []}
            nodes={graphData.nodes ?? []}
            selected={selectedProposal}
            onSelect={setSelectedProposal}
            onValidate={validateProposal}
          />
        </div>

        {/* Center Graph */}
        <div className="flex-1 relative overflow-hidden">
          <GraphErrorBoundary>
            <Graph3D
              graphData={{
                ...graphData,
                nodes: [...(graphData.nodes ?? []), ...expandedNodeData.nodes],
              }}
              selectedNodeId={selectedNode?.id}
              expandedNodeIds={new Set(expandedNodeData.nodes.map(n => n.id))}
              expandedLinks={expandedNodeData.links}
              domainFilter={domainFilter}
              onNodeClick={(node) => setSelectedNode(node)}
              onNodeRightClick={() => { /* future context menu */ }}
              onMergeRequest={(a, b) => setMergeRequest({ nodeA: a, nodeB: b })}
              onNodePin={() => { /* handled inside Graph3D */ }}
            />
          </GraphErrorBoundary>

          {/* Empty state */}
          {nodeCount === 0 && !authNeeded && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <p style={{ fontSize: 36, marginBottom: 12 }}>🌌</p>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 600, color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Semantic Mesh Empty
              </p>
              <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, color: '#64748b', marginTop: 6 }}>
                Enter a research query and trigger the Scout to begin mapping
              </p>
            </div>
          )}

          {/* Merge confirm overlay */}
          {mergeRequest && (
            <MergeConfirmOverlay
              nodeA={mergeRequest.nodeA}
              nodeB={mergeRequest.nodeB}
              onConfirm={() => mergeNodes(mergeRequest.nodeA.id, mergeRequest.nodeB.id)}
              onCancel={() => setMergeRequest(null)}
            />
          )}

          {/* Node Detail Panel (absolutely positioned over graph) */}
          <NodeDetailPanel
            node={selectedNode}
            proposals={graphData.proposals ?? []}
            allNodes={graphData.nodes ?? []}
            onClose={() => { setSelectedNode(null); setExpandedNodeData({ nodes: [], links: [] }); }}
            onExpand={expandNode}
            onDelete={deleteNode}
            onPin={(id) => { /* handled in Graph3D */ }}
          />
        </div>

        {/* Right Sidebar */}
        <div
          className="glass flex flex-col shrink-0 overflow-hidden z-10"
          style={{ width: 260, borderLeft: '1px solid rgba(245,158,11,0.15)' }}
        >
          <ActivityFeed items={activity} />
        </div>
      </div>

      {/* Modals / Drawers */}
      <FileIngestPanel
        isOpen={fileIngestOpen}
        onClose={() => setFileIngestOpen(false)}
        apiKey={apiKey}
        onIngested={() => { fetchGraph(); fetchActivity(); }}
      />
      <AIConfigDrawer
        isOpen={aiConfigOpen}
        onClose={() => setAiConfigOpen(false)}
        apiKey={apiKey}
      />
    </div>
  );
}

function StatusDot({ status }: { status: 'idle' | 'scanning' | 'error' }) {
  const color = status === 'scanning' ? '#22d3ee' : status === 'error' ? '#ef4444' : '#10b981';
  const label = status === 'scanning' ? 'SCANNING' : status === 'error' ? 'ERROR' : 'ONLINE';
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span
        className={status === 'scanning' ? 'pulse-glow' : ''}
        style={{
          display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
          background: color, boxShadow: `0 0 6px ${color}`,
        }}
      />
      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color }}>{label}</span>
    </span>
  );
}
