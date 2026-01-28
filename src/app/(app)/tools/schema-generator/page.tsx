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

            {/* --- SEO CONTENT SECTION --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-20 border-t border-white/5">
                <div className="md:col-span-2 text-center max-w-2xl mx-auto mb-8">
                    <h2 className="text-3xl font-black italic text-white uppercase">Speak Search Engine Fluidly</h2>
                    <p className="text-slate-400 mt-4 leading-relaxed">
                        Structured data is a standardized format for providing information about a page and classifying the page content.
                        By using <strong>Schema.org</strong> vocabulary, you help Google define entities, relationships, and actions on your site.
                    </p>
                </div>

                <div className="glass-card p-8 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-4">Why JSON-LD?</h3>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                        JSON-LD (JavaScript Object Notation for Linked Data) is the recommended format by Google. Unlike Microdata, it doesn't clutter your HTML tags and is easier to maintain.
                    </p>
                    <div className="p-4 bg-black/40 rounded-xl font-mono text-xs text-emerald-400 border border-white/5">
                        {`{ "@context": "https://schema.org", "@type": "Organization" ... }`}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Rich Snippet Benefits</h3>
                    <ul className="space-y-4">
                        <li className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xs">01</div>
                            <div>
                                <h4 className="font-bold text-white">Enhanced Visibility</h4>
                                <p className="text-xs text-slate-400 mt-1">Gain star ratings, price information, and images directly in SERPs.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xs">02</div>
                            <div>
                                <h4 className="font-bold text-white">Voice Search Readiness</h4>
                                <p className="text-xs text-slate-400 mt-1">Structured data powers answers for Google Assistant and Alexa.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xs">03</div>
                            <div>
                                <h4 className="font-bold text-white">Knowledge Graph Entitles</h4>
                                <p className="text-xs text-slate-400 mt-1">Firmly establish your brand entity in Google's Knowledge Graph.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
