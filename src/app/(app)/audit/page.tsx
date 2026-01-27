'use client';

import React, { useState } from 'react';
import { useCrawlerStore } from '@/lib/store';
import { ISSUE_SOLUTIONS } from '@/lib/issueSolutions';
import SchemaGenerator from '@/components/SchemaGenerator';
import MetaTagGenerator from '@/components/MetaTagGenerator';
import RedirectGenerator from '@/components/RedirectGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    ArrowLeft,
    Globe,
    Code,
    ShoppingBag,
    Download
} from 'lucide-react';
import { exportIssuesCSV } from '@/lib/exportUtils';

export default function Audit() {
    const { pages } = useCrawlerStore();
    const pageList = Object.values(pages);
    const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
    const [solutionTab, setSolutionTab] = useState<'general' | 'wordpress' | 'shopify'>('general');

    // Group pages by issue
    const issuesFound = Array.from(new Set(pageList.flatMap(p => p.issues)));

    const issueCards = issuesFound.map(issue => {
        const metadata = ISSUE_SOLUTIONS[issue] || { priority: 'Low', impact: 'Unknown issue.', generalFix: 'Manual review required.' };
        return {
            name: issue,
            count: pageList.filter(p => p.issues.includes(issue)).length,
            priority: metadata.priority,
            impact: metadata.impact,
            fix: metadata.generalFix
        };
    }).sort((a, b) => {
        const p = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return (p as any)[b.priority] - (p as any)[a.priority];
    });

    const affectedUrls = selectedIssue ? pageList.filter(p => p.issues.includes(selectedIssue)) : [];

    const currentSolution = selectedIssue ? ISSUE_SOLUTIONS[selectedIssue] : null;

    return (
        <div className="main-viewport animate-in">
            <AnimatePresence mode="wait">
                {!selectedIssue ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="flex-between" style={{ marginBottom: '32px' }}>
                            <div>
                                <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>SEO Diagnostics</h1>
                                <p style={{ color: '#94a3b8', marginTop: '4px' }}>Critical issues and performance optimization guide.</p>
                            </div>
                            <button
                                onClick={() => exportIssuesCSV(pageList)}
                                className="glow-btn"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '14px' }}
                            >
                                <Download size={16} /> Export Issues Report
                            </button>
                        </div>

                        <div className="dashboard-grid">
                            {issueCards.map((issue) => (
                                <div
                                    key={issue.name}
                                    className="glass-panel stat-card"
                                    onClick={() => setSelectedIssue(issue.name)}
                                    style={{ cursor: 'pointer', transition: 'transform 0.2s ease', borderLeft: `4px solid ${issue.priority === 'High' ? '#ef4444' : issue.priority === 'Medium' ? '#f59e0b' : '#3b82f6'}` }}
                                >
                                    <div className="flex-between">
                                        <div className={`badge ${issue.priority === 'High' ? 'badge-red' : issue.priority === 'Medium' ? 'badge-blue' : 'badge-green'}`}>
                                            {issue.priority} Priority
                                        </div>
                                        <div style={{ color: '#94a3b8', fontSize: '12px' }}>{issue.count} URLs affected</div>
                                    </div>
                                    <h3 style={{ margin: '16px 0 8px 0', fontSize: '18px' }}>{issue.name}</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{issue.impact ? issue.impact.substring(0, 80) + '...' : 'Analysis pending.'}</p>
                                    <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', color: '#22c55e', fontSize: '14px', fontWeight: 600 }}>
                                        View Solutions <ChevronRight size={16} />
                                    </div>
                                </div>
                            ))}
                            {issueCards.length === 0 && (
                                <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', gridColumn: '1 / -1' }}>
                                    <CheckCircle size={48} color="#22c55e" style={{ marginBottom: '16px' }} />
                                    <h2>Perfect Audit!</h2>
                                    <p style={{ color: '#94a3b8' }}>No critical SEO issues discovered in this crawl session.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="details"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <button
                                onClick={() => setSelectedIssue(null)}
                                style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
                            >
                                <ArrowLeft size={18} /> BACK TO ALL ISSUES
                            </button>
                            <button
                                onClick={() => exportIssuesCSV(affectedUrls, selectedIssue)}
                                style={{
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    color: '#3b82f6',
                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontWeight: 600,
                                    fontSize: '13px'
                                }}
                            >
                                <Download size={14} /> Export This Issue
                            </button>
                        </div>

                        <div className="dashboard-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
                            <div className="glass-panel" style={{ padding: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                    <AlertTriangle size={32} color={currentSolution?.priority === 'High' ? '#ef4444' : '#f59e0b'} />
                                    <h1 style={{ margin: 0 }}>{selectedIssue}</h1>
                                </div>

                                <div style={{ marginBottom: '32px' }}>
                                    <h4 style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontSize: '12px' }}>Impact Analysis</h4>
                                    <p style={{ fontSize: '16px', lineHeight: '1.6', margin: 0 }}>{currentSolution?.impact || 'No impact analysis available.'}</p>
                                </div>

                                {/* Platform Tabs */}
                                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '6px', display: 'inline-flex', gap: '4px', marginBottom: '24px' }}>
                                    {[
                                        { id: 'general', label: 'General Fix', icon: Globe },
                                        { id: 'wordpress', label: 'WordPress', icon: Code },
                                        { id: 'shopify', label: 'Shopify', icon: ShoppingBag },
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setSolutionTab(tab.id as any)}
                                            style={{
                                                background: solutionTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                border: 'none',
                                                padding: '8px 16px',
                                                borderRadius: '8px',
                                                color: solutionTab === tab.id ? '#fff' : '#94a3b8',
                                                fontWeight: 600,
                                                fontSize: '13px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <tab.icon size={14} /> {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Solution Content */}
                                <div style={{ background: 'rgba(34, 197, 94, 0.05)', borderLeft: '4px solid #22c55e', padding: '24px', borderRadius: '0 12px 12px 0' }}>
                                    <h4 style={{ color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0', fontSize: '12px' }}>Recommended Action</h4>

                                    <div style={{ fontSize: '15px', lineHeight: '1.6' }}>
                                        {solutionTab === 'general' && (currentSolution?.generalFix || 'No general fix available.')}
                                        {solutionTab === 'wordpress' && (currentSolution?.wordpressFix || 'No specific WordPress fix available.')}
                                        {solutionTab === 'shopify' && (currentSolution?.shopifyFix || 'No specific Shopify fix available.')}
                                    </div>
                                </div>

                                {/* Tools Injection */}
                                {currentSolution?.tools?.map((tool) => (
                                    <React.Fragment key={tool}>
                                        {tool === 'SchemaGenerator' && <SchemaGenerator key="schema" />}
                                        {tool === 'MetaTagGenerator' && <MetaTagGenerator key="meta" />}
                                        {tool === 'RedirectGenerator' && <RedirectGenerator key="redirect" />}
                                    </React.Fragment>
                                ))}

                            </div>

                            <div className="glass-panel" style={{ padding: '24px' }}>
                                <h3 style={{ marginTop: 0 }}>Affected Assets ({affectedUrls.length})</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
                                    {affectedUrls.map(p => (
                                        <div key={p.url} style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ color: '#3b82f6', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>{p.url}</div>
                                            <div style={{ color: '#64748b' }}>Status: {p.status} • Title: {p.details.title.substring(0, 30)}...</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
