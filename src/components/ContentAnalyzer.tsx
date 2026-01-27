'use client';

import React, { useState, useEffect } from 'react';
import { AlignLeft, BookOpen, AlertCircle } from 'lucide-react';

export default function ContentAnalyzer() {
    const [text, setText] = useState('');
    const [stats, setStats] = useState({
        words: 0,
        chars: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
        gradeLevel: 0,
        readingEase: 0
    });

    useEffect(() => {
        if (!text.trim()) {
            setStats({ words: 0, chars: 0, sentences: 0, paragraphs: 0, readingTime: 0, gradeLevel: 0, readingEase: 0 });
            return;
        }

        const words = text.trim().split(/\s+/).length;
        const chars = text.length;
        const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
        const paragraphs = text.split(/\n\n+/).filter(Boolean).length || 1;

        // Syllable estimation (heuristic)
        const syllables = text.toLowerCase().split(/[^a-z]/).filter(Boolean).reduce((acc, word) => {
            word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
            word = word.replace(/^y/, '');
            const match = word.match(/[aeiouy]{1,2}/g);
            return acc + (match ? match.length : 1);
        }, 0);

        // Flesch-Kincaid Grade Level
        // 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
        const gradeLevel = (0.39 * (words / sentences)) + (11.8 * (syllables / words)) - 15.59;

        // Flesch Reading Ease
        // 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
        const readingEase = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));

        setStats({
            words,
            chars,
            sentences,
            paragraphs,
            readingTime: Math.ceil(words / 200), // Avg reading speed 200 wpm
            gradeLevel: Math.max(0, parseFloat(gradeLevel.toFixed(1))),
            readingEase: Math.max(0, Math.min(100, parseFloat(readingEase.toFixed(1))))
        });

    }, [text]);

    const getReadingEaseLabel = (score: number) => {
        if (score >= 90) return { text: 'Very Easy', color: '#22c55e' };
        if (score >= 80) return { text: 'Easy', color: '#4ade80' };
        if (score >= 70) return { text: 'Fairly Easy', color: '#86efac' };
        if (score >= 60) return { text: 'Standard', color: '#facc15' };
        if (score >= 50) return { text: 'Fairly Difficult', color: '#f59e0b' };
        if (score >= 30) return { text: 'Difficult', color: '#ef4444' };
        return { text: 'Very Difficult', color: '#b91c1c' };
    };

    const ease = getReadingEaseLabel(stats.readingEase);

    return (
        <div style={{ background: 'rgba(30, 41, 59, 0.3)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <BookOpen size={20} color="#f472b6" />
                <h3 style={{ margin: 0, fontSize: '16px' }}>Content Readability & Stats</h3>
            </div>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your content here to analyze..."
                style={{
                    width: '100%',
                    height: '150px',
                    padding: '16px',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    resize: 'none',
                    marginBottom: '24px'
                }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>{stats.words}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Words</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>{stats.sentences}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Sentences</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>{stats.readingTime}m</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Read Time</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>{stats.gradeLevel}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Grade Level</div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: ease.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#000' }}>
                        {Math.round(stats.readingEase)}
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, color: '#fff' }}>Reading Ease Score</div>
                        <div style={{ fontSize: '12px', color: ease.color }}>{ease.text}</div>
                    </div>
                </div>
                <div style={{ maxWidth: '200px', fontSize: '11px', color: '#64748b', textAlign: 'right' }}>
                    Higher scores indicate easier reading. Aim for 60-70 for general web content.
                </div>
            </div>
        </div>
    );
}
