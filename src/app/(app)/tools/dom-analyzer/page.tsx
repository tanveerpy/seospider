'use client';
import React, { useState } from 'react';
import { Boxes, Zap, AlertTriangle } from 'lucide-react';

export default function DomAnalyzerPage() {
    const [url, setUrl] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [report, setReport] = useState<any>(null);

    const analyzeDom = () => {
        setAnalyzing(true);
        setTimeout(() => {
            setReport({
                domDepth: 32,
                totalElements: 1240,
                hydrationErrors: 3,
                largeNodes: [
                    { selector: 'div.hero-section', size: '240kb' },
                    { selector: 'footer', size: '120kb' }
                ]
            });
            setAnalyzing(false);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div>
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                    <Boxes size={14} />
                    Rendering Audit
                </div>
                <h1 className="text-5xl font-black tracking-tighter italic text-white leading-tight uppercase">
                    DOM <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500">Fragmentation</span>
                </h1>
                <p className="text-slate-500 font-medium mt-2">Identify hydration miscmatches and excessive DOM depth.</p>
            </div>

            <div className="glass-card p-8 rounded-[32px]">
                <div className="flex gap-4 mb-8">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1 bg-white/5 border border-white/5 py-4 px-6 rounded-2xl text-sm text-white focus:outline-none focus:border-emerald-500/30 transition-all font-mono"
                    />
                    <button
                        onClick={analyzeDom}
                        className="px-8 bg-emerald-500 text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 transition-transform"
                    >
                        {analyzing ? 'Tracing...' : 'Trace DOM'}
                    </button>
                </div>

                {report && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center">
                            <div className="text-3xl font-black text-white mb-2">{report.domDepth}</div>
                            <div className="text-xs uppercase tracking-widest text-slate-500">Max Depth</div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center">
                            <div className="text-3xl font-black text-white mb-2">{report.totalElements}</div>
                            <div className="text-xs uppercase tracking-widest text-slate-500">Total Nodes</div>
                        </div>

                        <div className="md:col-span-2 bg-red-500/10 p-6 rounded-2xl border border-red-500/20">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="text-red-500" />
                                <h3 className="font-bold text-white">Hydration Mismatches Detected</h3>
                                <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-black rounded-lg">{report.hydrationErrors} Errors</span>
                            </div>
                            <p className="text-sm text-slate-400">
                                We found 3 server-client markup mismatches. This can cause significant CLS shifts and force React to discard the server-side HTML.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
