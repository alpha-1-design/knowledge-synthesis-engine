import React, { useState } from 'react';
import type { KnowledgeNode, SynthesisProposal } from '../types.js';

interface Props {
  node: KnowledgeNode | null;
  proposals: SynthesisProposal[];
  allNodes: KnowledgeNode[];
  onClose: () => void;
  onExpand: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onPin: (nodeId: string) => void;
}

const DOMAIN_COLORS: Record<string, string> = {
  CS: '#60a5fa', Physics: '#a78bfa', Biology: '#34d399',
  Chemistry: '#fb923c', Medicine: '#f87171', Math: '#fbbf24',
  Engineering: '#94a3b8', Other: '#6b7280',
};

const STATUS_CONFIG = {
  clean:    { color: '#10b981', label: 'CLEAN' },
  warning:  { color: '#f59e0b', label: 'WARN' },
  rejected: { color: '#ef4444', label: 'REJECTED' },
  pending:  { color: '#6b7280', label: 'PENDING' },
};

export function NodeDetailPanel({ node, proposals, allNodes, onClose, onExpand, onDelete, onPin }: Props) {
  const [abstractOpen, setAbstractOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!node) return null;

  const domainColor = DOMAIN_COLORS[node.domain] ?? DOMAIN_COLORS.Other;
  const nodeMap = new Map(allNodes.map(n => [n.id, n]));
  const relatedProposals = proposals.filter(
    p => p.sourceNodeId === node.id || p.targetNodeId === node.id
  );

  return (
    <div
      className="slide-in-right"
      style={{
        position: 'absolute',
        right: 0, top: 0, bottom: 0,
        width: 320,
        background: '#0d1424',
        borderTop: '3px solid #f59e0b',
        borderLeft: '1px solid rgba(245,158,11,0.25)',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid rgba(245,158,11,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 15,
              fontWeight: 600,
              color: '#f1f5f9',
              lineHeight: 1.3,
              marginBottom: 4,
              wordBreak: 'break-word',
            }}>
              {node.name}
            </div>
            <span style={{
              display: 'inline-block',
              padding: '1px 7px',
              borderRadius: 4,
              background: `${domainColor}22`,
              color: domainColor,
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 10,
              fontWeight: 600,
              border: `1px solid ${domainColor}44`,
            }}>
              {node.domain}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid rgba(245,158,11,0.2)',
              color: '#64748b',
              borderRadius: 4,
              width: 26,
              height: 26,
              cursor: 'pointer',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >×</button>
        </div>

        {/* CID */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#f59e0b', flexShrink: 0 }}>CID</span>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 10,
            color: '#64748b',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {node.id}
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Description */}
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Description
          </div>
          <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>
            {node.description}
          </p>
        </div>

        {/* Source */}
        {(node.sourceUrl || node.fileSourceId) && (
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Source
            </div>
            {node.sourceUrl && (
              <a
                href={node.sourceUrl}
                target="_blank"
                rel="noreferrer"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, color: '#22d3ee', textDecoration: 'none' }}
              >
                ↗ View source paper
              </a>
            )}
            {node.fileSourceId && !node.sourceUrl && (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, color: '#64748b' }}>
                📄 From file
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {node.tags && node.tags.length > 0 && (
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Tags
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {node.tags.map(tag => (
                <span key={tag} style={{
                  padding: '1px 7px',
                  borderRadius: 999,
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: 10,
                  color: '#f59e0b',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Abstract collapsible */}
        {node.paperAbstract && (
          <div>
            <button
              onClick={() => setAbstractOpen(v => !v)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 10,
                color: '#f59e0b',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              <span style={{ transition: 'transform 0.15s', display: 'inline-block', transform: abstractOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
              Abstract
            </button>
            {abstractOpen && (
              <p style={{
                marginTop: 6,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 11,
                color: '#64748b',
                lineHeight: 1.6,
                borderLeft: '2px solid rgba(245,158,11,0.2)',
                paddingLeft: 8,
              }}>
                {node.paperAbstract}
              </p>
            )}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(245,158,11,0.1)' }} />

        {/* Connected proposals */}
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Connected Proposals ({relatedProposals.length})
          </div>
          {relatedProposals.length === 0 && (
            <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, color: '#334155' }}>
              No proposals linked to this node.
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {relatedProposals.map(p => {
              const cfg = STATUS_CONFIG[p.auditStatus] ?? STATUS_CONFIG.pending;
              return (
                <div key={p.id} style={{
                  background: '#06091a',
                  border: `1px solid ${cfg.color}33`,
                  borderLeft: `3px solid ${cfg.color}`,
                  borderRadius: 4,
                  padding: '6px 8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{
                      padding: '0px 5px',
                      borderRadius: 999,
                      background: `${cfg.color}22`,
                      color: cfg.color,
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: 10,
                    }}>
                      {cfg.label}
                    </span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#22d3ee' }}>
                      {Math.round(p.trustScore * 100)}%
                    </span>
                  </div>
                  <p style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: 11,
                    color: '#94a3b8',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {p.hypothesis}
                  </p>
                  {/* Trust bar */}
                  <div style={{ marginTop: 4, height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
                    <div style={{
                      height: '100%',
                      width: `${p.trustScore * 100}%`,
                      background: cfg.color,
                      borderRadius: 1,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(245,158,11,0.1)' }} />

        {/* Actions */}
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button
              onClick={() => onExpand(node.id)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(245,158,11,0.4)',
                color: '#f59e0b',
                borderRadius: 4,
                padding: '6px 10px',
                fontSize: 11,
                fontFamily: 'IBM Plex Mono, monospace',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              ⊕ Expand Connections
            </button>
            <button
              onClick={() => onPin(node.id)}
              style={{
                background: node.pinned ? 'rgba(245,158,11,0.15)' : 'transparent',
                border: `1px solid rgba(245,158,11,${node.pinned ? '0.5' : '0.2'})`,
                color: node.pinned ? '#f59e0b' : '#64748b',
                borderRadius: 4,
                padding: '6px 10px',
                fontSize: 11,
                fontFamily: 'IBM Plex Mono, monospace',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {node.pinned ? '◆ Pinned' : '◇ Pin Node'}
            </button>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#ef4444',
                  borderRadius: 4,
                  padding: '6px 10px',
                  fontSize: 11,
                  fontFamily: 'IBM Plex Mono, monospace',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                ✕ Delete Node
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => onDelete(node.id)}
                  style={{
                    flex: 1,
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.5)',
                    color: '#ef4444',
                    borderRadius: 4,
                    padding: '6px 8px',
                    fontSize: 11,
                    fontFamily: 'IBM Plex Mono, monospace',
                    cursor: 'pointer',
                  }}
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: '1px solid rgba(100,116,139,0.3)',
                    color: '#64748b',
                    borderRadius: 4,
                    padding: '6px 8px',
                    fontSize: 11,
                    fontFamily: 'IBM Plex Mono, monospace',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
