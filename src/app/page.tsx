'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Terminal,
  Zap,
  LayoutDashboard,
  Shield,
  Activity,
  Cpu,
  Fingerprint,
  Link as LinkIcon,
  Globe,
  BarChart,
  Search
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-sans selection:bg-emerald-500/20">

      {/* --- BACKGROUND COMPOSITION --- */}
      <div className="fixed inset-0 z-0 bg-cyber-grid pointer-events-none opacity-40"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none z-1 overflow-hidden" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none z-1" />

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 h-24 border-b border-white/5 backdrop-blur-2xl bg-black/20">
        <div className="container mx-auto px-10 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Terminal size={20} className="text-emerald-400" />
            </div>
            <span className="text-2xl font-black italic tracking-tighter uppercase">
              Spider<span className="text-emerald-500 font-black">Frog</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-12">
            {['Engine', 'Documentation', 'Access API', 'Enterprise'].map((item) => (
              <Link key={item} href="#" className="text-slate-400 hover:text-white text-xs font-black uppercase tracking-[0.2em] transition-all hover:tracking-[0.3em]">
                {item}
              </Link>
            ))}
          </div>

          <Link href="/dashboard">
            <button className="bg-white/5 border border-white/10 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all flex items-center gap-2">
              <LayoutDashboard size={14} className="text-emerald-500" />
              Open Dashboard
            </button>
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-56 pb-40 container mx-auto px-10">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.25em] mb-12 animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              SEO Spider v2.4 - Stable Release
            </div>

            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-12 italic text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-500 drop-shadow-2xl">
              AUDIT THE <br />
              <span className="text-emerald-500 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">INVISIBLE.</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-16 font-medium">
              The high-precision SEO crawler for web professionals. Detect issues,
              analyze internal links, and optimize your site via one powerful interface.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/dashboard">
                <button className="px-12 py-5 bg-emerald-500 text-black rounded-3xl text-sm font-black uppercase tracking-widest shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:scale-105 transition-all flex items-center gap-3">
                  <Zap size={20} className="fill-black" />
                  Start Crawling
                </button>
              </Link>
              <button className="px-12 py-5 bg-white/5 border border-white/10 text-white rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                <Terminal size={18} />
                User Documentation
              </button>
            </div>
          </motion.div>

          {/* Device Preview / Terminal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-32 w-full max-w-6xl relative group"
          >
            <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full transition-all group-hover:bg-emerald-500/20" />
            <div className="relative glass border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-left font-mono text-xs leading-[1.8]">
              {/* Toolbar */}
              <div className="bg-[#1e293b]/50 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-700/50" />
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-700/50" />
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-700/50" />
                </div>
                <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                  spiderfrog-console — v2.4.0 — optimized
                </div>
                <Activity size={12} className="text-emerald-500/50" />
              </div>

              {/* Lines */}
              <div className="p-8 text-slate-400 space-y-2 max-h-[400px] overflow-hidden">
                <div className="flex gap-4">
                  <span className="text-emerald-500">SF-INIT:</span>
                  <span>Neural network loading... success (2.4s)</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-cyan-500">TARGET:</span>
                  <span className="text-white underline">https://enterprise-node.sh</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-yellow-500">CRAWL:</span>
                  <span>Executing 512 recursive instances... [████████░░] 82%</span>
                </div>
                <div className="flex gap-4 opacity-70">
                  <span className="text-slate-600">INFRA:</span>
                  <span>Detected React v19.0.2 / Headless Chromium v132</span>
                </div>
                <div className="mt-6 flex flex-col gap-1 p-6 bg-black/40 border border-white/5 rounded-2xl">
                  <span className="text-[10px] text-emerald-500 font-black mb-2 uppercase tracking-tight">Real-Time Performance Data</span>
                  <div className="flex items-end gap-2">
                    <div className="w-2 h-8 bg-emerald-500/20 animate-pulse"></div>
                    <div className="w-2 h-16 bg-emerald-500/40 animate-pulse delay-75"></div>
                    <div className="w-2 h-12 bg-emerald-500/60 animate-pulse delay-100"></div>
                    <div className="w-2 h-24 bg-emerald-500 animate-pulse delay-150 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <div className="w-2 h-14 bg-emerald-500/40 animate-pulse delay-300"></div>
                    <div className="w-2 h-20 bg-emerald-500/20 animate-pulse delay-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-40 container mx-auto px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Fingerprint}
            title="SEO Intelligence"
            desc="Automatically identify structural issues and metadata gaps across your entire website."
          />
          <FeatureCard
            icon={Activity}
            title="Performance Audit"
            desc="Analyze page load speeds and identify bottlenecks to improve your search rankings."
          />
          <FeatureCard
            icon={Shield}
            title="Health Check"
            desc="Detect broken links, mixed content, and security vulnerabilities instantly."
          />
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/5 container mx-auto px-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
            <Terminal size={20} className="text-emerald-500" />
            <span className="text-lg font-black italic tracking-tighter uppercase underline decoration-emerald-500 underline-offset-4 decoration-2">
              SpiderFrog
            </span>
          </div>
          <div className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em]">
            &copy; 2026 SpiderFrog. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="glass-card p-10 rounded-[40px] group">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 mb-8 group-hover:scale-110 group-hover:border-emerald-500/20 transition-all">
        <Icon size={24} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
      </div>
      <h3 className="text-2xl font-black italic tracking-tighter mb-4 text-white group-hover:text-emerald-500 transition-colors">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}
