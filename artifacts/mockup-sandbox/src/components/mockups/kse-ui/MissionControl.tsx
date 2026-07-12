import React from 'react';

export default function MissionControl() {
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden text-slate-300 font-sans" style={{ backgroundColor: '#0a0c10', fontFamily: '"IBM Plex Sans", sans-serif' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        .bg-panel { background-color: #111318; }
        .text-amber { color: #f59e0b; }
        .bg-amber { background-color: #f59e0b; }
        .border-amber { border-color: #f59e0b; }
        
        .section-header {
          text-transform: uppercase;
          color: #f59e0b;
          border-left: 3px solid #f59e0b;
          padding-left: 8px;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 600;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }
        
        .thin-rule {
          height: 1px;
          background-color: rgba(255,255,255,0.1);
          margin: 16px 0;
        }

        .grid-bg {
          background-size: 40px 40px;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .blinking-cursor {
          animation: blink 1s step-end infinite;
        }
      `}} />

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-panel border-b border-white/10 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="text-amber font-mono font-semibold tracking-wider text-sm">
            KSE // COMMAND
          </div>
          <div className="px-2 py-0.5 bg-amber/10 border border-amber/30 text-amber font-mono text-xs rounded-sm">
            V 2.4.1
          </div>
        </div>
        <div className="flex items-center space-x-6 font-mono text-xs text-slate-400">
          <div className="flex space-x-4">
            <div>NODES: <span className="text-white">142</span></div>
            <div>LINKS: <span className="text-white">87</span></div>
            <div>VERIFIED: <span className="text-green-500">23</span></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
            <span className="text-green-500 tracking-widest">SYS.ONLINE</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar */}
        <div className="w-[300px] bg-panel border-r border-white/10 flex flex-col shrink-0 p-4 overflow-y-auto">
          
          <div className="section-header">Research Focus</div>
          <div className="flex flex-col space-y-3 mb-2">
            <div className="relative">
              <input 
                type="text" 
                defaultValue="Cross-domain material science"
                className="w-full bg-[#0a0c10] border border-white/20 p-2 text-sm text-white font-mono focus:outline-none focus:border-amber transition-colors"
              />
              <div className="absolute right-2 top-2 w-2 h-4 bg-amber/50 blinking-cursor"></div>
            </div>
            <button className="w-full bg-amber/10 hover:bg-amber/20 border border-amber/50 text-amber font-mono text-xs py-2 transition-colors uppercase tracking-widest cursor-pointer">
              Trigger Scout
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {['bio-inspired computing', 'quantum networks', 'neuromorphic design'].map((chip, i) => (
              <div key={i} className="text-[10px] font-mono text-slate-400 border border-white/10 px-2 py-1 bg-[#0a0c10] cursor-pointer hover:border-amber/50 hover:text-amber transition-colors">
                [{chip}]
              </div>
            ))}
          </div>

          <div className="thin-rule"></div>

          <div className="section-header flex justify-between items-center">
            Synthesis Proposals
          </div>

          <div className="flex flex-col space-y-3">
            {/* Proposal 1 */}
            <div className="flex flex-col bg-[#0a0c10] border-l-2 border-green-500 p-2 text-xs">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-green-500 text-[10px] bg-green-500/10 px-1 border border-green-500/20">VERIFIED</span>
                <span className="font-mono text-[10px] text-slate-500">TRU:94%</span>
              </div>
              <div className="font-mono text-white mb-2 leading-tight">
                Ion transport mechanics may inform transformer attention routing
              </div>
              <div className="flex space-x-1">
                <div className="h-1 flex-1 bg-green-500/20"><div className="h-full bg-green-500 w-[94%]"></div></div>
              </div>
            </div>

            {/* Proposal 2 */}
            <div className="flex flex-col bg-[#0a0c10] border-l-2 border-amber-500 p-2 text-xs">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-amber-500 text-[10px] bg-amber-500/10 px-1 border border-amber-500/20">WARNING</span>
                <span className="font-mono text-[10px] text-slate-500">TRU:61%</span>
              </div>
              <div className="font-mono text-white mb-2 leading-tight">
                Neural plasticity could mirror solid electrolyte charge dynamics
              </div>
              <div className="flex space-x-1">
                <div className="h-1 flex-1 bg-amber-500/20"><div className="h-full bg-amber-500 w-[61%]"></div></div>
              </div>
            </div>

            {/* Proposal 3 */}
            <div className="flex flex-col bg-[#0a0c10] border-l-2 border-slate-600 p-2 text-xs opacity-70">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-slate-400 text-[10px] bg-slate-400/10 px-1 border border-slate-600/20">PENDING</span>
                <span className="font-mono text-[10px] text-slate-500">TRU:--%</span>
              </div>
              <div className="font-mono text-white mb-2 leading-tight">
                Evaluating structural analogies between mycelium networks and IPFS
              </div>
              <div className="flex space-x-1">
                <div className="h-1 flex-1 bg-slate-700/50"></div>
              </div>
            </div>
          </div>

        </div>

        {/* Center Canvas */}
        <div className="flex-1 relative bg-[#0a0c10] grid-bg overflow-hidden flex flex-col">
          {/* Coordinates and Overlays */}
          <div className="absolute top-4 left-4 font-mono text-[10px] text-slate-600 pointer-events-none">
            LAT: 34.0205 // LNG: -118.2854<br/>
            PROJECTION: ORTHOGRAPHIC<br/>
            T: {new Date().toISOString().split('T')[1].slice(0, 8)}Z
          </div>
          
          <div className="absolute bottom-4 right-4 flex space-x-4 font-mono text-[10px] pointer-events-none">
            <div className="flex items-center space-x-1"><div className="w-2 h-2 bg-blue-500"></div><span className="text-slate-500">ENG</span></div>
            <div className="flex items-center space-x-1"><div className="w-2 h-2 bg-purple-500"></div><span className="text-slate-500">BIO</span></div>
            <div className="flex items-center space-x-1"><div className="w-2 h-2 bg-emerald-500"></div><span className="text-slate-500">CHEM</span></div>
            <div className="flex items-center space-x-1"><div className="w-2 h-2 bg-amber-500"></div><span className="text-slate-500">CS</span></div>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <svg width="100%" height="100%" className="absolute inset-0 z-0">
              {/* Connection Lines */}
              <g stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none">
                {/* Engineering <-> CS */}
                <line x1="30%" y1="30%" x2="70%" y2="40%" />
                <polygon points="50%,35% 49%,34% 49%,36%" fill="rgba(255,255,255,0.4)" />
                
                {/* CS <-> Bio */}
                <line x1="70%" y1="40%" x2="60%" y2="70%" />
                
                {/* Engineering <-> Chem */}
                <line x1="30%" y1="30%" x2="35%" y2="65%" strokeDasharray="4 4" stroke="rgba(245, 158, 11, 0.4)" />
                <polygon points="32.5%,47.5% 31.5%,46% 33.5%,46%" fill="rgba(245, 158, 11, 0.6)" transform="rotate(-75 32.5 47.5)" />
                
                {/* Bio <-> Chem */}
                <line x1="60%" y1="70%" x2="35%" y2="65%" />
                
                {/* Local lines */}
                <line x1="30%" y1="30%" x2="25%" y2="20%" />
                <line x1="70%" y1="40%" x2="80%" y2="35%" />
                <line x1="60%" y1="70%" x2="65%" y2="85%" />
                <line x1="35%" y1="65%" x2="20%" y2="75%" />
              </g>

              {/* Focus highlight ring */}
              <circle cx="70%" cy="40%" r="40" fill="none" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1" strokeDasharray="2 4" />
              <circle cx="70%" cy="40%" r="50" fill="none" stroke="rgba(245, 158, 11, 0.1)" strokeWidth="1" />
            </svg>

            {/* Nodes */}
            <div className="absolute top-[20%] left-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <div className="w-3 h-3 bg-blue-500 border border-blue-300"></div>
              <div className="mt-2 text-center">
                <div className="font-mono text-[9px] text-blue-400">#A9B2</div>
              </div>
            </div>
            
            <div className="absolute top-[30%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <div className="w-4 h-4 bg-blue-500 border border-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              <div className="mt-2 text-center">
                <div className="font-mono text-[10px] text-blue-400">Solid Electrolyte Interfaces</div>
                <div className="font-mono text-[8px] text-slate-500">[ENG] 8 NODES</div>
              </div>
            </div>

            <div className="absolute top-[35%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <div className="w-3 h-3 bg-amber-500 border border-amber-300"></div>
              <div className="mt-2 text-center">
                <div className="font-mono text-[9px] text-amber-400">#C4F1</div>
              </div>
            </div>

            <div className="absolute top-[40%] left-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 pointer-events-none">
              <div className="w-4 h-4 bg-amber-500 border border-white shadow-[0_0_15px_rgba(245,158,11,0.8)] animate-pulse"></div>
              <div className="mt-2 text-center bg-[#0a0c10]/80 p-1 border border-white/10 backdrop-blur-sm">
                <div className="font-mono text-[11px] text-white">Transformer Attention Patterns</div>
                <div className="font-mono text-[9px] text-amber-400">ACTIVE TARGET // [CS]</div>
              </div>
            </div>

            <div className="absolute top-[70%] left-[60%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <div className="w-4 h-4 bg-purple-500 border border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
              <div className="mt-2 text-center">
                <div className="font-mono text-[10px] text-purple-400">Neural Plasticity Adaptation</div>
                <div className="font-mono text-[8px] text-slate-500">[BIO] 12 NODES</div>
              </div>
            </div>
            
            <div className="absolute top-[85%] left-[65%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <div className="w-3 h-3 bg-purple-500 border border-purple-300"></div>
            </div>

            <div className="absolute top-[65%] left-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <div className="w-4 h-4 bg-emerald-500 border border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <div className="mt-2 text-center">
                <div className="font-mono text-[10px] text-emerald-400">Ion Transport Mechanisms</div>
                <div className="font-mono text-[8px] text-slate-500">[CHEM] 4 NODES</div>
              </div>
            </div>
            
            <div className="absolute top-[75%] left-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <div className="w-3 h-3 bg-emerald-500 border border-emerald-300"></div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[300px] bg-panel border-l border-white/10 flex flex-col shrink-0 p-4">
          <div className="section-header">Intelligence Feed</div>
          
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col space-y-3 font-mono text-[10px]">
            {/* Feed Item */}
            <div className="flex items-start space-x-2 pb-2 border-b border-white/5">
              <div className="w-10 text-slate-500 shrink-0">14:02:11</div>
              <div className="w-8 text-blue-400 shrink-0 border border-blue-400/30 bg-blue-400/10 text-center text-[9px] py-0.5">SYS</div>
              <div className="text-slate-300 break-words leading-tight">
                🔭 Scout cycle initiated. Target parameters defined.
              </div>
            </div>

            <div className="flex items-start space-x-2 pb-2 border-b border-white/5">
              <div className="w-10 text-slate-500 shrink-0">14:02:15</div>
              <div className="w-8 text-blue-400 shrink-0 border border-blue-400/30 bg-blue-400/10 text-center text-[9px] py-0.5">SYS</div>
              <div className="text-slate-300 break-words leading-tight">
                📚 Retrieved 5 recent papers from ArXiv (cs.NE, cond-mat.mtrl-sci).
              </div>
            </div>

            <div className="flex items-start space-x-2 pb-2 border-b border-white/5">
              <div className="w-10 text-slate-500 shrink-0">14:02:22</div>
              <div className="w-8 text-emerald-400 shrink-0 border border-emerald-400/30 bg-emerald-400/10 text-center text-[9px] py-0.5">AI</div>
              <div className="text-slate-300 break-words leading-tight">
                ✅ Indexed node: <span className="text-white">Solid Electrolyte Interfaces [Engineering]</span>. Extracting entities...
              </div>
            </div>

            <div className="flex items-start space-x-2 pb-2 border-b border-white/5">
              <div className="w-10 text-slate-500 shrink-0">14:02:45</div>
              <div className="w-8 text-amber-500 shrink-0 border border-amber-500/30 bg-amber-500/10 text-center text-[9px] py-0.5">WARN</div>
              <div className="text-amber-400 break-words leading-tight">
                ⚠️ Low confidence extraction on "Neural Plasticity" sub-domain. Proceeding with caution.
              </div>
            </div>

            <div className="flex items-start space-x-2 pb-2 border-b border-white/5 bg-white/5 p-2 -mx-2 rounded-sm border border-white/10">
              <div className="w-10 text-slate-500 shrink-0 mt-0.5">14:03:01</div>
              <div className="w-8 text-purple-400 shrink-0 border border-purple-400/30 bg-purple-400/10 text-center text-[9px] py-0.5 mt-0.5">SYN</div>
              <div className="text-white break-words leading-tight">
                ⚗️ Synthesizing: Ion Transport × Transformer Attention
                <div className="mt-1 text-slate-400 text-[9px]">Generating cross-domain bridge...</div>
              </div>
            </div>

            <div className="flex items-start space-x-2 pb-2 border-b border-white/5">
              <div className="w-10 text-slate-500 shrink-0">14:03:30</div>
              <div className="w-8 text-green-500 shrink-0 border border-green-500/30 bg-green-500/10 text-center text-[9px] py-0.5">AUDIT</div>
              <div className="text-green-400 break-words leading-tight">
                ✅ [CLEAN] Hypothesis verified. Plausibility score: 94%. Appending to proposals.
              </div>
            </div>
            
            {/* Blinking indicator for next action */}
            <div className="flex items-start space-x-2 pt-1 opacity-50">
              <div className="w-10 text-slate-600 shrink-0">--:--:--</div>
              <div className="w-8 shrink-0 flex justify-center"><div className="w-1 h-3 bg-amber-500 blinking-cursor mt-0.5"></div></div>
              <div className="text-slate-500 italic mt-0.5">Listening for events...</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
