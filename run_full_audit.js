const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { URL } = require('url');

// --- 1. Utilities (Pixel Width) ---
const CHAR_WIDTHS = {
    'a': 8.9, 'b': 9.8, 'c': 8.0, 'd': 9.8, 'e': 8.9, 'f': 5.3, 'g': 9.8, 'h': 9.8, 'i': 3.6,
    'j': 3.6, 'k': 8.9, 'l': 3.6, 'm': 14.2, 'n': 9.8, 'o': 9.8, 'p': 9.8, 'q': 9.8, 'r': 6.2,
    's': 8.0, 't': 5.3, 'u': 9.8, 'v': 8.9, 'w': 12.5, 'x': 8.9, 'y': 8.9, 'z': 8.0,
    'A': 11.6, 'B': 11.6, 'C': 12.5, 'D': 12.5, 'E': 11.6, 'F': 10.7, 'G': 13.3, 'H': 12.5,
    'I': 4.4, 'J': 8.9, 'K': 11.6, 'L': 9.8, 'M': 15.1, 'N': 12.5, 'O': 13.3, 'P': 11.6,
    'Q': 13.3, 'R': 12.5, 'S': 11.6, 'T': 10.7, 'U': 12.5, 'V': 11.6, 'W': 16.9, 'X': 11.6,
    'Y': 11.6, 'Z': 10.7,
    '0': 9.8, '1': 9.8, '2': 9.8, '3': 9.8, '4': 9.8, '5': 9.8, '6': 9.8, '7': 9.8, '8': 9.8, '9': 9.8,
    ' ': 4.4, '.': 4.4, ',': 4.4, '-': 5.3, '_': 8.9, '!': 4.4, '?': 8.9, '|': 4.4, '/': 5.3, '\\': 5.3,
    '(': 5.3, ')': 5.3, '[': 5.3, ']': 5.3, '{': 5.3, '}': 5.3, '<': 8.9, '>': 8.9, ':': 4.4, ';': 4.4,
    '"': 6.2, "'": 3.6, '@': 16.9, '#': 9.8, '$': 9.8, '%': 14.2, '^': 7.1, '&': 11.6, '*': 7.1, '+': 9.8,
    '=': 9.8, '~': 9.8, '`': 5.3
};
const DEFAULT_WIDTH = 8.9;

function calculatePixelWidth(text) {
    if (!text) return 0;
    let width = 0;
    for (let i = 0; i < text.length; i++) {
        width += CHAR_WIDTHS[text[i]] || DEFAULT_WIDTH;
    }
    return Math.round(width);
}

// --- 2. Crawler State ---
const queue = ['https://writeoffcalc.com'];
const processed = new Set();
const results = [];
const ROOT_DOMAIN = 'writeoffcalc.com';

