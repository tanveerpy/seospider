'use client';
import React from 'react';
import RobotsTxtGenerator from '@/components/RobotsTxtGenerator';

export default function RobotsGeneratorPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                    Robots.txt <span className="text-yellow-500">Generator</span>
                </h1>
                <p className="text-slate-400 mt-2">Configure crawl instructions for search engine bots.</p>
            </div>
            <RobotsTxtGenerator />
        </div>
    );
}
