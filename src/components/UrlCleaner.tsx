'use client';

import React, { useState } from 'react';
import { Link2, Copy, Check } from 'lucide-react';

export default function UrlCleaner() {
    const [input, setInput] = useState('');
    const [copied, setCopied] = useState(false);

    const cleanUrl = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove non-word/space/hyphen
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Trim hyphens
    };

    const output = cleanUrl(input);

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ background: 'rgba(30, 41, 59, 0.3)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Link2 size={20} color="#a855f7" />
                <h3 style={{ margin: 0, fontSize: '16px' }}>Slug & URL Cleaner</h3>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>Input Text (e.g. Blog Title)</label>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="How to Optimize Your Site in 2026!"
                    className="sf-input"
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                />
            </div>

            <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>SEO-Friendly Slug</label>
                <div style={{
                    background: '#0f172a',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#a5b4fc',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    minHeight: '54px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    {output || <span style={{ color: 'rgba(255,255,255,0.1)' }}>waiting for input...</span>}
                </div>
                <button
                    onClick={handleCopy}
                    disabled={!output}
                    style={{
                        position: 'absolute',
                        top: '28px',
                        right: '8px',
                        background: copied ? '#22c55e' : 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px',
                        cursor: output ? 'pointer' : 'default',
                        color: '#fff',
                        transition: 'all 0.2s',
                        opacity: output ? 1 : 0.5
                    }}
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
            </div>

            <div style={{ marginTop: '16px', fontSize: '11px', color: '#64748b' }}>
                Auto-converts to lowercase, removes special characters, and replaces spaces with hyphens for clean URL structures.
            </div>
        </div>
    );
}
