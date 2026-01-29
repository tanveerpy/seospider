import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// --- Configuration ---
const TARGET_URL = process.env.TARGET_URL;
const JOB_ID = process.env.JOB_ID || uuidv4();
const DATA_DIR = path.join(process.cwd(), 'data', 'crawls');

if (!TARGET_URL) {
    console.error('Error: TARGET_URL environment variable is required.');
    process.exit(1);
}

const urlToCrawl = TARGET_URL as string;

// --- Types (Simplified PageData) ---
interface PageData {
    url: string;
    status: number;
    title: string;
    description: string;
    h1: string;
    links: string[];
    time: number;
    timestamp: string;
}

async function run() {
    console.log(`[CrawlLogic] Starting job ${JOB_ID} for ${TARGET_URL}`);
    const start = Date.now();

    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const browser = await puppeteer.launch({
        headless: true, // New headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (compatible; CrawlLogicBot/1.0; +https://crawllogic.sh)');

        // Navigate
        const response = await page.goto(urlToCrawl, { waitUntil: 'networkidle2', timeout: 30000 });
        const status = response ? response.status() : 0;

        // Extract Data
        const data = await page.evaluate(() => {
            const title = document.title;
            const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
            const h1 = document.querySelector('h1')?.textContent?.trim() || '';

            const links = Array.from(document.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => href.startsWith('http'));

            return { title, description, h1, links };
        });

        const result: PageData = {
            url: TARGET_URL!,
            status,
            ...data,
            time: Date.now() - start,
            timestamp: new Date().toISOString()
        };

        // Save Result
        const filePath = path.join(DATA_DIR, `${JOB_ID}.json`);
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        console.log(`[CrawlLogic] Success! Saved to ${filePath}`);

    } catch (error: any) {
        console.error('[CrawlLogic] Error:', error);

        // Save Error State
        const errorResult = {
            url: TARGET_URL!,
            status: 0,
            error: error.message,
            timestamp: new Date().toISOString()
        };
        const filePath = path.join(DATA_DIR, `${JOB_ID}.json`);
        fs.writeFileSync(filePath, JSON.stringify(errorResult, null, 2));

    } finally {
        await browser.close();
    }
}

run();
