import React, { useEffect, useState } from "react";
import { Activity, Cpu, Database, Network, Search, Terminal, Zap, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function Neural() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-black text-[#00fff0] overflow-hidden selection:bg-[#ff00aa] selection:text-white" style={{ fontFamily: "'Space Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        .grid-bg {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(0, 255, 240, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 240, 0.03) 1px, transparent 1px);
        }
        
        .panel {
          background-color: rgba(0, 255, 240, 0.02);
          border: 1px solid rgba(0, 255, 240, 0.3);
          box-shadow: inset 0 0 20px rgba(0, 255, 240, 0.02);
        }
        
        .glow-text {
          text-shadow: 0 0 8px rgba(0, 255, 240, 0.6);
        }
        
        .glow-border {
          box-shadow: 0 0 10px rgba(0, 255, 240, 0.2), inset 0 0 10px rgba(0, 255, 240, 0.1);
        }
        
        .glow-border-active {
          box-shadow: 0 0 15px rgba(0, 255, 240, 0.6), inset 0 0 15px rgba(0, 255, 240, 0.2);
          border-color: #00fff0;
        }

        .magenta-glow {
          text-shadow: 0 0 8px rgba(255, 0, 170, 0.8);
          color: #ff00aa;
        }

        .magenta-border {
          border-color: #ff00aa;
          box-shadow: 0 0 10px rgba(255, 0, 170, 0.3), inset 0 0 10px rgba(255, 0, 170, 0.1);
        }

        .node-pulse {
          animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        .status-clean { color: #00ffaa; text-shadow: 0 0 8px rgba(0, 255, 170, 0.8); }
        .status-warn { color: #ffaa00; text-shadow: 0 0 8px rgba(255, 170, 0, 0.8); animation: strobe 1.5s infinite; }
        .status-rejected { color: #ff0055; text-shadow: 0 0 8px rgba(255, 0, 85, 0.8); }
        .status-pending { color: #00fff0; text-shadow: 0 0 8px rgba(0, 255, 240, 0.6); animation: blink 2s infinite; }

        @keyframes strobe {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        /* Custom scrollbar for terminal feed */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(0,255,240,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(0,255,240,0.3); }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,255,240,0.6); }
        
        .crt-overlay {
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
          background-size: 100% 4px;
          z-index: 100;
          opacity: 0.1;
        }
      `}</style>

      <div className="crt-overlay"></div>

      {/* Top Bar */}
      <header className="h-10 border-b border-[#00fff0]/30 flex items-center justify-between px-4 bg-black z-10 shrink-0 shadow-[0_0_15px_rgba(0,255,240,0.1)]">
        <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#00fff0] glow-text" />
            <span className="glow-text">K.S.E. // Neural Core</span>
          </div>
          <div className="px-2 py-0.5 bg-[#00fff0]/10 border border-[#00fff0]/50 text-[#00fff0] text-[10px]">
            v2.0.4-BETA
          </div>
        </div>
        <div className="flex items-center gap-6 text-[10px] uppercase">
          <div className="flex items-center gap-2">
            <Network className="w-3 h-3 opacity-60" />
            <span>Nodes: <span className="text-[#00fff0] glow-text">14,293</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-3 h-3 opacity-60" />
            <span>Links: <span className="text-[#00fff0] glow-text">42,109</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 opacity-60" />
            <span>Verified: <span className="text-[#00ffaa] status-clean">831</span></span>
          </div>
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-[#00fff0]/30">
            <div className="w-2 h-2 rounded-full bg-[#00ffaa] shadow-[0_0_8px_#00ffaa]"></div>
            <span className="text-[#00ffaa] tracking-widest status-clean">ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative z-0">
        <div className="absolute inset-0 grid-bg z-[-1]"></div>

        {/* Left Sidebar - Control Panel */}
        <aside className="w-[320px] h-full flex flex-col border-r border-[#00fff0]/30 panel shrink-0 z-10">
          <div className="p-4 border-b border-[#00fff0]/20">
            <div className="text-[10px] uppercase text-[#00fff0]/60 mb-2 tracking-widest">Target Vector</div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#00fff0]/50" />
              <input 
                type="text" 
                defaultValue="cross-domain emergent structures"
                className="w-full bg-black border border-[#00fff0]/40 text-[#00fff0] text-xs py-2 pl-9 pr-3 focus:outline-none focus:border-[#00fff0] focus:shadow-[0_0_10px_rgba(0,255,240,0.3)] transition-all placeholder:text-[#00fff0]/30"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {['bio-inspired', 'quantum-info', 'neural-chem'].map((chip) => (
                <button key={chip} className="text-[9px] px-2 py-1 border border-[#00fff0]/30 bg-[#00fff0]/5 text-[#00fff0]/80 hover:bg-[#00fff0]/20 hover:text-[#00fff0] transition-colors">
                  {chip}
                </button>
              ))}
            </div>

            <button className="w-full mt-4 bg-transparent border border-[#ff00aa] text-[#ff00aa] py-2 text-xs font-bold uppercase tracking-wider magenta-border hover:bg-[#ff00aa]/10 transition-all flex items-center justify-center gap-2 group">
              <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="magenta-glow">Trigger Scout Cycle</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            <div className="text-[10px] uppercase text-[#00fff0]/60 tracking-widest flex justify-between items-center mb-2">
              <span>Synthesis Proposals</span>
              <span className="text-[#00fff0]">3 ACTIVE</span>
            </div>

            {/* Proposal 1 */}
            <div className="border border-[#00ffaa]/40 bg-[#00ffaa]/5 p-3 relative group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ffaa] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold status-clean flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> [CLEAN]
                </span>
                <span className="text-[9px] text-[#00fff0]/50">ID: 0x8A4B</span>
              </div>
              <p className="text-xs text-[#00fff0] leading-relaxed mb-3">
                &gt; Ion transport mechanics may inform transformer attention routing via electrostatic analogy.
              </p>
              <div className="flex items-center gap-2">
                <div className="text-[9px] text-[#00fff0]/60">CONFIDENCE</div>
                <div className="flex-1 h-1.5 bg-black border border-[#00fff0]/30 overflow-hidden">
                  <div className="h-full bg-[#00ffaa] w-[94%] shadow-[0_0_5px_#00ffaa]"></div>
                </div>
                <div className="text-[9px] text-[#00ffaa]">0.94</div>
              </div>
            </div>

            {/* Proposal 2 */}
            <div className="border border-[#ffaa00]/40 bg-[#ffaa00]/5 p-3 relative group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ffaa00] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold status-warn flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> [WARN]
                </span>
                <span className="text-[9px] text-[#00fff0]/50">ID: 0x9F2C</span>
              </div>
              <p className="text-xs text-[#00fff0]/80 leading-relaxed mb-3">
                &gt; Neural plasticity could mirror solid electrolyte charge dynamics in low-temperature environments.
              </p>
              <div className="flex items-center gap-2">
                <div className="text-[9px] text-[#00fff0]/60">CONFIDENCE</div>
                <div className="flex-1 h-1.5 bg-black border border-[#00fff0]/30 overflow-hidden">
                  <div className="h-full bg-[#ffaa00] w-[62%] shadow-[0_0_5px_#ffaa00]"></div>
                </div>
                <div className="text-[9px] text-[#ffaa00]">0.62</div>
              </div>
            </div>

            {/* Proposal 3 */}
            <div className="border border-[#00fff0]/20 bg-[#00fff0]/5 p-3 relative group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00fff0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold status-pending flex items-center gap-1">
                  <Clock className="w-3 h-3" /> [CALCULATING]
                </span>
                <span className="text-[9px] text-[#00fff0]/50">ID: 0x3E11</span>
              </div>
              <p className="text-xs text-[#00fff0]/70 leading-relaxed mb-3 blur-[0.5px]">
                &gt; Topological defect propagation intersects with reinforcement learning reward surfaces.
              </p>
              <div className="flex items-center gap-2">
                <div className="text-[9px] text-[#00fff0]/60">CONFIDENCE</div>
                <div className="flex-1 h-1.5 bg-black border border-[#00fff0]/30 overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full w-[30%] bg-[#00fff0]/50 shadow-[0_0_5px_#00fff0]"></div>
                  <div className="absolute top-0 left-0 h-full w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,255,240,0.5)_2px,rgba(0,255,240,0.5)_4px)] opacity-30 animate-[slide_1s_linear_infinite]"></div>
                </div>
                <div className="text-[9px] text-[#00fff0]/50">--.--</div>
              </div>
            </div>

          </div>
        </aside>

        {/* Center Canvas - Knowledge Graph */}
        <section className="flex-1 relative overflow-hidden flex flex-col">
          {/* Subtle vignette */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,1)] z-10"></div>
          
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
            <div className="text-[10px] uppercase tracking-widest text-[#00fff0]/60">Graph Topology</div>
            <div className="flex gap-3 text-[9px] mt-1">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#0088ff] shadow-[0_0_5px_#0088ff]"></div> Engineering</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#ffaa00] shadow-[0_0_5px_#ffaa00]"></div> Chemistry</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#00ff00] shadow-[0_0_5px_#00ff00]"></div> Biology</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#00fff0] shadow-[0_0_5px_#00fff0]"></div> CompSci</div>
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center">
            {/* SVG Graph Visualization */}
            <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient id="link-chem-eng" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffaa00" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#0088ff" stopOpacity="0.8"/>
                </linearGradient>
                <linearGradient id="link-cs-bio" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00fff0" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#00ff00" stopOpacity="0.8"/>
                </linearGradient>
                <linearGradient id="link-bio-eng" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00ff00" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#0088ff" stopOpacity="0.8"/>
                </linearGradient>
              </defs>

              {/* Background structural links */}
              <g opacity="0.15" stroke="#00fff0" strokeWidth="1">
                <line x1="200" y1="150" x2="600" y2="450" />
                <line x1="150" y1="400" x2="650" y2="200" />
                <line x1="400" y1="100" x2="400" y2="500" />
                <line x1="250" y1="250" x2="550" y2="350" />
              </g>

              {/* Active Links */}
              <path d="M 250,200 Q 350,300 450,250" fill="none" stroke="url(#link-chem-eng)" strokeWidth="3" filter="url(#glow-orange)" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
              <path d="M 450,250 Q 550,200 600,350" fill="none" stroke="url(#link-cs-bio)" strokeWidth="4" filter="url(#glow-cyan)" />
              <path d="M 250,400 Q 400,450 600,350" fill="none" stroke="url(#link-bio-eng)" strokeWidth="2" filter="url(#glow-green)" />
              <line x1="250" y1="200" x2="250" y2="400" stroke="#00ff00" strokeWidth="1" opacity="0.4" />
              
              {/* Data packets moving along lines */}
              <circle r="3" fill="#ffffff" filter="url(#glow-cyan)">
                <animateMotion dur="3s" repeatCount="indefinite" path="M 450,250 Q 550,200 600,350" />
              </circle>
              <circle r="2" fill="#ffffff" filter="url(#glow-orange)">
                <animateMotion dur="4s" repeatCount="indefinite" path="M 250,200 Q 350,300 450,250" />
              </circle>
            </svg>

            {/* Nodes overlay (HTML for text styling) */}
            <div className="absolute inset-0 pointer-events-none">
              
              {/* Node: Solid Electrolyte (Engineering) */}
              <div className="absolute" style={{ left: '56.25%', top: '41.6%' /* 450, 250 on 800x600 */, transform: 'translate(-50%, -50%)' }}>
                <div className="relative flex flex-col items-center group pointer-events-auto cursor-crosshair">
                  {pulse && <div className="absolute inset-0 rounded-full border border-[#0088ff] node-pulse pointer-events-none"></div>}
                  <div className="w-5 h-5 rounded-full bg-[#0088ff] shadow-[0_0_15px_#0088ff] border-2 border-white z-10 transition-transform hover:scale-125"></div>
                  <div className="mt-2 bg-black/80 px-2 py-1 border border-[#0088ff]/50 backdrop-blur-sm shadow-[0_0_10px_rgba(0,136,255,0.3)] text-center">
                    <div className="text-[10px] text-[#0088ff] glow-text whitespace-nowrap">Solid Electrolyte Interfaces</div>
                    <div className="text-[8px] text-white/50">[ENG: 0x44]</div>
                  </div>
                </div>
              </div>

              {/* Node: Ion Transport (Chemistry) */}
              <div className="absolute" style={{ left: '31.25%', top: '33.3%' /* 250, 200 */, transform: 'translate(-50%, -50%)' }}>
                <div className="relative flex flex-col items-center pointer-events-auto cursor-crosshair">
                  <div className="w-4 h-4 rounded-full bg-[#ffaa00] shadow-[0_0_12px_#ffaa00] border border-white z-10 hover:scale-125 transition-transform"></div>
                  <div className="mt-2 bg-black/80 px-2 py-1 border border-[#ffaa00]/50 backdrop-blur-sm text-center">
                    <div className="text-[9px] text-[#ffaa00] whitespace-nowrap">Ion Transport Mechanisms</div>
                    <div className="text-[7px] text-white/50">[CHM: 0x2A]</div>
                  </div>
                </div>
              </div>

              {/* Node: Transformer Attention (CS) */}
              <div className="absolute" style={{ left: '75%', top: '58.3%' /* 600, 350 */, transform: 'translate(-50%, -50%)' }}>
                <div className="relative flex flex-col items-center pointer-events-auto cursor-crosshair">
                  <div className="absolute -inset-4 bg-[#00fff0]/10 rounded-full blur-md"></div>
                  {pulse && <div className="absolute inset-0 rounded-full border border-[#00fff0] node-pulse pointer-events-none" style={{animationDelay: '0.5s'}}></div>}
                  <div className="w-6 h-6 rounded-full bg-[#00fff0] shadow-[0_0_20px_#00fff0] border-2 border-white z-10 hover:scale-125 transition-transform"></div>
                  <div className="mt-2 bg-[#00fff0]/10 px-2 py-1 border border-[#00fff0] backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,240,0.4)] text-center">
                    <div className="text-[11px] font-bold text-[#00fff0] glow-text whitespace-nowrap">Transformer Attention Patterns</div>
                    <div className="text-[8px] text-white/70">[CSC: 0x8F]</div>
                  </div>
                </div>
              </div>

              {/* Node: Neural Plasticity (Biology) */}
              <div className="absolute" style={{ left: '31.25%', top: '66.6%' /* 250, 400 */, transform: 'translate(-50%, -50%)' }}>
                <div className="relative flex flex-col items-center pointer-events-auto cursor-crosshair">
                  <div className="w-4 h-4 rounded-full bg-[#00ff00] shadow-[0_0_12px_#00ff00] border border-white z-10 hover:scale-125 transition-transform"></div>
                  <div className="mt-2 bg-black/80 px-2 py-1 border border-[#00ff00]/50 backdrop-blur-sm text-center">
                    <div className="text-[9px] text-[#00ff00] whitespace-nowrap">Neural Plasticity Adaptation</div>
                    <div className="text-[7px] text-white/50">[BIO: 0x11]</div>
                  </div>
                </div>
              </div>

              {/* Background Node 1 */}
              <div className="absolute" style={{ left: '25%', top: '80%' /* 200, 480 */, transform: 'translate(-50%, -50%)', opacity: 0.5 }}>
                <div className="w-2 h-2 rounded-full bg-[#aa00ff] shadow-[0_0_8px_#aa00ff]"></div>
              </div>
              
              {/* Background Node 2 */}
              <div className="absolute" style={{ left: '60%', top: '25%' /* 480, 150 */, transform: 'translate(-50%, -50%)', opacity: 0.5 }}>
                <div className="w-2 h-2 rounded-full bg-[#00fff0] shadow-[0_0_8px_#00fff0]"></div>
              </div>

              {/* Background Node 3 */}
              <div className="absolute" style={{ left: '80%', top: '40%' /* 640, 240 */, transform: 'translate(-50%, -50%)', opacity: 0.3 }}>
                <div className="w-1 h-1 rounded-full bg-[#ffaa00]"></div>
              </div>

            </div>
          </div>
        </section>

        {/* Right Sidebar - Intelligence Feed */}
        <aside className="w-[300px] h-full flex flex-col border-l border-[#00fff0]/30 panel shrink-0 z-10">
          <div className="p-3 border-b border-[#00fff0]/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] uppercase text-[#00fff0]/80 tracking-widest font-bold">
              <Terminal className="w-4 h-4" />
              <span>Intelligence Feed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-[#00fff0] rounded-full animate-pulse"></div>
              <span className="text-[8px] text-[#00fff0]/60 uppercase">Live Log</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 text-[10px] leading-relaxed font-mono flex flex-col justify-end">
            <div className="space-y-3 mt-auto">
              
              <div className="flex gap-2">
                <span className="text-[#00fff0]/40 shrink-0">[14:02:41]</span>
                <span className="text-[#00fff0]/60">SYS: Engine initialized. Models loaded.</span>
              </div>
              
              <div className="flex gap-2">
                <span className="text-[#00fff0]/40 shrink-0">[14:03:12]</span>
                <span className="text-[#00fff0] glow-text">CMD: 🔭 Scout cycle initiated for vector 'cross-domain emergent structures'</span>
              </div>
              
              <div className="flex gap-2">
                <span className="text-[#00fff0]/40 shrink-0">[14:03:14]</span>
                <span className="text-[#00fff0]/80">NET: 📚 Retrieved 52 papers from ArXiv API</span>
              </div>
              
              <div className="flex gap-2">
                <span className="text-[#00fff0]/40 shrink-0">[14:03:18]</span>
                <span className="text-[#00ff00] flex gap-1"><CheckCircle className="w-3 h-3 inline mt-0.5" /> Indexed node: Solid Electrolyte Interfaces [ENG]</span>
              </div>

              <div className="flex gap-2">
                <span className="text-[#00fff0]/40 shrink-0">[14:03:19]</span>
                <span className="text-[#00ff00] flex gap-1"><CheckCircle className="w-3 h-3 inline mt-0.5" /> Indexed node: Transformer Attention Patterns [CSC]</span>
              </div>
              
              <div className="flex gap-2">
                <span className="text-[#00fff0]/40 shrink-0">[14:03:22]</span>
                <span className="text-[#ffaa00] flex gap-1"><Activity className="w-3 h-3 inline mt-0.5" /> Synthesizing: Ion Transport × Transformer Attention</span>
              </div>
              
              <div className="flex gap-2 border-l-2 border-[#ff00aa] pl-2 bg-[#ff00aa]/5 py-1">
                <span className="text-[#00fff0]/40 shrink-0">[14:03:28]</span>
                <span className="text-[#ff00aa] font-bold">WARN: Anomalous semantic leap detected. Re-routing audit.</span>
              </div>

              <div className="flex gap-2">
                <span className="text-[#00fff0]/40 shrink-0">[14:03:45]</span>
                <span className="text-[#00ffaa] status-clean font-bold">✅ Audit [CLEAN]: Hypothesis verified (Confidence: 0.94)</span>
              </div>

              <div className="flex gap-2 items-center opacity-70">
                <span className="text-[#00fff0]/40 shrink-0">[14:03:46]</span>
                <span className="text-[#00fff0] flex items-center gap-1">
                  Awaiting input <span className="w-2 h-4 bg-[#00fff0] animate-pulse inline-block ml-1"></span>
                </span>
              </div>

            </div>
          </div>
        </aside>

      </main>

      {/* Global CSS keyframes for some minor internal animations */}
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
      `}</style>
    </div>
  );
}
