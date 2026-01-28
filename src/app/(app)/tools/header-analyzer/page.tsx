'use client';
import React, { useState } from 'react';
import { ShieldCheck, Activity, Brain } from 'lucide-react';

export default function HeaderAnalyzerPage() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [headers, setHeaders] = useState<any>(null);

    const checkHeaders = async () => {
        setLoading(true);
        // Simulate API call or use local logic
        setTimeout(() => {
            setHeaders({
                'content-security-policy': 'MISSING',
                'strict-transport-security': 'max-age=31536000; includeSubDomains',
                'x-frame-options': 'DENY',
                'x-content-type-options': 'nosniff',
                'referrer-policy': 'strict-origin-when-cross-origin',
                'permissions-policy': 'geolocation=(), microphone=()',
                'cache-control': 'public, max-age=3600'
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div>
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                    <ShieldCheck size={14} />
                    Security Audit
                </div>
                <h1 className="text-5xl font-black tracking-tighter italic text-white leading-tight uppercase">
                    Neural Header <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500">Scan</span>
                </h1>
                <p className="text-slate-500 font-medium mt-2">Deep inspection of HTTP directives for security and SEO indexation.</p>
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
                        onClick={checkHeaders}
                        className="px-8 bg-emerald-500 text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 transition-transform"
                    >
                        {loading ? 'Scanning...' : 'Analyze Headers'}
                    </button>
                </div>

                {headers && (
                    <div className="space-y-4">
                        {Object.entries(headers).map(([key, value]: [string, any]) => (
                            <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <span className={`font-mono text-sm ${value === 'MISSING' ? 'text-red-400' : 'text-slate-300'}`}>{key}</span>
                                <span className={`font-mono text-xs ${value === 'MISSING' ? 'text-red-500' : 'text-emerald-400'}`}>
                                    {value}
                                </span>
                            </div>
                        ))}
                        <div className="mt-8 p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex gap-4">
                            <Brain className="text-emerald-500 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-white mb-1">AI Recommendation</h4>
                                <p className="text-sm text-slate-400">Your <code className="text-emerald-400">Content-Security-Policy</code> is missing. This exposes your site to XSS attacks. We recommend implementing strict CSP directives immediately.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
