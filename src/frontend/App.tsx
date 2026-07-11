import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Graph3D } from './components/Graph3D.js';
import { GraphErrorBoundary } from './components/GraphErrorBoundary.js';
import { ActivityFeed } from './components/ActivityFeed.js';
import { Controls } from './components/Controls.js';
import { ProposalsSidebar } from './components/ProposalsSidebar.js';
import type { GraphData, ActivityItem, SynthesisProposal } from './types.js';

export default function App() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [], proposals: [] });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<SynthesisProposal | null>(null);
  const [scoutRunning, setScoutRunning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'error'>('idle');
  const [nodeCount, setNodeCount] = useState(0);
  const [linkCount, setLinkCount] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchGraph = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/synthesis/graph');
      if (!res.ok) return;
      const json = await res.json() as { success: boolean; data: GraphData; meta: { nodeCount: number; linkCount: number } };
      if (json.success) {
        setGraphData(json.data);
        setNodeCount(json.meta.nodeCount);
        setLinkCount(json.meta.linkCount);
      }
    } catch {
      // silent
    }
  }, []);

  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/activity');
      if (!res.ok) return;
      const json = await res.json() as { success: boolean; data: ActivityItem[] };
      if (json.success) setActivity(json.data);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchGraph();
    fetchActivity();
    pollRef.current = setInterval(() => {
      fetchGraph();
      fetchActivity();
    }, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchGraph, fetchActivity]);

  const triggerScout = useCallback(async (seedQuery: string) => {
    setScoutRunning(true);
    setStatus('scanning');
    try {
      const res = await fetch('/api/v1/scout/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed_query: seedQuery }),
      });
      if (!res.ok) setStatus('error');
      else {
        // Keep scanning status for a bit to let the scout run
        setTimeout(() => setStatus('idle'), 30000);
      }
    } catch {
      setStatus('error');
    } finally {
      setScoutRunning(false);
    }
  }, []);

  const validateProposal = useCallback(async (id: string, approve: boolean) => {
    try {
      await fetch(`/api/v1/synthesis/${id}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approve, reasoning: '', expert_did: 'user' }),
      });
      fetchGraph();
    } catch {
      // silent
    }
  }, [fetchGraph]);

  return (
    <div className="scanlines relative w-full h-full flex flex-col overflow-hidden" style={{ background: '#050510' }}>
      {/* Top Bar */}
      <header className="glass flex items-center justify-between px-4 py-2 shrink-0 z-10" style={{ borderBottom: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="flex items-center gap-3">
          <span className="text-lg">🧬</span>
          <span className="text-sm font-bold tracking-widest" style={{ color: '#00d4ff' }}>
            KNOWLEDGE SYNTHESIS ENGINE
          </span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}>
            Semantic Mesh v1.0
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ color: '#64748b' }}>
          <StatusDot status={status} />
          <span><span style={{ color: '#00d4ff' }}>{nodeCount}</span> nodes</span>
          <span><span style={{ color: '#8b5cf6' }}>{linkCount}</span> links</span>
          <span><span style={{ color: '#10b981' }}>{graphData.proposals?.filter(p => p.auditStatus === 'clean').length ?? 0}</span> verified</span>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="glass flex flex-col w-72 shrink-0 overflow-hidden z-10" style={{ borderRight: '1px solid rgba(0,212,255,0.15)' }}>
          <Controls onTrigger={triggerScout} running={scoutRunning} />
          <ProposalsSidebar
            proposals={graphData.proposals ?? []}
            nodes={graphData.nodes ?? []}
            selected={selectedProposal}
            onSelect={setSelectedProposal}
            onValidate={validateProposal}
          />
        </div>

        {/* 3D Graph (center) */}
        <div className="flex-1 relative overflow-hidden">
          <GraphErrorBoundary>
            <Graph3D
              graphData={graphData}
              onNodeClick={(node) => {
                const related = graphData.proposals?.find(
                  p => p.sourceNodeId === node.id || p.targetNodeId === node.id
                );
                if (related) setSelectedProposal(related);
              }}
            />
          </GraphErrorBoundary>
          {nodeCount === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-4xl mb-4">🌌</p>
              <p className="text-sm font-bold tracking-widest" style={{ color: '#00d4ff' }}>SEMANTIC MESH EMPTY</p>
              <p className="text-xs mt-2" style={{ color: '#64748b' }}>Enter a research query and trigger the Scout to begin mapping</p>
            </div>
          )}
        </div>

        {/* Right Sidebar — Activity Feed */}
        <div className="glass flex flex-col w-64 shrink-0 overflow-hidden z-10" style={{ borderLeft: '1px solid rgba(0,212,255,0.15)' }}>
          <ActivityFeed items={activity} />
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: 'idle' | 'scanning' | 'error' }) {
  const color = status === 'scanning' ? '#00d4ff' : status === 'error' ? '#ef4444' : '#10b981';
  const label = status === 'scanning' ? 'SCANNING' : status === 'error' ? 'ERROR' : 'ONLINE';
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={status === 'scanning' ? 'pulse-glow' : ''}
        style={{
          display: 'inline-block',
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 6px ${color}`,
        }}
      />
      <span style={{ color }}>{label}</span>
    </span>
  );
}
