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
  clean:    { color: '#10b981', label: 'CLEAN',    bg: 'rgba(16,185,129,0.06)' },
  warning:  { color: '#f59e0b', label: 'WARN',     bg: 'rgba(245,158,11,0.06)' },
  rejected: { color: '#ef4444', label: 'REJECTED', bg: 'rgba(239,68,68,0.06)' },
  pending:  { color: '#6b7280', label: 'PENDING',  bg: 'rgba(100,116,139,0.06)' },
};

export function ProposalsSidebar({ proposals, nodes, selected, onSelect, onValidate }: Props) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const sorted = [...proposals].sort((a, b) => {
    const order = { clean: 0, warning: 1, pending: 2, rejected: 3 };
    return (order[a.auditStatus] ?? 2) - (order[b.auditStatus] ?? 2);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '10px 12px 8px',
        borderBottom: '1px solid rgba(245,158,11,0.12)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          borderLeft: '3px solid #f59e0b',
          paddingLeft: 8,
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 11,
          fontWeight: 600,
          color: '#f59e0b',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          ◈ Synthesis Proposals
        </div>
        <span style={{
          padding: '1px 7px',
          borderRadius: 999,
          background: 'rgba(245,158,11,0.1)',
          border: '1px solid rgba(245,158,11,0.25)',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 10,
          color: '#f59e0b',
        }}>
          {proposals.length}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {sorted.length === 0 && (
          <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, color: '#334155', padding: '8px 4px', lineHeight: 1.5 }}>
            No proposals yet. Run the Scout to generate cross-domain hypotheses.
          </p>
        )}

        {sorted.map((p, idx) => {
          const cfg = STATUS_CONFIG[p.auditStatus] ?? STATUS_CONFIG.pending;
          const srcNode = nodeMap.get(p.sourceNodeId);
          const tgtNode = nodeMap.get(p.targetNodeId);
          const isSelected = selected?.id === p.id;

          return (
            <div
              key={p.id}
              onClick={() => onSelect(isSelected ? null : p)}
              style={{
                background: isSelected ? '#111d35' : '#0a0f1e',
                border: `1px solid ${isSelected ? `${cfg.color}55` : `${cfg.color}22`}`,
                borderLeft: `3px solid ${cfg.color}`,
                borderRadius: 4,
                padding: '7px 8px',
                cursor: 'pointer',
                transition: 'background 0.12s',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = '#111d35'; }}
              onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = '#0a0f1e'; }}
            >
              {/* Top row: status badge + P-number + trust score */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{
                  padding: '0px 5px',
                  borderRadius: 999,
                  background: `${cfg.color}22`,
                  color: cfg.color,
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: 9,
                  fontWeight: 600,
                }}>
                  {cfg.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, color: '#22d3ee' }}>
                    {Math.round(p.trustScore * 100)}%
                  </span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, color: '#334155' }}>
                    P{idx + 1}
                  </span>
                </div>
              </div>

              {/* Node pair */}
              <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, marginBottom: 4, color: '#e2e8f0' }}>
                <span style={{ color: '#60a5fa' }}>{srcNode?.name ?? p.sourceNodeId.slice(0, 8)}</span>
                <span style={{ color: '#334155' }}> × </span>
                <span style={{ color: '#a78bfa' }}>{tgtNode?.name ?? p.targetNodeId.slice(0, 8)}</span>
              </div>

              {/* Hypothesis preview — 2 line clamp */}
              <p style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 10,
                color: '#64748b',
                lineHeight: 1.45,
                display: '-webkit-box',
                WebkitLineClamp: isSelected ? undefined : 2,
                WebkitBoxOrient: 'vertical',
                overflow: isSelected ? 'visible' : 'hidden',
                marginBottom: 4,
              }}>
                {p.hypothesis}
              </p>

              {/* Trust bar */}
              <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1, marginBottom: isSelected ? 8 : 0 }}>
                <div style={{
                  height: '100%',
                  width: `${p.trustScore * 100}%`,
                  background: p.auditStatus === 'clean' ? '#f59e0b'
                    : p.auditStatus === 'warning' ? 'rgba(245,158,11,0.5)'
                    : p.auditStatus === 'rejected' ? '#ef4444'
                    : '#334155',
                  borderRadius: 1,
                }} />
              </div>

              {/* Expanded: audit + actions */}
              {isSelected && (
                <div>
                  <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10, color: '#64748b', lineHeight: 1.5, fontStyle: 'italic', marginBottom: 8 }}>
                    Audit: {p.auditReasoning}
                  </p>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button
                      onClick={e => { e.stopPropagation(); onValidate(p.id, true); }}
                      style={{
                        flex: 1, padding: '5px',
                        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)',
                        borderRadius: 3, color: '#10b981',
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
                        cursor: 'pointer',
                      }}
                    >✓ APPROVE</button>
                    <button
                      onClick={e => { e.stopPropagation(); onValidate(p.id, false); }}
                      style={{
                        flex: 1, padding: '5px',
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)',
                        borderRadius: 3, color: '#ef4444',
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
                        cursor: 'pointer',
                      }}
                    >✕ REJECT</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
