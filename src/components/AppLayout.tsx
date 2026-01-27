'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCrawlerStore, PageData } from '@/lib/store';
import {
    LayoutDashboard,
    Database,
    Share2,
    AlertTriangle,
    Play,
    StopCircle,
    Settings,
    Search,
    Wrench
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ConfigModal from '@/components/ConfigModal';
import { crawlPageClientSide } from '@/lib/clientCrawler';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { isCrawling, startCrawl, stopCrawl, pages, queue, popQueue, addPage, addToQueue } = useCrawlerStore();
    const [urlInput, setUrlInput] = useState('https://writeoffcalc.com');
    const [showConfig, setShowConfig] = useState(false);
    const pathname = usePathname();
    const workerRef = useRef<boolean>(false);

    // --- Persistent Crawl Engine ---
    useEffect(() => {
        if (isCrawling && !workerRef.current) processQueue();
        else if (!isCrawling) workerRef.current = false;
    }, [isCrawling, queue]);

    const processQueue = async () => {
        if (workerRef.current) return;
        workerRef.current = true;
        while (useCrawlerStore.getState().isCrawling && useCrawlerStore.getState().queue.length > 0) {
            const nextUrl = popQueue();
            if (!nextUrl) break;
            try {
                const rules = useCrawlerStore.getState().extractionRules;
                // Switch to client-side crawling for GitHub Pages compatibility
                const data = await crawlPageClientSide(nextUrl, rules);

                if (data && data.url) {
                    addPage(data);
                    const internalLinks = data.links.filter(l => l.type === 'internal').map(l => l.url);
                    addToQueue(internalLinks);
                }
            } catch (e) { console.error(e); }
            await new Promise(r => setTimeout(r, 200));
        }
        workerRef.current = false;
        if (useCrawlerStore.getState().queue.length === 0) stopCrawl();
    };

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'Inventory', icon: Database, href: '/inventory' },
        { name: 'Visualizations', icon: Share2, href: '/visualizations' },
        { name: 'SEO Audit', icon: AlertTriangle, href: '/audit' },
        { name: 'Tools', icon: Wrench, href: '/tools' },
    ];

    return (
        <div className="app-container">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div style={{ padding: '0 16px', marginBottom: '40px' }}>
                    <div style={{ fontWeight: 900, fontSize: '24px', letterSpacing: '-1px' }}>
                        <span style={{ color: '#22c55e' }}>SPIDER</span>FROG
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>
                        Next-Gen SEO Engine
                    </div>
                </div>

                <nav style={{ flex: 1 }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="nav-item" onClick={() => setShowConfig(true)}>
                        <Settings size={20} />
                        Settings
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', flex: 1 }}>
                {/* Top Header Bar */}
                <header className="glass-panel" style={{
                    margin: '24px 32px 0 32px',
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    borderRadius: '16px',
                    zIndex: 10
                }}>
                    <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', color: '#64748b' }} />
                        <input
                            className="sf-input"
                            value={urlInput}
                            onChange={e => setUrlInput(e.target.value)}
                            onFocus={e => e.target.select()}
                            placeholder="Enter URL to crawl..."
                            style={{
                                width: '100%',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                padding: '12px 12px 12px 48px',
                                borderRadius: '12px',
                                color: '#fff',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        {isCrawling ? (
                            <button className="glow-btn" onClick={stopCrawl} style={{ background: '#ef4444', color: '#fff' }}>
                                <StopCircle size={18} /> Stop
                            </button>
                        ) : (
                            <button className="glow-btn" onClick={() => startCrawl(urlInput)}>
                                <Play size={18} /> Start Crawl
                            </button>
                        )}
                    </div>

                    <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>

                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>CRAWLED</div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#22c55e' }}>{Object.keys(pages).length} <span style={{ fontSize: '12px', color: '#64748b' }}>URLs</span></div>
                    </div>
                </header>

                {/* Viewport for Pages */}
                <div style={{ flex: 1, overflow: 'auto' }}>
                    {children}
                </div>
            </main>

            {showConfig && <ConfigModal onClose={() => setShowConfig(false)} />}
        </div>
    );
}
