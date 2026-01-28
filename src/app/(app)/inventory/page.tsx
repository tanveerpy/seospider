'use client';

import React from 'react';
import { useCrawlerStore } from '@/lib/store';
import {
    Database,
    Search,
    Filter,
    ChevronRight,
    Globe,
    FileType,
    Clock,
    AlertCircle,
    Download,
    Terminal,
    Cpu,
    Zap,
    Tag
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function InventoryPage() {
    const { pages } = useCrawlerStore();
    const pageList = Object.values(pages);

    return (
        <div className="space-y-12">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                        <Database size={14} />
                        Active Page Database
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter italic text-white leading-tight uppercase">
                        Page <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500">Inventory</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Comprehensive list of all discovered pages and their SEO data.</p>
                </div>

                <div className="flex gap-4">
                    <button className="px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-3">
                        <Download size={14} /> Export CSV
                    </button>
                </div>
            </div>

            {/* --- FILTER BAR --- */}
            <div className="p-4 rounded-3xl bg-white/2 border border-white/5 flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input
                        className="w-full bg-black/40 border border-white/5 py-4 pl-14 pr-6 rounded-2xl text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/30 transition-all font-medium"
                        placeholder="Search for pages..."
                    />
                </div>
                <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 transition-all hover:bg-white/10">
                    <Filter size={14} /> Filters
                </button>
            </div>

            {/* --- TABLE AREA --- */}
            <div className="glass-card rounded-[40px] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/2 border-b border-white/5">
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Page URL</th>
                            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Load Time</th>
                            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Links</th>
                            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">SEO Health</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageList.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-40 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-700 gap-6 opacity-30">
                                        <Database size={64} strokeWidth={1} />
                                        <span className="text-xs font-black uppercase tracking-[0.4em]">Inventory Empty</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            pageList.map((page, idx) => (
                                <tr key={idx} className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:border-emerald-500/30 transition-all">
                                                <Globe size={18} className="text-slate-500 group-hover:text-emerald-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black italic text-white group-hover:text-emerald-500 transition-colors uppercase tracking-tight truncate max-w-sm">
                                                    {page.url}
                                                </div>
                                                <div className="text-[10px] text-slate-500 font-bold flex items-center gap-2 uppercase">
                                                    <Tag size={10} /> {page.details?.title?.substring(0, 40) || 'Untitled Page'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8">
                                        <div className="flex items-center gap-2 font-mono text-[10px] font-black">
                                            <Clock size={12} className="text-slate-600" />
                                            <span className={page.time > 1000 ? 'text-red-500' : 'text-emerald-500'}>
                                                {page.time}ms
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-white tabular-nums">{page.links.filter(l => l.type === 'internal').length}I</span>
                                                <span className="text-[10px] font-black text-slate-600 tabular-nums uppercase">Net</span>
                                            </div>
                                            <div className="w-px h-6 bg-white/10" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-cyan-500 tabular-nums">{page.links.filter(l => l.type === 'external').length}E</span>
                                                <span className="text-[10px] font-black text-slate-600 tabular-nums uppercase">Ext</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8">
                                        <div className={`
                                            inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase italic
                                            ${page.issues.length === 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}
                                        `}>
                                            {page.issues.length === 0 ? 'Optimal' : `${page.issues.length} Issues`}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <button className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all">
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
