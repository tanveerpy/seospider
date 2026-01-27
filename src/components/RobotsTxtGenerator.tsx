'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, FileText } from 'lucide-react';

export default function RobotsTxtGenerator() {
    const [agents, setAgents] = useState([{ name: '*', disallow: ['/admin', '/private'], allow: [] }]);
    const [sitemap, setSitemap] = useState('');
    const [code, setCode] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let generated = '';
        agents.forEach(agent => {
            generated += `User-agent: ${agent.name}\n`;
            agent.disallow.forEach(path => {
                generated += `Disallow: ${path}\n`;
            });
            agent.allow.forEach(path => {
                generated += `Allow: ${path}\n`;
            });
            generated += '\n';
        });

        if (sitemap) {
            generated += `Sitemap: ${sitemap}`;
        }

        setCode(generated.trim());
    }, [agents, sitemap]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const addDisallow = (idx: number, val: string) => {
        if (!val) return;
        const newAgents = [...agents];
        newAgents[idx].disallow.push(val);
        setAgents(newAgents);
    };

    return (
        <div style={{ background: 'rgba(30, 41, 59, 0.3)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <FileText size={20} color="#3b82f6" />
                <h3 style={{ margin: 0, fontSize: '16px' }}>Robots.txt Generator</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Sitemap URL</label>
                        <input
                            className="sf-input"
                            value={sitemap}
                            onChange={(e) => setSitemap(e.target.value)}
                            placeholder="https://example.com/sitemap.xml"
                            style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }}
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Disallow Path</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                id="new-disallow"
                                className="sf-input"
                                placeholder="/admin"
                                style={{ flex: 1, padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addDisallow(0, e.currentTarget.value);
                                        e.currentTarget.value = '';
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    const el = document.getElementById('new-disallow') as HTMLInputElement;
                                    addDisallow(0, el.value);
                                    el.value = '';
                                }}
                                className="glow-btn"
                                style={{ padding: '8px 16px', fontSize: '12px' }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ position: 'relative' }}>
                    <div style={{
                        background: '#0f172a',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        height: '250px',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                        color: '#a5b4fc'
                    }}>
                        {code}
                    </div>
                    <button
                        onClick={handleCopy}
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: copied ? '#22c55e' : 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px',
                            cursor: 'pointer',
                            color: '#fff',
                            transition: 'all 0.2s'
                        }}
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
