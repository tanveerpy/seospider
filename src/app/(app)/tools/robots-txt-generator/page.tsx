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

            {/* --- SEO CONTENT SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-20 border-t border-white/5">
                <div className="lg:col-span-2 space-y-8">
                    <h2 className="text-3xl font-black italic text-white uppercase">Mastering Crawl Authorization</h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        The <code className="text-emerald-400">robots.txt</code> file is the first file search engine bots look for when visiting your site.
                        It acts as a gatekeeper, instructing crawlers which parts of your site they can and cannot access.
                        Proper configuration is essential for preserving your <strong>Crawl Budget</strong> and keeping sensitive admin pages out of the index.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                            <h3 className="font-bold text-white mb-2">User-Agent Targeting</h3>
                            <p className="text-xs text-slate-400">Specify rules for <em>Googlebot</em>, <em>Bingbot</em>, or <em>GPTBot</em> individually to block AI scrapers while allowing search indexers.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                            <h3 className="font-bold text-white mb-2">Disallow Directives</h3>
                            <p className="text-xs text-slate-400">Prevent crawling of low-value parameters (e.g., <code className="text-emerald-500">?sort=price</code>) to avoid duplicate content penalties.</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4">Common Mistakes</h3>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li className="flex items-start gap-3">
                            <span className="text-red-500 font-bold">✕</span>
                            <span>Blocking CSS/JS files (Google needs these to render)</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-500 font-bold">✕</span>
                            <span>Using 'Disallow' to hide private content (Use password protection instead)</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-500 font-bold">✕</span>
                            <span>Forgetting to declare your Sitemap location</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
