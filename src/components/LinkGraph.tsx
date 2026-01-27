'use client';

import dynamic from 'next/dynamic';
import { useCrawlerStore } from '@/lib/store';
import { useMemo, useEffect, useState, useRef } from 'react';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function LinkGraph() {
    const { pages } = useCrawlerStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const updateSize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        // Initial measurement
        updateSize();

        // Resize with debounce
        const observer = new ResizeObserver((entries) => {
            requestAnimationFrame(() => updateSize());
        });

        if (containerRef.current) observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    const data = useMemo(() => {
        const nodes: any[] = [];
        const links: any[] = [];
        const pageList = Object.values(pages);

        if (pageList.length === 0) return { nodes: [], links: [] };

        // 1. Create Nodes
        pageList.forEach(p => {
            let color = '#22c55e'; // 200 OK (Green)
            if (p.status >= 300 && p.status < 400) color = '#3b82f6'; // 3xx (Blue)
            if (p.status >= 400 && p.status < 500) color = '#f59e0b'; // 4xx (Orange)
            if (p.status >= 500) color = '#ef4444'; // 5xx (Red)

            // Centrality / Size Calculation based on inlinks
            const inlinks = pageList.filter(other => other.links?.some(l => l.url === p.url)).length;
            const size = Math.min(10, 3 + Math.sqrt(inlinks));

            nodes.push({
                id: p.url,
                name: p.url, // Tooltip text
                color,
                val: size
            });
        });

        // 2. Create Links
        pageList.forEach(source => {
            source.links?.forEach(targetLink => {
                // Only create links if target exists in our graph (internal)
                if (pages[targetLink.url]) {
                    links.push({
                        source: source.url,
                        target: targetLink.url
                    });
                }
            });
        });

        return { nodes, links };
    }, [pages]);

    if (!mounted) return null;

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', background: '#020617', position: 'relative' }}>
            {data.nodes.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ marginBottom: '16px' }}>🕸️</div>
                        <div>Awaiting crawler data...</div>
                    </div>
                </div>
            ) : (
                <ForceGraph2D
                    graphData={data}
                    width={dimensions.width}
                    height={dimensions.height}
                    backgroundColor="#020617"

                    // Nodes
                    nodeLabel="name"
                    nodeColor="color"
                    nodeRelSize={4}

                    // Links
                    linkColor={() => 'rgba(255, 255, 255, 0.1)'}
                    linkWidth={1}
                    linkDirectionalParticles={2}
                    linkDirectionalParticleSpeed={0.005}
                    linkDirectionalParticleWidth={1.5}
                    linkDirectionalParticleColor={() => '#22c55e'}

                    // Physics
                    d3AlphaDecay={0.02}
                    d3VelocityDecay={0.3}
                    cooldownTicks={100}

                    onNodeClick={(node: any) => window.open(node.id, '_blank')}
                />
            )}
        </div>
    );
}
