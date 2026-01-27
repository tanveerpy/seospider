
export interface IssueSolution {
    priority: 'High' | 'Medium' | 'Low';
    impact: string;
    generalFix: string;
    wordpressFix: string;
    shopifyFix: string;
    tools?: string[];
}

export const ISSUE_SOLUTIONS: Record<string, IssueSolution> = {
    // --- Response Codes ---
    'Response Codes: Internal Client Error': {
        priority: 'High',
        impact: 'Search engines act as clients. 4xx/5xx errors prevent indexing completely.',
        generalFix: 'Check server logs for error details. Restore broken files or fix permission issues.',
        wordpressFix: 'Check .htaccess file for errors. Disable plugins one by one to find conflicts. Verify file permissions (755 for folders, 644 for files).',
        shopifyFix: 'Check if the URL handle has changed. Create a URL Redirect in Navigation settings if the product/page was moved.',
        tools: ['RedirectGenerator']
    },
    'Response Codes: Redirect': {
        priority: 'Medium',
        impact: 'Redirect chains dilute PageRank and slow down crawling.',
        generalFix: 'Update internal links to point directly to the final destination URL.',
        wordpressFix: 'Use a "Better Search Replace" plugin to update old URLs in the database to new ones.',
        shopifyFix: 'Shopify automatically creates redirects, but you should update Navigation links manually to the new URL to avoid the hop.',
        tools: ['RedirectGenerator']
    },

    // --- Metadata ---
    'Page Titles: Missing': {
        priority: 'High',
        impact: 'Title tags are a primary ranking signal. Missing titles devastate CTR.',
        generalFix: 'Add a <title> tag to the <head> section of your HTML.',
        wordpressFix: 'Install Yoast SEO or RankMath. Edit the page and set the "SEO Title" in the meta box.',
        shopifyFix: 'Go to Online Store > Pages/Products used. Scroll to "Search engine listing preview" and click "Edit website SEO".',
        tools: ['MetaTagGenerator']
    },
    'Page Titles: Over 60 Characters': {
        priority: 'Medium',
        impact: 'Long titles get truncated in SERPs, hiding key information.',
        generalFix: 'Shorten the title to under 60 characters for optimal display.',
        wordpressFix: 'Edit the page/post. The SEO plugin (Yoast/RankMath) bar will turn green when length is optimal.',
        shopifyFix: 'Edit website SEO in the product/page details. Shopify warns you when you exceed the character limit.',
        tools: ['MetaTagGenerator']
    },
    'Page Titles: Under 30 Characters': {
        priority: 'Low',
        impact: 'Short titles likely fail to target long-tail keywords.',
        generalFix: 'Expand title to include more descriptive keywords or brand name.',
        wordpressFix: 'Add your site name variable to the title template in SEO settings.',
        shopifyFix: 'Manually expand the title in the "Search engine listing preview" section.',
        tools: ['MetaTagGenerator']
    },
    'Meta Description: Missing': {
        priority: 'Medium',
        impact: 'Search engines will generate random snippets, often reducing CTR.',
        generalFix: 'Add a <meta name="description"> tag to the <head>.',
        wordpressFix: 'Enter a custom description in the Yoast/RankMath "Meta Description" field.',
        shopifyFix: 'Fill out the "Description" field in "Edit website SEO" for every product and page.',
        tools: ['MetaTagGenerator']
    },
    'Meta Description: Over 155 Characters': {
        priority: 'Low',
        impact: 'Truncated descriptions look unprofessional and hide calls-to-action.',
        generalFix: 'Trim description to roughly 155 characters.',
        wordpressFix: 'Use the snippet editor in your SEO plugin to trim the text until the bar is green.',
        shopifyFix: 'Edit within the Shopify admin; keep it concise and under the character limit.'
    },
    'Meta Description: Under 70 Characters': {
        priority: 'Low',
        impact: 'Too short to be persuasive or informative.',
        generalFix: 'Expand description to summarize content and include a CTA.',
        wordpressFix: 'Flesh out the description in the SEO plugin meta box.',
        shopifyFix: 'Add more detail to the "Description" field in SEO settings.'
    },

    // --- Headings ---
    'H1: Missing': {
        priority: 'High',
        impact: 'H1 is the main topic signal. Absence confuses search engines about page context.',
        generalFix: 'Ensure every page has exactly one <h1> tag containing the main topic.',
        wordpressFix: 'The "Post Title" input is usually the H1. Ensure your theme outputs this title in an <h1> tag.',
        shopifyFix: 'The "Title" field for Products/Pages is the H1. Ensure your theme liquid files use <h1>{{ product.title }}</h1>.'
    },
    'H1: Multiple': {
        priority: 'Medium',
        impact: 'Multiple H1s dilute the main topic signal.',
        generalFix: 'Use only one <h1> per page. Demote others to <h2> or <h3>.',
        wordpressFix: 'Check content logic. If you manually added an H1 in the content editor, change it to H2. Let the specific Title field be the only H1.',
        shopifyFix: 'Edit the page content. Highlight secondary headings and change formatting from "Heading 1" to "Heading 2".'
    },
    'H1: Duplicate of Page Title': {
        priority: 'Low',
        impact: 'Missed opportunity to target secondary keywords.',
        generalFix: 'Vary the H1 slightly from the Title Tag to capture more keyword variations.',
        wordpressFix: 'Set a custom "SEO Title" in Yoast/RankMath that differs from the main Input Title (H1).',
        shopifyFix: 'Edit "Website SEO" title separately from the main Product/Page title.'
    },
    'H2: Missing': {
        priority: 'Medium',
        impact: 'Lack of H2s suggests poor content structure or thin content.',
        generalFix: 'Break content into logical sections using <h2> tags.',
        wordpressFix: 'Use the Gutenberg block editor to add "Heading" blocks and select H2.',
        shopifyFix: 'In the rich text editor, select text and choose "Heading 2" from the formatting dropdown.'
    },
    'Headings: H2 with Missing H1': {
        priority: 'High',
        impact: 'Broken hierarchy confuses accessibility tools and bots.',
        generalFix: 'Ensure an <h1> exists before any <h2> tags.',
        wordpressFix: 'Verify your theme renders the post title as H1. Contact theme developer if missing.',
        shopifyFix: 'Check theme.liquid or main-product.liquid to ensure the title is wrapped in <h1>.'
    },

    // --- Technical ---
    'Canonicals: Missing': {
        priority: 'High',
        impact: 'Risk of duplicate content penalties if URLs are accessed via parameters.',
        generalFix: 'Add <link rel="canonical" href="..." > to point to the definitive URL.',
        wordpressFix: 'SEO plugins (Yoast/RankMath) add self-referencing canonicals automatically by default.',
        shopifyFix: 'Edit theme.liquid. Ensure <link rel="canonical" href="{{ canonical_url }}"> is in the <head>.'
    },
    'Canonicals: Non-Self-Referential': {
        priority: 'Medium',
        impact: 'Tells Google this page is a duplicate of another. verify if intentional.',
        generalFix: 'If this page is unique, the canonical should match current URL. If duplicate, this is correct.',
        wordpressFix: 'Check "Advanced" tab in Yoast/RankMath logic for this specific page.',
        shopifyFix: 'Check if you are viewing a collection-aware product URL. Always link to the root /products/ URL.'
    },

    // --- Schema ---
    'Schema: Missing Structured Data': {
        priority: 'Medium',
        impact: 'Missed opportunity for Rich Results (Stars, FAQs, Events) in SERPs.',
        generalFix: 'Add JSON-LD script block defining the entity (Article, Product, etc).',
        wordpressFix: 'Install a schema plugin (Schema Pro) or use Yoast\'s built-in schema settings.',
        shopifyFix: 'Use an SEO app or manually edit liquid files to add JSON-LD structures for Products.',
        tools: ['SchemaGenerator']
    },

    // --- Images ---
    'Images: Missing Alt Text': {
        priority: 'Medium',
        impact: 'Hurts accessibility and image SEO ranking.',
        generalFix: 'Add alt="Description" to all image tags.',
        wordpressFix: 'Click the image in the Media Library or Editor. Fill in "Alternative Text".',
        shopifyFix: 'Click the image in the Product Media section. Click "Add alt text" and save.'
    },

    // --- Content ---
    'Content: Thin Content (< 300 words)': {
        priority: 'Medium',
        impact: 'Unlikely to rank for competitive terms. May be flagged as low quality.',
        generalFix: 'Flesh out content to cover the topic in depth.',
        wordpressFix: 'Add more text blocks. Use an SEO plugin to analyze content length in real-time.',
        shopifyFix: 'Add detailed product descriptions, specs, and shipping info to increase word count.'
    },

    // --- Security ---
    'Security: Missing HSTS Header': {
        priority: 'Low',
        impact: 'Modern browsers prefer sites enforcing HTTPS via HSTS.',
        generalFix: 'Configure web server (Nginx/Apache) to send Strict-Transport-Security header.',
        wordpressFix: 'Use a security plugin like Wordfence or iThemes Security to enable HSTS.',
        shopifyFix: 'Shopify handles this automatically for connected domains. Ensure SSL is active.'
    }
};
