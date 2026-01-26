import { create } from 'zustand';

export interface ExtractionRule {
    id: string;
    name: string;
    type: 'css' | 'regex';
    value: string;
}

export interface PageData {
    url: string;
    status: number;
    contentType: string;
    size: number;
    time: number;
    links: { url: string; type: 'internal' | 'external' }[];
    assets: { url: string; type: 'image' | 'css' | 'javascript'; alt?: string }[];
    details: {
        title: string;
        description: string;
        h1: string;
        h2: string[];
        wordCount: number;
        canonical: string;
        metaRobots: string;
        xRobotsTag: string;
        hreflang: { lang: string; url: string }[];
        relNext: string;
        relPrev: string;
        amphtml: string;
        structuredData: any[];
    };
    customData: Record<string, string[]>;
    issues: string[];
}

interface CrawlerState {
    pages: Record<string, PageData>;
    queue: string[];
    processed: Set<string>;
    isCrawling: boolean;
    rootDomain: string;
    extractionRules: ExtractionRule[];

    // Actions
    startCrawl: (url: string) => void;
    stopCrawl: () => void;
    addPage: (page: PageData) => void;
    addToQueue: (urls: string[]) => void;
    popQueue: () => string | undefined;
    addRule: (rule: ExtractionRule) => void;
    removeRule: (id: string) => void;
}

export const useCrawlerStore = create<CrawlerState>((set, get) => ({
    pages: {},
    queue: [],
    processed: new Set(),
    isCrawling: false,
    rootDomain: '',
    extractionRules: [],

    startCrawl: (url) => {
        try {
            const domain = new URL(url).hostname;
            set({
                pages: {},
                queue: [url],
                processed: new Set([url]),
                isCrawling: true,
                rootDomain: domain
            });
        } catch {
            // Invalid URL
        }
    },

    stopCrawl: () => set({ isCrawling: false }),

    addPage: (page) => set((state) => ({
        pages: { ...state.pages, [page.url]: page }
    })),

    addToQueue: (urls) => set((state) => {
        const newQueue = [...state.queue];
        const newProcessed = new Set(state.processed);

        urls.forEach(u => {
            // Only enqueue if not processed and is internal
            if (!newProcessed.has(u)) {
                try {
                    if (new URL(u).hostname === state.rootDomain) {
                        newQueue.push(u);
                        newProcessed.add(u);
                    }
                } catch { }
            }
        });

        return { queue: newQueue, processed: newProcessed };
    }),

    popQueue: () => {
        const state = get();
        if (state.queue.length === 0) return undefined;
        const [next, ...rest] = state.queue;
        set({ queue: rest });
        return next;
    },

    addRule: (rule) => set(state => ({ extractionRules: [...state.extractionRules, rule] })),
    removeRule: (id) => set(state => ({ extractionRules: state.extractionRules.filter(r => r.id !== id) }))
}));
