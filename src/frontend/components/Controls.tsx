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
    if (query.trim()) onTrigger(query.trim());
  };

  return (
    <div style={{ padding: '12px 12px 10px', borderBottom: '1px solid rgba(245,158,11,0.12)', flexShrink: 0 }}>
      {/* Section header */}
      <div style={{
        borderLeft: '3px solid #f59e0b',
        paddingLeft: 8,
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 11,
        fontWeight: 600,
        color: '#f59e0b',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        paddingBottom: 6,
        marginBottom: 10,
        borderBottom: '1px solid rgba(245,158,11,0.15)',
      }}>
        ◈ Research Focus
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter seed query..."
          style={{
            background: 'rgba(6,9,26,0.8)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 4,
            padding: '7px 10px',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 11,
            color: '#f1f5f9',
            outline: 'none',
            width: '100%',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(245,158,11,0.6)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(245,158,11,0.2)')}
        />

        <button
          type="submit"
          disabled={running || !query.trim()}
          style={{
            background: running ? 'rgba(245,158,11,0.15)' : '#f59e0b',
            border: 'none',
            borderRadius: 4,
            padding: '8px',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 11,
            fontWeight: 600,
            color: running ? 'rgba(245,158,11,0.5)' : '#000',
            cursor: (running || !query.trim()) ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            transition: 'all 0.15s',
          }}
        >
          {running ? '⟳ Scout Active...' : '⚡ Trigger Scout'}
        </button>
      </form>

      {/* Quick query chips */}
      <div style={{ marginTop: 10 }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
          Quick queries
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => setQuery(q)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(245,158,11,0.25)',
                borderRadius: 3,
                padding: '2px 6px',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 10,
                color: '#f59e0b',
                cursor: 'pointer',
                transition: 'all 0.12s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,158,11,0.12)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,158,11,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,158,11,0.25)';
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
