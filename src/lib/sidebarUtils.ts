import { PageData } from '@/lib/store';

export interface TreeItemData {
    label: string;
    count: number;
    filter?: (p: PageData) => boolean;
    children?: TreeItemData[];
}

export const getResponseTimeBuckets = (pages: PageData[]) => {
    return [
        { label: '0 to 200ms', count: pages.filter(p => p.time < 200).length },
        { label: '201 to 500ms', count: pages.filter(p => p.time >= 200 && p.time <= 500).length },
        { label: '501 to 1000ms', count: pages.filter(p => p.time > 500 && p.time <= 1000).length },
        { label: '1001 to 2000ms', count: pages.filter(p => p.time > 1000 && p.time <= 2000).length },
        { label: 'Over 2 sec', count: pages.filter(p => p.time > 2000).length },
    ];
};

export const buildStructureTree = (pages: PageData[]) => {
    // Basic folder structure logic
    const root: any = { label: 'Root', count: 0, children: {} };

    pages.forEach(p => {
        try {
            const path = new URL(p.url).pathname;
            const parts = path.split('/').filter(Boolean);
            let current = root;
            current.count++;

            parts.forEach(part => {
                if (!current.children[part]) {
                    current.children[part] = { label: part, count: 0, children: {} };
                }
                current = current.children[part];
                current.count++;
            });
        } catch { }
    });

    // Convert to array format for rendering with filter function
    const traverse = (node: any, currentPath: string): any => {
        const fullPath = currentPath + (node.label === 'Root' ? '' : (currentPath.endsWith('/') ? '' : '/') + node.label);
        return {
            label: node.label,
            count: node.count,
            filter: (p: PageData) => {
                try {
                    const urlPath = new URL(p.url).pathname;
                    return urlPath.startsWith(fullPath) || (fullPath === '/' && urlPath === '/');
                } catch { return false; }
            },
            children: Object.values(node.children).map(child => traverse(child, fullPath))
        };
    };

    const tree = traverse(root, '');
    return tree.children; // Return children of root
};
