'use client';

import React, { useState } from 'react';
import { useCrawlerStore } from '@/lib/store';
import { Copy, Check, GitBranch } from 'lucide-react';

export default function SitemapGenerator() {
    const { pages } = useCrawlerStore();
    const [copied, setCopied] = useState(false);

    // Filter only 200 OK pages for sitemap
    const validPages = Object.values(pages).filter(p => p.status === 200);

    const generateSitemap = () => {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        validPages.forEach(page => {
            xml += `  <url>\n`;
            xml += `    <loc>${page.url}</loc>\n`;
            xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
            xml += `    <changefreq>monthly</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += `  </url>\n`;
        });

        xml += `</urlset>`;
        return xml;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateSitemap());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([generateSitemap()], { type: 'text/xml' });
        element.href = URL.createObjectURL(file);
        element.download = "sitemap.xml";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div style={{ background: 'rgba(30, 41, 59, 0.3)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <GitBranch size={20} color="#3b82f6" />
                <h3 style={{ margin: 0, fontSize: '16px' }}>XML Sitemap Generator</h3>
            </div>

            <div style={{ marginBottom: '16px', fontSize: '13px', color: '#94a3b8' }}>
                Generated from <strong>{validPages.length}</strong> indexable URLs currently in inventory.
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
                    color: '#a5b4fc',
                    marginBottom: '16px'
                }}>
                    {generateSitemap()}
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

            <button className="glow-btn" style={{ width: '100%' }} onClick={handleDownload}>
                Download sitemap.xml
            </button>
        </div>
    );
}
