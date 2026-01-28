'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Cpu, Activity, Zap, Server, Shield } from 'lucide-react';
import { useCrawlerStore } from '@/lib/store';

export default function EnginePage() {
    const { isCrawling, queue, pages } = useCrawlerStore();
    const [throughput, setThroughput] = useState(0);
    const [avgResponse, setAvgResponse] = useState(0);
    const prevCountRef = useRef(Object.keys(pages).length);
    const lastPageUrl = Object.values(pages).pop()?.url || 'None';

    // Throughput Calculation
    useEffect(() => {
        const interval = setInterval(() => {
            const currentCount = Object.keys(useCrawlerStore.getState().pages).length;
            const diff = currentCount - prevCountRef.current;
            setThroughput(diff > 0 ? diff : 0); // Pages per second
            prevCountRef.current = currentCount;

            // Avg Response Time
            const pageList = Object.values(useCrawlerStore.getState().pages);
            if (pageList.length > 0) {
                const totalTime = pageList.reduce((acc, p) => acc + (p.time || 0), 0);
                setAvgResponse(Math.round(totalTime / pageList.length));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Helper to format memory if available (Chrome only)
    const getMemoryUsage = () => {
        if (typeof window !== 'undefined' && (performance as any).memory) {
            return Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) + ' MB';
        }
        return 'N/A'; // Firefox/Safari don't expose this API
    };

    const hasBotBlocks = Object.values(pages).some(p => p.issues && p.issues.some(i => i.code === 'BOT-BLOCK'));

    return (
        <div className="space-y-12">
            <div>
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                    <Cpu size={14} />
                    System Status
                </div>
                <h1 className="text-5xl font-black tracking-tighter italic text-white leading-tight uppercase">
                    Crawl <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500">Engine</span>
                </h1>
                <p className="text-slate-500 font-medium mt-2">Real-time heuristics and worker thread management.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 rounded-[32px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Activity size={100} />
                    </div>
                    <h3 className="text-xl font-black italic text-white uppercase mb-6">Core Status</h3>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 font-medium">Engine Mode</span>
                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${isCrawling ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                                {isCrawling ? 'ACTIVE' : 'IDLE'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 font-medium">Browser Heap (Est.)</span>
                            <span className="text-emerald-400 font-mono font-bold">{getMemoryUsage()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 font-medium">Avg Response Latency</span>
                            <span className={`font-mono font-bold ${avgResponse > 1000 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                                {avgResponse} ms
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 font-medium">Current Focus</span>
                            <span className="text-xs text-slate-500 font-mono max-w-[200px] truncate" title={lastPageUrl}>
                                {isCrawling ? lastPageUrl : 'Waiting for Queue'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-[32px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Server size={100} />
                    </div>
                    <h3 className="text-xl font-black italic text-white uppercase mb-6">Queue Metrics</h3>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 font-medium">Pending URLs</span>
                            <span className="text-cyan-400 font-mono font-bold">{queue.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 font-medium">Processed</span>
                            <span className="text-cyan-400 font-mono font-bold">{Object.keys(pages).length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 font-medium">Real-Time Throughput</span>
                            <span className="text-cyan-400 font-mono font-bold">{throughput} pages/sec</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 font-medium">Active Workers</span>
                            <span className="text-cyan-400 font-mono font-bold">{isCrawling ? '1 (Client-Side)' : '0'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`glass-card p-8 rounded-[32px] border-l-4 ${hasBotBlocks ? 'border-l-red-500' : 'border-l-yellow-500'}`}>
                <div className="flex items-start gap-4">
                    <Shield className={`${hasBotBlocks ? 'text-red-500' : 'text-yellow-500'} flex-shrink-0`} size={24} />
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">
                            {hasBotBlocks ? 'Bot Protection DETECTED' : 'Stealth Mode Active'}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {hasBotBlocks
                                ? 'We have detected active bot/WAF blocking (Cloudflare/Akamai) on some pages. The engine will automatically attempt server-side bypass strategies.'
                                : 'The engine is rotating request headers to evade basic WAF detection. No active blocks detected so far.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
