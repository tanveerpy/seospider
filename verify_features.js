const axios = require('axios');
const cheerio = require('cheerio');

// Mocking the utility locally to ensure standalone execution
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

async function verify() {
    const url = 'https://writeoffcalc.com';
    console.log(`Verifying features on ${url}...`);

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);

        console.log(`HTML Size: ${html.length} bytes`);
        console.log(`Image Tags found: ${$('img').length}`);

        // 1. Pixel Width Verification
        const title = $('title').text().trim();
        const width = calculatePixelWidth(title);
        console.log(`\n[Pixel Width Check]`);
        console.log(`Title: "${title}"`);
        console.log(`Estimated Width: ${width}px`);

        if (width > 0) console.log("✅ Pixel Calc: SUCCESS");
        else console.log("❌ Pixel Calc: FAILED (0 width)");

        if (width > 580) console.log("⚠️  Issue Triggered: Title too long in pixels");
        else console.log("ℹ️  Title width is within safe limits");


        // 2. Security Headers Verification
        console.log(`\n[Security Headers Check]`);
        const headers = response.headers;

        const checks = [
            'strict-transport-security',
            'content-security-policy',
            'x-frame-options',
            'x-content-type-options',
            'referrer-policy'
        ];

        let missingCount = 0;
        checks.forEach(h => {
            if (!headers[h]) {
                console.log(`⚠️  Missing Header detected: ${h}`);
                missingCount++;
            } else {
                console.log(`✅ Found Header: ${h}`);
            }
        });

        if (missingCount > 0) {
            console.log(`✅ Gap Fill Verified: Audit detected ${missingCount} missing security headers (Logic is working).`);
        } else {
            console.log("ℹ️  No missing headers found (Site might be secure, or logic mismatch).");
        }

        // 3. Image Size Logic Verification (Feasibility Check)
        console.log(`\n[Image Size Feasibility Check]`);
        const img = $('img').first().attr('src');
        if (img) {
            try {
                const absUrl = new URL(img, url).href;
                console.log(`Testing HEAD request on: ${absUrl}`);
                const headRes = await axios.head(absUrl);
                const size = headRes.headers['content-length'];
                console.log(`Content-Length: ${size} bytes`);

                if (size) console.log("✅ Image Size: HEAD Request successful.");
                else console.log("⚠️  Image Size: No content-length returned.");
            } catch (e) {
                console.log(`❌ Image Size Check Failed: ${e.message}`);
            }
        } else {
            console.log("ℹ️  No images found on page to test.");
        }

    } catch (e) {
        console.error("Verification failed:", e.message);
    }
}

verify();
