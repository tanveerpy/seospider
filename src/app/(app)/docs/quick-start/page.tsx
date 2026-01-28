'use client';
import React from 'react';
import { PlayCircle, Settings, CheckCircle } from 'lucide-react';

export default function QuickStartPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">
                    Quick Start <span className="text-blue-500">Guide</span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                    Welcome to CrawlLogic. This guide will walk you through your first technical audit, from configuring the crawler to interpreting the results.
                </p>
            </div>

            <div className="space-y-6">
                <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">1</div>
                        <h3 className="text-xl font-bold text-white">Starting Your First Crawl</h3>
                    </div>
                    <div className="space-y-4 pl-14">
                        <p className="text-slate-400 text-sm">
                            Navigate to the Dashboard. Enter your target URL (e.g., <code className="text-emerald-400 bg-black/20 px-2 py-0.5 rounded">https://example.com</code>) into the main input field.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 bg-black/40 p-3 rounded-lg border border-white/5 w-fit">
                            <PlayCircle size={14} className="text-emerald-500" />
                            <span>Click <strong>Start Transformation</strong> to begin the audit.</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">2</div>
                        <h3 className="text-xl font-bold text-white">Configuring Exclusions</h3>
                    </div>
                    <div className="space-y-4 pl-14">
                        <p className="text-slate-400 text-sm">
                            To avoid crawling external links or admin sections, use the exclusion patterns in the settings panel.
                            Common patterns to exclude:
                        </p>
                        <ul className="list-disc ml-5 space-y-2 text-slate-400 text-sm">
                            <li><code className="text-emerald-400">/admin/*</code> - Backend dashboards</li>
                            <li><code className="text-emerald-400">/login</code> - Authentication pages</li>
                            <li><code className="text-emerald-400">?sort=</code> - Parameterized duplicate content</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">3</div>
                        <h3 className="text-xl font-bold text-white">Interpreting Results</h3>
                    </div>
                    <div className="space-y-4 pl-14">
                        <p className="text-slate-400 text-sm">
                            Once the crawl is complete, visit the <strong>Audit</strong> tab to see prioritized issues. High priority issues (Red) should be addressed immediately as they block indexation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
