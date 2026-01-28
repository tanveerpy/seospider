import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ExtractionRule {
    id: string;
    name: string;
    type: 'css' | 'regex';
    value: string;
}

export interface Issue {
    type: 'error' | 'warning' | 'info';
    message: string;
    code?: string;
}

export interface PageData {
    url: string;
    status: number;
    contentType: string;
    size: number;
    time: number;
    links: { url: string; type: 'internal' | 'external' }[];
    assets: { url: string; type: 'image' | 'css' | 'javascript'; alt?: string; missingAlt?: boolean }[];
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
    issues: Issue[];
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

export const useCrawlerStore = create<CrawlerState>()(
    persist(
        (set, get) => ({
            pages: {},
            queue: [],
            processed: new Set(),
            isCrawling: false,
            rootDomain: '',
            extractionRules: [],

            startCrawl: (url) => {
                try {
                    const normalizedDomain = new URL(url).hostname.replace(/^www\./, '');
                    set({
                        pages: {},
                        queue: [url],
                        processed: new Set([url]),
                        isCrawling: true,
                        rootDomain: normalizedDomain
                    });
                } catch {
                    // Invalid URL
                }
            },

            stopCrawl: () => set({ isCrawling: false }),

            addPage: (page) => set((state) => {
                // Create initial newPages map with the newest page added
                let newPages = { ...state.pages, [page.url]: page };

                // Global audit for duplicates
                const titleMap: Record<string, string[]> = {};
                const descMap: Record<string, string[]> = {};

                Object.values(newPages).forEach(p => {
                    if (p.details?.title) {
                        if (!titleMap[p.details.title]) titleMap[p.details.title] = [];
                        titleMap[p.details.title].push(p.url);
                    }
                    if (p.details?.description) {
                        if (!descMap[p.details.description]) descMap[p.details.description] = [];
                        descMap[p.details.description].push(p.url);
                    }
                });

                // Apply duplicate issues imutably
                const finalPages: Record<string, PageData> = {};
                Object.values(newPages).forEach(p => {
                    const isTitleDup = p.details?.title ? (titleMap[p.details.title] || []).length > 1 : false;
                    const isDescDup = p.details?.description ? (descMap[p.details.description] || []).length > 1 : false;

                    // Only update if duplicate status changed or if it's the new page
                    const hasExistingTitleDup = p.issues?.some(i => i.message === 'Page Titles: Duplicate');
                    const hasExistingDescDup = p.issues?.some(i => i.message === 'Meta Description: Duplicate');

                    if (isTitleDup !== hasExistingTitleDup || isDescDup !== hasExistingDescDup || p.url === page.url) {
                        // Remove existing duplicate issues before re-adding
                        let nextIssues = (p.issues || []).filter(i => i.message !== 'Page Titles: Duplicate' && i.message !== 'Meta Description: Duplicate');
                        if (isTitleDup) nextIssues.push({ type: 'error', message: 'Page Titles: Duplicate', code: 'DUP-TITLE' });
                        if (isDescDup) nextIssues.push({ type: 'warning', message: 'Meta Description: Duplicate', code: 'DUP-DESC' });

                        finalPages[p.url] = { ...p, issues: nextIssues };
                    } else {
                        finalPages[p.url] = p;
                    }
                });

                return { pages: finalPages };
            }),

            addToQueue: (urls) => set((state) => {
                const newQueue = [...state.queue];
                const newProcessed = new Set(state.processed);

                urls.forEach(u => {
                    // Only enqueue if not processed and is internal
                    if (!newProcessed.has(u)) {
                        try {
                            const linkHostname = new URL(u).hostname.replace(/^www\./, '');
                            if (linkHostname === state.rootDomain || linkHostname.endsWith('.' + state.rootDomain)) {
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
        }),
        {
            name: 'spider-frog-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                pages: state.pages,
                queue: state.queue,
                processed: Array.from(state.processed), // Convert Set to Array for storage
                rootDomain: state.rootDomain,
                extractionRules: state.extractionRules
            } as any),
            merge: (persistedState: any, currentState) => ({
                ...currentState,
                ...persistedState,
                // Convert Array back to Set during hydration
                processed: new Set(persistedState.processed || []),
                // Always reset crawling state on reload to prevent UI deadlocks
                isCrawling: false
            })
        }
    )
);
