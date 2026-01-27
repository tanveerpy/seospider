import { PageData } from './store';

export function exportToCSV(pages: Record<string, PageData>) {
    const pageList = Object.values(pages);
    if (pageList.length === 0) return;

    // Define CSV Headers
    const headers = [
        'URL',
        'Status Code',
        'Content Type',
        'Title',
        'Meta Description',
        'H1',
        'Word Count',
        'Canonical URL',
        'Inlinks Count',
        'Outlinks Count',
        'Crawl Depth', // Note: Depth not currently tracked in store explicitly, placeholder
        'Issues'
    ];

    // Map Data to Rows
    const rows = pageList.map(p => {
        const title = p.details?.title?.replace(/"/g, '""') || '';
        const desc = p.details?.description?.replace(/"/g, '""') || '';
        const h1 = p.details?.h1?.replace(/"/g, '""') || '';
        const issues = p.issues?.join('; ').replace(/"/g, '""') || '';

        return [
            `"${p.url}"`,
            p.status,
            `"${p.contentType}"`,
            `"${title}"`,
            `"${desc}"`,
            `"${h1}"`,
            p.details?.wordCount || 0,
            `"${p.details?.canonical || ''}"`,
            // Calculating active inlinks requires global context not inherently in PageData unless computed, 
            // but we can count known referring pages if we had backlink map. 
            // For now, we will just count internal links found ON this page (Outlinks).
            // Inlinks would require a reverse index which we can compute or omit.
            // Let's stick to Outlinks for V1.
            0, // Placeholder for Inlinks
            p.links.length,
            0, // Placeholder for Depth
            `"${issues}"`
        ].join(',');
    });

    // Combine Headers and Rows
    const csvContent = [headers.join(','), ...rows].join('\n');

    // Create Download Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `spider_frog_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
