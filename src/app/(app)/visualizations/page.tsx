'use client';

import React from 'react';
import LinkGraph from '@/components/LinkGraph';
import { Share2, ZoomIn, Maximize2 } from 'lucide-react';

export default function Visualizations() {
    return (
        <div className="main-viewport animate-in" style={{ height: 'calc(100vh - 120px)' }}>
            <div className="flex-between">
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>Network Topology</h1>
                    <p style={{ color: '#94a3b8', marginTop: '4px' }}>Hierarchical link graph and relationship mapping.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div className="badge badge-blue">Force-Directed Simulation</div>
                </div>
            </div>

            <div className="glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8PX' }}>
                    <div className="glass-panel" style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.8)' }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>GRAPH CONTROLS</div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><ZoomIn size={16} /></button>
                            <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><Maximize2 size={16} /></button>
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%', height: '100%' }}>
                    <LinkGraph />
                </div>

                {/* Legend */}
                <div style={{ position: 'absolute', bottom: '24px', right: '24px', padding: '16px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '8px' }}>LEGEND</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div>
                            <span>Internal Page</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div>
                            <span>Broken URL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
