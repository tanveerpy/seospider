'use client';

import React, { useState } from 'react';
import { useCrawlerStore } from '@/lib/store';
import {
    AlertTriangle,
    ShieldAlert,
    HelpCircle,
    CheckCircle2,
    Search,
    Filter,
    ChevronRight,
    ExternalLink,
    ShieldCheck,
    Globe,
    Zap,
    ArrowUpRight,
    BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportIssuesCSV, generateAgencyReport } from '@/lib/exportUtils';
import IssueDetailModal from '@/components/IssueDetailModal';
import { ISSUE_METADATA } from '@/lib/issueMetadata';

export default function AuditPage() {
    const { pages, isCrawling } = useCrawlerStore();
    const pageList = Object.values(pages);
    const [selectedTab, setSelectedTab] = useState<'critical' | 'warnings' | 'info' | 'passed'>('critical');

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedIssueData, setSelectedIssueData] = useState<{
        code: string;
        title: string;
        urls: string[];
    } | null>(null);

    // Categorize issues
    const allIssues = pageList.flatMap(p => p.issues.map(i => ({ ...i, url: p.url })));
    const critical = allIssues.filter(i => i.type === 'error');
    const warnings = allIssues.filter(i => i.type === 'warning');
    const info = allIssues.filter(i => i.type === 'info');
    const passed = pageList.filter(p => p.issues.length === 0);

    const tabs = [
        { id: 'critical', label: 'Critical Issues', count: critical.length, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
        { id: 'warnings', label: 'Optimizations', count: warnings.length, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
        { id: 'info', label: 'Recommendations', count: info.length, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
        { id: 'passed', label: 'Healthy Pages', count: passed.length, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    ];

    const currentList = {
        critical, warnings, info, passed
    }[selectedTab];

    // Grouping Logic for Summary View
    const getGroupedIssues = () => {
        if (selectedTab === 'passed') return [];

        const groups: Record<string, { code: string; message: string; urls: string[]; type: string }> = {};

        (currentList as any[]).forEach(issue => {
            const code = issue.code || 'UNKNOWN';
            if (!groups[code]) {
                groups[code] = {
                    code,
                    message: issue.message,
                    urls: [],
                    type: issue.type
                };
            }
            groups[code].urls.push(issue.url);
        });

        return Object.values(groups).sort((a, b) => b.urls.length - a.urls.length);
    };

    const groupedIssues = getGroupedIssues();

    const handleIssueClick = (issue: any) => {
        const meta = ISSUE_METADATA[issue.code];
        setSelectedIssueData({
            code: issue.code,
            title: meta ? meta.title : issue.message,
            urls: issue.urls
        });
        setModalOpen(true);
    };

    return (
        <div className="space-y-12">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                        <ShieldCheck size={14} />
                        Live SEO Analysis Active
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter italic text-white leading-tight uppercase">
                        SEO <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500">Audit</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Checking page structure, metadata, and performance issues.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => generateAgencyReport(pageList)}
                        disabled={isCrawling || pageList.length === 0}
                        className={`px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 transition-all ${isCrawling || pageList.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-white'}`}
                    >
                        <BarChart3 size={14} /> Agency Report
                    </button>
                    <button
                        onClick={() => exportIssuesCSV(pageList)}
                        disabled={isCrawling || pageList.length === 0}
                        className={`px-6 py-3 rounded-2xl bg-emerald-500 text-black text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${isCrawling || pageList.length === 0 ? 'opacity-50 cursor-not-allowed' : 'shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-105'}`}
                    >
                        <ArrowUpRight size={14} /> Export Issues
                    </button>
                </div>
            </div>

            {/* --- TABS --- */}
            <div className="flex flex-wrap gap-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id as any)}
                        className={`
                            px-8 py-5 rounded-[24px] border transition-all duration-300 flex flex-col items-start gap-1 group
                            ${selectedTab === tab.id
                                ? `${tab.bg} ${tab.border} ${tab.color} ring-1 ring-white/5`
                                : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10 hover:border-white/10'}
                        `}
                    >
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedTab === tab.id ? '' : 'text-slate-600'}`}>
                            {tab.label}
                        </span>
                        <span className={`text-4xl font-black italic tabular-nums leading-none tracking-tighter ${selectedTab === tab.id ? 'text-white' : ''}`}>
                            {tab.count.toString().padStart(2, '0')}
                        </span>
                    </button>
                ))}
            </div>

            {/* --- LISTING --- */}
            <div className="glass-card rounded-[40px] overflow-hidden">
                <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                    <div className="flex items-center gap-4">
                        <Filter size={18} className="text-slate-500" />
                        <span className="text-sm font-black italic tracking-tighter uppercase text-slate-400">
                            Viewing Sequence: {selectedTab} List
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                            <input
                                className="bg-black/40 border border-white/5 py-2 pl-10 pr-6 rounded-xl text-xs text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/30 transition-all font-medium"
                                placeholder="Filter Findings..."
                            />
                        </div>
                    </div>
                </div>

                <div className="p-10 space-y-4 max-h-[700px] overflow-y-auto min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {selectedTab === 'passed' ? (
                            (currentList as any[]).length === 0 ? (
                                <EmptyState />
                            ) : (
                                <div className="space-y-4">
                                    {(currentList as any[]).map((page, idx) => (
                                        <PassedItem key={idx} page={page} />
                                    ))}
                                </div>
                            )
                        ) : (
                            groupedIssues.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {groupedIssues.map((issue, idx) => (
                                        <IssueSummaryCard key={idx} issue={issue} onClick={() => handleIssueClick(issue)} />
                                    ))}
                                </div>
                            )
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {selectedIssueData && (
                <IssueDetailModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    issueCode={selectedIssueData.code}
                    issueTitle={selectedIssueData.title}
                    affectedPages={selectedIssueData.urls}
                />
            )}
        </div>
    );
}

function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[400px] flex flex-col items-center justify-center text-slate-700 gap-6 opacity-30"
        >
            <Zap size={64} strokeWidth={1} />
            <span className="text-xs font-black uppercase tracking-[0.4em]">No Items Found</span>
        </motion.div>
    );
}

function IssueSummaryCard({ issue, onClick }: { issue: any, onClick: () => void }) {
    const iconMap: any = {
        error: <ShieldAlert className="text-red-500" size={24} />,
        warning: <AlertTriangle className="text-yellow-500" size={24} />,
        info: <HelpCircle className="text-cyan-500" size={24} />
    };

    const meta = ISSUE_METADATA[issue.code];
    const displayTitle = meta ? meta.title : issue.message;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onClick}
            className="group p-8 rounded-3xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer flex items-center justify-between"
        >
            <div className="flex items-center gap-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 bg-black/20 group-hover:bg-black/40 transition-colors`}>
                    {iconMap[issue.type]}
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest bg-white/5 border border-white/5 ${issue.type === 'error' ? 'text-red-400 border-red-500/20 bg-red-500/10' :
                                issue.type === 'warning' ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' :
                                    'text-cyan-400 border-cyan-500/20 bg-cyan-500/10'
                            }`}>
                            {issue.type === 'error' ? 'Critical' : issue.type === 'warning' ? 'Optimization' : 'Notice'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-600 uppercase">ID: {issue.code}</span>
                    </div>
                    <h4 className="text-white font-black italic tracking-tight text-xl uppercase leading-tight group-hover:text-emerald-400 transition-colors">
                        {displayTitle}
                    </h4>
                    <p className="text-slate-500 text-xs font-medium mt-1">
                        Affects {issue.urls.length} {issue.urls.length === 1 ? 'page' : 'pages'} across your site
                    </p>
                </div>
            </div>

            <button className="p-4 rounded-xl bg-white/5 text-slate-600 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all transform group-hover:translate-x-1">
                <ChevronRight size={24} />
            </button>
        </motion.div>
    );
}

function PassedItem({ page }: { page: any }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="group p-6 rounded-3xl bg-emerald-500/[0.02] border border-emerald-500/10 hover:bg-emerald-500/[0.04] transition-all flex items-center justify-between"
        >
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                </div>
                <div>
                    <h4 className="text-white font-black italic tracking-tight text-lg uppercase leading-tight mb-1 truncate max-w-lg">{page.url}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-emerald-500/50 uppercase font-black tracking-widest">
                        Page structure is optimal
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-[10px] font-black text-emerald-500 uppercase italic tabular-nums">
                    {page.time}ms Speed
                </div>
                <button className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-emerald-400 transition-colors">
                    <ExternalLink size={18} />
                </button>
            </div>
        </motion.div>
    );
}
