import React, { useRef, useCallback, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import type { GraphData, KnowledgeNode } from '../types.js';

const DOMAIN_COLORS: Record<string, string> = {
  CS: '#60a5fa',
  Physics: '#a78bfa',
  Biology: '#34d399',
  Chemistry: '#fb923c',
  Medicine: '#f87171',
  Math: '#fbbf24',
  Engineering: '#94a3b8',
  Other: '#6b7280',
};

function domainColor(domain: string): string {
  return DOMAIN_COLORS[domain] ?? DOMAIN_COLORS.Other;
}

interface Props {
  graphData: GraphData;
  onNodeClick?: (node: KnowledgeNode) => void;
}

export function Graph3D({ graphData, onNodeClick }: Props) {
  const fgRef = useRef<any>(null);

  // Transform to force-graph format
  const data = useMemo(() => ({
    nodes: (graphData.nodes ?? []).map(n => ({ ...n, val: 3 })),
    links: (graphData.links ?? []).map(l => ({
      source: l.source,
      target: l.target,
      color: l.type === 'synthesis' ? '#8b5cf6' : '#334155',
    })),
  }), [graphData.nodes, graphData.links]);

  const handleNodeClick = useCallback((node: any) => {
    // Aim camera at node
    const distance = 80;
    const distRatio = 1 + distance / Math.hypot(node.x ?? 1, node.y ?? 1, node.z ?? 1);
    fgRef.current?.cameraPosition(
      { x: (node.x ?? 0) * distRatio, y: (node.y ?? 0) * distRatio, z: (node.z ?? 0) * distRatio },
      node,
      800
    );
    onNodeClick?.(node as KnowledgeNode);
  }, [onNodeClick]);

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={data}
      backgroundColor="#050510"
      nodeLabel={(node: any) => `<div style="background:#0a0a1e;border:1px solid #00d4ff44;border-radius:6px;padding:8px 10px;font-family:monospace;font-size:12px;color:#e2e8f0;max-width:200px"><strong style="color:${domainColor(node.domain)}">${node.name}</strong><br/><span style="color:#64748b">${node.domain}</span><br/><span style="font-size:11px">${(node.description ?? '').slice(0, 100)}${node.description?.length > 100 ? '…' : ''}</span></div>`}
      nodeColor={(node: any) => domainColor(node.domain)}
      nodeOpacity={0.9}
      nodeResolution={16}
      linkColor={(link: any) => link.color ?? '#334155'}
      linkOpacity={0.4}
      linkWidth={0.8}
      linkDirectionalParticles={2}
      linkDirectionalParticleWidth={1}
      linkDirectionalParticleColor={(link: any) => link.color ?? '#00d4ff'}
      onNodeClick={handleNodeClick}
      onEngineStop={() => {}}
      enableNodeDrag={true}
      enableNavigationControls={true}
      showNavInfo={false}
      d3AlphaDecay={0.02}
      d3VelocityDecay={0.3}
      width={undefined as any}
      height={undefined as any}
    />
  );
}
