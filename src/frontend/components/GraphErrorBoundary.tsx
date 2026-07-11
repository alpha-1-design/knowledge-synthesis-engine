import React from 'react';

interface State { error: Error | null }

export class GraphErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full" style={{ color: '#64748b' }}>
          <p className="text-4xl mb-4">🌌</p>
          <p className="text-sm font-bold tracking-widest mb-2" style={{ color: '#f59e0b' }}>
            3D RENDERER UNAVAILABLE
          </p>
          <p className="text-xs text-center max-w-xs" style={{ color: '#334155', lineHeight: 1.6 }}>
            WebGL is not supported in this environment. The graph will render in your browser's preview pane.
          </p>
          <p className="text-xs mt-3 px-3 py-1.5 rounded font-mono" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
            {this.state.error.message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
