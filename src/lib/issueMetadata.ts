export interface IssueInfo {
    impact: string;
    fix: string;
    priority: 'High' | 'Medium' | 'Low';
}

export const ISSUE_METADATA: Record<string, IssueInfo> = {
    'Page Titles: Missing': {
        priority: 'High',
        impact: 'Search engines use titles as the primary link in search results. Missing titles lead to poor ranking and zero CTR.',
        fix: 'Add a descriptive <title> tag within the <head> of the document.'
    },
    'Page Titles: Over 60 Characters': {
        priority: 'Medium',
        impact: 'Titles longer than 60 characters are truncated in SERPs, making snippets look unprofessional and hiding keywords.',
        fix: 'Condense your title to stay below 60 characters while keeping your primary keyword at the start.'
    },
    'Page Titles: Under 30 Characters': {
        priority: 'Low',
        impact: 'Short titles miss opportunities to include relevant keywords and can be too vague for users.',
        fix: 'Expand the title to include secondary keywords or a more descriptive hook (aim for 50-60 chars).'
    },
    'Page Titles: Duplicate': {
        priority: 'Medium',
        impact: 'Duplicate titles cause search engine confusion (cannibalization) and prevent specific pages from standing out.',
        fix: 'Ensure every page has a unique, descriptive title that reflects its specific content.'
    },
    'Meta Description: Missing': {
        priority: 'Medium',
        impact: 'Missing descriptions force Google to autogenerate snippets, which often results in less compelling text and lower CTR.',
        fix: 'Add a <meta name="description"> tag that summarizes the page content.'
    },
    'Meta Description: Over 155 Characters': {
        priority: 'Low',
        impact: 'Descriptions longer than 155 characters will be truncated, potentially cutting off your Call to Action.',
        fix: 'Shorten the description to 120-155 characters for optimal display across devices.'
    },
    'Meta Description: Under 70 Characters': {
        priority: 'Low',
        impact: 'Short descriptions don\'t provide enough context to entice a user to click.',
        fix: 'Expand the description to better summarize the value proposition of the page.'
    },
    'Meta Description: Duplicate': {
        priority: 'Low',
        impact: 'Duplicate descriptions make search results look repetitive and don\'t differentiate your pages.',
        fix: 'Craft a unique meta description for every page to improve individual snippet performance.'
    },
    'H1: Missing': {
        priority: 'High',
        impact: 'The H1 is the most important on-page signal for content relevance. Missing it is an SEO red flag.',
        fix: 'Add a single <h1> tag containing the page\'s main topic.'
    },
    'H1: Multiple': {
        priority: 'Medium',
        impact: 'Multiple H1s can dilute the importance of your main topic and confuse search algorithms.',
        fix: 'Stick to one <h1> per page. Use H2-H6 for sub-headings.'
    },
    'H1: Duplicate of Page Title': {
        priority: 'Low',
        impact: 'While not critical, having the exact same H1 and Title is a missed opportunity for keyword variety.',
        fix: 'Slightly vary your H1 from the Page Title to target a broader range of keywords.'
    },
    'H2: Missing': {
        priority: 'Low',
        impact: 'Missing H2s suggests a lack of structure, making content harder to read for both humans and bots.',
        fix: 'Use H2 tags to break your content into logical blocks and sections.'
    },
    'H2: Multiple (High Count)': {
        priority: 'Low',
        impact: 'An excessive amount of H2s (over 20) can indicate over-optimization or poor content flow.',
        fix: 'Check if some sections can be merged or if H3 tags would be more appropriate for sub-subheadings.'
    },
    'Canonicals: Missing': {
        priority: 'High',
        impact: 'Without a canonical, search engines might index duplicate versions of your site, diluting your link equity.',
        fix: 'Add a <link rel="canonical" href="https://yourpage.com/..." /> to define the master version.'
    },
    'Canonicals: Non-Self-Referential': {
        priority: 'Medium',
        impact: 'Pointing a canonical to another page tells Google this page is a duplicate, which may lead to it being de-indexed.',
        fix: 'Ensure your canonical tag points to the current URL unless you intentionally want to consolidate traffic.'
    },
    'Content: Low Content Pages': {
        priority: 'Medium',
        impact: 'Pages with under 200 words (Thin Content) are often seen as low-quality by search engines and struggle to rank.',
        fix: 'Expand the page content with meaningful information, or redirect to a more comprehensive sibling page.'
    },
    'Images: Missing Alt Text': {
        priority: 'Medium',
        impact: 'Alt text is vital for accessibility (screen readers) and helps search engines understand what\'s in your images.',
        fix: 'Add descriptive "alt" attributes to all your <img> tags.'
    },
    'Images: Missing Size Attributes': {
        priority: 'Low',
        impact: 'Browsers reserve space based on size attributes. Missing them causes layout shifts (CLS), hurting UX scores.',
        fix: 'Include "width" and "height" attributes in your <img> tags to stabilize your layout.'
    },
    'Security: Missing HSTS Header': {
        priority: 'Medium',
        impact: 'HSTS enforces HTTPS connections, protecting users and satisfying modern browser security requirements.',
        fix: 'Enable the Strict-Transport-Security header on your server (e.g., via .htaccess or Nginx config).'
    },
    'Security: Missing Content-Security-Policy Header': {
        priority: 'High',
        impact: 'CSP prevents Cross-Site Scripting (XSS) and data injection attacks. It is a cornerstone of modern web security.',
        fix: 'Implement a CSP header to whitelist trusted sources for scripts, styles, and data.'
    },
    'Response Codes: Internal Client Error (404)': {
        priority: 'High',
        impact: '404 errors prevent users and crawlers from reaching your content, leading to de-indexing and lost traffic.',
        fix: 'Fix the broken link or set up a 301 redirect to the most relevant working page.'
    },
    'Response Codes: Redirect': {
        priority: 'Low',
        impact: 'Internal redirects (301/302) increase page load time and waste "crawling budget".',
        fix: 'Update your internal links to point directly to the destination URL instead of through a redirect.'
    },

    // --- New Signals ---
    'Schema: Missing Structured Data': {
        priority: 'Medium',
        impact: 'In the era of AI-driven search (SGE), Schema helps bots understand entities like Products, Articles, and FAQs.',
        fix: 'Add JSON-LD structured data script tags to your page head.'
    },
    'Accessibility: Missing HTML Lang Attribute': {
        priority: 'Medium',
        impact: 'Screen readers rely on the lang attribute to pronounce content correctly. Google also uses it for locale detection.',
        fix: 'Add a lang="en" (or your specific locale) attribute to the root <html> tag.'
    },
    'Content: Thin Content (< 300 words)': {
        priority: 'High',
        impact: 'AI-generated results favor in-depth content. Pages under 300 words are often seen as "Thin" and de-ranked.',
        fix: 'Expand the page content to be more comprehensive or consolidate it with other pages.'
    },
    'Headings: H2 with Missing H1': {
        priority: 'Medium',
        impact: 'Using H2s without an H1 breaks the document outline, confusing screen readers and search algorithms about hierarchy.',
        fix: 'Ensure your page starts with a main H1 before using H2 subheaders.'
    }
};