const MAX_PAGES = 50; // Safety limit
const DELAY_MS = 1000;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- 3. Main Audit Function ---
async function crawl() {
    console.log("🚀 Starting Full Audit Simulation...");

    while (queue.length > 0 && processed.size < MAX_PAGES) {
        const url = queue.shift();
        if (processed.has(url)) continue;
        processed.add(url);

        console.log(`Crawling (${processed.size}/${MAX_PAGES}): ${url}`);

        try {
            const start = Date.now();
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Accept': 'text/html'
                }
            });
            const time = Date.now() - start;
            const html = response.data;
            const $ = cheerio.load(html);

            const issues = [];

            // --- A. Pixel Width Checks ---
            const title = $('title').text().trim() || '';
            const desc = $('meta[name="description"]').attr('content') || '';

            if (!title) issues.push('Page Titles: Missing');
            else {
                const w = calculatePixelWidth(title);
                if (title.length > 60) issues.push('Page Titles: Over 60 Characters');
                if (title.length < 30) issues.push('Page Titles: Under 30 Characters');
                if (w > 580) issues.push('Page Titles: Over 580 Pixels (Truncated)'); // SF uses 561, we use 580 safe zone
                if (w < 200) issues.push('Page Titles: Under 200 Pixels');
            }

            if (!desc) issues.push('Meta Description: Missing');
            else {
                const w = calculatePixelWidth(desc);
                if (desc.length > 155) issues.push('Meta Description: Over 155 Characters');
                if (desc.length < 70) issues.push('Meta Description: Under 70 Characters');
                if (w > 990) issues.push('Meta Description: Over 990 Pixels');
            }

            // --- B. Security Headers ---
            const h = response.headers;
            const getH = (n) => h[n] || h[n.toLowerCase()];

            if (!getH('strict-transport-security')) issues.push('Security: Missing HSTS Header');
            if (!getH('content-security-policy')) issues.push('Security: Missing Content-Security-Policy Header');
            if (!getH('x-frame-options')) issues.push('Security: Missing X-Frame-Options Header');
            if (!getH('x-content-type-options')) issues.push('Security: Missing X-Content-Type-Options Header');
            if (!getH('referrer-policy')) issues.push('Security: Missing Secure Referrer-Policy Header');

            // --- C. H1 & Headings ---
            const h1 = $('h1').first().text().trim();
            if (!h1) issues.push('H1: Missing');
            if ($('h1').length > 1) issues.push('H1: Multiple');

            const h2Count = $('h2').length;
            if (h2Count > 20) issues.push('H2: Multiple (High Count)');

            // --- D. Images ---
            const imgs = $('img');
            // Check Alts
            imgs.each((_, el) => {
                if (!$(el).attr('alt')) {
                    if (!issues.includes('Images: Missing Alt Text')) issues.push('Images: Missing Alt Text');
                }
            });

            // Image Size Check (Sample first 5 to avoid spamming)
            // (Only if we want to be thorough, but let's assume headless check is mostly correct)
            // Ideally we'd replicate the HEAD request here, but for simulation speed let's check one.
            if (imgs.length > 0) {
                const src = imgs.first().attr('src');
                // Only check absolute URLs easily
                if (src && src.startsWith('http')) {
                    try {
                        const head = await axios.head(src);
                        if (parseInt(head.headers['content-length']) > 102400) {
                            issues.push('Images: Over 100 KB');
                        }
                    } catch (e) { }
                }
            }

            // --- E. Canonicals ---
            if (!$('link[rel="canonical"]').attr('href')) issues.push('Canonicals: Missing');

            // --- Output ---
            results.push({
                URL: url,
                Title: title,
                Description: desc,
                H1: h1,
                WordCount: $('body').text().split(/\s+/).length,
                Issues: issues.join('; ')
            });

            // --- F. Discover Links ---
            $('a').each((_, el) => {
                const href = $(el).attr('href');
                if (href) {
                    try {
                        const abs = new URL(href, url).href;
                        if (abs.includes(ROOT_DOMAIN) && !processed.has(abs) && !queue.includes(abs) && !abs.includes('#')) {
                            queue.push(abs);
                        }
                    } catch { }
                }
            });

        } catch (e) {
            console.error(`Failed to crawl ${url}:`, e.message);
        }

        await sleep(DELAY_MS);
    }

    // Write CSV
    console.log(`Writing results to craw_logic.csv (${results.length} pages)...`);
    const header = ['URL', 'Title', 'Description', 'H1', 'WordCount', 'Issues'];
    const csvContent = [
        header.join(','),
        ...results.map(r => [
            `"${r.URL}"`,
            `"${(r.Title || '').replace(/"/g, '""')}"`,
            `"${(r.Description || '').replace(/"/g, '""')}"`,
            `"${(r.H1 || '').replace(/"/g, '""')}"`,
            r.WordCount,
            `"${r.Issues}"`
        ].join(','))
    ].join('\n');

    fs.writeFileSync('craw_logic.csv', csvContent);
    console.log("✅ Audit Complete.");
}

crawl();
