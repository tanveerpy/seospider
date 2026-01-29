import { calculatePixelWidth } from './seo-utils';

import axios from 'axios';
import * as cheerio from 'cheerio';
import { PageData } from './store';


// List of reliable CORS Proxies to try in round-robin or fallback order
const CORS_PROXIES = [
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
];

const USER_AGENTS = [
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
];

const getRandomUA = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let attempt = 0; attempt < retries; attempt++) {
        // Try each proxy until one works
        for (const proxy of CORS_PROXIES) {
            try {
                const proxyUrl = proxy(url);
                const response = await axios.get(proxyUrl, {
                    timeout: 20000, // 20s timeout
                    headers: {
                        'User-Agent': getRandomUA(),
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    }
                });

                // If success, return response immediately
                if (response.status >= 200 && response.status < 300) {
                    return response;
                }
            } catch (e) {
                // Continue to next proxy
                // console.warn(`Proxy failed: ${proxy(url)}`, e);
            }
        }

        // If all proxies failed this attempt, wait before retrying (Exponential Backoff)
        const delay = 1000 * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, delay));
    }
    throw new Error('All connection attempts failed after retries.');
}

// ENFORCED REAL DATA POLICY: No Mock Data.
// If proxies fail, we return a failure state explaining why.

async function crawlViaServer(url: string, rules: any = []): Promise<PageData> {
    // console.log(`[SF-CLIENT] Attempting Server-Side Stealth Crawler for: ${url}`);
    try {
        // Respecting basePath: /seospider
        const response = await axios.post('/seospider/api/crawl', { url, rules });
        return response.data;
    } catch (error: any) {
        // console.error("[SF-CLIENT] Server Fallback Failed:", error);

        // If API is missing (Static Host) or blocked, propagate the error
        // Do NOT return mock data.
        throw error;
    }
}

