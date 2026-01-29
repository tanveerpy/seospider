'use client';

import React from 'react';
import { useCrawlerStore } from '@/lib/store';
import { exportToCSV, generateAgencyReport } from '@/lib/exportUtils';
import {
    Activity,
    Zap,
    Globe,
    ShieldAlert,
    Clock,
    Link2,
    BarChart3,
    TrendingUp,
    Cpu,
    Layers,
    ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
    const { pages, isCrawling } = useCrawlerStore();
    const pageList = Object.values(pages);

    // Stats calc
    const totalUrls = pageList.length;
    const issuesFound = pageList.reduce((acc, p) => acc + p.issues.length, 0);
    const avgLoad = pageList.length > 0 ? (pageList.reduce((acc, p) => acc + p.time, 0) / pageList.length).toFixed(0) : 0;
    const internalLinks = pageList.reduce((acc, p) => acc + p.links.filter(l => l.type === 'internal').length, 0);

    // --- Dynamic Health Score ---
    const calculateHealthScore = () => {
        if (totalUrls === 0) return 0;
        const totalErrors = pageList.reduce((acc, p) => acc + p.issues.filter(i => i.type === 'error').length, 0);
        const totalWarnings = pageList.reduce((acc, p) => acc + p.issues.filter(i => i.type === 'warning').length, 0);

        // Base 100. 
        // Penalize: -10 per Error/Page ratio, -2 per Warning/Page ratio
        // Example: 10 pages, 5 errors = 0.5 ratio * 20 = -10 points
        const errorPenalty = (totalErrors / totalUrls) * 20;
        const warningPenalty = (totalWarnings / totalUrls) * 5;

        // Cap deduction to 100? No, min score 0.
        let score = 100 - errorPenalty - warningPenalty;
        return Math.max(0, Math.min(100, Math.round(score)));
    };
    const healthScore = calculateHealthScore();

    // --- Issue Distribution ---
    const calcDistribution = () => {
        let metadata = 0;
        let links = 0;
        let critical = 0;
        let performance = 0;

        pageList.forEach(p => {
            // Check Performance (Time > 1000ms is a "soft" issue to count here)
            if (p.time > 800) performance++;

            p.issues.forEach(i => {
                const msg = i.message.toLowerCase();
                const code = i.code || '';

                if (i.type === 'error') critical++;

                if (msg.includes('title') || msg.includes('description') || msg.includes('meta') || msg.includes('h1') || msg.includes('h2')) {
                    metadata++;
                } else if (msg.includes('link') || msg.includes('redirect') || code === '404' || code === 'Broken') {
                    links++;
                }
            });
        });

        // Normalize to percentages relative to total ISSUES (for bars) 
        // usually bars are "Count" or "% of Total Issues". 
        // Let's use Count for value, but pass max to bar for width logic if needed? 
        // The component expects a % value provided currently in the UI usually.
        // Let's stick to "Count" but visualized as a filled bar against a nominal max?
        // Actually the current ProgressBar component takes 'value' as %.
        // Let's change the bar to accept max or just show relative distribution.
        // For now, let's just assume 100 is "Bad".

        const total = metadata + links + critical + performance || 1;

        return {
            metadata: Math.round((metadata / total) * 100),
            links: Math.round((links / total) * 100),
            critical: Math.round((critical / total) * 100),
            performance: Math.round((performance / total) * 100)
        };
    };
    const dist = calcDistribution();

    return (
        <div className="space-y-12">

            {/* --- DASHBOARD HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        System Status: Nominal
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter italic text-white leading-tight">
                        CRAWL <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500">OVERVIEW</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Active SEO analysis. Real-time data synchronization.</p>
                </div>

                <div className="flex gap-4">
                    <Link
                        href="mailto:dahajsainak@gmail.com"
                        className="px-6 py-3 rounded-2xl bg-amber-500 text-black text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-105 hover:bg-amber-400"
                    >
                        <Zap size={14} className="fill-black" /> Hire for Dev & SEO
                    </Link>
                    <button
                        onClick={() => generateAgencyReport(pageList)}
                        disabled={isCrawling || pageList.length === 0}
                        className={`px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 transition-all ${isCrawling || pageList.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-white'}`}
                    >
                        <BarChart3 size={14} /> Agency Report
                    </button>
                    <button
                        onClick={() => exportToCSV(pages)}
                        disabled={isCrawling || pageList.length === 0}
                        className={`px-6 py-3 rounded-2xl bg-emerald-500 text-black text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${isCrawling || pageList.length === 0 ? 'opacity-50 cursor-not-allowed' : 'shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-105'}`}
                    >
                        <ArrowUpRight size={14} /> Export Results
                    </button>
                </div>
            </div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Crawled Pages"
                    value={totalUrls}
                    icon={Globe}
                    color="emerald"
                    trend={isCrawling ? "Active" : "Ready"}
                    sub="Total Discovered"
                    href="/inventory"
                />
                <StatCard
                    label="SEO Issues"
                    value={issuesFound}
                    icon={ShieldAlert}
                    color="red"
                    trend={issuesFound > 0 ? "Requires Action" : "Clean"}
                    sub="Critical & Warnings"
                    href="/audit"
                />
                <StatCard
                    label="Avg Load Time"
                    value={avgLoad}
                    icon={Clock}
                    color="yellow"
                    suffix="ms"
                    trend={Number(avgLoad) < 500 ? "Fast" : Number(avgLoad) < 1000 ? "Moderate" : "Slow"}
                    sub="Mean Performance"
                    href="/audit"
                />
                <StatCard
                    label="Internal Links"
                    value={internalLinks}
                    icon={Link2}
                    color="cyan"
                    trend={`${(internalLinks / (totalUrls || 1)).toFixed(1)} avg`}
                    sub="Found Connections"
                    href="/visualizations"
                />
            </div>

            {/* --- MAIN DASHBOARD LAYOUT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Live Terminal / Recent Log */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card rounded-[32px] overflow-hidden">
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Activity size={18} className="text-emerald-500" />
                                <h3 className="text-lg font-black italic tracking-tighter text-white uppercase">Crawl Activity Log</h3>
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${isCrawling ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
                                {isCrawling ? 'Streaming' : 'Idle'}
                            </div>
                        </div>
                        <div className="p-8 h-[400px] overflow-y-auto font-mono text-xs text-slate-500 bg-black/20">
                            <div className="space-y-4">
                                {pageList.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 mt-20 opacity-40">
                                        <Cpu size={48} />
                                        <span className="uppercase tracking-[0.3em] font-black">Ready for Initialization...</span>
                                    </div>
                                ) : (
                                    pageList.slice().reverse().map((p, idx) => (
                                        <Link
                                            key={idx}
                                            href="/inventory"
                                            className="block"
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex gap-4 group cursor-pointer hover:bg-white/5 p-2 -m-2 rounded-lg transition-colors"
                                            >
                                                <span className="text-emerald-900 font-bold">[{new Date(p.time).toLocaleTimeString('en-GB')}]</span>
                                                <span className="text-cyan-500 italic">CRAWLED</span>
                                                <span className="text-slate-300 truncate opacity-80 group-hover:opacity-100 group-hover:text-emerald-400 transition-all font-medium">
                                                    {p.url}
                                                </span>
                                                <span className="ml-auto text-emerald-500 tabular-nums font-mono opacity-60 group-hover:opacity-100">{p.time}ms</span>
                                            </motion.div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Architecture Visualization Placeholder */}
                    <div className="glass-card rounded-[32px] p-8 relative overflow-hidden h-[300px] flex items-center justify-center group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent opacity-50" />
                        <div className="relative text-center">
                            <Layers size={48} className="mx-auto text-emerald-500/30 mb-4 group-hover:scale-110 transition-transform" />
                            <h4 className="text-slate-200 font-black italic tracking-tighter text-xl uppercase mb-2">Site Architecture Map</h4>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-[0.2em]">Visualizer loading...</p>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Stats */}
                <div className="space-y-8">
                    <div className="glass-card rounded-[32px] p-8">
                        <h3 className="text-lg font-black italic tracking-tighter text-white uppercase mb-8 flex items-center gap-3">
                            <TrendingUp size={18} className="text-emerald-500" />
                            SEO Health Score
                        </h3>
                        <div className="relative h-64 flex items-center justify-center">
                            <div className="absolute w-48 h-48 rounded-full border-[1.5px] border-white/5 flex items-center justify-center">
                                <div className="absolute w-56 h-56 rounded-full border-[1.5px] border-emerald-500/20 border-t-emerald-500 transition-all duration-1000" style={{ transform: `rotate(${3.6 * healthScore}deg)` }} />
                                <div className="text-center">
                                    <div className="text-6xl font-black italic text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] tabular-nums">{healthScore}%</div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
                                        {healthScore >= 90 ? 'Excellent' : healthScore >= 70 ? 'Good' : healthScore >= 50 ? 'Fair' : 'Critical'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-[32px] p-8">
                        <h3 className="text-lg font-black italic tracking-tighter text-white uppercase mb-6">Issue Distribution</h3>
                        <div className="space-y-5">
                            <ProgressBar label="Metadata Gaps" value={dist.metadata} color="emerald" />
                            <ProgressBar label="Link Issues" value={dist.links} color="cyan" />
                            <ProgressBar label="Critical Errors" value={dist.critical} color="red" />
                            <ProgressBar label="Load Performance" value={dist.performance} color="yellow" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color, suffix = '', trend, sub, href }: any) {
    const colorClasses: any = {
        emerald: "from-emerald-500/10 to-transparent text-emerald-400 border-emerald-500/10",
        red: "from-red-500/10 to-transparent text-red-400 border-red-500/10",
        yellow: "from-yellow-500/10 to-transparent text-yellow-400 border-yellow-500/10",
        cyan: "from-cyan-500/10 to-transparent text-cyan-400 border-cyan-500/10"
    };

    const cardContent = (
        <>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={80} strokeWidth={1} />
            </div>

            <div className="relative">
                <div className="flex items-center justify-between mb-10">
                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5`}>
                        <Icon size={20} />
                    </div>
                    <div className="text-[10px] font-black tabular-nums tracking-widest px-2 py-1 rounded-md bg-white/5">
                        {trend}
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{label}</div>
                    <div className="text-4xl font-black tabular-nums tracking-tighter italic text-white leading-none">
                        {value}{suffix}
                    </div>
                    <div className="text-[10px] text-slate-600 font-bold uppercase mt-2">{sub}</div>
                </div>
            </div>
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                className={`glass-card p-8 rounded-[32px] border-b-4 ${colorClasses[color]} overflow-hidden relative group block hover:scale-[1.02] transition-all hover:bg-white/[0.03] active:scale-[0.98]`}
            >
                {cardContent}
            </Link>
        );
    }

    return (
        <div className={`glass-card p-8 rounded-[32px] border-b-4 ${colorClasses[color]} overflow-hidden relative group`}>
            {cardContent}
        </div>
    );
}

function ProgressBar({ label, value, color }: any) {
    const colorMap: any = {
        emerald: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
        cyan: "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]",
        red: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]",
        yellow: "bg-yellow-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>{label}</span>
                <span className="text-white">{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    className={`h-full rounded-full ${colorMap[color]}`}
                />
            </div>
        </div>
    );
}
