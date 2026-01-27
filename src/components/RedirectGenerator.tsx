'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, ArrowRightLeft, Server } from 'lucide-react';

export default function RedirectGenerator() {
    const [source, setSource] = useState('/old-page');
    const [target, setTarget] = useState('/new-page');
    const [type, setType] = useState('301');
    const [server, setServer] = useState('apache');
    const [code, setCode] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let generated = '';
        if (server === 'apache') {
            generated = `Redirect ${type} ${source} ${target}`;
        } else if (server === 'nginx') {
            const nginxType = type === '301' ? 'permanent' : 'redirect';
            generated = `rewrite ^${source}/?$ ${target} ${nginxType};`;
        } else if (server === 'nextjs') {
            generated = `// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '${source}',
        destination: '${target}',
        permanent: ${type === '301'},
      },
    ]
  },
}`;
        } else if (server === 'shopify') {
            generated = `Link: Instructions
1. Go to Online Store > Navigation
2. Click 'URL Redirects'
3. Click 'Create URL Redirect'
4. Redirect from: ${source}
5. Redirect to: ${target}`;
        }

        setCode(generated);
    }, [source, target, type, server]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ marginTop: '24px', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <ArrowRightLeft size={20} color="#f59e0b" />
                <h3 style={{ margin: 0, fontSize: '16px' }}>Redirect Rule Generator</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Inputs */}
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Redirect Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    background: '#0f172a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    fontSize: '13px'
                                }}
                            >
                                <option value="301">301 (Permanent)</option>
                                <option value="302">302 (Temporary)</option>
                                <option value="307">307 (Temporary)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Server / Platform</label>
                            <select
                                value={server}
                                onChange={(e) => setServer(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    background: '#0f172a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    fontSize: '13px'
                                }}
                            >
                                <option value="apache">Apache (.htaccess)</option>
                                <option value="nginx">Nginx</option>
                                <option value="nextjs">Next.js Config</option>
                                <option value="shopify">Shopify Admin</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Old URL (Source)</label>
                        <input
                            className="sf-input"
                            value={source}
                            onChange={e => setSource(e.target.value)}
                            placeholder="/old-page"
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '13px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>New URL (Target)</label>
                        <input
                            className="sf-input"
                            value={target}
                            onChange={e => setTarget(e.target.value)}
                            placeholder="/new-page"
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '13px'
                            }}
                        />
                    </div>

                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '16px', lineHeight: '1.5' }}>
                        <strong style={{ color: '#94a3b8' }}>Tip:</strong> Before implementing redirects, ensure the target page exists and returns a 200 OK status to avoid redirect chains.
                    </div>
                </div>

                {/* Output */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        background: '#0f172a',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        height: '100%',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                        color: '#a5b4fc',
                        display: 'flex',
                        alignItems: 'center'
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
