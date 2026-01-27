'use client';

import { useState } from 'react';
import { useCrawlerStore } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';
import { X, Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export default function ConfigModal({ onClose }: { onClose: () => void }) {
    const { extractionRules, addRule, removeRule } = useCrawlerStore();
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [type, setType] = useState<'css' | 'regex'>('css');

    const handleAdd = () => {
        if (!name || !value) return;
        addRule({ id: uuidv4(), name, type, value });
        setName('');
        setValue('');
    };

    return (
        <div className="sf-modal-overlay animate-in">
            <div className="sf-modal-content glass-panel" style={{ width: '600px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex-between" style={{ marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Configuration</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '16px', letterSpacing: '1px' }}>
                        Custom Data Extraction
                    </h3>

                    {/* Input Group */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '8px', marginBottom: '8px' }}>
                        <input
                            className="sf-input"
                            style={{
                                padding: '10px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none'
                            }}
                            placeholder="Field Name (e.g. Price, Author)"
                            value={name} onChange={e => setName(e.target.value)}
                        />
                        <div style={{ position: 'relative' }}>
                            <select
                                style={{
                                    width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none', appearance: 'none', cursor: 'pointer'
                                }}
                                value={type} onChange={e => setType(e.target.value as any)}
                            >
                                <option value="css">CSS Selector</option>
                                <option value="regex">Regex Pattern</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            className="sf-input"
                            style={{
                                flex: 1, padding: '10px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px', color: '#fff', fontFamily: 'monospace', fontSize: '12px', outline: 'none'
                            }}
                            placeholder={type === 'css' ? '.product-price' : '/price:\\s*(\\$[0-9]+)/'}
                            value={value} onChange={e => setValue(e.target.value)}
                        />
                        <button
                            onClick={handleAdd}
                            className="glow-btn"
                            style={{ padding: '0 20px', borderRadius: '8px' }}
                        >
                            <Plus size={16} /> Add
                        </button>
                    </div>
                </div>

                {/* Rules List */}
                <div style={{
                    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px',
                    height: '240px', overflowY: 'auto', padding: '12px'
                }}>
                    {extractionRules.length === 0 && (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                            <div style={{ fontSize: '13px' }}>No active rules</div>
                            <div style={{ fontSize: '11px', marginTop: '4px' }}>Add a rule to scrape custom data</div>
                        </div>
                    )}
                    {extractionRules.map(rule => (
                        <div key={rule.id} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: 'rgba(255,255,255,0.03)', padding: '10px', marginBottom: '8px',
                            borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', gap: '12px' }}>
                                <span style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '13px' }}>{rule.name}</span>
                                <span style={{
                                    fontSize: '10px', background: rule.type === 'css' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                    color: rule.type === 'css' ? '#4ade80' : '#60a5fa',
                                    padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700
                                }}>
                                    {rule.type}
                                </span>
                                <span style={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                    {rule.value}
                                </span>
                            </div>
                            <button
                                onClick={() => removeRule(rule.id)}
                                style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)',
                            padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '13px'
                        }}
                    >
                        Save & Close
                    </button>
                </div>
            </div>
        </div>
    );
}
