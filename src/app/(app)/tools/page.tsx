'use client';

import React from 'react';
import {
    Wrench,
    Terminal,
    Cpu,
    ShieldCheck,
    Zap,
    ArrowRight,
    Boxes
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ToolsPage() {
    const tools = [
        { name: 'Neural Header Scan', desc: 'Deep inspection of HTTP response headers for security and performance leaks.', icon: ShieldCheck, status: 'Online' },
        { name: 'DOM Fragmentation', desc: 'Identify hydration errors and oversized DOM nodes in React/Next.js environments.', icon: Boxes, status: 'Online' },
        { name: 'Equity Pulse', icon: Zap, desc: 'Real-time monitoring of internal link weights and PageRank distribution.', status: 'Active' },
        { name: 'Core Vital Vector', icon: Cpu, desc: 'Synthetic LCP/CLS measurement via headless Chromium instances.', status: 'Ready' },
    ];

    return (
        <div className="space-y-12">

            {/* --- HEADER --- */}
            <div>
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                    <Wrench size={14} />
                    System Utility Matrix
                </div>
                <h1 className="text-5xl font-black tracking-tighter italic text-white leading-tight uppercase">
                    TOOL <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500">SUITE</span>
                </h1>
                <p className="text-slate-500 font-medium mt-2">Advanced analytical modules for high-fidelity technical SEO operations.</p>
            </div>

            {/* --- TOOLS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tools.map((tool, idx) => (
                    <motion.div
                        whileHover={{ y: -5 }}
                        key={idx}
                        className="glass-card p-10 rounded-[40px] group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <tool.icon size={100} strokeWidth={1} />
                        </div>

                        <div className="relative">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all">
                                    <tool.icon size={28} />
                                </div>
                                <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-[10px] font-black text-emerald-500 uppercase tracking-widest italic animate-pulse">
                                    {tool.status}
                                </div>
                            </div>

                            <h3 className="text-2xl font-black italic text-white mb-4 uppercase tracking-tight group-hover:text-emerald-500 transition-colors">
                                {tool.name}
                            </h3>
                            <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-sm">
                                {tool.desc}
                            </p>

                            <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 group-hover:gap-5 transition-all">
                                Initialize Module <ArrowRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* --- DETAILED SEO CONTENT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-12">
                <div className="space-y-8">
                    <div>
                        <h2 className="text-3xl font-black italic text-white mb-4 uppercase">Why Technical SEO Matters</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Modern search engines like Google use complex rendering engines (WRS) to index JavaScript-heavy websites.
                            Traditional crawlers often miss hydration errors, client-side routing issues, and dynamic content.
                            CrawlLogic's <strong>technical utility suite</strong> bridges this gap by simulating a real user agent environment.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-emerald-400 mb-2">HTTP Header Analysis & Security</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Our <strong>Neural Header Scan</strong> inspects critical security headers (CSP, X-Frame-Options, HSTS)
                            and cache-control directives. identifying misconfigurations that can impact crawl budget and indexation.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-emerald-400 mb-2">DOM & Hydration Auditing</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            The <strong>DOM Fragmentation</strong> tool detects mismatches between server-rendered HTML and client-side defects.
                            Essential for Next.js, React, and Vue applications to prevent "soft 404s" and indexing failures.
                        </p>
                    </div>
                </div>

                <div className="glass-card rounded-[40px] overflow-hidden">
                    <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                        <div className="flex items-center gap-3">
                            <Terminal size={18} className="text-emerald-500" />
                            <h3 className="text-lg font-black italic tracking-tighter text-white uppercase">Raw Command Interface</h3>
                        </div>
                    </div>
                    <div className="p-10 flex flex-col gap-6">
                        <div className="font-mono text-sm leading-relaxed text-slate-400 bg-black/40 p-8 rounded-3xl border border-white/5">
                            <div className="text-emerald-500 mb-2 underline decoration-emerald-800 underline-offset-4 decoration-2">GET /api/v2/scanners/latency</div>
                            <div className="mb-4">Host: api.spiderfrog.sh</div>
                            <div className="text-slate-600">
                                {'{'} <br />
                                &nbsp;&nbsp;&quot;status&quot;: &quot;awaiting_input&quot;, <br />
                                &nbsp;&nbsp;&quot;vector&quot;: &quot;null&quot; <br />
                                {'}'}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <input
                                className="flex-1 bg-white/5 border border-white/5 py-4 px-8 rounded-2xl text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500/30 transition-all"
                                placeholder="sf run-audit --target=..."
                            />
                            <button className="px-8 bg-emerald-500 text-black font-black uppercase text-xs tracking-widest rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                Execute
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
