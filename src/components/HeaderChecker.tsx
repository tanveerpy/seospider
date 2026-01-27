'use client';

import React, { useState } from 'react';
import { Activity, ArrowRight, Shield, Globe, Clock, Server } from 'lucide-react';

export default function HeaderChecker() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const checkHeaders = async () => {
        if (!url) return;
        setLoading(true);
        setResult(null);
        try {
            const start = Date.now();
            // Use CORS proxy for client-side check
            const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, {
                method: 'GET' // Proxy usually expects GET
            });
            const time = Date.now() - start;

            // Extract headers (Note: Proxy might add/remove some)
            const headers: Record<string, string> = {};
            res.headers.forEach((val, key) => {
                headers[key] = val;
            });

            setResult({
                status: res.status,
                time,
                headers
            });
        } catch (e: any) {
            console.error(e);
            setResult({
                status: 0,
                time: 0,
                error: 'Connection Failed (CORS or Network Error)'
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return '#22c55e'; // Green
        if (status >= 300 && status < 400) return '#3b82f6'; // Blue
        if (status >= 400 && status < 500) return '#f59e0b'; // Orange
        if (status >= 500) return '#ef4444'; // Red
        return '#94a3b8';
    };

    return (
        <div style={{ background: 'rgba(30, 41, 59, 0.3)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Activity size={20} color="#10b981" />
                <h3 style={{ margin: 0, fontSize: '16px' }}>Server Status & Headers</h3>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && checkHeaders()}
                    placeholder="https://example.com"
                    className="sf-input"
                    style={{
                        flex: 1,
                        padding: '10px 12px',
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '13px'
                    }}
                />
                <button
                    onClick={checkHeaders}
                    disabled={loading}
                    className="glow-btn"
                    style={{ padding: '0 16px', fontSize: '13px' }}
                >
                    {loading ? '...' : <ArrowRight size={16} />}
                </button>
            </div>

            {result && (
                <div className="animate-in" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        borderLeft: `4px solid ${getStatusColor(result.status)}`
                    }}>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: 800, color: getStatusColor(result.status) }}>{result.status || 'ERR'}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Status Code</div>
                        </div>
                        <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{result.time}ms</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Response Time</div>
                        </div>
                    </div>

                    <div style={{ overflow: 'auto', flex: 1, fontSize: '12px', fontFamily: 'monospace' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                {Object.entries(result.headers || {}).map(([key, value]: any) => (
                                    <tr key={key} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '8px 0', color: '#94a3b8', width: '40%' }}>{key}</td>
                                        <td style={{ padding: '8px 0', color: '#a5b4fc', wordBreak: 'break-all' }}>{value}</td>
                                    </tr>
                                ))}
                                {(!result.headers || Object.keys(result.headers).length === 0) && (
                                    <tr><td colSpan={2} style={{ padding: '10px', color: '#ef4444' }}>{result.error || 'No headers received'}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
