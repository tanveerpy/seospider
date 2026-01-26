'use client';

import dynamic from 'next/dynamic';
import { useCrawlerStore } from '@/lib/store';
import { useMemo } from 'react';

// Dynamically import to avoid SSR issues with Canvas
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function LinkGraph() {
    const { pages } = useCrawlerStore();

    const data = useMemo(() => {
        const nodes: any[] = [];
        const links: any[] = [];

        const pageList = Object.values(pages);

        if (pageList.length === 0) return { nodes: [], links: [] };

        // Create Nodes
        pageList.forEach(p => {
            let color = '#4ade80'; // Green (200)
            if (p.status >= 300) color = '#fbbf24'; // Orange (300)
            if (p.status >= 400) color = '#f87171'; // Red (400)

            let val = 1;
            // Size by "Inlinks" (internal authority approximation)
            const inlinks = pageList.filter(other => other.links.some(l => l.url === p.url)).length;
            val = 1 + (inlinks * 0.5);

            nodes.push({
                id: p.url,
                name: p.url,
                color,
                val
            });
        });

        // Create Links
        pageList.forEach(source => {
            source.links.forEach(targetLink => {
                // Only draw link if target exists in our graph (Internal)
                if (pages[targetLink.url]) {
                    links.push({
                        source: source.url,
                        target: targetLink.url,
                        color: '#cccccc'
                    });
                }
            });
        });

        return { nodes, links };
    }, [pages]);

    return (
        <div className="w-full h-full bg-[#f0f0f0] relative overflow-hidden">
            {data.nodes.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                    Start a crawl to see the graph
                </div>
            ) : (
                <ForceGraph2D
                    graphData={data}
                    backgroundColor="#f0f0f0"
                    nodeLabel="name"
                    nodeColor="color"
                    linkColor={() => '#ccc'}
                    nodeRelSize={6}
                    linkDirectionalArrowLength={3.5}
                    linkDirectionalArrowRelPos={1}
                    cooldownTicks={100}
                    onNodeClick={(node: any) => {
                        // Optional: Select node in main store
                        window.alert(`Clicked: ${node.id}`);
                    }}
                />
            )}

            <div className="absolute top-4 right-4 bg-white/90 p-2 rounded shadow text-xs border border-gray-300">
                <div className="font-bold mb-1">Legend</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-400"></span> 200 OK</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-400"></span> 3xx Redirect</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400"></span> 4xx Error</div>
            </div>
        </div>
    );
}
