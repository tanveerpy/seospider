
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PageData } from './store';

// Use a CORS proxy to bypass browser restrictions
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export async function crawlPageClientSide(url: string, rules: any = []): Promise<PageData> {
    try {
        const targetUrl = new URL(url);
        const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;

        const start = Date.now();
        const response = await axios.get(proxyUrl);
        const time = Date.now() - start;

        const contentType = response.headers['content-type'] || '';
        const html = response.data;

        const pageData: PageData = {
            url,
            status: response.status,
            contentType: contentType.split(';')[0],
            size: html.length,
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
                xRobotsTag: '', // Hard to get via proxy usually
                hreflang: [],
                relNext: '',
                relPrev: '',
                amphtml: '',
                structuredData: []
            },
            customData: {},
            issues: []
        };

        if (typeof html === 'string') {
            const $ = cheerio.load(html);

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
                    lang: $(el).attr('hreflang') || '',
                    url: $(el).attr('href') || ''
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
                            while ((match = regex.exec(html)) !== null) {
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

            // --- Comprehensive Issue Detection ---
            // Response Codes
            if (response.status >= 400) pageData.issues.push(`Response Codes: Internal Client Error (${response.status})`);

            // Page Titles
            if (!pageData.details.title) pageData.issues.push('Page Titles: Missing');
            else {
                if (pageData.details.title.length > 60) pageData.issues.push('Page Titles: Over 60 Characters');
                if (pageData.details.title.length < 30) pageData.issues.push('Page Titles: Under 30 Characters');
            }

            // Meta Descriptions
            if (!pageData.details.description) pageData.issues.push('Meta Description: Missing');
            else {
                if (pageData.details.description.length > 155) pageData.issues.push('Meta Description: Over 155 Characters');
                if (pageData.details.description.length < 70) pageData.issues.push('Meta Description: Under 70 Characters');
            }

            // H1
            if (!pageData.details.h1) pageData.issues.push('H1: Missing');
            if ($('h1').length > 1) pageData.issues.push('H1: Multiple');
            if (pageData.details.h1 && pageData.details.h1 === pageData.details.title) pageData.issues.push('H1: Duplicate of Page Title');

            // H2
            if (pageData.details.h2.length === 0) pageData.issues.push('H2: Missing');
            if (pageData.details.h2.length > 20) pageData.issues.push('H2: Multiple (High Count)');

            // Canonicals
            if (!pageData.details.canonical) pageData.issues.push('Canonicals: Missing');

            // Content
            if (pageData.details.wordCount < 300) pageData.issues.push('Content: Thin Content (< 300 words)');
            if (pageData.details.h2.length > 0 && !pageData.details.h1) pageData.issues.push('Headings: H2 with Missing H1');

            // --- Images ---
            $('img').each((_, el) => {
                const src = $(el).attr('src');
                const alt = $(el).attr('alt');
                const width = $(el).attr('width');
                const height = $(el).attr('height');

                if (src) {
                    try {
                        const abs = new URL(src, url).href;
                        pageData.assets.push({ url: abs, type: 'image', alt: alt || '' });
                    } catch { }

                    if (!alt) pageData.issues.push('Images: Missing Alt Text');
                    if (!width || !height) pageData.issues.push('Images: Missing Size Attributes');
                }
            });

            // --- Internal Link Extraction ---
            $('a').each((_, el) => {
                const href = $(el).attr('href');
                if (href) {
                    try {
                        const absUrl = new URL(href, url).href;
                        if (absUrl.startsWith('http')) {
                            const isInternal = new URL(absUrl).hostname === targetUrl.hostname;
                            pageData.links.push({
                                url: absUrl,
                                type: isInternal ? 'internal' : 'external'
                            });
                        }
                    } catch { }
                }
            });
        }

        return pageData;

    } catch (error: any) {
        console.error("Crawl Error", error);
        return {
            url, status: 0,
            contentType: '', size: 0, time: 0,
            links: [], assets: [],
            details: {
                title: '', description: '', h1: '', h2: [], wordCount: 0,
                canonical: '', metaRobots: '', xRobotsTag: '',
                hreflang: [], relNext: '', relPrev: '', amphtml: '', structuredData: []
            },
            customData: {},
            issues: ['Connection Failed']
        };
    }
}
