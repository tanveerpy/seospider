import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
    try {
        const { url, rules } = await request.json();

        if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

        let targetUrlObj;
        try {
            targetUrlObj = new URL(url);
        } catch {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        const start = Date.now();
        let response;
        try {
            response = await axios.get(url, {
                headers: { 'User-Agent': 'SpiderFrog/1.0 (Compatible; Googlebot/2.1)' },
                timeout: 10000,
                validateStatus: () => true
            });
        } catch (e: any) {
            return NextResponse.json({
                url, status: 0, error: e.message || 'Network Error', links: [], assets: [], customData: {}
            });
        }

        const time = Date.now() - start;
        const contentType = response.headers['content-type'] || '';

        const pageData: any = {
            url,
            status: response.status,
            contentType: contentType.split(';')[0],
            size: response.headers['content-length'] ? parseInt(response.headers['content-length']) : 0,
            time,
            links: [],
            assets: [],
            details: {
                title: '',
                description: '',
                h1: '',
                h2: [],
                wordCount: 0,
                canonical: '',
                metaRobots: '',
                xRobotsTag: response.headers['x-robots-tag'] || '',
                hreflang: [],
                relNext: '',
                relPrev: '',
                amphtml: '',
                structuredData: []
            },
            customData: {},
            issues: []
        };

        if (contentType.includes('text/html')) {
            const $ = cheerio.load(response.data);
            const htmlString = response.data;

            // --- Metadata ---
            pageData.details.title = $('title').text().trim() || '';
            pageData.details.description = $('meta[name="description"]').attr('content') || '';
            pageData.details.h1 = $('h1').first().text().trim() || '';

            // H2s
            $('h2').each((_, el) => {
                const text = $(el).text().trim();
                if (text) pageData.details.h2.push(text);
            });

            // Canonicals & Pagination
            pageData.details.canonical = $('link[rel="canonical"]').attr('href') || '';
            pageData.details.relNext = $('link[rel="next"]').attr('href') || '';
            pageData.details.relPrev = $('link[rel="prev"]').attr('href') || '';
            pageData.details.amphtml = $('link[rel="amphtml"]').attr('href') || '';

            // Meta Robots
            pageData.details.metaRobots = $('meta[name="robots"]').attr('content') || '';

            // Hreflang
            $('link[rel="alternate"][hreflang]').each((_, el) => {
                pageData.details.hreflang.push({
                    lang: $(el).attr('hreflang'),
                    url: $(el).attr('href')
                });
            });

            // Structured Data (JSON-LD)
            $('script[type="application/ld+json"]').each((_, el) => {
                try {
                    const json = JSON.parse($(el).html() || '{}');
                    pageData.details.structuredData.push(json);
                } catch { }
            });

            const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
            pageData.details.wordCount = bodyText ? bodyText.split(' ').length : 0;

            // --- Custom Extraction Execution ---
            if (rules && Array.isArray(rules)) {
                rules.forEach((rule: any) => {
                    const results: string[] = [];
                    try {
                        if (rule.type === 'css') {
                            $(rule.value).each((_, el) => {
                                results.push($(el).text().trim());
                            });
                        } else if (rule.type === 'regex') {
                            const regex = new RegExp(rule.value, 'g');
                            let match;
                            while ((match = regex.exec(htmlString)) !== null) {
                                results.push(match[1] || match[0]);
                            }
                        }
                    } catch (e) {
                        results.push('Extraction Error');
                    }
                    if (results.length > 0) {
                        pageData.customData[rule.name] = results;
                    }
                });
            }

            // --- Issue Detection ---
            if (!pageData.details.title) pageData.issues.push('Missing Title');
            if (pageData.details.title.length > 60) pageData.issues.push('Title Too Long');
            if (pageData.details.title.length < 30 && pageData.details.title.length > 0) pageData.issues.push('Title Too Short');

            if (!pageData.details.description) pageData.issues.push('Missing Meta Description');
            if (pageData.details.description.length > 155) pageData.issues.push('Meta Description Too Long');

            if (!pageData.details.h1) pageData.issues.push('Missing H1');
            if ($('h1').length > 1) pageData.issues.push('Multiple H1s');
            if (pageData.details.h1 === pageData.details.title) pageData.issues.push('Dup H1 & Title');

            if (pageData.details.wordCount < 200) pageData.issues.push('Low Content Word Count');

            if (response.status >= 400) pageData.issues.push(`Status ${response.status}`);
            if (pageData.details.canonical && pageData.details.canonical !== url) pageData.issues.push('Canonicalized');

            // --- Link Extraction ---
            $('a').each((_, el) => {
                const href = $(el).attr('href');
                if (href) {
                    try {
                        const absUrl = new URL(href, url).href;
                        if (absUrl.startsWith('http')) {
                            const isInternal = new URL(absUrl).hostname === targetUrlObj.hostname;
                            pageData.links.push({
                                url: absUrl,
                                type: isInternal ? 'internal' : 'external'
                            });
                        }
                    } catch { }
                }
            });

            // --- Asset Extraction ---
            const addAsset = (src: string | undefined, type: string, extra?: any) => {
                if (src) {
                    try {
                        const abs = new URL(src, url).href;
                        pageData.assets.push({ url: abs, type, ...extra });
                    } catch { }
                }
            };

            $('img').each((_, el) => {
                addAsset($(el).attr('src'), 'image', { alt: $(el).attr('alt') || '' });
                if (!$(el).attr('alt')) pageData.issues.push('Missing Alt Text');
                if ($(el).attr('src') && $(el).attr('src')!.length > 1000) pageData.issues.push('Long Image URL');
            });
            $('link[rel="stylesheet"]').each((_, el) => addAsset($(el).attr('href'), 'css'));
            $('script[src]').each((_, el) => addAsset($(el).attr('src'), 'javascript'));
        }

        return NextResponse.json(pageData);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
