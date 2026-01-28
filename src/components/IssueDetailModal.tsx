import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ExternalLink,
    AlertTriangle,
    ShieldAlert,
    HelpCircle,
    Copy,
    PenTool
} from 'lucide-react';
import { ISSUE_METADATA } from '@/lib/issueMetadata';

interface IssueDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    issueCode: string;
    issueTitle: string;
    affectedPages: string[];
}

export default function IssueDetailModal({ isOpen, onClose, issueCode, issueTitle, affectedPages }: IssueDetailModalProps) {
    if (!isOpen) return null;

    const meta = ISSUE_METADATA[issueCode] || {
        title: issueTitle,
        priority: 'Medium',
        impact: 'This issue may affect your SEO performance.',
        fix: 'Investigate the affected pages and resolve the specific error.',
        tools: []
    };

    const iconMap: any = {
        High: <ShieldAlert className="text-red-500" size={32} />,
        Medium: <AlertTriangle className="text-yellow-500" size={32} />,
        Low: <HelpCircle className="text-cyan-500" size={32} />
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#0c1220] border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
                        <div className="flex items-start gap-6">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 bg-white/5`}>
                                {iconMap[meta.priority] || iconMap['Medium']}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest bg-white/5 border border-white/5 ${meta.priority === 'High' ? 'text-red-400 border-red-500/20 bg-red-500/10' :
                                        meta.priority === 'Medium' ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' :
                                            'text-cyan-400 border-cyan-500/20 bg-cyan-500/10'
                                        }`}>
                                        {meta.priority} Priority
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">{issueCode}</span>
                                </div>
                                <h2 className="text-3xl font-black italic text-white uppercase tracking-tight leading-none mb-2">
                                    {meta.title}
                                </h2>
                                <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                    {issueTitle !== meta.title ? issueTitle : ''}
                                    {/* Show dynamic message if different, though usually we group by code so title covers it */}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 rounded-xl hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content Scrollable */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Left Column: Education */}
                            <div className="space-y-8">
                                <section>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                        <AlertTriangle size={14} /> Why this matters
                                    </h3>
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-slate-300 leading-relaxed text-sm">
                                        {meta.impact}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500 mb-4 flex items-center gap-2">
                                        <PenTool size={14} /> How to fix it
                                    </h3>
                                    <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-100/80 leading-relaxed text-sm">
                                        {meta.fix}
                                    </div>
                                </section>


                                {meta.tools && meta.tools.length > 0 && (
                                    <section>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500 mb-4 flex items-center gap-2">
                                            <ExternalLink size={14} /> Diagnostic Tools
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {meta.tools.map((tool, idx) => {
                                                const isInternal = tool.url.startsWith('/');
                                                if (isInternal) {
                                                    return (
                                                        <Link
                                                            key={idx}
                                                            href={tool.url}
                                                            className="flex items-center justify-between p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all group"
                                                        >
                                                            <span className="text-cyan-200 text-sm font-medium">{tool.name}</span>
                                                            <ExternalLink size={14} className="text-cyan-500 opacity-50 group-hover:opacity-100" />
                                                        </Link>
                                                    );
                                                }
                                                return (
                                                    <a
                                                        key={idx}
                                                        href={tool.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all group"
                                                    >
                                                        <span className="text-cyan-200 text-sm font-medium">{tool.name}</span>
                                                        <ExternalLink size={14} className="text-cyan-500 opacity-50 group-hover:opacity-100" />
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Right Column: Affected Pages */}
                            <div className="flex flex-col h-full min-h-[400px]">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center justify-between">
                                    <span>Affected Pages ({affectedPages.length})</span>
                                    <button
                                        onClick={() => copyToClipboard(affectedPages.join('\n'))}
                                        className="text-[10px] text-emerald-500 flex items-center gap-1 hover:underline cursor-pointer"
                                    >
                                        <Copy size={12} /> Copy List
                                    </button>
                                </h3>

                                <div className="flex-1 bg-black/40 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
                                    <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar flex-1">
                                        {affectedPages.map((url, idx) => (
                                            <div key={idx} className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                                <span className="text-xs text-slate-400 font-mono truncate max-w-[300px]">{url}</span>
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-emerald-500 hover:bg-emerald-500/10 transition-all"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 bg-white/5 border-t border-white/5 text-[10px] text-slate-500 text-center font-mono">
                                        Showing all {affectedPages.length} URLs
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
