import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

// Note: Removed puppeteer-extra-plugin-stealth due to "utils.typeOf is not a function" runtime error in this env.
// We will rely on manual stealth techniques (UA, headers, args) which are robust enough for most cases.

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0'
];

const getRandomUA = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

// Helper: Headless Browser Crawl
async function crawlWithPuppeteer(url: string) {
    console.log(`[SF-PUPPETEER] Launching stealth browser for: ${url}`);
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--window-position=0,0',
                '--ignore-certifcate-errors',
                '--ignore-certifcate-errors-spki-list',
                '--disable-blink-features=AutomationControlled' // Extra safety
            ]
        });
        const page = await browser.newPage();

        // Randomize Viewport
        await page.setViewport({
            width: 1920 + Math.floor(Math.random() * 100),
            height: 1080 + Math.floor(Math.random() * 100),
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: true,
            isMobile: false,
        });

        // Use a standard desktop user agent for Puppeteer
        const ua = getRandomUA();
        await page.setUserAgent(ua);

        // Add headers to look like a real navigation
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/'
        });

        // Navigate and wait 
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });

        // Wait a bit more for any client-side hydration or Cloudflare checks
        // Random delay between 2s and 5s
        const randomDelay = Math.floor(Math.random() * 3000) + 2000;
        await new Promise(r => setTimeout(r, randomDelay));

        const content = await page.content();
        const status = 200; // Puppeteer doesn't give status directly on content(), simplified assumption if loaded

        return { data: content, status };
    } catch (e: any) {
        console.error('[SF-PUPPETEER] Error:', e.message);
        return null; // Fallback failed
    } finally {
        if (browser) await browser.close();
    }
}

export async function POST(request: Request) {
    try {
        const { url, rules } = await request.json();

        if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

        let targetUrlObj: URL;
        try {
            targetUrlObj = new URL(url);
        } catch {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        const start = Date.now();
        let response: any = { status: 0, data: '', headers: {} };
        let usedPuppeteer = false;

        const ua = getRandomUA();

        // 1. Try Fast Crawl (Axios) with Enhanced Headers
        try {
            response = await axios.get(url, {
                headers: {
                    'User-Agent': ua,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'cross-site',
                    'Sec-Fetch-User': '?1',
                    'Cache-Control': 'max-age=0',
                    'Referer': 'https://www.google.com/' // Spoof coming from Google
                },
                timeout: 15000,
                validateStatus: () => true
            });
        } catch (e: any) {
            console.warn(`[SF-AXIOS] Failed for ${url}: ${e.message}`);
        }

        // 2. Check for Bot Protection / Failures
        let html = typeof response.data === 'string' ? response.data : JSON.stringify(response.data || '');
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

        // 3. Fallback to Puppeteer if needed
        if (response.status === 403 || response.status === 406 || response.status === 503 || response.status === 429 || isBotChallenge || !response.status) {
            console.log(`[SF-INFO] Triggering Stealth Puppeteer bypass for: ${url} (Reason: ${response.status || 'Bot Detection'})`);
            const pupResult = await crawlWithPuppeteer(url);

            if (pupResult) {
                html = pupResult.data;
                response = {
                    status: pupResult.status,
                    headers: { 'content-type': 'text/html' },
                    data: html
                };
                usedPuppeteer = true;
            }
        }

        const time = Date.now() - start;
        const contentType = response.headers['content-type'] || '';
        if (!html) html = '';

        const pageData: any = {
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

        if (contentType.includes('text/html') || usedPuppeteer) {
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

            // --- Issue Mapping ---
            // Page Titles
            if (!pageData.details.title) pageData.issues.push({ type: 'error', message: 'Page Titles: Missing', code: 'TITLE-MISS' });
            else {
                if (pageData.details.title.length > 60) pageData.issues.push({ type: 'warning', message: 'Page Titles: Over 60 Characters', code: 'TITLE-LONG' });
            }

            // H1
            if (!pageData.details.h1) pageData.issues.push({ type: 'error', message: 'H1: Missing', code: 'H1-MISS' });

            // Canonicals
            if (!pageData.details.canonical) pageData.issues.push({ type: 'error', message: 'Canonicals: Missing', code: 'CAN-MISS' });

            // Content
            if (pageData.details.wordCount < 300) pageData.issues.push({ type: 'warning', message: 'Content: Thin Content (< 300 words)', code: 'CONT-THIN' });

            // Schema / Structured Data
            if (pageData.details.structuredData.length === 0) {
                pageData.issues.push({ type: 'info', message: 'Schema: Missing Structured Data', code: 'SCHEMA-MISS' });
            }

            // Detect bot protection (Re-check on final HTML)
            const finalHtml = html;
            const remainingChallenge = finalHtml && (
                finalHtml.includes('challenge-platform') ||
                finalHtml.includes('Access Denied') ||
                finalHtml.includes('Verify you are human') ||
                (finalHtml.length < 5000 && (finalHtml.toLowerCase().includes('javascript') || finalHtml.toLowerCase().includes('enable cookies')))
            );

            if (remainingChallenge && !usedPuppeteer) {
                pageData.issues.push({ type: 'error', message: 'Bot Protection: Access Restricted by Server', code: 'BOT-BLOCK' });
            }

            // --- Internal Link Extraction ---
            $('a').each((_, el) => {
                const href = $(el).attr('href');
                if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                    try {
                        const absUrl = new URL(href, url).href;
                        if (absUrl.startsWith('http')) {
                            const linkUrl = new URL(absUrl);
                            const cleanUrl = linkUrl.origin + linkUrl.pathname + linkUrl.search;

                            const isInternal = linkUrl.hostname === targetUrlObj.hostname ||
                                linkUrl.hostname.endsWith('.' + targetUrlObj.hostname) ||
                                targetUrlObj.hostname.endsWith('.' + linkUrl.hostname);

                            pageData.links.push({
                                url: cleanUrl,
                                type: isInternal ? 'internal' : 'external'
                            });
                        }
                    } catch { }
                }
            });
        }

        // --- Performance Checks ---
        if (pageData.time > 2000) {
            pageData.issues.push({
                type: 'warning',
                message: `Performance: Slow Page Load (${pageData.time}ms)`,
                code: 'PERF-SLOW'
            });
        }

        return NextResponse.json(pageData);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
