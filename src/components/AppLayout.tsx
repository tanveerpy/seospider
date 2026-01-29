'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCrawlerStore } from '@/lib/store';
import {
    LayoutDashboard,
    Database,
    Share2,
    AlertTriangle,
    Play,
    StopCircle,
    Settings,
    Search,
    Wrench,
    LogOut,
    ChevronRight,
    Terminal as TerminalIcon,
    Cpu,
    Zap,
    User,
    BookOpen,
    Building2,
    Cloud
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ConfigModal from '@/components/ConfigModal';
import { crawlPageClientSide } from '@/lib/clientCrawler';
import { dispatchCrawlJob, checkCrawlResult } from '@/lib/github-api';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { isCrawling, startCrawl, stopCrawl, pages, queue, popQueue, addPage, addToQueue } = useCrawlerStore();
    const [urlInput, setUrlInput] = useState('https://writeoffcalc.com');
    const [showConfig, setShowConfig] = useState(false);
    const [cloudMode, setCloudMode] = useState(false);
    const pathname = usePathname();
    const workerRef = useRef<boolean>(false);

    // --- Cloud Polling Effect ---
    useEffect(() => {
        const pollInterval = setInterval(async () => {
            const { remoteJobs, updateRemoteJob, addPage } = useCrawlerStore.getState();
            Object.entries(remoteJobs).forEach(async ([jobId, job]) => {
                if (job.status === 'queued' || job.status === 'processing') {
                    const result = await checkCrawlResult(jobId);
                    if (result) {
                        if ((result as any).error) { // Check for error object
                            updateRemoteJob(jobId, 'failed');
                        } else {
                            addPage(result);
                            updateRemoteJob(jobId, 'completed');
                        }
                    }
                }
            });
        }, 5000); // Poll every 5s

        return () => clearInterval(pollInterval);
    }, []);

    // --- Persistent Crawl Engine ---
    const processQueue = React.useCallback(async () => {
        if (workerRef.current) return;
        workerRef.current = true;
        while (useCrawlerStore.getState().isCrawling && useCrawlerStore.getState().queue.length > 0) {
            const nextUrl = popQueue();
            if (!nextUrl) break;
            try {
                const rules = useCrawlerStore.getState().extractionRules;
                let data = await crawlPageClientSide(nextUrl, rules);

                // --- RETRY LOGIC (Bot Block / Network Fail) ---
                // If client-side proxy fails or gets blocked, try Server-Side API (Puppeteer)
                const isBlocked = data?.issues.some((i: any) => i.code === 'BOT-BLOCK');
                const isFailed = !data || data.status === 0 || data.issues.some((i: any) => i.code === 'CONN-FAIL');

                if (isBlocked || isFailed) {
                    console.info(`[SF-RETRY] ${isBlocked ? 'Bot Block' : 'Connection Failure'} detected on ${nextUrl}. Retrying via Server-Side API...`);
                    try {
                        // Note: In 'next dev' with basePath='/seospider', the API is at /seospider/api/crawl
                        const svResponse = await fetch('/seospider/api/crawl', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ url: nextUrl, rules })
                        });

                        if (svResponse.ok) {
                            const svData = await svResponse.json();
                            // If server returned valid data (even if it has issues, as long as it's not a block)
                            if (svData && svData.status > 0) {
                                data = svData;
                                console.info(`[SF-RETRY] Server-Side API bypass SUCCESS for ${nextUrl}`);
                            }
                        } else {
                            console.warn(`[SF-RETRY] Server API returned ${svResponse.status}`);
                        }
                    } catch (svErr) {
                        console.error('[SF-RETRY] Server-Side API fallback failed', svErr);
                    }
                }

                if (data && data.url) {
                    addPage(data);
                    const internalLinks = data.links.filter((l: any) => l.type === 'internal').map((l: any) => l.url);
                    addToQueue(internalLinks);
                }
            } catch (e) { console.error(e); }
            await new Promise(r => setTimeout(r, 200));
        }
        workerRef.current = false;
        if (useCrawlerStore.getState().queue.length === 0) stopCrawl();
    }, [popQueue, addPage, addToQueue, stopCrawl]);

    useEffect(() => {
        if (isCrawling && !workerRef.current) processQueue();
        else if (!isCrawling) workerRef.current = false;
    }, [isCrawling, queue, processQueue]);

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'Engine', icon: Cpu, href: '/engine' },
        { name: 'Inventory', icon: Database, href: '/inventory' },
        { name: 'Visualizations', icon: Share2, href: '/visualizations' },
        { name: 'SEO Audit', icon: AlertTriangle, href: '/audit' },
        { name: 'Tools', icon: Wrench, href: '/tools' },
        { name: 'Documentation', icon: BookOpen, href: '/docs' },
        { name: 'Access API', icon: TerminalIcon, href: '/api-access' },
        { name: 'Enterprise', icon: Building2, href: '/enterprise' },
    ];

    return (
        <div className="flex h-screen w-full bg-[#020617] text-[#f8fafc] font-sans selection:bg-emerald-500/30 selection:text-emerald-200">

            {/* --- SIDEBAR --- */}
            <aside className="w-80 min-w-[320px] flex-shrink-0 border-r border-white/5 bg-[#0a0f1d] flex flex-col relative z-20 group">

                {/* Logo Section */}
                <div className="p-8 flex flex-col gap-1">
                    <Link href="/" className="flex items-center gap-3 no-underline">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center p-[2px]">
                            <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center">
                                <TerminalIcon size={20} className="text-emerald-400" />
                            </div>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                            Crawl<span className="text-emerald-500">Logic</span>
                        </span>
                    </Link>
                    <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-2 ml-1">
                        Crawler v2.4.0 <span className="text-emerald-500/50">●</span> Ready
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 mt-4 flex flex-col gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300
                                    ${isActive
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon size={18} className={isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-200'} />
                                    {item.name}
                                </div>
                                {isActive && <ChevronRight size={14} />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-6 flex flex-col gap-6">

                    {/* Settings / Modal Trigger */}
                    <button
                        onClick={() => setShowConfig(true)}
                        className="flex items-center gap-4 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition-all"
                    >
                        <Settings size={18} className="text-slate-500" />
                        Crawl Settings
                    </button>

                    {/* Profile Section (Conceptual Login) */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 group/profile cursor-pointer hover:border-emerald-500/30 transition-all">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                            <User size={18} className="text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-white truncate">Administrator</div>
                            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1 font-mono tracking-tighter">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                Live Session
                            </div>
                        </div>
                        <Link href="/">
                            <div className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                                <LogOut size={16} />
                            </div>
                        </Link>
                    </div>

                    <div className="px-2 text-[10px] text-slate-600 font-mono text-center">
                        Professional SEO Web Crawler
                    </div>
                </div>
            </aside >

            {/* --- MAIN CONTENT --- */}
            < main className="flex-1 flex flex-col h-screen overflow-hidden bg-cyber-grid relative min-w-0" >

                {/* Floating Radial Glow */}
                < div className="absolute -top-[500px] -right-[500px] w-[1000px] h-[1000px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

                {/* Top Bar Navigation (Dynamic) */}
                < header className="h-24 min-h-[96px] px-10 flex items-center justify-between border-b border-white/5 relative z-10 backdrop-blur-xl bg-black/10" >

                    <div className="flex items-center gap-8 flex-1 max-w-2xl">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                            <input
                                className="w-full bg-white/5 border border-white/5 py-3.5 pl-14 pr-6 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-slate-600 font-medium"
                                value={urlInput}
                                onChange={e => setUrlInput(e.target.value)}
                                onFocus={e => e.target.select()}
                                placeholder="Target URL for Analysis..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">

                        {/* Stats Counter */}
                        <div className="flex items-center gap-4 bg-white/5 border border-white/5 px-6 py-3 rounded-2xl">
                            <div className="flex flex-col items-end">
                                <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase leading-none">Crawled</div>
                                <div className="text-xl font-black text-white italic tracking-tighter tabular-nums leading-tight">
                                    {Object.keys(pages).length} <span className="text-[10px] opacity-50 not-italic">Pages</span>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className={`p-2 rounded-lg ${isCrawling ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                                <Cpu size={20} className={isCrawling ? 'animate-pulse' : ''} />
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-3 items-center">
                            {/* Cloud Toggle */}
                            <button
                                onClick={() => setCloudMode(!cloudMode)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${cloudMode
                                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                        : 'bg-white/5 text-slate-500 border-transparent hover:text-white'
                                    }`}
                                title="Run via GitHub Actions (Serverless)"
                            >
                                <Cloud size={14} />
                                {cloudMode ? 'Cloud' : 'Local'}
                            </button>
                            {isCrawling ? (
                                <button
                                    className="flex items-center gap-2.5 px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                                    onClick={stopCrawl}
                                >
                                    <StopCircle size={16} /> Stop Crawl
                                </button>
                            ) : (
                                <button
                                    className="flex items-center gap-2.5 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] group hover:scale-[1.02] active:scale-[0.98]"
                                    onClick={async () => {
                                        if (!urlInput.trim() || !/^https?:\/\/.+/.test(urlInput)) {
                                            alert('Please enter a valid URL (http/https).');
                                            return;
                                        }

                                        if (cloudMode) {
                                            try {
                                                const jobId = await dispatchCrawlJob(urlInput);
                                                useCrawlerStore.getState().addRemoteJob(jobId, urlInput);
                                                alert(`Cloud Crawl Started! Job ID: ${jobId}. Results will appear shortly.`);
                                            } catch (e: any) {
                                                alert(`Cloud Dispatch Failed: ${e.message}`);
                                            }
                                        } else {
                                            startCrawl(urlInput);
                                        }
                                    }}
                                >
                                    <Zap size={16} className="fill-black group-hover:scale-110 transition-transform" />
                                    {cloudMode ? 'Dispatch Cloud' : 'Start Crawl'}
                                </button>
                            )}
                        </div>
                    </div>
                </header >

                {/* Content Viewport */}
                < div className="flex-1 overflow-auto overflow-x-hidden p-10 relative" >
                    {children}
                </div >
            </main >

            {/* Modals overlay */}
            <AnimatePresence>
                {
                    showConfig && (
                        <ConfigModal onClose={() => setShowConfig(false)} />
                    )
                }
            </AnimatePresence >
        </div >
    );
}
