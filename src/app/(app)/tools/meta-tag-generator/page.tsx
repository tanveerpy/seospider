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

            {/* --- SEO CONTENT SECTION --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-20 border-t border-white/5">
                <div className="space-y-6">
                    <h2 className="text-2xl font-black italic text-white uppercase">Why Meta Tags Matter for SEO</h2>
                    <p className="text-slate-400 leading-relaxed">
                        Meta tags are snippets of text that describe a page's content; the meta tags don't appear on the page itself, but only in the page's source code.
                        They are essentially little content descriptors that help tell search engines what a web page is about.
                    </p>
                    <ul className="space-y-3 text-slate-400">
                        <li className="flex gap-3">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>Improve Click-Through Rates (CTR) from SERPs</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>Control social media preview cards (Open Graph)</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>Prevent duplicate content issues with canonicals</span>
                        </li>
                    </ul>
                </div>
                <div className="space-y-8">
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-2">Title Tag Length</h3>
                        <p className="text-sm text-slate-400">
                            Google typically displays the first <strong>50–60 characters</strong> of a title tag. If you keep your titles under 60 characters, our research suggests that you can expect about 90% of your titles to display properly.
                        </p>
                    </div>
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-2">Meta Description Tips</h3>
                        <p className="text-sm text-slate-400">
                            While meta descriptions don't directly influence rankings, they are crucial for <strong>user engagement</strong>. Treat them as ad copy—include a call to action and relevant keywords to bold them in search results.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
