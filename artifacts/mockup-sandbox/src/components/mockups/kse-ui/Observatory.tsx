import React, { useState, useEffect } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  Cpu,
  Database,
  GitBranch,
  Search,
  Zap,
} from "lucide-react";

const Observatory = () => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden text-slate-300 font-sans" style={{ backgroundColor: "#0d0f1a" }}>
      {/* CSS overrides for animations */}
      <style>{`
        @keyframes flow {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 0; }
          100% { transform: scale(0.9); opacity: 0; }
        }
        @keyframes node-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-flow {
          animation: flow 1.5s linear infinite;
        }
        .node-hover {
          transition: all 0.3s ease;
        }
        .node-hover:hover {
          filter: brightness(1.3);
          transform: scale(1.1);
        }
      `}</style>

      {/* Top Header */}
      <header className="flex-none h-12 border-b border-white/[0.08] flex items-center justify-between px-6 bg-[#0d0f1a]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <h1 className="font-semibold tracking-wide text-slate-200">Knowledge Synthesis Engine</h1>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono tracking-widest bg-white/[0.05] text-slate-400 border border-white/[0.05]">v2.4.0</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">System Online</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Nodes: <strong className="text-slate-200">142</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              <span>Links: <strong className="text-slate-200">38</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400/80" />
              <span>Verified: <strong className="text-indigo-300">12</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Controls & Proposals */}
        <aside className="w-[320px] flex-none border-r border-white/[0.08] flex flex-col bg-white/[0.01]">
          {/* Controls */}
          <div className="p-6 border-b border-white/[0.08] flex-none">
            <div className="mb-2 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">Research Focus</div>
            <div className="relative group mb-4">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Enter domain or topic..."
                defaultValue="Cross-domain material science"
                className="w-full bg-[#151828] text-slate-200 text-sm rounded-md pl-9 pr-4 py-2.5 outline-none border border-white/[0.08] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)]"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {['Biomimetics', 'Neural Nets', 'Polymer Chemistry'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-[11px] text-slate-400 cursor-pointer transition-colors">
                  {tag}
                </span>
              ))}
            </div>

            <button className="w-full relative group overflow-hidden rounded-md bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-2.5 px-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2 focus:ring-offset-[#0d0f1a]">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative flex items-center justify-center gap-2 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                <Zap className="w-4 h-4" />
                <span>Trigger Scout</span>
              </div>
            </button>
          </div>

          {/* Proposals List */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">Synthesis Proposals</div>
              <span className="text-[10px] bg-white/[0.05] px-1.5 py-0.5 rounded text-slate-400 border border-white/[0.05]">3 ACTIVE</span>
            </div>
            
            <div className="space-y-3">
              {/* Proposal 1: Verified */}
              <div className="group p-4 bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/30 rounded-lg transition-all border-l-[3px] border-l-emerald-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold tracking-wide border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">P-842</span>
                </div>
                <h3 className="text-sm text-slate-200 leading-snug mb-3 group-hover:text-indigo-200 transition-colors">
                  Ion transport mechanics may inform transformer attention routing
                </h3>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-wider">
                    <span>Trust Score</span>
                    <span className="text-emerald-400">94%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-[94%]" />
                  </div>
                </div>
              </div>

              {/* Proposal 2: Warning */}
              <div className="group p-4 bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/30 rounded-lg transition-all border-l-[3px] border-l-amber-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-semibold tracking-wide border border-amber-500/20">
                    <AlertCircle className="w-3 h-3" /> WARNING
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">P-843</span>
                </div>
                <h3 className="text-sm text-slate-200 leading-snug mb-3 group-hover:text-amber-200 transition-colors">
                  Neural plasticity could mirror solid electrolyte charge dynamics
                </h3>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-wider">
                    <span>Trust Score</span>
                    <span className="text-amber-400">42%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 w-[42%]" />
                  </div>
                </div>
              </div>

              {/* Proposal 3: Pending */}
              <div className="group p-4 bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/30 rounded-lg transition-all border-l-[3px] border-l-slate-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 text-[10px] font-semibold tracking-wide border border-slate-500/20">
                    <CircleDashed className="w-3 h-3 animate-[spin_3s_linear_infinite]" /> AUDITING
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">P-844</span>
                </div>
                <h3 className="text-sm text-slate-200 leading-snug mb-3 group-hover:text-slate-100 transition-colors">
                  Protein folding optimization via attention mechanism patterns
                </h3>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-wider">
                    <span>Trust Score</span>
                    <span className="text-slate-400">--%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-500/50 to-transparent w-[50%] animate-[flow_2s_linear_infinite]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Canvas - Knowledge Graph SVG */}
        <section className="flex-1 relative flex items-center justify-center bg-[#0a0c16] overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
          {/* Subtle background grid pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: `40px 40px`
          }} />
          
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#0a0c16]/50 to-[#0a0c16] pointer-events-none" />

          {/* SVG Graph */}
          <svg className="w-[800px] h-[600px] absolute z-10 overflow-visible">
            <defs>
              <filter id="glow-indigo" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              
              {/* Connection gradient */}
              <linearGradient id="edge-grad-1" x1="400" y1="300" x2="200" y2="150" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="edge-grad-2" x1="400" y1="300" x2="650" y2="200" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="edge-grad-3" x1="400" y1="300" x2="550" y2="480" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="edge-grad-4" x1="400" y1="300" x2="180" y2="420" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="edge-grad-5" x1="650" y1="200" x2="550" y2="480" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Edges */}
            <g className="edges" fill="none" strokeWidth="1.5">
              {/* Base edges */}
              <path d="M 400 300 Q 300 220 200 150" stroke="url(#edge-grad-1)" />
              <path d="M 400 300 Q 520 250 650 200" stroke="url(#edge-grad-2)" />
              <path d="M 400 300 Q 480 390 550 480" stroke="url(#edge-grad-3)" />
              <path d="M 400 300 Q 290 360 180 420" stroke="url(#edge-grad-4)" />
              <path d="M 650 200 Q 600 340 550 480" stroke="url(#edge-grad-5)" strokeDasharray="4 4" className="opacity-50" />
              
              {/* Flow animations on edges */}
              <path d="M 400 300 Q 300 220 200 150" stroke="#fff" strokeWidth="2" strokeDasharray="4 16" className="animate-flow opacity-30" />
              <path d="M 400 300 Q 520 250 650 200" stroke="#fff" strokeWidth="2" strokeDasharray="4 16" className="animate-flow opacity-30" />
              <path d="M 400 300 Q 480 390 550 480" stroke="#fff" strokeWidth="2" strokeDasharray="4 16" className="animate-flow opacity-30" />
            </g>

            {/* Nodes */}
            <g className="nodes">
              {/* Node 1: Engineering */}
              <g transform="translate(200, 150)" className="node-hover cursor-pointer" style={{ transformOrigin: '200px 150px' }}>
                <circle cx="0" cy="0" r="24" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" filter="url(#glow-blue)" />
                <circle cx="0" cy="0" r="8" fill="#60a5fa" />
                {pulse && <circle cx="0" cy="0" r="28" fill="none" stroke="#3b82f6" strokeWidth="1" className="animate-[pulse-ring_2s_ease-out_infinite]" />}
                <text x="-40" y="-35" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" letterSpacing="0.1em">ENGINEERING</text>
                <text x="-40" y="-18" fill="#e2e8f0" fontSize="12" fontWeight="500" fontFamily="sans-serif">Solid Electrolyte Interfaces</text>
              </g>

              {/* Node 2: Biology 1 */}
              <g transform="translate(650, 200)" className="node-hover cursor-pointer" style={{ transformOrigin: '650px 200px' }}>
                <circle cx="0" cy="0" r="20" fill="#064e3b" stroke="#10b981" strokeWidth="2" filter="url(#glow-emerald)" />
                <circle cx="0" cy="0" r="6" fill="#34d399" />
                <text x="30" y="-12" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" letterSpacing="0.1em">BIOLOGY</text>
                <text x="30" y="5" fill="#e2e8f0" fontSize="12" fontWeight="500" fontFamily="sans-serif">Neural Plasticity</text>
                <text x="30" y="20" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif">Adaptation</text>
              </g>

              {/* Node 3: Chemistry */}
              <g transform="translate(550, 480)" className="node-hover cursor-pointer" style={{ transformOrigin: '550px 480px' }}>
                <circle cx="0" cy="0" r="18" fill="#78350f" stroke="#f59e0b" strokeWidth="2" filter="url(#glow-amber)" />
                <circle cx="0" cy="0" r="5" fill="#fbbf24" />
                <text x="25" y="-10" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" letterSpacing="0.1em">CHEMISTRY</text>
                <text x="25" y="6" fill="#e2e8f0" fontSize="12" fontWeight="500" fontFamily="sans-serif">Ion Transport</text>
                <text x="25" y="20" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif">Mechanisms</text>
              </g>

              {/* Node 4: Biology 2 */}
              <g transform="translate(180, 420)" className="node-hover cursor-pointer" style={{ transformOrigin: '180px 420px' }}>
                <circle cx="0" cy="0" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" className="opacity-70" />
                <circle cx="0" cy="0" r="4" fill="#34d399" className="opacity-80" />
                <text x="-120" y="0" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" letterSpacing="0.1em">BIOLOGY</text>
                <text x="-120" y="15" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif">Protein Folding</text>
              </g>

              {/* Center Node: Computer Science */}
              <g transform="translate(400, 300)" className="node-hover cursor-pointer animate-[node-breathe_4s_ease-in-out_infinite]" style={{ transformOrigin: '400px 300px' }}>
                <circle cx="0" cy="0" r="32" fill="#312e81" stroke="#6366f1" strokeWidth="2.5" filter="url(#glow-indigo)" />
                <circle cx="0" cy="0" r="12" fill="#818cf8" />
                <circle cx="0" cy="0" r="40" fill="none" stroke="#6366f1" strokeWidth="1" className="opacity-40 animate-[spin_10s_linear_infinite]" strokeDasharray="8 8" />
                {pulse && <circle cx="0" cy="0" r="40" fill="none" stroke="#6366f1" strokeWidth="1.5" className="animate-[pulse-ring_2s_ease-out_infinite]" />}
                <rect x="-60" y="45" width="120" height="24" rx="12" fill="#1e1b4b" stroke="#4f46e5" strokeWidth="1" />
                <text x="0" y="61" fill="#c7d2fe" fontSize="11" fontFamily="sans-serif" fontWeight="600" textAnchor="middle" letterSpacing="0.05em">CS / AI</text>
                <text x="-80" y="-45" fill="#e2e8f0" fontSize="13" fontWeight="600" fontFamily="sans-serif">Transformer Attention</text>
                <text x="-80" y="-30" fill="#cbd5e1" fontSize="12" fontFamily="sans-serif">Patterns</text>
              </g>
            </g>
          </svg>
          
          {/* Overlay text / legend */}
          <div className="absolute bottom-6 right-6 flex items-center gap-4 text-[10px] uppercase tracking-wider text-slate-500 font-medium z-20 bg-[#0d0f1a]/80 py-2 px-4 rounded-full border border-white/[0.05] backdrop-blur-md">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" /> Computer Sci</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" /> Engineering</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" /> Biology</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" /> Chemistry</span>
          </div>
        </section>

        {/* Right Sidebar - Intelligence Feed */}
        <aside className="w-[280px] flex-none border-l border-white/[0.08] flex flex-col bg-white/[0.01]">
          <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
            <div className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              Intelligence Feed
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-sm">
            
            {/* Feed Item 1 */}
            <div className="relative pl-5 group">
              <div className="absolute left-[3px] top-[14px] bottom-[-20px] w-px bg-white/[0.08] group-last:hidden" />
              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-slate-600 ring-4 ring-[#0d0f1a]" />
              <div className="text-[10px] text-slate-500 font-mono mb-1">10:42:01.034</div>
              <div className="text-slate-400 leading-snug">
                <span className="text-slate-300 font-medium">SYS:</span> 🔭 Scout cycle initiated
              </div>
            </div>

            {/* Feed Item 2 */}
            <div className="relative pl-5 group">
              <div className="absolute left-[3px] top-[14px] bottom-[-20px] w-px bg-white/[0.08] group-last:hidden" />
              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-slate-600 ring-4 ring-[#0d0f1a]" />
              <div className="text-[10px] text-slate-500 font-mono mb-1">10:42:05.891</div>
              <div className="text-slate-400 leading-snug">
                <span className="text-slate-300 font-medium">SYS:</span> 📚 Retrieved 5 papers from ArXiv (cs.AI, cond-mat.mtrl-sci)
              </div>
            </div>

            {/* Feed Item 3 */}
            <div className="relative pl-5 group">
              <div className="absolute left-[3px] top-[14px] bottom-[-20px] w-px bg-white/[0.08] group-last:hidden" />
              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-[#0d0f1a] shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
              <div className="text-[10px] text-blue-400/70 font-mono mb-1">10:42:12.440</div>
              <div className="text-blue-100 leading-snug">
                <span className="text-blue-300 font-medium">AI:</span> ✅ Indexed node: Solid Electrolyte Interfaces [Engineering]
              </div>
            </div>

            {/* Feed Item 4 */}
            <div className="relative pl-5 group">
              <div className="absolute left-[3px] top-[14px] bottom-[-20px] w-px bg-white/[0.08] group-last:hidden" />
              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-[#0d0f1a] shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
              <div className="text-[10px] text-indigo-400/70 font-mono mb-1">10:42:18.102</div>
              <div className="text-indigo-100 leading-snug bg-indigo-500/10 p-2.5 rounded border border-indigo-500/20 mt-1">
                ⚗️ Synthesizing: Ion Transport × Transformer Attention
              </div>
            </div>

            {/* Feed Item 5 */}
            <div className="relative pl-5 group">
              <div className="absolute left-[3px] top-[14px] bottom-[-20px] w-px bg-white/[0.08] group-last:hidden" />
              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-[#0d0f1a] shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
              <div className="text-[10px] text-emerald-400/70 font-mono mb-1">10:42:25.993</div>
              <div className="text-emerald-100 leading-snug">
                <span className="text-emerald-300 font-medium">AI:</span> ✅ Audit [CLEAN]: hypothesis verified. Synthesizing proposal P-842.
              </div>
            </div>

            {/* Feed Item 6 */}
            <div className="relative pl-5 group">
              <div className="absolute left-[3px] top-[14px] bottom-[-20px] w-px bg-white/[0.08] group-last:hidden" />
              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-slate-500 ring-4 ring-[#0d0f1a]" />
              <div className="text-[10px] text-slate-500 font-mono mb-1">10:42:30.000</div>
              <div className="text-slate-400 leading-snug italic">
                Awaiting next cycle...
              </div>
            </div>

          </div>
        </aside>
      </main>

      {/* Global CSS injections for scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Observatory;