export async function crawlPageClientSide(url: string, rules: any = []): Promise<PageData> {
    const targetUrl = new URL(url);
    const start = Date.now();
    let response;
    let methodUsed = 'DIRECT';

    // ---------------------------------------------------------
    // STRATEGY 1: DIRECT BROWSER FETCH (Visitor IP)
    // ---------------------------------------------------------
    try {
        // console.log(`[SF-CLIENT] Attempting Direct Fetch (Visitor IP) for: ${url}`);
        response = await axios.get(url, {
            timeout: 10000,
            headers: { 'Accept': 'text/html' } // Simple header to avoid pre-flight option requests sometimes
        });

    } catch (directError: any) {
        // CORS Errors usually appear as Network Errors in Axios
        // console.warn(`[SF-CLIENT] Direct Fetch Failed (Likely CORS). Switching to Proxy.`, directError.message);

        // ---------------------------------------------------------
        // STRATEGY 2: PUBLIC CORS PROXIES
        // ---------------------------------------------------------
        try {
            methodUsed = 'PROXY';
            response = await fetchWithRetry(url);
        } catch (proxyError) {
            console.warn(`[SF-CLIENT] All proxies failed. Triggering Server Fallback.`);

            // ---------------------------------------------------------
            // STRATEGY 3: SERVER-SIDE FALLBACK (Node.js)
            // ---------------------------------------------------------
            try {
                methodUsed = 'SERVER';
                return await crawlViaServer(url, rules);
            } catch (serverError: any) {
                // Both Failed. Return "Failed Page" status (Real outcome).
                console.error(`[SF-CRITICAL] All crawl methods failed for ${url}`);

                return {
                    url,
                    status: 0, // Connection Failed
                    contentType: 'error',
                    size: 0,
                    time: Date.now() - start,
                    links: [],
                    assets: [],
                    details: {
                        title: 'Crawl Failed',
                        description: '',
                        h1: '',
                        h2: [],
                        wordCount: 0,
                        canonical: '',
                        metaRobots: '',
                        xRobotsTag: '',
                        hreflang: [],
                        relNext: '',
                        relPrev: '',
                        amphtml: '',
                        structuredData: []
                    },
                    customData: {},
                    issues: [{
                        type: 'error',
                        message: 'Crawl Failed: Blocked by CORS/WAF or API Unavailable. Run locally for full power.',
                        code: 'CRAWL-FAIL'
                    }]
                };
            }
        }
    }

    const contentType = response.headers['content-type'] || 'text/html';
    const html = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    const time = Date.now() - start;

    // Detect bot protection (on real data)
    const isBotChallenge = html && (
        html.includes('cloudflare') ||
        html.includes('challenge-platform') ||
        html.includes('Verify you are human') ||
        html.includes('Access Denied') ||
        html.includes('captcha') ||
        html.includes('sucuri') ||
        html.includes('security') ||
        html.includes('sgcaptcha') ||
        (html.length < 5000 && (html.toLowerCase().includes('javascript') || html.toLowerCase().includes('enable cookies') || html.toLowerCase().includes('wait')))
    );

    if (isBotChallenge) {
        // Try server fallback for bot protection
        try {
            return await crawlViaServer(url, rules);
        } catch (e) {
            return {
                url,
                status: 403,
                contentType: 'text/html',
                size: html.length,
                time,
                links: [],
                assets: [],
                details: {
                    title: 'Bot Protection Triggered',
                    description: '',
                    h1: '',
                    h2: [],
                    wordCount: 0,
                    canonical: '',
                    metaRobots: '',
                    xRobotsTag: '',
                    hreflang: [],
                    relNext: '',
                    relPrev: '',
                    amphtml: '',
                    structuredData: []
                },
                customData: {},
                issues: [{
                    type: 'error',
                    message: 'Bot Protection: Access Restricted by Server',
                    code: 'BOT-BLOCK'
                }]
            };
        }
    }

    // COPY OF PARSING LOGIC FOR CLIENT SIDE SUCCESS
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
            xRobotsTag: '',
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
        if (response.status >= 400) pageData.issues.push({
            type: 'error',
            message: `Response Codes: Internal Client Error (${response.status})`,
            code: 'HTTP-ERR'
        });

        // Page Titles
        if (!pageData.details.title) pageData.issues.push({ type: 'error', message: 'Page Titles: Missing', code: 'TITLE-MISS' });
        else {
            if (pageData.details.title.length > 60) pageData.issues.push({ type: 'warning', message: 'Page Titles: Over 60 Characters', code: 'TITLE-LONG' });
            if (pageData.details.title.length < 30) pageData.issues.push({ type: 'warning', message: 'Page Titles: Under 30 Characters', code: 'TITLE-SHORT' });
        }

        // Meta Descriptions
        if (!pageData.details.description) pageData.issues.push({ type: 'warning', message: 'Meta Description: Missing', code: 'DESC-MISS' });
        else {
            if (pageData.details.description.length > 155) pageData.issues.push({ type: 'info', message: 'Meta Description: Over 155 Characters', code: 'DESC-LONG' });
            if (pageData.details.description.length < 70) pageData.issues.push({ type: 'info', message: 'Meta Description: Under 70 Characters', code: 'DESC-SHORT' });
        }

        // H1
        if (!pageData.details.h1) pageData.issues.push({ type: 'error', message: 'H1: Missing', code: 'H1-MISS' });
        if ($('h1').length > 1) pageData.issues.push({ type: 'error', message: 'H1: Multiple', code: 'H1-MULT' });
        if (pageData.details.h1 && pageData.details.h1 === pageData.details.title) pageData.issues.push({ type: 'warning', message: 'H1: Duplicate of Page Title', code: 'H1-DUP-TITLE' });

        // H2
        if (pageData.details.h2.length === 0) pageData.issues.push({ type: 'info', message: 'H2: Missing', code: 'H2-MISS' });
        if (pageData.details.h2.length > 20) pageData.issues.push({ type: 'warning', message: 'H2: Multiple (High Count)', code: 'H2-MULT' });

        // Canonicals
        if (!pageData.details.canonical) pageData.issues.push({ type: 'error', message: 'Canonicals: Missing', code: 'CAN-MISS' });

        // Content
        if (pageData.details.wordCount < 300) pageData.issues.push({ type: 'warning', message: 'Content: Thin Content (< 300 words)', code: 'CONT-THIN' });
        if (pageData.details.h2.length > 0 && !pageData.details.h1) pageData.issues.push({ type: 'error', message: 'Headings: H2 with Missing H1', code: 'HEAD-ORDER' });

        // Schema / Structured Data
        if (pageData.details.structuredData.length === 0) {
            pageData.issues.push({ type: 'info', message: 'Schema: Missing Structured Data', code: 'SCHEMA-MISS' });
        }

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

                if (!alt && !pageData.issues.some(i => i.message === 'Images: Missing Alt Text')) {
                    pageData.issues.push({ type: 'warning', message: 'Images: Missing Alt Text', code: 'IMG-ALT' });
                }
                if ((!width || !height) && !pageData.issues.some(i => i.message === 'Images: Missing Size Attributes')) {
                    pageData.issues.push({ type: 'info', message: 'Images: Missing Size Attributes', code: 'IMG-SIZE' });
                }
            }
        });

        // --- Internal Link Extraction ---
        $('a').each((_, el) => {
            const href = $(el).attr('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                try {
                    const absUrl = new URL(href, url).href;
                    if (absUrl.startsWith('http')) {
                        const linkUrl = new URL(absUrl);
                        const cleanUrl = linkUrl.origin + linkUrl.pathname + linkUrl.search;

                        const isInternal = linkUrl.hostname === targetUrl.hostname ||
                            linkUrl.hostname.endsWith('.' + targetUrl.hostname) ||
                            targetUrl.hostname.endsWith('.' + linkUrl.hostname);

                        pageData.links.push({
                            url: cleanUrl,
                            type: isInternal ? 'internal' : 'external'
                        });
                    }
                } catch { }
            }
        });
    }

    return pageData;
}
