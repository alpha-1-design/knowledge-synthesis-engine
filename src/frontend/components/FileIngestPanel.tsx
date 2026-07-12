import React, { useState, useRef, useCallback } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string | null;
  onIngested: () => void;
}

type Phase = 'idle' | 'uploading' | 'extracting' | 'mapping' | 'done' | 'error';

const PHASE_MESSAGES: Record<Phase, string> = {
  idle: '',
  uploading: 'Uploading...',
  extracting: 'Extracting concepts...',
  mapping: 'Mapping bridges...',
  done: '',
  error: '',
};

export function FileIngestPanel({ isOpen, onClose, apiKey, onIngested }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<{ nodesAdded: number; linksAdded: number; proposalsGenerated?: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const apiFetch = useCallback(async (url: string, init?: RequestInit) => {
    const headers: Record<string, string> = {};
    if (apiKey) headers['X-API-KEY'] = apiKey;
    if (init?.headers) Object.assign(headers, init.headers);
    return fetch(url, { ...init, headers });
  }, [apiKey]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleFileSubmit = async () => {
    if (!selectedFile) return;
    setPhase('uploading');
    setResult(null);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      await new Promise(r => setTimeout(r, 400));
      setPhase('extracting');
      const res = await apiFetch('/api/v1/ingest/file', { method: 'POST', body: formData });
      await new Promise(r => setTimeout(r, 400));
      setPhase('mapping');
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();
      await new Promise(r => setTimeout(r, 300));
      setPhase('done');
      setResult({ nodesAdded: json.nodesAdded ?? 0, linksAdded: json.linksAdded ?? 0, proposalsGenerated: json.proposalsGenerated ?? 0 });
      onIngested();
      setTimeout(() => { setPhase('idle'); setSelectedFile(null); setResult(null); onClose(); }, 3000);
    } catch (err: any) {
      setPhase('error');
      setErrorMsg(err?.message ?? 'Unknown error');
    }
  };

  const handleTextSubmit = async () => {
    if (!textContent.trim()) return;
    setPhase('uploading');
    setResult(null);
    setErrorMsg('');
    try {
      await new Promise(r => setTimeout(r, 300));
      setPhase('extracting');
      const res = await apiFetch('/api/v1/ingest/text', {
        method: 'POST',
        body: JSON.stringify({ content: textContent.trim(), title: textTitle.trim() || 'Untitled' }),
        headers: { 'Content-Type': 'application/json' },
      });
      await new Promise(r => setTimeout(r, 400));
      setPhase('mapping');
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();
      await new Promise(r => setTimeout(r, 300));
      setPhase('done');
      setResult({ nodesAdded: json.nodesAdded ?? 0, linksAdded: json.linksAdded ?? 0 });
      onIngested();
      setTimeout(() => { setPhase('idle'); setTextContent(''); setTextTitle(''); setResult(null); onClose(); }, 3000);
    } catch (err: any) {
      setPhase('error');
      setErrorMsg(err?.message ?? 'Unknown error');
    }
  };

  const handleClose = () => {
    if (phase === 'uploading' || phase === 'extracting' || phase === 'mapping') return;
    setPhase('idle');
    setSelectedFile(null);
    setTextContent('');
    setTextTitle('');
    setResult(null);
    setErrorMsg('');
    onClose();
  };

  if (!isOpen) return null;

  const busy = phase === 'uploading' || phase === 'extracting' || phase === 'mapping';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(6,9,26,0.88)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#0d1424',
        border: '1px solid rgba(245,158,11,0.3)',
        borderTop: '3px solid #f59e0b',
        borderRadius: 8,
        width: '100%',
        maxWidth: 480,
        maxHeight: '88vh',
        overflowY: 'auto',
        padding: '20px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 12,
              fontWeight: 600,
              color: '#f59e0b',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Ingest Knowledge Source
            </div>
            <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, color: '#64748b', marginTop: 2 }}>
              Extract concepts and map cross-domain connections
            </div>
          </div>
          <button onClick={handleClose} style={{
            background: 'transparent', border: '1px solid rgba(245,158,11,0.2)',
            color: '#64748b', borderRadius: 4, width: 28, height: 28,
            cursor: busy ? 'not-allowed' : 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !busy && fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? '#f59e0b' : 'rgba(245,158,11,0.35)'}`,
            borderRadius: 6,
            padding: '24px 16px',
            textAlign: 'center',
            cursor: busy ? 'not-allowed' : 'pointer',
            background: dragOver ? 'rgba(245,158,11,0.05)' : 'rgba(6,9,26,0.5)',
            transition: 'all 0.15s',
            marginBottom: 10,
          }}
        >
          <div style={{ fontSize: 24, marginBottom: 6 }}>📂</div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#f59e0b' }}>
            Drop files here or click to browse
          </div>
          <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10, color: '#64748b', marginTop: 4 }}>
            Supported: PDF, TXT, MD, DOCX
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept=".pdf,.txt,.md,.docx" onChange={handleFileChange} style={{ display: 'none' }} />

        {/* Format badges */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 14, flexWrap: 'wrap' }}>
          {['PDF', 'TXT', 'MD', 'DOCX'].map(fmt => (
            <span key={fmt} style={{
              padding: '1px 7px', borderRadius: 999,
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.2)',
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#f59e0b',
            }}>{fmt}</span>
          ))}
        </div>

        {/* Selected file preview */}
        {selectedFile && (
          <div style={{
            background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 4, padding: '8px 10px', marginBottom: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#f1f5f9' }}>{selectedFile.name}</div>
              <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10, color: '#64748b', marginTop: 2 }}>
                {(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.type || 'unknown'}
              </div>
            </div>
            <button onClick={() => setSelectedFile(null)} style={{
              background: 'transparent', border: 'none', color: '#64748b',
              cursor: 'pointer', fontSize: 14, padding: 0,
            }}>×</button>
          </div>
        )}

        {/* File submit */}
        {selectedFile && (
          <button
            onClick={handleFileSubmit}
            disabled={busy}
            style={{
              width: '100%', padding: '9px', marginBottom: 16,
              background: busy ? 'rgba(245,158,11,0.3)' : '#f59e0b',
              border: 'none', borderRadius: 4,
              color: busy ? 'rgba(0,0,0,0.5)' : '#000',
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 600,
              cursor: busy ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}
          >
            {busy ? PHASE_MESSAGES[phase] : '⊕ Extract & Map'}
          </button>
        )}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(245,158,11,0.1)' }} />
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#334155' }}>ALSO TRY</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(245,158,11,0.1)' }} />
        </div>

        {/* Text paste area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            type="text"
            placeholder="Title (optional)"
            value={textTitle}
            onChange={e => setTextTitle(e.target.value)}
            disabled={busy}
            style={{
              background: 'rgba(6,9,26,0.8)', border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 4, padding: '7px 10px',
              fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, color: '#f1f5f9',
              outline: 'none',
            }}
          />
          <textarea
            placeholder="Paste raw text, research notes, paper excerpts..."
            value={textContent}
            onChange={e => setTextContent(e.target.value)}
            disabled={busy}
            rows={4}
            style={{
              background: 'rgba(6,9,26,0.8)', border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 4, padding: '7px 10px',
              fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, color: '#f1f5f9',
              outline: 'none', resize: 'vertical',
            }}
          />
          {textContent.trim() && (
            <button
              onClick={handleTextSubmit}
              disabled={busy}
              style={{
                padding: '9px',
                background: busy ? 'rgba(245,158,11,0.3)' : '#f59e0b',
                border: 'none', borderRadius: 4,
                color: busy ? 'rgba(0,0,0,0.5)' : '#000',
                fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 600,
                cursor: busy ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}
            >
              {busy ? PHASE_MESSAGES[phase] : '⊕ Extract & Map Text'}
            </button>
          )}
        </div>

        {/* Status / result */}
        {busy && (
          <div style={{
            marginTop: 14, padding: '8px 10px',
            background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 4, fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#f59e0b',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ display: 'inline-block', animation: 'pulse-glow 1s ease-in-out infinite' }}>◈</span>
            {PHASE_MESSAGES[phase]}
          </div>
        )}

        {phase === 'done' && result && (
          <div style={{
            marginTop: 14, padding: '8px 10px',
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 4,
          }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#10b981' }}>
              ✓ {result.nodesAdded} nodes added, {result.linksAdded} cross-domain bridges found
              {result.proposalsGenerated ? `, ${result.proposalsGenerated} proposals generated` : ''}
            </div>
          </div>
        )}

        {phase === 'error' && (
          <div style={{
            marginTop: 14, padding: '8px 10px',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 4,
          }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#ef4444' }}>
              ✗ {errorMsg || 'Ingestion failed'}
            </div>
            <button onClick={() => setPhase('idle')} style={{
              marginTop: 6, background: 'transparent', border: 'none',
              color: '#64748b', fontSize: 11, cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace',
            }}>Dismiss</button>
          </div>
        )}
      </div>
    </div>
  );
}
