'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Terminal,
  ShieldCheck,
  Globe,
  Zap,
  Share2,
  BarChart3,
  Search,
  LayoutDashboard,
  FileText,
  GitBranch,
  BookOpen,
  Link2,
  Type,
  Activity,
  Cpu,
  Code2
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-grid relative overflow-hidden">

      {/* --- Ambient Glow (Technical/Subtle) --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* --- Navigation --- */}
      <nav className="relative z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-void)]/80 backdrop-blur-md">
        <div className="container h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--accent-dim)] border border-[var(--accent-border)] rounded-[var(--radius-md)] flex items-center justify-center">
              <Terminal size={20} className="text-[var(--accent-primary)]" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              SPIDER<span className="text-[var(--accent-primary)]">FROG</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/tools" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium transition-colors">
              Tools API
            </Link>
            <Link href="/docs" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium transition-colors">
              Documentation
            </Link>
            <Link href="/pricing" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium transition-colors">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="btn btn-primary btn-sm">
                <LayoutDashboard size={16} />
                Console
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative z-10 pt-32 pb-20 text-center container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Status Badge */}
          <div className="badge-mono mb-8">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System v2.0 Online
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            SEO Audits.<br />
            <span className="text-[var(--accent-primary)] font-mono tracking-tight">Executed.</span>
          </h1>

          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-12">
            The developer-first SEO crawler. Detect hydration errors,
            visualize link equity, and optimize Core Web Vitals via one unified console.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard">
              <button className="btn btn-primary">
                <Zap size={18} />
                Initialize Crawl
              </button>
            </Link>
            <button className="btn btn-secondary text-[var(--text-secondary)]">
              <Code2 size={18} />
              View API Docs
            </button>
          </div>
        </motion.div>

        {/* --- Terminal Preview --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-24 relative max-w-5xl mx-auto perspective-1000"
        >
          <div className="bg-[#0f172a] rounded-t-lg border border-[var(--border-subtle)] shadow-2xl overflow-hidden text-left font-mono text-sm leading-6">
            {/* Terminal Header */}
            <div className="bg-[#1e293b] px-4 py-2 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-600" />
                <div className="w-3 h-3 rounded-full bg-slate-600" />
                <div className="w-3 h-3 rounded-full bg-slate-600" />
              </div>
              <div className="text-slate-500 text-xs">spider-frog-cli — node — 80x24</div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 text-slate-300">
              <div className="flex gap-2">
                <span className="text-emerald-500">➜</span>
                <span className="text-blue-400">~</span>
                <span>spiderfrog crawl --url https://writeoffcalc.com --depth 3</span>
              </div>
              <div className="mt-2 text-slate-400">
                [info] Starting crawler engine v2.4.0<br />
                [info] Target resolved: 104.21.32.145 (Cloudflare)<br />
                [====&gt;          ] 32% - Discovered 142 links...<br />
                <span className="text-yellow-500">[warn] /blog/tax-deductions has missing meta description</span><br />
                <span className="text-red-500">[error] /api/legacy-calc returned 404 (Broken Link)</span><br />
                <span className="text-emerald-500">[success] Crawl complete. 342 pages indexed in 4.2s.</span>
              </div>
              <div className="mt-4 flex gap-2 animate-pulse">
                <span className="text-emerald-500">➜</span>
                <span className="text-blue-400">~</span>
                <span className="w-2 h-5 bg-slate-500 block" />
              </div>
            </div>

            {/* Grid Overlay for realism */}
            <div className="absolute inset-0 bg-[url('https://grain-texture.netlify.app/grain.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
          </div>

          {/* Reflection */}
          <div className="absolute top-full left-0 right-0 h-40 bg-gradient-to-b from-[var(--bg-panel)]/50 to-transparent blur-xl transform scale-y-[-1] opacity-30 pointer-events-none" />
        </motion.div>
      </section>

      {/* --- Features Grid --- */}
      <section className="py-32 container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Core Architecture</h2>
          <p className="text-[var(--text-secondary)] text-lg">
            Built without bloat. Pure performance for serious SEOs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={Zap}
            title="Render-Engine"
            desc="Executes JS-heavy pages (React, Vue, Angular) to see exactly what Googlebot sees."
          />
          <FeatureCard
            icon={GitBranch}
            title="Link Topology"
            desc="Visualize equity flow distributed via Force-Directed Internal Graphs."
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Heuristic Audit"
            desc="Automated checks for 140+ common technical SEO failures and hydration issues."
          />
          <FeatureCard
            icon={Cpu}
            title="Local Execution"
            desc="Available as a self-hosted Docker container or managed cloud instance."
          />
          <FeatureCard
            icon={BarChart3}
            title="Raw Data Export"
            desc="Full JSON/CSV pipelines for integration with BigQuery or Looker Studio."
          />
          <FeatureCard
            icon={Terminal}
            title="CLI Interface"
            desc="Headless mode support for CI/CD pipeline integration and regressions."
          />
        </div>
      </section>

      {/* --- Utility Tools --- */}
      <section className="py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-panel)]/30">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="badge-mono mb-4 text-xs font-mono">Open Source Utilities</div>
              <h2 className="text-3xl font-bold">Quick Tools</h2>
            </div>
            <Link href="/tools" className="btn btn-secondary btn-sm hidden md:flex">
              View All Tools <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ToolCard icon={FileText} label="Robots.txt Gen" />
            <ToolCard icon={GitBranch} label="Sitemap Builder" />
            <ToolCard icon={BookOpen} label="Readability Calc" />
            <ToolCard icon={Link2} label="Slug Cleaner" />
            <ToolCard icon={Type} label="Keyword Density" />
            <ToolCard icon={Activity} label="Status Checker" />
            <ToolCard icon={Search} label="SERP Simulator" />
            <ToolCard icon={Code2} label="Schema Generator" />
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-panel)] pt-20 pb-12">
        <div className="container flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-6">
              <Terminal size={24} className="text-[var(--accent-primary)]" />
              <span className="font-bold text-xl tracking-tight">SPIDER<span className="text-[var(--accent-primary)]">FROG</span></span>
            </div>
            <p className="text-[var(--text-tertiary)] text-sm leading-relaxed">
              Advanced technical SEO infrastructure for the modern web.
              Built by Tanveer Ahmed.
            </p>
          </div>

          <div className="flex gap-16 text-sm">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-[var(--text-primary)]">Platform</h4>
              <Link href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">Crawler</Link>
              <Link href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">API</Link>
              <Link href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">Integrations</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-[var(--text-primary)]">Resources</h4>
              <Link href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">Documentation</Link>
              <Link href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">Status</Link>
              <Link href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">Changelog</Link>
            </div>
          </div>
        </div>

        <div className="container pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center text-xs text-[var(--text-tertiary)]">
          <div>&copy; 2026 SpiderFrog Online. All systems nominal.</div>
          <div className="font-mono mt-4 md:mt-0">v2.4.0-stable</div>
        </div>
      </footer>

    </div>
  );
}

// --- Subcomponents ---

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="card-tech group">
      <div className="mb-6 w-12 h-12 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] flex items-center justify-center group-hover:border-[var(--accent-border)] transition-colors">
        <Icon size={24} className="text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors" />
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--accent-primary)] transition-colors">{title}</h3>
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function ToolCard({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <Link href="/tools" className="flex flex-col items-center justify-center p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] hover:border-[var(--accent-border)] hover:bg-[var(--bg-surface)]/80 transition-all group">
      <Icon size={24} className="text-[var(--text-tertiary)] mb-3 group-hover:text-[var(--accent-primary)] transition-colors" />
      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{label}</span>
    </Link>
  );
}
