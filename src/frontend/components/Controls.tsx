import React, { useState } from 'react';

interface Props {
  onTrigger: (seedQuery: string) => void;
  running: boolean;
}

const EXAMPLE_QUERIES = [
  'solid state battery materials',
  'neural plasticity and machine learning',
  'CRISPR gene editing therapeutics',
  'quantum computing error correction',
  'protein folding drug discovery',
];

export function Controls({ onTrigger, running }: Props) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTrigger(query.trim());
  };

  return (
    <div className="p-3 shrink-0" style={{ borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
      <div className="text-xs font-bold tracking-widest mb-3" style={{ color: '#00d4ff' }}>
        ◈ RESEARCH FOCUS
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter seed query..."
            className="w-full text-xs px-3 py-2 rounded outline-none"
            style={{
              background: 'rgba(0,212,255,0.05)',
              border: '1px solid rgba(0,212,255,0.2)',
              color: '#e2e8f0',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={running}
          className="text-xs font-bold py-2 px-3 rounded tracking-widest transition-all"
          style={{
            background: running
              ? 'rgba(0,212,255,0.1)'
              : 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(139,92,246,0.2))',
            border: `1px solid ${running ? 'rgba(0,212,255,0.2)' : 'rgba(0,212,255,0.4)'}`,
            color: running ? '#334155' : '#00d4ff',
            cursor: running ? 'not-allowed' : 'pointer',
          }}
        >
          {running ? '⟳ SCOUT ACTIVE...' : '⚡ TRIGGER AUTONOMOUS SCOUT'}
        </button>
      </form>

      <div className="mt-3">
        <p className="text-xs mb-1.5" style={{ color: '#334155' }}>Quick queries:</p>
        <div className="flex flex-wrap gap-1">
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => setQuery(q)}
              className="text-xs px-2 py-0.5 rounded transition-colors"
              style={{
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.2)',
                color: '#8b5cf6',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
