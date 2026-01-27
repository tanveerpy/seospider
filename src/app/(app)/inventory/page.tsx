'use client';

import React, { useState } from 'react';
import { useCrawlerStore, PageData } from '@/lib/store';
import { Search, Filter, Download, ExternalLink, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Inventory() {
    const { pages } = useCrawlerStore();
    const pageList = Object.values(pages);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    const filteredPages = pageList.filter(p => {
        const matchesSearch = p.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.details.title.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'All') return matchesSearch;
        if (activeTab === 'HTML') return matchesSearch && p.contentType.includes('html');
        if (activeTab === 'Images') return matchesSearch && p.contentType.includes('image');
        if (activeTab === 'Redirects') return matchesSearch && p.status >= 300 && p.status < 400;
        if (activeTab === 'Errors') return matchesSearch && p.status >= 400;
        return matchesSearch;
    });

    return (
        <div className="main-viewport animate-in">
            <div className="flex-between">
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>URL Inventory</h1>
                    <p style={{ color: '#94a3b8', marginTop: '4px' }}>Deep exploration of all discovered site assets.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="glow-btn" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                        <Download size={18} /> Export Data
                    </button>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '0' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['All', 'HTML', 'Images', 'Redirects', 'Errors'].map(tab => (
                            <button
                                key={tab}
                                className={`sf-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    border: 'none',
                                    background: activeTab === tab ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                                    color: activeTab === tab ? '#22c55e' : '#64748b',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 600
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b' }} />
                        <input
                            className="sf-input"
                            placeholder="Search URLs or titles..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 40px',
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                fontSize: '13px'
                            }}
                        />
                    </div>
                </div>

                <div className="modern-table-container" style={{ maxHeight: 'calc(100vh - 350px)' }}>
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th><div className="flex-between">Address <Filter size={14} /></div></th>
                                <th>Status</th>
                                <th>Type</th>
                                <th>Title</th>
                                <th>Word Count</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPages.map((page, i) => (
                                <motion.tr
                                    key={page.url}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.02 }}
                                >
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ color: '#3b82f6' }}>{page.url}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${page.status < 300 ? 'badge-green' : page.status < 400 ? 'badge-blue' : 'badge-red'}`}>
                                            {page.status}
                                        </span>
                                    </td>
                                    <td style={{ color: '#94a3b8', fontSize: '11px' }}>{page.contentType.split(';')[0]}</td>
                                    <td>{page.details.title}</td>
                                    <td>{page.details.wordCount}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <a href={page.url} target="_blank" rel="noreferrer" style={{ color: '#64748b' }}><ExternalLink size={16} /></a>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {filteredPages.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '60px' }}>
                                        No assets found matching the current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
