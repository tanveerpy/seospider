'use client';
import React from 'react';
import { Globe, Server, Layers } from 'lucide-react';

export default function HeadlessRenderingPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">
                    Headless & <span className="text-emerald-500">Rendering</span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                    Understanding how CrawlLogic processes modern JavaScript frameworks (React, Next.js, Vue) compared to traditional text-based crawlers.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 rounded-3xl border-l-[6px] border-emerald-500">
                    <h3 className="text-xl font-bold text-white mb-4">The JavaScript Problem</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Traditional crawlers only see the initial HTML payload. For Single Page Applications (SPAs), this often means they see an empty <code className="text-emerald-400 bg-white/5 px-1 rounded">div id="root"</code>. CrawlLogic spawns a real headless browser to execute your JS bundles, waiting for hydration to complete before analyzing the DOM.
                    </p>
                </div>
                <div className="glass-card p-8 rounded-3xl border-l-[6px] border-emerald-500">
                    <h3 className="text-xl font-bold text-white mb-4">Server-Side Rendering (SSR)</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        If your site uses SSR (Next.js/Nuxt), CrawlLogic can validate that the server-rendered HTML matches the client-side hydration. Mismatches here are critical errors that cause layout shifts and indexing issues.
                    </p>
                </div>
            </div>

            <div className="bg-white/5 p-10 rounded-3xl border border-white/5 mt-8">
                <h3 className="text-2xl font-bold text-white mb-6">Rendering Pipeline</h3>
                <div className="flex flex-col md:flex-row items-center gap-6 justify-between text-center relative">
                    {/* Arrow Line */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-emerald-500/20 -z-10"></div>

                    <div className="bg-black p-6 rounded-2xl border border-white/10 z-10 w-full md:w-auto">
                        <Globe className="text-emerald-500 mx-auto mb-3" />
                        <div className="font-bold text-white text-sm">1. Fetch</div>
                        <div className="text-[10px] text-slate-500 mt-1">Requests URL</div>
                    </div>
                    <div className="bg-black p-6 rounded-2xl border border-white/10 z-10 w-full md:w-auto">
                        <Server className="text-emerald-500 mx-auto mb-3" />
                        <div className="font-bold text-white text-sm">2. Execute</div>
                        <div className="text-[10px] text-slate-500 mt-1">Runs JS Bundles</div>
                    </div>
                    <div className="bg-black p-6 rounded-2xl border border-white/10 z-10 w-full md:w-auto">
                        <Layers className="text-emerald-500 mx-auto mb-3" />
                        <div className="font-bold text-white text-sm">3. Snapshot</div>
                        <div className="text-[10px] text-slate-500 mt-1">Captures Final DOM</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
