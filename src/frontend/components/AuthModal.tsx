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
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(5,5,16,0.95)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="glass rounded-lg p-8 w-full max-w-sm"
        style={{ border: '1px solid rgba(0,212,255,0.3)', boxShadow: '0 0 40px rgba(0,212,255,0.1)' }}
      >
        <div className="text-center mb-6">
          <p className="text-2xl mb-2">🧬</p>
          <h1 className="text-sm font-bold tracking-widest mb-1" style={{ color: '#00d4ff' }}>
            KNOWLEDGE SYNTHESIS ENGINE
          </h1>
          <p className="text-xs" style={{ color: '#64748b' }}>Semantic Mesh — Secure Access</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs mb-1.5 block font-bold tracking-widest" style={{ color: '#64748b' }}>
              ADMIN API KEY
            </label>
            <input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter your X-API-KEY..."
              autoFocus
              className="w-full text-sm px-3 py-2.5 rounded outline-none"
              style={{
                background: 'rgba(0,212,255,0.05)',
                border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(0,212,255,0.2)'}`,
                color: '#e2e8f0',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {error && (
            <p className="text-xs" style={{ color: '#ef4444' }}>
              ⚠ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!value.trim()}
            className="text-xs font-bold py-2.5 px-4 rounded tracking-widest transition-all"
            style={{
              background: value.trim()
                ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(139,92,246,0.2))'
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${value.trim() ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: value.trim() ? '#00d4ff' : '#334155',
              cursor: value.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            ⚡ AUTHENTICATE
          </button>

          <p className="text-xs text-center mt-1" style={{ color: '#334155', lineHeight: 1.5 }}>
            This is the <code style={{ color: '#64748b' }}>ADMIN_API_KEY</code> secret you configured on the server.
          </p>
        </form>
      </div>
    </div>
  );
}
