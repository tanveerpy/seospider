'use client';
import React from 'react';
import { Building2, CheckCircle2, ArrowRight } from 'lucide-react';

export default function EnterprisePage() {
    return (
        <div className="space-y-12 max-w-5xl">
            <div>
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                    <Building2 size={14} />
                    Solutions
                </div>
                <h1 className="text-5xl font-black tracking-tighter italic text-white leading-tight uppercase">
                    Enterprise
                </h1>
                <p className="text-slate-500 font-medium mt-2">Scalable infrastructure for high-volume agencies and large-scale data mining.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <p className="text-lg text-slate-300 leading-relaxed">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">CrawlLogic</span> Enterprise
                        is designed for organizations that need to crawl millions of pages, integrate deep data into their pipelines, or require dedicated support engineers.
                    </p>

                    <ul className="space-y-4">
                        {[
                            'Dedicated Worker Nodes',
                            'Custom JavaScript Rendering',
                            'Residential Proxy Network',
                            'SSO & Advanced Role Management',
                            'Priority 24/7 Support',
                            'SLA Guarantees'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-400">
                                <CheckCircle2 className="text-emerald-500" size={18} />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <button className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform flex items-center gap-2">
                        Contact Sales <ArrowRight size={16} />
                    </button>
                </div>

                <div className="glass-card p-10 rounded-[40px] border border-white/10 bg-gradient-to-b from-white/5 to-transparent flex flex-col justify-center items-center text-center">
                    <div className="mb-6">
                        <span className="text-5xl font-black text-white">$499</span>
                        <span className="text-slate-500 text-lg">/mo</span>
                    </div>
                    <div className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-8">Starting Price</div>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8">
                        Includes 1M crawl credits, API access, and 5 team seats. Custom plans available.
                    </p>
                    <button className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-white font-bold uppercase text-xs tracking-widest">
                        View Full Pricing
                    </button>
                </div>
            </div>
        </div>
    );
}
