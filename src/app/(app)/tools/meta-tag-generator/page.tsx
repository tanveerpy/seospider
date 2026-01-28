'use client';
import React from 'react';
import MetaTagGenerator from '@/components/MetaTagGenerator';

export default function MetaTagGeneratorPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                    Meta Tag <span className="text-cyan-500">Generator</span>
                </h1>
                <p className="text-slate-400 mt-2">Create SEO-optimized meta tags with live SERP preview.</p>
            </div>
            <MetaTagGenerator />
        </div>
    );
}
