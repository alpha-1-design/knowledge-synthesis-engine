import React, { useState, useEffect } from 'react';
import type { AIConfig } from '../types.js';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string | null;
}

const DEFAULT_CONFIG: AIConfig = {
  extractionProvider: 'gemini',
  synthesisProvider: 'openrouter',
  auditProvider: 'grok',
  ollamaEndpoint: 'http://localhost:11434',
  ollamaExtractionModel: 'llama3.2',
  ollamaSynthesisModel: 'llama3.2',
  ollamaAuditModel: 'llama3.2',
};

export function AIConfigDrawer({ isOpen, onClose, apiKey }: Props) {
  const [config, setConfig] = useState<AIConfig>(DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<'ok' | 'error' | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const apiFetch = async (url: string, init?: RequestInit) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiKey) headers['X-API-KEY'] = apiKey;
    if (init?.headers) Object.assign(headers, init.headers);
    return fetch(url, { ...init, headers });
  };

  useEffect(() => {
    if (!isOpen) return;
    apiFetch('/api/v1/config').then(async res => {
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) setConfig(json.data);
      }
    }).catch(() => {});
  }, [isOpen]);

  const handleSave = async () => {
    setSaving(true);
    setSaveResult(null);
    try {
      const res = await apiFetch('/api/v1/config', { method: 'POST', body: JSON.stringify(config) });
      setSaveResult(res.ok ? 'ok' : 'error');
    } catch {
      setSaveResult('error');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveResult(null), 3000);
    }
  };

  const handleTestOllama = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await apiFetch('/api/v1/config/test-ollama', { method: 'POST', body: JSON.stringify({ endpoint: config.ollamaEndpoint }) });
      if (res.ok) {
        const json = await res.json();
        setTestResult(`✓ Connected — ${json.models ?? 0} models available`);
      } else {
        setTestResult('✗ Connection failed');
      }
    } catch {
      setTestResult('✗ Connection failed');
    } finally {
      setTesting(false);
    }
  };

  const usesOllama = config.extractionProvider === 'ollama' || config.synthesisProvider === 'ollama' || config.auditProvider === 'ollama';

  if (!isOpen) return null;

  const inputStyle: React.CSSProperties = {
    background: 'rgba(6,9,26,0.8)',
    border: '1px solid rgba(245,158,11,0.2)',
    borderRadius: 4, padding: '6px 10px',
    fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#f1f5f9',
    outline: 'none', width: '100%',
  };

  const radioRow = (label: string, value: string, current: string, onChange: (v: string) => void) => (
    <label key={value} style={{
      display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
      padding: '5px 0',
    }}>
      <input
        type="radio"
        checked={current === value}
        onChange={() => onChange(value)}
        style={{ accentColor: '#f59e0b' }}
      />
      <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, color: current === value ? '#f1f5f9' : '#64748b' }}>
        {label}
      </span>
    </label>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 400,
        background: '#0d1424',
        borderLeft: '3px solid #f59e0b',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 16px 12px',
          borderBottom: '1px solid rgba(245,158,11,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              AI Providers
            </div>
            <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, color: '#64748b', marginTop: 2 }}>
              Configure knowledge extraction pipeline
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: '1px solid rgba(245,158,11,0.2)',
            color: '#64748b', borderRadius: 4, width: 28, height: 28,
            cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Extraction */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              Extraction
            </div>
            {radioRow('Gemini 1.5 Flash', 'gemini', config.extractionProvider,
              v => setConfig(c => ({ ...c, extractionProvider: v as AIConfig['extractionProvider'] })))}
            {radioRow('Local (Ollama)', 'ollama', config.extractionProvider,
              v => setConfig(c => ({ ...c, extractionProvider: v as AIConfig['extractionProvider'] })))}
          </div>

          <div style={{ height: 1, background: 'rgba(245,158,11,0.1)', marginBottom: 16 }} />

          {/* Synthesis */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              Synthesis
            </div>
            {radioRow('OpenRouter / Gemma-2', 'openrouter', config.synthesisProvider,
              v => setConfig(c => ({ ...c, synthesisProvider: v as AIConfig['synthesisProvider'] })))}
            {radioRow('Local (Ollama)', 'ollama', config.synthesisProvider,
              v => setConfig(c => ({ ...c, synthesisProvider: v as AIConfig['synthesisProvider'] })))}
          </div>

          <div style={{ height: 1, background: 'rgba(245,158,11,0.1)', marginBottom: 16 }} />

          {/* Audit */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              Audit
            </div>
            {radioRow('Grok Beta', 'grok', config.auditProvider,
              v => setConfig(c => ({ ...c, auditProvider: v as AIConfig['auditProvider'] })))}
            {radioRow('Local (Ollama)', 'ollama', config.auditProvider,
              v => setConfig(c => ({ ...c, auditProvider: v as AIConfig['auditProvider'] })))}
          </div>

          <div style={{ height: 1, background: 'rgba(245,158,11,0.1)', marginBottom: 16 }} />

          {/* Local AI Config */}
          <div style={{ opacity: usesOllama ? 1 : 0.45 }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Local AI Configuration
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <label style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#64748b', display: 'block', marginBottom: 3 }}>Endpoint URL</label>
                <input
                  style={inputStyle}
                  value={config.ollamaEndpoint}
                  onChange={e => setConfig(c => ({ ...c, ollamaEndpoint: e.target.value }))}
                  placeholder="http://localhost:11434"
                />
              </div>
              <div>
                <label style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#64748b', display: 'block', marginBottom: 3 }}>Extraction Model</label>
                <input
                  style={inputStyle}
                  value={config.ollamaExtractionModel}
                  onChange={e => setConfig(c => ({ ...c, ollamaExtractionModel: e.target.value }))}
                  placeholder="llama3.2"
                />
              </div>
              <div>
                <label style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#64748b', display: 'block', marginBottom: 3 }}>Synthesis Model</label>
                <input
                  style={inputStyle}
                  value={config.ollamaSynthesisModel}
                  onChange={e => setConfig(c => ({ ...c, ollamaSynthesisModel: e.target.value }))}
                  placeholder="llama3.2"
                />
              </div>
              <div>
                <label style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#64748b', display: 'block', marginBottom: 3 }}>Audit Model</label>
                <input
                  style={inputStyle}
                  value={config.ollamaAuditModel}
                  onChange={e => setConfig(c => ({ ...c, ollamaAuditModel: e.target.value }))}
                  placeholder="llama3.2"
                />
              </div>

              <button
                onClick={handleTestOllama}
                disabled={testing}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(34,211,238,0.4)',
                  borderRadius: 4, padding: '6px',
                  color: '#22d3ee',
                  fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
                  cursor: testing ? 'not-allowed' : 'pointer',
                }}
              >
                {testing ? '⟳ Testing...' : '⚡ Test Connection'}
              </button>

              {testResult && (
                <div style={{
                  padding: '6px 8px', borderRadius: 4,
                  background: testResult.startsWith('✓') ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${testResult.startsWith('✓') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
                  color: testResult.startsWith('✓') ? '#10b981' : '#ef4444',
                }}>
                  {testResult}
                </div>
              )}

              <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10, color: '#334155', lineHeight: 1.5 }}>
                Works with Ollama, LM Studio, Jan, or any OpenAI-compatible endpoint
              </p>
            </div>
          </div>
        </div>

        {/* Save button — sticky footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(245,158,11,0.12)', flexShrink: 0, marginTop: 'auto' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%', padding: '9px',
              background: saving ? 'rgba(245,158,11,0.3)' : '#f59e0b',
              border: 'none', borderRadius: 4,
              color: saving ? 'rgba(0,0,0,0.5)' : '#000',
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}
          >
            {saving ? 'Saving...' : '⊕ Save Configuration'}
          </button>
          {saveResult === 'ok' && (
            <div style={{ marginTop: 6, fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#10b981', textAlign: 'center' }}>
              ✓ Saved successfully
            </div>
          )}
          {saveResult === 'error' && (
            <div style={{ marginTop: 6, fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#ef4444', textAlign: 'center' }}>
              ✗ Save failed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
