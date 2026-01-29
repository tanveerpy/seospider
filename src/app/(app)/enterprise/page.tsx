'use client';
import React from 'react';
import { Building2, CheckCircle2, ArrowRight } from 'lucide-react';

export default function EnterprisePage() {
    return (
        <div className="space-y-12 max-w-5xl">
            <div>
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                    <Building2 size={14} />
                    Open Source
                </div>
                <h1 className="text-5xl font-black tracking-tighter italic text-white leading-tight uppercase">
                    Enterprise Power.<br />
                    <span className="text-emerald-500">Zero Cost.</span>
                </h1>
                <p className="text-slate-500 font-medium mt-4 text-lg">
                    The capabilities of a $500/mo enterprise crawler, completely free and open source.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <p className="text-lg text-slate-300 leading-relaxed">
                        <span className="text-white font-bold">CrawlLogic</span> is built on the belief that powerful SEO tools should be accessible to everyone.
                        We provide the same infrastructure used by large agencies—headless browser rendering, scalable queues, and deep analysis—without the enterprise price tag.
                    </p>

                    <ul className="space-y-4">
                        {[
                            '100% Open Source (MIT License)',
                            'Self-Hosted & Private Data',
                            'Unlimited Pages & Crawls',
                            'Customizable Extraction Rules',
                            'No Monthly Subscription',
                            'Community Driven Updates'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-400">
                                <CheckCircle2 className="text-emerald-500" size={18} />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div className="flex gap-4">
                        <a
                            href="https://github.com/tanveerpy/seospider"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            View Source <ArrowRight size={16} />
                        </a>
                    </div>
                </div>

                <div className="glass-card p-10 rounded-[40px] border border-white/10 bg-gradient-to-b from-emerald-500/10 to-transparent flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

                    <div className="mb-6">
                        <span className="text-6xl font-black text-white tracking-tighter">$0</span>
                    </div>
                    <div className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-8">Forever Free</div>

                    <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8">
                        Download the source, deploy it locally or on your own server, and crawl the entire web without limits.
                    </p>

                    <a
                        href="https://github.com/tanveerpy/seospider"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 rounded-xl bg-emerald-500 text-black font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-colors"
                    >
                        Clone Repository
                    </a>
                </div>
            </div>

            {/* --- Footer --- */}
            <div className="border-t border-white/5 pt-8 mt-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <p className="text-slate-500 text-xs">
                        &copy; {new Date().getFullYear()} CrawlLogic. Released under the <span className="text-emerald-500">MIT License</span>.
                    </p>
                    <div className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">
                        Free Software Foundation Compatible
                    </div>
                </div>
            </div>
        </div>
    );
}
