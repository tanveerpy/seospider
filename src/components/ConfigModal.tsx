'use client';

import { useState } from 'react';
import { useCrawlerStore } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';

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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[500px] shadow-2xl border border-gray-300">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Crawl Configuration</h2>

                <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Custom Extraction</h3>
                    <div className="flex gap-2 mb-2">
                        <input
                            className="flex-1 border p-2 text-sm rounded"
                            placeholder="Extraction Name (e.g. Price)"
                            value={name} onChange={e => setName(e.target.value)}
                        />
                        <select
                            className="border p-2 text-sm rounded bg-gray-50"
                            value={type} onChange={e => setType(e.target.value as any)}
                        >
                            <option value="css">CSS Path</option>
                            <option value="regex">Regex</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 border p-2 text-sm rounded font-mono text-xs"
                            placeholder={type === 'css' ? '.product-price' : '/price:\\s*(\\$[0-9]+)/'}
                            value={value} onChange={e => setValue(e.target.value)}
                        />
                        <button
                            onClick={handleAdd}
                            className="bg-green-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-600"
                        >
                            ADD
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 border rounded h-40 overflow-auto p-2 mb-4">
                    {extractionRules.length === 0 && <div className="text-gray-400 text-sm text-center mt-10">No rules added.</div>}
                    {extractionRules.map(rule => (
                        <div key={rule.id} className="flex justify-between items-center bg-white p-2 mb-1 border rounded shadow-sm text-sm">
                            <div>
                                <span className="font-bold text-gray-700 mr-2">{rule.name}</span>
                                <span className="text-xs bg-gray-200 px-1 rounded mr-2">{rule.type}</span>
                                <span className="font-mono text-gray-500 text-xs">{rule.value}</span>
                            </div>
                            <button onClick={() => removeRule(rule.id)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-800 text-white px-6 py-2 rounded font-bold hover:bg-black"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
