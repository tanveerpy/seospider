export interface IssueInfo {
    title: string;
    impact: string;
    fix: string;
    priority: 'High' | 'Medium' | 'Low';
    tools?: { name: string; url: string }[];
}

export const ISSUE_METADATA: Record<string, IssueInfo> = {
    'TITLE-MISS': {
        title: 'Missing Page Titles',
        priority: 'High',
        impact: 'Search engines use titles as the primary link in search results. Missing titles lead to poor ranking and zero CTR.',
        fix: 'Add a descriptive <title> tag within the <head> of the document.',
        tools: [
            { name: 'Internal Meta Tag Generator', url: '/tools/meta-tag-generator' },
            { name: 'Google Search Central: Title Links', url: 'https://developers.google.com/search/docs/appearance/title-link' }
        ]
    },
    'TITLE-LONG': {
        title: 'Page Titles Too Long',
        priority: 'Medium',
        impact: 'Titles longer than 60 characters are truncated in SERPs, making snippets look unprofessional and hiding keywords.',
        fix: 'Condense your title to stay below 60 characters while keeping your primary keyword at the start.',
        tools: [
            { name: 'Internal Meta Tag Generator', url: '/tools/meta-tag-generator' },
            { name: 'Moz Title Tag Preview', url: 'https://moz.com/learn/seo/title-tag' }
        ]
    },
    'TITLE-SHORT': {
        title: 'Page Titles Too Short',
        priority: 'Low',
        impact: 'Short titles miss opportunities to include relevant keywords and can be too vague for users.',
        fix: 'Expand the title to include secondary keywords or a more descriptive hook (aim for 50-60 chars).',
        tools: [
            { name: 'Internal Meta Tag Generator', url: '/tools/meta-tag-generator' }
        ]
    },
    'DUP-TITLE': {
        title: 'Duplicate Page Titles',
        priority: 'Medium',
        impact: 'Duplicate titles cause search engine confusion (cannibalization) and prevent specific pages from standing out.',
        fix: 'Ensure every page has a unique, descriptive title that reflects its specific content.',
        tools: [
            { name: 'Google Search Console', url: 'https://search.google.com/search-console' }
        ]
    },
    'DESC-MISS': {
        title: 'Missing Meta Descriptions',
        priority: 'Medium',
        impact: 'Missing descriptions force Google to autogenerate snippets, which often results in less compelling text and lower CTR.',
        fix: 'Add a <meta name="description"> tag that summarizes the page content.',
        tools: [
            { name: 'Internal Meta Tag Generator', url: '/tools/meta-tag-generator' },
            { name: 'Google Search Central: Snippets', url: 'https://developers.google.com/search/docs/appearance/snippet' }
        ]
    },
    'DESC-LONG': {
        title: 'Meta Descriptions Too Long',
        priority: 'Low',
        impact: 'Descriptions longer than 155 characters will be truncated, potentially cutting off your Call to Action.',
        fix: 'Shorten the description to 120-155 characters for optimal display across devices.',
        tools: [
            { name: 'Internal Meta Tag Generator', url: '/tools/meta-tag-generator' }
        ]
    },
    'DESC-SHORT': {
        title: 'Meta Descriptions Too Short',
        priority: 'Low',
        impact: 'Short descriptions don\'t provide enough context to entice a user to click.',
        fix: 'Expand the description to better summarize the value proposition of the page.',
        tools: [
            { name: 'Internal Meta Tag Generator', url: '/tools/meta-tag-generator' }
        ]
    },
    'DUP-DESC': {
        title: 'Duplicate Meta Descriptions',
        priority: 'Low',
        impact: 'Duplicate descriptions make search results look repetitive and don\'t differentiate your pages.',
        fix: 'Craft a unique meta description for every page to improve individual snippet performance.'
    },
    'H1-MISS': {
        title: 'Missing H1 Tags',
        priority: 'High',
        impact: 'The H1 is the most important on-page signal for content relevance. Missing it is an SEO red flag.',
        fix: 'Add a single <h1> tag containing the page\'s main topic.'
    },
    'H1-MULT': {
        title: 'Multiple H1 Tags',
        priority: 'Medium',
        impact: 'Multiple H1s can dilute the importance of your main topic and confuse search algorithms.',
        fix: 'Stick to one <h1> per page. Use H2-H6 for sub-headings.'
    },
    'H1-DUP-TITLE': {
        title: 'H1 Idential to Title',
        priority: 'Low',
        impact: 'While not critical, having the exact same H1 and Title is a missed opportunity for keyword variety.',
        fix: 'Slightly vary your H1 from the Page Title to target a broader range of keywords.'
    },
    'H2-MISS': {
        title: 'Missing H2 Tags',
        priority: 'Low',
        impact: 'Missing H2s suggests a lack of structure, making content harder to read for both humans and bots.',
        fix: 'Use H2 tags to break your content into logical blocks and sections.'
    },
    'H2-MULT': {
        title: 'Excessive H2 Tags',
        priority: 'Low',
        impact: 'An excessive amount of H2s (over 20) can indicate over-optimization or poor content flow.',
        fix: 'Check if some sections can be merged or if H3 tags would be more appropriate for sub-subheadings.'
    },
    'CAN-MISS': {
        title: 'Missing Canonical Tags',
        priority: 'High',
        impact: 'Without a canonical, search engines might index duplicate versions of your site, diluting your link equity.',
        fix: 'Add a <link rel="canonical" href="https://yourpage.com/..." /> to define the master version.',
        tools: [
            { name: 'Google Search Central: Canonicals', url: 'https://developers.google.com/search/docs/crawling-indexing/canonicalization' }
        ]
    },
    'CONT-THIN': {
        title: 'Thin Content',
        priority: 'Medium',
        impact: 'Pages with under 200 words (Thin Content) are often seen as low-quality by search engines and struggle to rank.',
        fix: 'Expand the page content with meaningful information, or redirect to a more comprehensive sibling page.'
    },
    'IMG-ALT': {
        title: 'Missing Image Alt Text',
        priority: 'Medium',
        impact: 'Alt text is vital for accessibility (screen readers) and helps search engines understand what\'s in your images.',
        fix: 'Add descriptive "alt" attributes to all your <img> tags.'
    },
    'IMG-SIZE': {
        title: 'Missing Image Size Attributes',
        priority: 'Low',
        impact: 'Browsers reserve space based on size attributes. Missing them causes layout shifts (CLS), hurting UX scores.',
        fix: 'Include "width" and "height" attributes in your <img> tags to stabilize your layout.',
        tools: [
            { name: 'Cumulative Layout Shift (CLS)', url: 'https://web.dev/cls/' }
        ]
    },
    'HEAD-ORDER': {
        title: 'Incorrect Heading Order',
        priority: 'Medium',
        impact: 'Using H2s without an H1 breaks the document outline, confusing screen readers and search algorithms about hierarchy.',
        fix: 'Ensure your page starts with a main H1 before using H2 subheaders.'
    },
    'HTTP-ERR': {
        title: 'HTTP Error Responses',
        priority: 'High',
        impact: '4xx/5xx errors prevent users and crawlers from reaching your content, leading to de-indexing and lost traffic.',
        fix: 'Check server logs, fix broken links, or implement redirects to working pages.',
        tools: [
            { name: 'HTTP Status Codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status' }
        ]
    },
    'BOT-BLOCK': {
        title: 'Bot Protection Triggered',
        priority: 'High',
        impact: 'The site is actively blocking crawlers. This may prevent Google from indexing your content if misconfigured.',
        fix: 'Review your WAF (Cloudflare/Sucuri) settings to ensure you are not blocking legitimate bots. Use the Google Search Console URL Inspection tool to verify access.',
        tools: [
            { name: 'Internal Robots.txt Generator', url: '/tools/robots-txt-generator' },
            { name: 'Google Search Console', url: 'https://search.google.com/search-console' },
            { name: 'Cloudflare Bot Management', url: 'https://www.cloudflare.com/products/bot-management/' }
        ]
    },
    'PERF-SLOW': {
        title: 'Slow Page Performance',
        priority: 'Medium',
        impact: 'High response times (> 2s) hurt User Experience (Core Web Vitals) and crawl budget efficiency.',
        fix: 'Enable caching, optimize database queries, or upgrade server resources.',
        tools: [
            { name: 'PageSpeed Insights', url: 'https://pagespeed.web.dev/' }
        ]
    },
    'CONN-FAIL': {
        title: 'Connection Failures',
        priority: 'High',
        impact: 'The crawler could not establish a connection. This often indicates DNS issues or server downtime.',
        fix: 'Verify your DNS settings and server uptime status immediately.',
        tools: [
            { name: 'DNS Checker', url: 'https://dnschecker.org/' }
        ]
    },
    'SCHEMA-MISS': {
        title: 'Missing Structured Data',
        priority: 'Medium',
        impact: 'Structured data (Schema) helps search engines understand your content and can enable rich results (stars, reviews, recipes).',
        fix: 'Add JSON-LD structured data to your pages using the Schema.org vocabulary.',
        tools: [
            { name: 'Internal Schema Generator', url: '/tools/schema-generator' },
            { name: 'Rich Results Test', url: 'https://search.google.com/test/rich-results' },
            { name: 'Schema Markup Generator', url: 'https://technicalseo.com/tools/schema-markup-generator/' }
        ]
    }
};
