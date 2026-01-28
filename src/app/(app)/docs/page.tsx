'use client';
import React from 'react';
import { BookOpen, FileText, Code, Globe } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
    return (
        <div className="space-y-12 max-w-5xl">
            <div>
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                    <BookOpen size={14} />
                    Knowledge Base
                </div>
                <h1 className="text-5xl font-black tracking-tighter italic text-white leading-tight uppercase">
                    Documentation
                </h1>
                <p className="text-slate-500 font-medium mt-2">Guides, references, and technical specifications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/docs/quick-start" className="group glass-card p-8 rounded-[32px] hover:bg-white/5 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                        <FileText className="text-blue-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Quick Start Guide</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Learn how to set up your first crawl, configure exclusions, and interpret the initial audit report.
                    </p>
                </Link>

                <Link href="/docs/extraction-rules" className="group glass-card p-8 rounded-[32px] hover:bg-white/5 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                        <Code className="text-purple-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Extraction Rules</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Master CSS Selectors and Regex to extract custom data points like prices, SKUs, and meta tags.
                    </p>
                </Link>

                <Link href="/docs/headless-rendering" className="group glass-card p-8 rounded-[32px] hover:bg-white/5 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                        <Globe className="text-emerald-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Headless & Rendering</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Understanding how the JavaScript renderer works, and optimizing your site for dynamic rendering.
                    </p>
                </Link>
            </div>

            <div className="glass-card p-10 rounded-[32px] border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                <h2 className="text-2xl font-black italic text-white mb-4">Latest Release Notes (v2.4.0)</h2>
                <ul className="space-y-3 text-slate-400 text-sm">
                    <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Improved stealth mode for handling Cloudflare challenges.
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        New Schema Validator tool added to the suite.
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Reduced memory footprint for large crawls (&gt;10k pages).
                    </li>
                </ul>
            </div>
        </div>
    );
}
