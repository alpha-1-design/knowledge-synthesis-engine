import React, { useEffect, useRef } from 'react';
import type { ActivityItem } from '../types.js';

interface Props {
  items: ActivityItem[];
}

const TYPE_CONFIG = {
  ai:   { color: '#22d3ee', label: '[AI]',   bg: 'rgba(34,211,238,0.05)' },
  info: { color: '#64748b', label: '[SYS]',  bg: 'transparent' },
  warn: { color: '#f59e0b', label: '[WARN]', bg: 'rgba(245,158,11,0.04)' },
};

export function ActivityFeed({ items }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [items]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '10px 12px 8px',
        borderBottom: '1px solid rgba(245,158,11,0.12)',
        flexShrink: 0,
        borderLeft: '3px solid #f59e0b',
        marginLeft: 0,
      }}>
        <div style={{
          paddingLeft: 8,
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 11,
          fontWeight: 600,
          color: '#f59e0b',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          ◈ Intelligence Feed
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {items.length === 0 && (
          <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, color: '#334155', padding: '10px 12px', lineHeight: 1.5 }}>
            Awaiting scout activity...
          </p>
        )}
        {items.map((item, idx) => {
          const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.info;
          const time = new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
          });
          const isEven = idx % 2 === 0;
          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 6,
                padding: '5px 10px',
                background: isEven ? 'rgba(6,9,26,0.3)' : 'transparent',
                borderBottom: '1px solid rgba(245,158,11,0.03)',
              }}
            >
              {/* Timestamp */}
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 9,
                color: '#1e293b',
                flexShrink: 0,
                paddingTop: 1,
                width: 56,
                letterSpacing: '0.02em',
              }}>
                {time}
              </span>

              {/* Type badge */}
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 9,
                color: cfg.color,
                background: `${cfg.color}15`,
                padding: '0px 4px',
                borderRadius: 2,
                flexShrink: 0,
                paddingTop: 1,
                minWidth: 36,
                textAlign: 'center',
              }}>
                {cfg.label}
              </span>

              {/* Message */}
              <span style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 11,
                color: item.type === 'ai' ? '#94a3b8' : item.type === 'warn' ? '#f59e0b' : '#64748b',
                lineHeight: 1.4,
                flex: 1,
                wordBreak: 'break-word',
              }}>
                {item.msg}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
