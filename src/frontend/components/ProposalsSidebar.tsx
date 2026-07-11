import React from 'react';
import type { SynthesisProposal, KnowledgeNode } from '../types.js';

interface Props {
  proposals: SynthesisProposal[];
  nodes: KnowledgeNode[];
  selected: SynthesisProposal | null;
  onSelect: (p: SynthesisProposal | null) => void;
  onValidate: (id: string, approve: boolean) => void;
}

const STATUS_CONFIG = {
  clean: { color: '#10b981', label: '✓ VERIFIED', bg: 'rgba(16,185,129,0.1)' },
  warning: { color: '#f59e0b', label: '⚠ WARNING', bg: 'rgba(245,158,11,0.1)' },
  rejected: { color: '#ef4444', label: '✕ REJECTED', bg: 'rgba(239,68,68,0.1)' },
  pending: { color: '#64748b', label: '◌ PENDING', bg: 'rgba(100,116,139,0.1)' },
};

export function ProposalsSidebar({ proposals, nodes, selected, onSelect, onValidate }: Props) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const sorted = [...proposals].sort((a, b) => {
    const order = { clean: 0, warning: 1, pending: 2, rejected: 3 };
    return (order[a.auditStatus] ?? 2) - (order[b.auditStatus] ?? 2);
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="px-3 py-2 text-xs font-bold tracking-widest shrink-0 flex items-center justify-between"
        style={{ color: '#8b5cf6', borderBottom: '1px solid rgba(139,92,246,0.2)' }}
      >
        <span>◈ SYNTHESIS PROPOSALS</span>
        <span style={{ color: '#334155' }}>{proposals.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
        {sorted.length === 0 && (
          <p className="text-xs p-2" style={{ color: '#334155' }}>
            No proposals yet. Run the Scout to generate cross-domain hypotheses.
          </p>
        )}

        {sorted.map((p) => {
          const cfg = STATUS_CONFIG[p.auditStatus] ?? STATUS_CONFIG.pending;
          const srcNode = nodeMap.get(p.sourceNodeId);
          const tgtNode = nodeMap.get(p.targetNodeId);
          const isSelected = selected?.id === p.id;

          return (
            <div
              key={p.id}
              onClick={() => onSelect(isSelected ? null : p)}
              className="rounded p-2 cursor-pointer transition-all"
              style={{
                background: isSelected ? 'rgba(139,92,246,0.15)' : cfg.bg,
                border: `1px solid ${isSelected ? 'rgba(139,92,246,0.5)' : `${cfg.color}33`}`,
              }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-xs font-bold"
                  style={{ color: cfg.color, fontSize: 10 }}
                >
                  {cfg.label}
                </span>
                <span style={{ color: '#64748b', fontSize: 10 }}>
                  {Math.round(p.trustScore * 100)}%
                </span>
              </div>

              {/* Node pair */}
              <div className="text-xs mb-1" style={{ color: '#e2e8f0' }}>
                <span style={{ color: '#60a5fa' }}>{srcNode?.name ?? p.sourceNodeId.slice(0, 8)}</span>
                <span style={{ color: '#334155' }}> × </span>
                <span style={{ color: '#a78bfa' }}>{tgtNode?.name ?? p.targetNodeId.slice(0, 8)}</span>
              </div>

              {/* Hypothesis preview */}
              {isSelected && (
                <div className="mt-2">
                  <p className="text-xs mb-2" style={{ color: '#94a3b8', lineHeight: 1.5 }}>
                    {p.hypothesis}
                  </p>
                  <p className="text-xs mb-2 italic" style={{ color: '#64748b', lineHeight: 1.4 }}>
                    Audit: {p.auditReasoning}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onValidate(p.id, true); }}
                      className="flex-1 text-xs py-1 rounded font-bold"
                      style={{
                        background: 'rgba(16,185,129,0.15)',
                        border: '1px solid rgba(16,185,129,0.4)',
                        color: '#10b981',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      ✓ APPROVE
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onValidate(p.id, false); }}
                      className="flex-1 text-xs py-1 rounded font-bold"
                      style={{
                        background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.4)',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      ✕ REJECT
                    </button>
                  </div>
                </div>
              )}

              {/* Trust bar */}
              <div className="mt-1.5 h-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${p.trustScore * 100}%`,
                    background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
