import { PageData } from './store';

export function exportToCSV(pages: Record<string, PageData>) {
    const pageList = Object.values(pages);
    if (pageList.length === 0) return;

    // 1. Calculate Inlinks (Reverse Index)
    const inlinkCounts: Record<string, number> = {};
    pageList.forEach(p => {
        p.links.forEach(link => {
            // Normalize link to remove hashes for better matching
            const target = link.url.split('#')[0];
            inlinkCounts[target] = (inlinkCounts[target] || 0) + 1;
        });
    });

    // 2. Identify all unique custom data keys
    const customKeys = new Set<string>();
    pageList.forEach(p => {
        if (p.customData) {
            Object.keys(p.customData).forEach(k => customKeys.add(k));
        }
    });
    const sortedCustomKeys = Array.from(customKeys).sort();

    // 3. Define CSV Headers
    const headers = [
        'URL',
        'Status Code',
        'Status', // Good, Redirect, Client Error, Server Error
        'Content Type',
        'Size (Bytes)',
        'Response Time (ms)',
        'Title',
        'Title Length',
        'Meta Description',
        'Desc Length',
        'H1',
        'H1 Length',
        'Word Count',
        'Canonical URL',
        'Meta Robots',
        'Inlinks',
        'Outlinks',
        'Issues',
        ...sortedCustomKeys.map(k => `Custom: ${k}`)
    ];

    // 4. Helper to escape CSV fields safely
    const safe = (val: string | number | undefined | null) => {
        if (val === undefined || val === null) return '""';
        const str = String(val);
        // If contains quote, comma or newline, wrap in quotes and escape inner quotes
        if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str; // Return raw if safe, but usually safer to quote strings? 
        // Standard CSV: non-special chars don't need quotes, but consistent quoting is fine.
        // Let's stick to quoting if special chars exist, otherwise raw for numbers looks cleaner in Excel.
        return `"${str}"`; // Actually, always quoting strings is safest for mixed content
    };

    // Fix for issue objects in exportToCSV
    const rows = pageList.map(p => {
        const title = p.details?.title || '';
        const desc = p.details?.description || '';
        const h1 = p.details?.h1 || '';
        // Map issue objects to string
        const issues = p.issues?.map(i => i.message).join('; ') || '';

        let statusType = 'Unknown';
        if (p.status >= 200 && p.status < 300) statusType = 'Success';
        else if (p.status >= 300 && p.status < 400) statusType = 'Redirect';
        else if (p.status >= 400 && p.status < 500) statusType = 'Client Error';
        else if (p.status >= 500) statusType = 'Server Error';

        const row = [
            safe(p.url),
            safe(p.status),
            safe(statusType),
            safe(p.contentType),
            safe(p.size),
            safe(p.time),
            safe(title),
            safe(title.length),
            safe(desc),
            safe(desc.length),
            safe(h1),
            safe(h1.length),
            safe(p.details?.wordCount || 0),
            safe(p.details?.canonical || ''),
            safe(p.details?.metaRobots || ''),
            safe(inlinkCounts[p.url] || 0),
            safe(p.links.length),
            safe(issues),
            ...sortedCustomKeys.map(key => {
                const val = p.customData?.[key];
                return safe(Array.isArray(val) ? val.join('; ') : val);
            })
        ];

        return row.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    triggerDownload(csvContent, `crawl_logic_audit_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
}

export function exportIssuesCSV(pages: PageData[], issueType: string | null = null) {
    if (pages.length === 0) return;

    const headers = [
        'Issue Type',
        'Priority',
        'URL',
        'Status Code',
        'Title',
        'Details'
    ];

    // Helper to determine priority
    const getPriority = (message: string) => {
        if (message.includes('Missing') || message.includes('Error') || message.includes('Duplicate')) return 'High';
        if (message.includes('Low') || message.includes('Thin')) return 'Medium';
        return 'Low';
    };

    // Collect all rows first
    const issueRows: {
        type: string;
        priority: string;
        url: string;
        status: number;
        title: string;
        details: string; // This corresponds to the user's "Main Issue" category (Message)
    }[] = [];

    pages.forEach(p => {
        const relevantIssues = issueType
            ? p.issues.filter(i => i.message === issueType)
            : p.issues;

        relevantIssues.forEach(issue => {
            issueRows.push({
                type: issue.type,
                priority: getPriority(issue.message),
                url: p.url,
                status: p.status,
                title: p.details?.title || '',
                details: issue.message
            });
        });
    });

    if (issueRows.length === 0) return;

    // SORT: First by Issue Details (Message) -> "Categorize by Main Issue", then by URL
    issueRows.sort((a, b) => {
        if (a.details < b.details) return -1;
        if (a.details > b.details) return 1;
        if (a.url < b.url) return -1;
        if (a.url > b.url) return 1;
        return 0;
    });

    const rows = issueRows.map(row => {
        return [
            `"${row.type}"`,
            `"${row.priority}"`,
            `"${row.url}"`,
            String(row.status),
            `"${row.title.replace(/"/g, '""')}"`,
            `"${row.details}"`
        ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const filename = issueType
        ? `issue_report_${issueType.replace(/\s+/g, '_').toLowerCase()}.csv`
        : `full_issues_report_sorted_${new Date().toISOString().slice(0, 10)}.csv`;

    triggerDownload(csvContent, filename, 'text/csv;charset=utf-8;');
}

import { ISSUE_METADATA } from './issueMetadata';

export function generateAgencyReport(pages: PageData[]) {
    if (pages.length === 0) return;

    // Aggregate by Code (Static) instead of Message (Dynamic)
    const issueCounts: Record<string, { code: string; message: string; count: number; urls: string[] }> = {};
    let totalIssues = 0;

    pages.forEach(p => {
        p.issues.forEach(issue => {
            const code = issue.code || 'UNKNOWN';
            // Only aggregate known issues or track generic ones
            if (!issueCounts[code]) {
                issueCounts[code] = {
                    code,
                    // Use the first message found for this code as the display title
                    // For dynamic messages like "Slow Page Load (230ms)", we might want a cleaner static title.
                    // But for now, using the message is okay as long as we group by code.
                    // Actually, let's look up a static title from metadata if possible.
                    message: issue.message,
                    count: 0,
                    urls: []
                };
            }
            issueCounts[code].count++;
            issueCounts[code].urls.push(p.url);
            totalIssues++;
        });
    });

    const sortedIssues = Object.values(issueCounts).sort((a, b) => b.count - a.count);
    const dateStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    // Generate HTML Report
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SEO Audit Agency Report</title>
        <style>
            body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #f8fafc; color: #1e293b; max-width: 900px; margin: 0 auto; padding: 40px; }
            h1 { font-size: 2.5rem; font-weight: 900; color: #0f172a; margin-bottom: 0.5rem; letter-spacing: -0.05em; }
            h2 { font-size: 1.5rem; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 40px; color: #334155; }
            .header { text-align: center; margin-bottom: 60px; padding-bottom: 40px; border-bottom: 1px solid #cbd5e1; }
            .meta { color: #64748b; font-size: 0.9rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; }
            .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
            .stat-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            .stat-val { font-size: 2rem; font-weight: 900; color: #10b981; }
            .stat-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; }
            
            .issue-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; margin-bottom: 24px; overflow: hidden; page-break-inside: avoid; }
            .issue-header { padding: 20px; background: #f1f5f9; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; }
            .issue-title { font-weight: 700; font-size: 1.1rem; color: #0f172a; display: flex; align-items: center; gap: 10px; }
            .badge { padding: 4px 10px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
            .badge-High { background: #fee2e2; color: #ef4444; }
            .badge-Medium { background: #fef3c7; color: #f59e0b; }
            .badge-Low { background: #ecfeff; color: #06b6d4; }
            
            .issue-body { padding: 24px; }
            .section-title { font-size: 0.75rem; font-weight: 900; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.1em; margin-bottom: 8px; margin-top: 16px; }
            .section-title:first-child { margin-top: 0; }
            .impact-text { color: #334155; font-size: 0.95rem; line-height: 1.6; }
            .fix-text { color: #059669; font-weight: 600; font-size: 0.95rem; background: #ecfdf5; padding: 12px; border-radius: 8px; border-left: 4px solid #10b981; }
            
            .url-list { background: #0f172a; color: #cbd5e1; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 0.8rem; margin-top: 16px; max-height: 200px; overflow-y: auto; }
            .url-item { padding: 4px 0; border-bottom: 1px solid #334155; }
            .url-item:last-child { border-bottom: none; }
            .footer { text-align: center; margin-top: 80px; color: #94a3b8; font-size: 0.8rem; border-top: 1px solid #e2e8f0; padding-top: 40px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="meta">SEO Technical Audit Report</div>
            <h1>Website Performance Analysis</h1>
            <div class="meta">${dateStr}</div>
        </div>

        <div class="stat-grid">
            <div class="stat-card">
                <div class="stat-val">${pages.length}</div>
                <div class="stat-label">Pages Analyzed</div>
            </div>
            <div class="stat-card">
                <div class="stat-val">${totalIssues}</div>
                <div class="stat-label">Issues Detected</div>
            </div>
            <div class="stat-card">
                <div class="stat-val" style="color: ${totalIssues === 0 ? '#10b981' : '#f59e0b'}">
                    ${Math.round((1 - (totalIssues / (pages.length * 5))) * 100)}%
                </div>
                <div class="stat-label">Health Score</div>
            </div>
        </div>

        <h2>Detailed Findings & Recommendations</h2>

        ${sortedIssues.map((data) => {
        const meta = ISSUE_METADATA[data.code] || {
            title: data.message, // Fallback to dynamic message
            priority: 'Medium',
            impact: 'This issue affects technical SEO performance.',
            fix: 'Investigate the specific page setup.'
        };

        return `
            <div class="issue-card">
                <div class="issue-header">
                    <div class="issue-title">
                        ${meta.title}
                    </div>
                    <div class="badge badge-${meta.priority}">${meta.priority} Priority</div>
                </div>
                <div class="issue-body">
                    <div class="section-title">SEO Impact</div>
                    <div class="impact-text">${meta.impact}</div>

                    <div class="section-title">How to Fix</div>
                    <div class="fix-text">${meta.fix}</div>

                    <div class="section-title">Affected Pages (${data.count})</div>
                    <div class="url-list">
                        ${data.urls.slice(0, 50).map(u => `<div class="url-item">${u}</div>`).join('')}
                        ${data.urls.length > 50 ? `<div class="url-item" style="color: #64748b; margin-top: 8px;">...and ${data.urls.length - 50} more</div>` : ''}
                    </div>
                </div>
            </div>
            `;
    }).join('')}

        <div class="footer">
            Generated by SpiderFrog Online • Professional SEO Crawler
        </div>
    </body>
    </html>
    `;

    triggerDownload(html, `seo_agency_report_${new Date().toISOString().slice(0, 10)}.html`, 'text/html;charset=utf-8;');
}

// Helper to handle downloads key
function triggerDownload(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.click();
    document.body.removeChild(link);
}

export function generateXMLSitemap(pages: Record<string, PageData>) {
    const pageList = Object.values(pages).filter(p => p.status === 200); // Only include 200 OK pages

    if (pageList.length === 0) return;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageList.map(p => `    <url>
        <loc>${p.url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>`).join('\n')}
</urlset>`;

    triggerDownload(xml, 'sitemap.xml', 'application/xml');
}
