'use client';

import React, { useState } from 'react';
import { useCrawlerStore, PageData } from '@/lib/store';
import clsx from 'clsx';
import { getResponseTimeBuckets, buildStructureTree } from '@/lib/sidebarUtils';
import { ISSUE_METADATA } from '@/lib/issueMetadata';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: any) => void;
    setFilter: React.Dispatch<React.SetStateAction<((p: PageData) => boolean) | null>>;
}

export default function RightSidebar({ activeTab: parentTab, setActiveTab: setParentTab, setFilter }: SidebarProps) {
    const { pages, queue } = useCrawlerStore();
    const [sidebarTab, setSidebarTab] = useState<'Overview' | 'Issues' | 'Site Structure' | 'Response Times' | 'API'>('Overview');
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

    const pageList = Object.values(pages);
    const totalURLs = pageList.length + queue.length;

    // Helper to calculate percentages
    const pct = (count: number) => totalURLs > 0 ? `${((count / totalURLs) * 100).toFixed(1)}%` : '0%';

    const toggleNode = (label: string) => {
        const next = new Set(expandedNodes);
        if (next.has(label)) next.delete(label);
        else next.add(label);
        setExpandedNodes(next);
    };

    // --- Tree Renderers ---
    const TreeItem = ({ label, count, indent = 0, onClick, hasChildren, isExpanded }: any) => (
        <div
            className="tree-node"
            style={{ paddingLeft: `${indent * 12 + 8}px`, height: '28px', alignItems: 'center', borderBottom: '1px solid #f5f5f5' }}
            onClick={onClick}
        >
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, overflow: 'hidden' }}>
                <span style={{ width: '16px', color: '#999', flexShrink: 0, textAlign: 'center', fontFamily: 'monospace' }}>
                    {hasChildren ? (isExpanded ? '▼' : '▶') : ''}
                </span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="tree-count">{count.toLocaleString()}</span>
                <span style={{ color: '#999', fontSize: '10px', width: '35px', textAlign: 'right', marginLeft: '4px' }}>{pct(count)}</span>
            </div>
        </div>
    );

    const renderStructure = (nodes: any[], depth = 0) => {
        return nodes.map(node => (
            <div key={node.label}>
                <TreeItem
                    label={node.label}
                    count={node.count}
                    indent={depth}
                    hasChildren={node.children && node.children.length > 0}
                    isExpanded={expandedNodes.has(node.label)}
                    onClick={() => {
                        toggleNode(node.label);
                        if (node.filter) setFilter(() => node.filter);
                    }}
                />
                {expandedNodes.has(node.label) && node.children && renderStructure(node.children, depth + 1)}
            </div>
        ));
    };

    return (
        <div className="sf-right-sidebar">
            {/* Sidebar Tabs */}
            <div className="sf-tabs-bar" style={{ height: '40px', overflowX: 'auto', flexShrink: 0 }}>
                {['Overview', 'Issues', 'Site Structure', 'Response Times', 'API'].map(tab => (
                    <div
                        key={tab}
                        className={clsx(
                            "sf-tab",
                            sidebarTab === tab && "active"
                        )}
                        onClick={() => setSidebarTab(tab as any)}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {/* Sidebar Content */}
            <div className="sf-sidebar-scroll">
                {sidebarTab === 'Overview' && (
                    <div className="sf-flex-col" style={{ paddingBottom: '16px' }}>
                        <div className="tree-header sticky top-0">Summary</div>
                        <TreeItem label="Total URLs Encountered" count={totalURLs} />
                        <TreeItem label="Total URLs Crawled" count={pageList.length} />
                        <TreeItem label="Total Internal URLs" count={pageList.filter(p => !p.links.some(l => l.type === 'external')).length} />
                        <TreeItem label="Total External URLs" count={pageList.filter(p => p.links.some(l => l.type === 'external')).length} />

                        <div className="tree-header sticky top-0" style={{ marginTop: '8px' }}>Crawl Data</div>
                        <TreeItem label="HTML" count={pageList.filter(p => p.contentType.includes('html')).length} />
                        <TreeItem label="JavaScript" count={pageList.filter(p => p.contentType.includes('javascript')).length} />
                        <TreeItem label="CSS" count={pageList.filter(p => p.contentType.includes('css')).length} />
                        <TreeItem label="Images" count={pageList.filter(p => p.contentType.includes('image')).length} />
                        <TreeItem label="PDF" count={pageList.filter(p => p.contentType.includes('pdf')).length} />
                        <TreeItem label="Other" count={pageList.filter(p => !['html', 'javascript', 'css', 'image', 'pdf'].some(t => p.contentType.includes(t))).length} />

                        <div className="tree-header sticky top-0" style={{ marginTop: '8px' }}>Response Codes</div>
                        <TreeItem label="Success (2xx)" count={pageList.filter(p => p.status >= 200 && p.status < 300).length} />
                        <TreeItem label="Redirection (3xx)" count={pageList.filter(p => p.status >= 300 && p.status < 400).length} />
                        <TreeItem label="Client Error (4xx)" count={pageList.filter(p => p.status >= 400 && p.status < 500).length} />
                        <TreeItem label="Server Error (5xx)" count={pageList.filter(p => p.status >= 500).length} />
                    </div>
                )}

                {sidebarTab === 'Issues' && (
                    <div className="sf-flex-col" style={{ paddingBottom: '16px' }}>
                        {!selectedIssue ? (
                            <>
                                <div className="tree-header" style={{ background: '#fef2f2', color: '#dc2626' }}>Detected Issues</div>
                                {Array.from(new Set(pageList.flatMap(p => p.issues))).map(issue => (
                                    <TreeItem
                                        key={issue}
                                        label={issue}
                                        count={pageList.filter(p => p.issues.includes(issue)).length}
                                        onClick={() => {
                                            setSelectedIssue(issue);
                                            setFilter(() => (p: PageData) => p.issues?.includes(issue));
                                        }}
                                    />
                                ))}
                                {pageList.flatMap(p => p.issues).length === 0 && <div style={{ padding: '16px', color: '#999', textAlign: 'center', fontSize: '12px' }}>No issues found.</div>}
                            </>
                        ) : (
                            <div style={{ padding: '16px' }}>
                                <button
                                    onClick={() => {
                                        setSelectedIssue(null);
                                        setFilter(null);
                                    }}
                                    style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '12px', marginBottom: '12px', padding: 0, fontWeight: 'bold' }}
                                >
                                    ← Back to All Issues
                                </button>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#d32f2f' }}>{selectedIssue}</div>

                                {ISSUE_METADATA[selectedIssue] ? (
                                    <div className="issue-details-view">
                                        <div className={clsx("priority-badge", ISSUE_METADATA[selectedIssue].priority.toLowerCase())}>
                                            {ISSUE_METADATA[selectedIssue].priority} Priority
                                        </div>

                                        <div style={{ marginTop: '16px' }}>
                                            <div style={{ fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', color: '#666' }}>Impact</div>
                                            <p style={{ fontSize: '13px', color: '#333', lineHeight: '1.4', marginTop: '4px' }}>{ISSUE_METADATA[selectedIssue].impact}</p>
                                        </div>

                                        <div style={{ marginTop: '16px' }}>
                                            <div style={{ fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', color: '#666' }}>How to Fix</div>
                                            <p style={{ fontSize: '13px', color: '#333', lineHeight: '1.4', marginTop: '4px', background: '#f0f9ff', padding: '8px', borderRadius: '4px', borderLeft: '3px solid #0ea5e9' }}>
                                                {ISSUE_METADATA[selectedIssue].fix}
                                            </p>
                                        </div>

                                        <div style={{ marginTop: '24px', fontSize: '12px', color: '#666' }}>
                                            <b>Affected URLs:</b> {pageList.filter(p => p.issues.includes(selectedIssue)).length}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>Detailed information for this issue is coming soon.</div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {sidebarTab === 'Site Structure' && (
                    <div style={{ padding: '8px 0' }}>
                        {renderStructure(buildStructureTree(pageList))}
                    </div>
                )}

                {sidebarTab === 'Response Times' && (
                    <div className="sf-flex-col" style={{ paddingBottom: '16px' }}>
                        <div className="tree-header">Response Time Buckets</div>
                        {getResponseTimeBuckets(pageList).map(b => (
                            <TreeItem key={b.label} label={b.label} count={b.count} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
