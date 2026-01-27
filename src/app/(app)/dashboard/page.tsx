'use client';

import React from 'react';
import { useCrawlerStore } from '@/lib/store';
import { exportToCSV } from '@/lib/exportUtils';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {
    Zap,
    ShieldCheck,
    ArrowUpRight,
    Clock,
    Share2,
    FileText,
    GitBranch,
    BookOpen,
    Link2,
    Type,
    Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const { pages } = useCrawlerStore();
    const pageList = Object.values(pages);
    const totalUrls = pageList.length;

    const responseData = [
        { name: '2xx', value: pageList.filter(p => p.status >= 200 && p.status < 300).length, color: '#22c55e' },
        { name: '3xx', value: pageList.filter(p => p.status >= 300 && p.status < 400).length, color: '#3b82f6' },
        { name: '4xx', value: pageList.filter(p => p.status >= 400 && p.status < 500).length, color: '#f59e0b' },
        { name: '5xx', value: pageList.filter(p => p.status >= 500).length, color: '#ef4444' },
    ].filter(d => d.value > 0);

    const issueCountMap: Record<string, number> = {};
    pageList.flatMap(p => p.issues).forEach(issue => {
        issueCountMap[issue] = (issueCountMap[issue] || 0) + 1;
    });

    const issueData = Object.entries(issueCountMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    const stats = [
        { label: 'Health Score', value: totalUrls > 0 ? '84%' : '0%', icon: ShieldCheck, color: '#22c55e' },
        { label: 'Crawl Speed', value: '12 p/s', icon: Zap, color: '#3b82f6' },
        { label: 'Avg Load Time', value: '240ms', icon: Clock, color: '#f59e0b' },
        { label: 'Internal Links', value: pageList.reduce((acc, p) => acc + p.links.length, 0).toLocaleString(), icon: Share2, color: '#a855f7' },
    ];

    return (
        <div className="main-viewport animate-in">
            <div className="flex-between">
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>Project Overview</h1>
                    <p style={{ color: '#94a3b8', marginTop: '4px' }}>Real-time audit results and structural analysis.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        className="glow-btn"
                        style={{ padding: '8px 16px', fontSize: '13px', background: '#3b82f6', boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' }}
                        onClick={() => exportToCSV(pages)}
                    >
                        <Share2 size={16} /> Export CSV
                    </button>
                    <div className="badge badge-green" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>Live Monitoring Active</div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="dashboard-grid">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-panel stat-card"
                    >
                        <div className="flex-between">
                            <div className="stat-label">{stat.label}</div>
                            <stat.icon size={18} color={stat.color} />
                        </div>
                        <div className="stat-value">{stat.value}</div>
                        <div style={{ fontSize: '12px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ArrowUpRight size={14} /> +2.4% vs last crawl
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
                {/* Issues Chart */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Top Critical Issues</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={issueData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Response Code Distribution */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Status Codes</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={responseData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {responseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                            {responseData.map(d => (
                                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }}></div>
                                    {d.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Tools Access */}
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Quick Tools Access</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    <a href="/tools" className="glass-panel tool-card" style={{ padding: '20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'transform 0.2s' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                            <FileText size={20} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>Robots.txt Generator</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Create custom bot rules</div>
                        </div>
                    </a>

                    <a href="/tools" className="glass-panel tool-card" style={{ padding: '20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'transform 0.2s' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                            <GitBranch size={20} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>Sitemap Generator</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Build XML sitemaps</div>
                        </div>
                    </a>

                    <a href="/tools" className="glass-panel tool-card" style={{ padding: '20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'transform 0.2s' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899' }}>
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>Content Analyzer</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Readability & Stats</div>
                        </div>
                    </a>

                    <a href="/tools" className="glass-panel tool-card" style={{ padding: '20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'transform 0.2s' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
                            <Link2 size={20} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>Slug Cleaner</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>SEO-friendly URLs</div>
                        </div>
                    </a>

                    <a href="/tools" className="glass-panel tool-card" style={{ padding: '20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'transform 0.2s' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                            <Type size={20} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>Keyword Density</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Analyze content keywords</div>
                        </div>
                    </a>

                    <a href="/tools" className="glass-panel tool-card" style={{ padding: '20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'transform 0.2s' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                            <Activity size={20} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>Server Status</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Check Headers & Codes</div>
                        </div>
                    </a>
                </div>
            </div>
            <div className="glass-panel" style={{ padding: '24px' }}>
                <div className="flex-between" style={{ marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>Latest Discovered Pages</h3>
                    <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>See All Inventory</button>
                </div>
                <div className="modern-table-container">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>Address</th>
                                <th>Status</th>
                                <th>Word Count</th>
                                <th>Health</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageList.slice(-5).reverse().map((page) => (
                                <tr key={page.url}>
                                    <td style={{ color: '#3b82f6' }}>{page.url}</td>
                                    <td>
                                        <span className={`badge ${page.status < 300 ? 'badge-green' : 'badge-red'}`}>
                                            {page.status}
                                        </span>
                                    </td>
                                    <td>{page.details.wordCount}</td>
                                    <td>
                                        <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${Math.min(100, (page.details.wordCount / 1000) * 100)}%`, height: '100%', background: '#22c55e' }}></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pageList.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No pages crawled yet. Start a crawl to see data.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
