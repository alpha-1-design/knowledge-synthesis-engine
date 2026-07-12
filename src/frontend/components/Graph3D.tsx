import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
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

function hexToNum(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}

interface Props {
  graphData: GraphData;
  selectedNodeId?: string;
  expandedNodeIds?: Set<string>;
  expandedLinks?: any[];
  domainFilter?: Set<string> | null;
  onNodeClick?: (node: KnowledgeNode) => void;
  onNodeRightClick?: (node: KnowledgeNode, event: MouseEvent) => void;
  onMergeRequest?: (nodeA: KnowledgeNode, nodeB: KnowledgeNode) => void;
  onNodePin?: (node: KnowledgeNode) => void;
}

export function Graph3D({
  graphData,
  selectedNodeId,
  expandedNodeIds,
  expandedLinks,
  domainFilter,
  onNodeClick,
  onNodeRightClick,
  onMergeRequest,
  onNodePin,
}: Props) {
  const fgRef = useRef<any>(null);
  const [pinnedNodes, setPinnedNodes] = useState<Set<string>>(new Set());
  const [mergeCandidate, setMergeCandidate] = useState<string | null>(null);
  const [activeDomains, setActiveDomains] = useState<Set<string> | null>(null);

  const allNodes = useMemo(() => graphData.nodes ?? [], [graphData.nodes]);
  const allLinks = useMemo(() => graphData.links ?? [], [graphData.links]);

  const uniqueDomains = useMemo(() => {
    const domains = new Set<string>();
    allNodes.forEach(n => domains.add(n.domain));
    return Array.from(domains);
  }, [allNodes]);

  // Build graph data with pinning support
  const data = useMemo(() => {
    const nodes = allNodes.map(n => ({
      ...n,
      val: pinnedNodes.has(n.id) ? 5 : 3,
      pinned: pinnedNodes.has(n.id),
      fx: pinnedNodes.has(n.id) ? (n as any).fx : undefined,
      fy: pinnedNodes.has(n.id) ? (n as any).fy : undefined,
      fz: pinnedNodes.has(n.id) ? (n as any).fz : undefined,
    }));

    const baseLinks = allLinks.map(l => ({
      ...l,
      source: l.source,
      target: l.target,
      _type: l.type,
      _expanded: false,
    }));

    const extraLinks = (expandedLinks ?? []).map(l => ({
      ...l,
      _type: l.type ?? 'reference',
      _expanded: true,
    }));

    return { nodes, links: [...baseLinks, ...extraLinks] };
  }, [allNodes, allLinks, expandedLinks, pinnedNodes]);

  const nodeThreeObject = useCallback((node: any) => {
    const isPinned = pinnedNodes.has(node.id);
    const isSelected = node.id === selectedNodeId;
    const isMergeTarget = node.id === mergeCandidate;

    const effectiveDomainFilter = activeDomains ?? domainFilter;
    const isFiltered = effectiveDomainFilter !== null && effectiveDomainFilter !== undefined
      ? !effectiveDomainFilter.has(node.domain)
      : false;

    const radius = isPinned ? 5 : 4;
    const group = new THREE.Group();

    // Main sphere
    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    const material = new THREE.MeshPhongMaterial({
      color: isMergeTarget ? 0xf59e0b : hexToNum(domainColor(node.domain)),
      opacity: isFiltered ? 0.08 : 0.9,
      transparent: true,
      emissive: isSelected ? hexToNum('#f59e0b') : 0x000000,
      emissiveIntensity: isSelected ? 0.3 : 0,
      shininess: 60,
    });
    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);

    // Selected ring
    if (isSelected) {
      const ringGeo = new THREE.RingGeometry(radius + 2, radius + 3.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }

    // Pinned diamond marker
    if (isPinned) {
      const diamondGeo = new THREE.OctahedronGeometry(2, 0);
      const diamondMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const diamond = new THREE.Mesh(diamondGeo, diamondMat);
      diamond.position.y = radius + 5;
      group.add(diamond);
    }

    return group;
  }, [selectedNodeId, pinnedNodes, mergeCandidate, activeDomains, domainFilter]);

  const nodeLabel = useCallback((node: any) => {
    return `<div style="background:#0d1424;border:1px solid rgba(245,158,11,0.4);border-radius:6px;padding:8px 10px;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#f1f5f9;max-width:220px"><strong style="color:${domainColor(node.domain)}">${node.name}</strong><br/><span style="color:#64748b;font-size:10px">${node.domain}</span><br/><span style="font-size:11px;color:#94a3b8">${(node.description ?? '').slice(0, 100)}${(node.description?.length ?? 0) > 100 ? '…' : ''}</span></div>`;
  }, []);

  const linkColor = useCallback((link: any) => {
    if (link._expanded) return '#334155';
    switch (link._type) {
      case 'synthesis': return '#8b5cf6';
      case 'file-bridge': return '#f59e0b';
      case 'reference': return '#22d3ee';
      case 'similarity': return '#22d3ee';
      default: return '#334155';
    }
  }, []);

  const linkWidth = useCallback((link: any) => {
    if (link._expanded) return 0.3;
    switch (link._type) {
      case 'synthesis': return 1.5;
      case 'file-bridge': return 1.0;
      default: return 0.5;
    }
  }, []);

  const linkParticles = useCallback((link: any) => {
    if (link._expanded) return 0;
    switch (link._type) {
      case 'synthesis': return 3;
      case 'file-bridge': return 2;
      default: return 0;
    }
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    const distance = 80;
    const distRatio = 1 + distance / Math.hypot(node.x ?? 1, node.y ?? 1, node.z ?? 1);
    fgRef.current?.cameraPosition(
      { x: (node.x ?? 0) * distRatio, y: (node.y ?? 0) * distRatio, z: (node.z ?? 0) * distRatio },
      node,
      800
    );
    onNodeClick?.(node as KnowledgeNode);
  }, [onNodeClick]);

  const handleNodeRightClick = useCallback((node: any, event: MouseEvent) => {
    onNodeRightClick?.(node as KnowledgeNode, event);
  }, [onNodeRightClick]);

  const handleNodeDblClick = useCallback((node: any) => {
    setPinnedNodes(prev => {
      const next = new Set(prev);
      if (next.has(node.id)) {
        next.delete(node.id);
        node.fx = undefined;
        node.fy = undefined;
        node.fz = undefined;
      } else {
        next.add(node.id);
        node.fx = node.x;
        node.fy = node.y;
        node.fz = node.z;
      }
      return next;
    });
    fgRef.current?.d3ReheatSimulation();
    onNodePin?.(node as KnowledgeNode);
  }, [onNodePin]);

  const handleNodeDrag = useCallback((node: any) => {
    if (!onMergeRequest) return;
    const nodes = data.nodes;
    let closestId: string | null = null;
    let closestDist = Infinity;
    for (const other of nodes) {
      if (other.id === node.id) continue;
      const dx = (other.x ?? 0) - (node.x ?? 0);
      const dy = (other.y ?? 0) - (node.y ?? 0);
      const dz = (other.z ?? 0) - (node.z ?? 0);
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < closestDist) { closestDist = dist; closestId = other.id; }
    }
    setMergeCandidate(closestDist < 20 ? closestId : null);
  }, [data.nodes, onMergeRequest]);

  const handleNodeDragEnd = useCallback((node: any) => {
    if (!onMergeRequest) { setMergeCandidate(null); return; }
    const nodes = data.nodes;
    for (const other of nodes) {
      if (other.id === node.id) continue;
      const dx = (other.x ?? 0) - (node.x ?? 0);
      const dy = (other.y ?? 0) - (node.y ?? 0);
      const dz = (other.z ?? 0) - (node.z ?? 0);
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < 20) {
        onMergeRequest(node as KnowledgeNode, other as KnowledgeNode);
        break;
      }
    }
    setMergeCandidate(null);
  }, [data.nodes, onMergeRequest]);

  const toggleDomain = (domain: string) => {
    setActiveDomains(prev => {
      if (prev === null) {
        // Start filtering: all except clicked one active
        const next = new Set(uniqueDomains.filter(d => d !== domain));
        return next.size === 0 ? null : next;
      }
      const next = new Set(prev);
      if (next.has(domain)) {
        next.delete(domain);
        if (next.size === 0) return new Set(uniqueDomains); // reset to all
      } else {
        next.add(domain);
      }
      return next.size === uniqueDomains.length ? null : next;
    });
  };

  const effectiveDomainFilter = activeDomains ?? domainFilter;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        backgroundColor="#06091a"
        nodeLabel={nodeLabel}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        nodeOpacity={0.9}
        nodeResolution={16}
        linkColor={linkColor}
        linkOpacity={0.5}
        linkWidth={linkWidth}
        linkDirectionalParticles={linkParticles}
        linkDirectionalParticleWidth={1.2}
        linkDirectionalParticleColor={linkColor}
        onNodeClick={handleNodeClick}
        onNodeRightClick={handleNodeRightClick}
        onNodeDblClick={handleNodeDblClick}
        onNodeDrag={handleNodeDrag}
        onNodeDragEnd={handleNodeDragEnd}
        onEngineStop={() => {}}
        enableNodeDrag={true}
        enableNavigationControls={true}
        showNavInfo={false}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        width={undefined as any}
        height={undefined as any}
      />

      {/* HUD controls */}
      <div style={{
        position: 'absolute', bottom: 16, right: 16, zIndex: 10,
        display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end',
      }}>
        {/* Graph control buttons */}
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => fgRef.current?.d3ReheatSimulation()}
            style={hudBtnStyle}
            title="Reset simulation"
          >⟳ Reset</button>
          <button
            onClick={() => fgRef.current?.zoomToFit(400)}
            style={hudBtnStyle}
            title="Fit to screen"
          >⊡ Fit</button>
        </div>

        {/* Domain filter chips */}
        {uniqueDomains.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, maxWidth: 220, justifyContent: 'flex-end' }}>
            {uniqueDomains.map(domain => {
              const color = domainColor(domain);
              const isActive = effectiveDomainFilter === null || effectiveDomainFilter.has(domain);
              return (
                <button
                  key={domain}
                  onClick={() => toggleDomain(domain)}
                  style={{
                    padding: '2px 7px',
                    borderRadius: 999,
                    background: isActive ? `${color}22` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.08)'}`,
                    color: isActive ? color : '#334155',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: 9,
                    cursor: 'pointer',
                    opacity: isActive ? 1 : 0.4,
                    transition: 'all 0.15s',
                  }}
                >
                  {domain}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const hudBtnStyle: React.CSSProperties = {
  background: 'rgba(13,20,36,0.9)',
  border: '1px solid rgba(245,158,11,0.3)',
  color: '#f59e0b',
  borderRadius: 4,
  padding: '4px 10px',
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: 10,
  cursor: 'pointer',
};
