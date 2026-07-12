import React, { useState } from 'react';

interface Props {
  onSubmit: (key: string) => void;
  error?: string;
}

export function AuthModal({ onSubmit, error }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50, background: 'rgba(6,9,26,0.95)', backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        background: '#0d1424',
        border: '2px solid rgba(245,158,11,0.25)',
        borderTop: '3px solid #f59e0b',
        borderRadius: 8,
        padding: '28px 28px 24px',
        width: '100%',
        maxWidth: 360,
        boxShadow: '0 0 40px rgba(245,158,11,0.08)',
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>⬡</div>
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 12,
            fontWeight: 600,
            color: '#f59e0b',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 4,
          }}>
            Authentication Required
          </div>
          <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, color: '#64748b' }}>
            Knowledge Synthesis Engine — Secure Access
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <label style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 10,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'block',
              marginBottom: 5,
            }}>
              Admin API Key
            </label>
            <input
              type="password"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Enter your X-API-KEY..."
              autoFocus
              style={{
                width: '100%',
                background: 'rgba(6,9,26,0.8)',
                border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(245,158,11,0.25)'}`,
                borderRadius: 4,
                padding: '8px 10px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 12,
                color: '#f1f5f9',
                outline: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = error ? 'rgba(239,68,68,0.6)' : 'rgba(245,158,11,0.6)')}
              onBlur={e => (e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'rgba(245,158,11,0.25)')}
            />
          </div>

          {error && (
            <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, color: '#ef4444' }}>
              ⚠ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!value.trim()}
            style={{
              padding: '9px',
              background: value.trim() ? '#f59e0b' : 'rgba(245,158,11,0.08)',
              border: 'none',
              borderRadius: 4,
              color: value.trim() ? '#000' : '#334155',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 12,
              fontWeight: 600,
              cursor: value.trim() ? 'pointer' : 'not-allowed',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginTop: 4,
            }}
          >
            ⚡ Authenticate
          </button>

          <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10, color: '#334155', textAlign: 'center', lineHeight: 1.5 }}>
            This is the <code style={{ color: '#64748b', fontFamily: 'IBM Plex Mono, monospace' }}>ADMIN_API_KEY</code> secret configured on the server.
          </p>
        </form>
      </div>
    </div>
  );
}
