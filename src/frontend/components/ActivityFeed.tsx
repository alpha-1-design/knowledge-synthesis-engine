import React from 'react';
import type { ActivityItem } from '../types.js';

interface Props {
  items: ActivityItem[];
}

const TYPE_CONFIG = {
  ai: { color: '#00d4ff', prefix: '◈ AI' },
  info: { color: '#64748b', prefix: '· SYS' },
  warn: { color: '#f59e0b', prefix: '⚠ WARN' },
};

export function ActivityFeed({ items }: Props) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="px-3 py-2 text-xs font-bold tracking-widest shrink-0"
        style={{ color: '#00d4ff', borderBottom: '1px solid rgba(0,212,255,0.15)' }}
      >
        ◈ INTELLIGENCE FEED
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {items.length === 0 && (
          <p className="text-xs p-2" style={{ color: '#334155' }}>
            Awaiting scout activity...
          </p>
        )}
        {items.map((item) => {
          const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.info;
          const time = new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          });
          return (
            <div
              key={item.id}
              className="rounded p-2 text-xs"
              style={{
                background: item.type === 'ai' ? 'rgba(0,212,255,0.05)' : 'transparent',
                border: item.type === 'ai' ? '1px solid rgba(0,212,255,0.1)' : '1px solid transparent',
              }}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold" style={{ color: cfg.color, fontSize: 10 }}>
                  {cfg.prefix}
                </span>
                <span style={{ color: '#334155', fontSize: 10 }}>{time}</span>
              </div>
              <p style={{ color: item.type === 'ai' ? '#e2e8f0' : '#64748b', lineHeight: 1.4 }}>
                {item.msg}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
