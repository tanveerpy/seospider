'use client';

import React, { useState } from 'react';
import { useCrawlerStore } from '@/lib/store';
import { Type, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface KeywordData {
    word: string;
    count: number;
    density: number;
}

export default function KeywordDensityTool() {
    const { pages } = useCrawlerStore();
    const pageList = Object.values(pages);
    const [selectedUrl, setSelectedUrl] = useState<string>(pageList[0]?.url || '');
    const [textInput, setTextInput] = useState('');
    const [mode, setMode] = useState<'url' | 'text'>('url');
    const [ngram, setNgram] = useState(1);

    const analyzeText = (text: string) => {
        if (!text) return [];
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 3) // Filter short words
            .filter(w => !['this', 'that', 'with', 'from', 'have', 'your'].includes(w)); // Basic stop words

        let phrases = words;
        if (ngram === 2) {
            phrases = words.map((w, i) => i < words.length - 1 ? `${w} ${words[i + 1]}` : '').filter(Boolean);
        }

        const counts: Record<string, number> = {};
        phrases.forEach(w => counts[w] = (counts[w] || 0) + 1);

        const total = phrases.length;
        return Object.entries(counts)
            .map(([word, count]) => ({
                word,
                count,
                density: parseFloat(((count / total) * 100).toFixed(2))
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    };

    // Calculate data based on current inputs
    let textToAnalyze = textInput;
    if (mode === 'url' && selectedUrl && pages[selectedUrl]) {
        // We don't save body text in store currently to save memory, 
        // so we will simulate analysis on Title + Description + Headers for now
        // In a real app, we'd fetch the content or store it.
        const p = pages[selectedUrl].details;
        textToAnalyze = `${p.title} ${p.description} ${p.h1} ${p.h2.join(' ')}`;
    }

    const data: KeywordData[] = analyzeText(textToAnalyze);

    return (
        <div style={{ background: 'rgba(30, 41, 59, 0.3)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Type size={20} color="#3b82f6" />
                <h3 style={{ margin: 0, fontSize: '16px' }}>Keyword Density Analyzer</h3>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <button
                    className={`glow-btn ${mode === 'url' ? 'active' : ''}`}
                    onClick={() => setMode('url')}
                    style={{ fontSize: '12px', background: mode === 'url' ? '#3b82f6' : 'rgba(255,255,255,0.05)' }}
                >
                    From Crawl
                </button>
                <button
                    className={`glow-btn ${mode === 'text' ? 'active' : ''}`}
                    onClick={() => setMode('text')}
                    style={{ fontSize: '12px', background: mode === 'text' ? '#3b82f6' : 'rgba(255,255,255,0.05)' }}
                >
                    Manual Text
                </button>
            </div>

            {mode === 'url' ? (
                <div style={{ marginBottom: '16px' }}>
                    <select
                        value={selectedUrl}
                        onChange={(e) => setSelectedUrl(e.target.value)}
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
                        {pageList.length === 0 && <option>No pages crawled yet</option>}
                        {pageList.map(p => (
                            <option key={p.url} value={p.url}>{p.url}</option>
                        ))}
                    </select>
                    <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                        * Analyzes Title, Meta Description, H1, and H2 tags from crawl data.
                    </p>
                </div>
            ) : (
                <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste text content here..."
                    style={{
                        width: '100%',
                        height: '100px',
                        padding: '12px',
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '12px',
                        resize: 'none',
                        marginBottom: '16px'
                    }}
                />
            )}

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button
                    onClick={() => setNgram(1)}
                    style={{ flex: 1, padding: '4px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: ngram === 1 ? 'rgba(255,255,255,0.1)' : 'transparent', color: '#fff', cursor: 'pointer', fontSize: '12px' }}
                >
                    1-Word
                </button>
                <button
                    onClick={() => setNgram(2)}
                    style={{ flex: 1, padding: '4px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: ngram === 2 ? 'rgba(255,255,255,0.1)' : 'transparent', color: '#fff', cursor: 'pointer', fontSize: '12px' }}
                >
                    2-Word
                </button>
            </div>

            <div style={{ height: '200px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="word" type="category" width={80} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                        <Tooltip
                            contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
