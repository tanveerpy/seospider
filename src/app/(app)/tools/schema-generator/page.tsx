'use client';
import React from 'react';
import SchemaGenerator from '@/components/SchemaGenerator';

export default function SchemaGeneratorPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                    Schema <span className="text-emerald-500">Generator</span>
                </h1>
                <p className="text-slate-400 mt-2">Generate JSON-LD structured data for your website.</p>
            </div>
            <SchemaGenerator />
        </div>
    );
}
