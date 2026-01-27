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

    // 5. Map Data to Rows
    const rows = pageList.map(p => {
        const title = p.details?.title || '';
        const desc = p.details?.description || '';
        const h1 = p.details?.h1 || '';
        const issues = p.issues?.join('; ') || '';

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
            safe(inlinkCounts[p.url] || 0), // Real Inlink Count
            safe(p.links.length),          // Outlink Count
            safe(issues),
            // Custom Data Columns
            ...sortedCustomKeys.map(key => {
                const val = p.customData?.[key];
                return safe(Array.isArray(val) ? val.join('; ') : val);
            })
        ];

        return row.join(',');
    });

    // 6. Combine Headers and Rows
    const csvContent = [headers.join(','), ...rows].join('\n');

    // 7. Create Download Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `spider_frog_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function exportIssuesCSV(pages: PageData[], issueType: string | null = null) {
    if (pages.length === 0) return;

    // Define CSV Headers
    const headers = [
        'Issue Type',
        'Priority',
        'URL',
        'Status Code',
        'Title',
        'Details' // Specific detail about why it failed if available, otherwise generic
    ];

    // Helper to determine priority (duplicated logic from UI, ideally shared constant)
    const getPriority = (issue: string) => {
        if (issue.includes('Missing') || issue.includes('Error') || issue.includes('Duplicate')) return 'High';
        if (issue.includes('Low') || issue.includes('Thin')) return 'Medium';
        return 'Low';
    };

    const rows: string[] = [];

    pages.forEach(p => {
        // Filter issues if a specific type is requested
        const relevantIssues = issueType
            ? p.issues.filter(i => i === issueType)
            : p.issues;

        relevantIssues.forEach(issue => {
            const row = [
                `"${issue}"`,
                `"${getPriority(issue)}"`,
                `"${p.url}"`,
                p.status,
                `"${(p.details?.title || '').replace(/"/g, '""')}"`,
                // Start of details logic - could be expanded
                `"${issue}"`
            ];
            rows.push(row.join(','));
        });
    });

    if (rows.length === 0) return;

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = issueType
        ? `issue_report_${issueType.replace(/\s+/g, '_').toLowerCase()}.csv`
        : `full_issues_report_${new Date().toISOString().slice(0, 10)}.csv`;

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
