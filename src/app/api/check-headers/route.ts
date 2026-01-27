import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

        let targetUrl;
        try {
            targetUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
        } catch {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        const start = Date.now();
        const response = await axios.get(targetUrl.href, {
            headers: {
                'User-Agent': 'SpiderFrog/1.0 (Compatible; Googlebot/2.1)',
                'Accept-Encoding': 'gzip, deflate, br'
            },
            timeout: 10000,
            validateStatus: () => true,
            maxRedirects: 0 // We want to see the 301 if it exists, not follow it
        });
        const time = Date.now() - start;

        // Extract relevant headers
        // Axios headers are AxiosRequestHeaders, we convert to simple object
        const cleanHeaders: Record<string, string> = {};
        Object.entries(response.headers).forEach(([k, v]) => {
            if (v) cleanHeaders[k] = String(v);
        });

        return NextResponse.json({
            url: targetUrl.href,
            status: response.status,
            statusText: response.statusText,
            time,
            headers: cleanHeaders
        });

    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            status: 0,
            headers: {}
        }, { status: 200 }); // Return 200 so UI can handle the error display gracefully
    }
}
