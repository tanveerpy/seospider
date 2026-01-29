'use client';
import React from 'react';
import { Terminal, Key, Lock, Copy } from 'lucide-react';

export default function ApiAccessPage() {
    return (
        <div className="space-y-12 max-w-5xl">
            <div>
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                    <Terminal size={14} />
                    Developer Platform
                </div>
                <h1 className="text-5xl font-black tracking-tighter italic text-white leading-tight uppercase">
                    Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500">API</span>
                </h1>
                <p className="text-slate-500 font-medium mt-2">Programmatic access to the CrawlLogic crawling engine.</p>
            </div>

            {/* API Key Section */}
            <div className="glass-card p-8 rounded-[32px]">
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                            <Key className="text-emerald-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">API Credentials</h3>
                            <p className="text-slate-500 text-xs">Environment: Development</p>
                        </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                        Active
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Public Key</div>
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-colors">
                            <code className="text-emerald-400 font-mono text-sm">pk_live_sf_9x8e7d6c5b4a3</code>
                            <Copy size={14} className="text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Secret Key</div>
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                            <code className="text-slate-500 font-mono text-sm">****************************</code>
                            <button className="text-[10px] uppercase font-bold text-slate-400 hover:text-white">Reveal</button>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-slate-500 mt-6">
                    <Lock size={12} className="inline mr-1" /> keys are scoped to <code className="text-slate-300">localhost</code> by default. Configure CORS in settings for remote access.
                </p>
            </div>

            {/* Endpoints */}
            <h2 className="text-2xl font-bold text-white mb-6">Live Endpoints</h2>

            <div className="space-y-4">
                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded uppercase">POST</span>
                        <code className="text-white font-mono text-sm">/seospider/api/crawl</code>
                    </div>
                    <p className="text-slate-400 text-sm">Trigger a server-side Puppeteer crawl. Returns the full page data object.</p>

                    <div className="bg-black/40 p-4 rounded-xl font-mono text-xs text-slate-400">
                        <div className="text-slate-500 mb-2">// Request Body</div>
                        {`{
  "url": "https://example.com",
  "rules": [
    { "name": "price", "type": "css", "value": ".price-tag" }
  ]
}`}
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-black rounded uppercase">GET</span>
                        <code className="text-white font-mono text-sm">/seospider/api/check-headers</code>
                    </div>
                    <p className="text-slate-400 text-sm">Utility endpoint to inspect HTTP response headers for a given URL.</p>
                </div>
            </div>
        </div>
    );
}
