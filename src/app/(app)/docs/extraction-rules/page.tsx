'use client';
import React from 'react';
import { Regex, Code } from 'lucide-react';

export default function ExtractionRulesPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">
                    Extraction <span className="text-purple-500">Rules</span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                    Learn how to scrape custom data points from your target pages using CSS Selectors and Regular Expressions.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="p-2 bg-purple-500/10 rounded-lg text-purple-400 font-mono text-sm">CSS</span>
                        CSS Selectors
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">
                        Use standard CSS selectors to target specific HTML elements. This is the most robust way to extract known data structures.
                    </p>

                    <div className="space-y-4">
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                            <div className="text-xs text-slate-500 mb-2 font-mono uppercase">Example: Extracting Product Price</div>
                            <code className="text-emerald-400 font-mono text-sm">.product-price .current-value</code>
                        </div>
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                            <div className="text-xs text-slate-500 mb-2 font-mono uppercase">Example: Extracting H1 Title</div>
                            <code className="text-emerald-400 font-mono text-sm">h1.main-title</code>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="p-2 bg-purple-500/10 rounded-lg text-purple-400 font-mono text-sm">REGEX</span>
                        Regular Expressions
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">
                        For more complex pattern matching inside raw HTML source code, interpret script tags, or JSON objects.
                    </p>

                    <div className="space-y-4">
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                            <div className="text-xs text-slate-500 mb-2 font-mono uppercase">Example: Extracting Analytics ID</div>
                            <code className="text-emerald-400 font-mono text-sm">UA-[0-9]+-[0-9]</code>
                        </div>
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                            <div className="text-xs text-slate-500 mb-2 font-mono uppercase">Example: Extracting Email Addresses</div>
                            <code className="text-emerald-400 font-mono text-sm">[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{'{'}2,{'}'}</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
