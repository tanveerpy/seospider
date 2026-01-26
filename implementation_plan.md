# SpiderFrog Online: Implementation Master Plan

## 🎯 Objective
Transform the MVP into a full-featured "Screaming Frog" alternative in the browser, matching the desktop experience with a premium "Cyber-Glass" aesthetic.

## 🏗️ 1. Architecture & State Management
**Current Issue:** Simple `useState` cannot handle complex filtering, selection details, or 1000+ pages efficiently.
**Solution:** Implement **Zustand** for global state management.

*   **Store Structure:**
    *   `pages`: Map<URL, PageData> (Fast lookups)
    *   `queue`: Array<URL>
    *   `history`: Array<CrawlSession>
    *   `selection`: Currently selected URL (for Bottom Detail View)
    *   `filters`: Active filters (HTML, JS, CSS, Images, External)

## 🕷️ 2. Crawler Engine Refactor (`/api/crawl`)
**Current Capabilities:** Fetches HTML, parses `<a>` tags.
**Upgrade Requirements:**
*   **Asset Discovery:** Parse `<img>`, `<link rel="stylesheet">`, `<script src="...">`.
*   **External vs Internal:** Distinct categorization.
*   **MIME Type Detection:** accurately identify Content-Type even if extension is missing.
*   **Robots.txt parsing:** Respect basic robots rules (optional but pro).

## 🖥️ 3. UI/UX Layout Overhaul (The "Pro" Interface)
Replicate the density and utility of the Screaming Frog interface but with better design.

### A. Right Sidebar: "The Overview Tree"
*   **Summary Section:**
    *   Total URLs
    *   **Internal:** (All, HTML, JS, CSS, Images, PDF)
    *   **External:** (All, HTML, JS, etc.)
    *   **Response Codes:** (2xx, 3xx, 4xx, 5xx)
*   **Function:** Clicking a node (e.g., "Images") filters the main table instantly.

### B. Main Data Grid (Center)
*   **Tabs:** Internal | External | Security | Response Codes | Page Titles
*   **Sticky Headers:** Sortable columns.
*   **Status Indicators:** Color-coded status dots.

### C. Bottom Detail Panel (The "Inspector")
*   When a row is clicked, this panel slides up or updates.
*   **Tabs within Inspector:**
    *   **Overview:** Full metadata (Title, Desc, H1, Word Count).
    *   **Inlinks:** Which pages point to this URL? (Crucial for Link Equity).
    *   **Outlinks:** Where does this page point?
    *   **Image Details:** Alt text analysis for this specific page.

## 🎨 4. Data Visualization ("The Reveal")
*   **Force-Directed Graph:**
    *   Interactive network graph of the site.
    *   Nodes = Pages, Edges = Links.
    *   Color by Status Code (Red=Error, Green=OK).
    *   Size by Page Authority (Inlink count).

## 🛠️ 5. Utilities
*   **CSV Export:** Flatten the state and generate a download.
*   **SitemapXML Generation:** Generate a valid `sitemap.xml` string from the crawled `pages`.

## 📅 Phased Execution

### Phase 1: Engine & State
1.  Install `zustand`.
2.  Update `route.ts` to capture Images, CSS, JS.
3.  Update logic to distinguish Internal vs External links.

### Phase 2: The "Pro" Layout
1.  Componentize the Dashboard (`Sidebar`, `MainTable`, `DetailPanel`).
2.  Implement the "Overview Tree" logic.
3.  Implement the Bottom Detail View logic (Inlinks calculation).

### Phase 3: Visuals & Export
1.  Integrate `react-force-graph`.
2.  Build CSV Export function.
