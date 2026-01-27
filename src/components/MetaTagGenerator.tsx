'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Search, Eye } from 'lucide-react';

export default function MetaTagGenerator() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [robots, setRobots] = useState('index, follow');
    const [keywords, setKeywords] = useState('');
    const [author, setAuthor] = useState('');
    const [code, setCode] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let generated = `<!-- HTML Meta Tags -->\n`;
        if (title) generated += `<title>${title}</title>\n`;
        if (description) generated += `<meta name="description" content="${description}">\n`;
        if (keywords) generated += `<meta name="keywords" content="${keywords}">\n`;
        if (author) generated += `<meta name="author" content="${author}">\n`;
        if (robots !== 'index, follow') generated += `<meta name="robots" content="${robots}">\n`;

        // Open Graph
        generated += `\n<!-- Open Graph / Facebook -->\n`;
        generated += `<meta property="og:type" content="website">\n`;
        if (title) generated += `<meta property="og:title" content="${title}">\n`;
        if (description) generated += `<meta property="og:description" content="${description}">\n`;

        // Twitter
        generated += `\n<!-- Twitter -->\n`;
        generated += `<meta property="twitter:card" content="summary_large_image">\n`;
        if (title) generated += `<meta property="twitter:title" content="${title}">\n`;
        if (description) generated += `<meta property="twitter:description" content="${description}">\n`;

        setCode(generated);
    }, [title, description, robots, keywords, author]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ marginTop: '24px', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Search size={20} color="#3b82f6" />
                <h3 style={{ margin: 0, fontSize: '16px' }}>Meta Tag Generator & SERP Preview</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Inputs */}
                <div>
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Page Title ({title.length}/60)</label>
                        <input
                            className="sf-input"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            maxLength={70}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                background: 'rgba(0,0,0,0.2)',
                                border: title.length > 60 ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '13px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Meta Description ({description.length}/160)</label>
                        <textarea
                            className="sf-input"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            maxLength={170}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                background: 'rgba(0,0,0,0.2)',
                                border: description.length > 160 ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '13px',
                                resize: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Robots Directives</label>
                            <select
                                value={robots}
                                onChange={(e) => setRobots(e.target.value)}
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
                                <option value="index, follow">Index, Follow</option>
                                <option value="noindex, follow">Noindex, Follow</option>
                                <option value="index, nofollow">Index, Nofollow</option>
                                <option value="noindex, nofollow">Noindex, Nofollow</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Author</label>
                            <input
                                className="sf-input"
                                value={author}
                                onChange={e => setAuthor(e.target.value)}
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
                    </div>
                </div>

                {/* Preview & Output */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Google SERP Preview */}
                    <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <GlobeIcon />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                <span style={{ fontSize: '12px', color: '#202124', fontWeight: 500 }}>Example Site</span>
                                <span style={{ fontSize: '10px', color: '#4d5156' }}>https://example.com</span>
                            </div>
                        </div>
                        <div style={{ fontSize: '18px', color: '#1a0dab', fontWeight: 400, cursor: 'pointer', marginBottom: '2px', lineHeight: '1.2' }}>
                            {title || 'Example Page Title'}
                        </div>
                        <div style={{ fontSize: '13px', color: '#4d5156', lineHeight: '1.4' }}>
                            {description || 'This is an example meta description that will show up in search results. It helps users understand what your page is about before clicking.'}
                        </div>
                    </div>

                    {/* Code Output */}
                    <div style={{ position: 'relative', flex: 1 }}>
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
                            minHeight: '150px'
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
        </div>
    );
}

function GlobeIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
    )
}
