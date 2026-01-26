'use client';

import { useState } from 'react';
import { useCrawlerStore, PageData } from '@/lib/store';
import clsx from 'clsx';
import { getResponseTimeBuckets, buildStructureTree } from '@/lib/sidebarUtils';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: any) => void;
    setFilter: (filter: (p: PageData) => boolean) => void;
}

export default function RightSidebar({ activeTab: parentTab, setActiveTab: setParentTab, setFilter }: SidebarProps) {
    const { pages, queue } = useCrawlerStore();
    const [sidebarTab, setSidebarTab] = useState<'Overview' | 'Issues' | 'Site Structure' | 'Response Times' | 'API'>('Overview');
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

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
            className="flex items-center hover:bg-gray-100 cursor-pointer text-xs py-1 border-b border-gray-50 select-none group h-7"
            style={{ paddingLeft: `${indent * 12 + 8}px` }}
            onClick={onClick}
        >
            <span className="mr-1 text-gray-400 font-mono w-4 text-center inline-block shrink-0">
                {hasChildren ? (isExpanded ? '▼' : '▶') : ''}
            </span>
            <span className="flex-1 truncate text-gray-700 font-medium group-hover:text-black">{label}</span>
            <span className="text-gray-600 mr-2 text-[10px] w-12 text-right shrink-0">{count.toLocaleString()}</span>
            <span className="text-gray-400 w-12 text-right mr-2 text-[10px] shrink-0">{pct(count)}</span>
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
                    onClick={() => toggleNode(node.label)}
                />
                {expandedNodes.has(node.label) && node.children && renderStructure(node.children, depth + 1)}
            </div>
        ));
    };

    return (
        <div className="sf-right-sidebar flex flex-col h-full border-l border-gray-300 bg-white w-[350px] min-w-[320px] max-w-[450px] shadow-lg relative z-20">
            {/* Sidebar Tabs */}
            <div className="flex bg-gray-100 border-b border-gray-300 overflow-x-auto text-[11px] shrink-0 no-scrollbar h-9 items-center">
                {['Overview', 'Issues', 'Site Structure', 'Response Times', 'API'].map(tab => (
                    <div
                        key={tab}
                        className={clsx(
                            "px-3 h-full flex items-center cursor-pointer whitespace-nowrap hover:bg-gray-200 border-r border-gray-200 transition-colors",
                            sidebarTab === tab ? "bg-white text-gray-900 font-bold border-t-2 border-green-500" : "text-gray-600"
                        )}
                        onClick={() => setSidebarTab(tab as any)}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white">
                {sidebarTab === 'Overview' && (
                    <div className="flex flex-col pb-4">
                        <div className="font-bold bg-gray-50 px-3 py-2 text-[10px] text-gray-500 uppercase border-y tracking-wider sticky top-0 z-10">Summary</div>
                        <TreeItem label="Total URLs Encountered" count={totalURLs} />
                        <TreeItem label="Total URLs Crawled" count={pageList.length} />
                        <TreeItem label="Total Internal URLs" count={pageList.filter(p => !p.links.some(l => l.type === 'external')).length} />
                        <TreeItem label="Total External URLs" count={pageList.filter(p => p.links.some(l => l.type === 'external')).length} />

                        <div className="font-bold bg-gray-50 px-3 py-2 text-[10px] text-gray-500 uppercase border-y mt-2 tracking-wider sticky top-0 z-10">Crawl Data</div>
                        <TreeItem label="HTML" count={pageList.filter(p => p.contentType.includes('html')).length} />
                        <TreeItem label="JavaScript" count={pageList.filter(p => p.contentType.includes('javascript')).length} />
                        <TreeItem label="CSS" count={pageList.filter(p => p.contentType.includes('css')).length} />
                        <TreeItem label="Images" count={pageList.filter(p => p.contentType.includes('image')).length} />
                        <TreeItem label="PDF" count={pageList.filter(p => p.contentType.includes('pdf')).length} />
                        <TreeItem label="Other" count={pageList.filter(p => !['html', 'javascript', 'css', 'image', 'pdf'].some(t => p.contentType.includes(t))).length} />

                        <div className="font-bold bg-gray-50 px-3 py-2 text-[10px] text-gray-500 uppercase border-y mt-2 tracking-wider sticky top-0 z-10">Response Codes</div>
                        <TreeItem label="Success (2xx)" count={pageList.filter(p => p.status >= 200 && p.status < 300).length} />
                        <TreeItem label="Redirection (3xx)" count={pageList.filter(p => p.status >= 300 && p.status < 400).length} />
                        <TreeItem label="Client Error (4xx)" count={pageList.filter(p => p.status >= 400 && p.status < 500).length} />
                        <TreeItem label="Server Error (5xx)" count={pageList.filter(p => p.status >= 500).length} />
                    </div>
                )}

                {sidebarTab === 'Issues' && (
                    <div className="flex flex-col pb-4">
                        <div className="font-bold bg-red-50 px-3 py-2 text-[10px] text-red-600 uppercase border-y tracking-wider">Detected Issues</div>
                        {Array.from(new Set(pageList.flatMap(p => p.issues))).map(issue => (
                            <TreeItem
                                key={issue}
                                label={issue}
                                count={pageList.filter(p => p.issues.includes(issue)).length}
                                onClick={() => setFilter((p) => p.issues.includes(issue))}
                            />
                        ))}
                        {pageList.flatMap(p => p.issues).length === 0 && <div className="p-4 text-gray-400 text-center text-xs">No issues found.</div>}
                    </div>
                )}

                {sidebarTab === 'Site Structure' && (
                    <div className="py-2">
                        {renderStructure(buildStructureTree(pageList))}
                    </div>
                )}

                {sidebarTab === 'Response Times' && (
                    <div className="flex flex-col pb-4">
                        <div className="font-bold bg-gray-50 px-3 py-2 text-[10px] text-gray-500 uppercase border-y tracking-wider">Response Time Buckets</div>
                        {getResponseTimeBuckets(pageList).map(b => (
                            <TreeItem key={b.label} label={b.label} count={b.count} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
