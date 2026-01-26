'use client';

import { useEffect, useRef, useState } from 'react';
import { useCrawlerStore, PageData } from '@/lib/store';
import clsx from 'clsx';
import LinkGraph from '@/components/LinkGraph';
import ConfigModal from '@/components/ConfigModal';
import RightSidebar from '@/components/RightSidebar';

export default function Dashboard() {
  const {
    pages, queue, isCrawling, startCrawl, stopCrawl, addPage, addToQueue, popQueue
  } = useCrawlerStore();

  const [urlInput, setUrlInput] = useState('https://writeoffcalc.com');
  const [activeTab, setActiveTab] = useState<string>('Internal');
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [activeFilter, setActiveFilter] = useState<{ (p: PageData): boolean } | null>(null);
  const workerRef = useRef<boolean>(false);

  // --- Crawl Engine ---
  useEffect(() => {
    if (isCrawling && !workerRef.current) processQueue();
    else if (!isCrawling) workerRef.current = false;
  }, [isCrawling, queue]);

  const processQueue = async () => {
    if (workerRef.current) return;
    workerRef.current = true;
    while (useCrawlerStore.getState().isCrawling && useCrawlerStore.getState().queue.length > 0) {
      const nextUrl = popQueue();
      if (!nextUrl) break;
      try {
        const rules = useCrawlerStore.getState().extractionRules;
        const res = await fetch('/api/crawl', {
          method: 'POST',
          body: JSON.stringify({ url: nextUrl, rules })
        });
        const data: PageData = await res.json();
        if (data && data.url) {
          addPage(data);
          const internalLinks = data.links.filter(l => l.type === 'internal').map(l => l.url);
          addToQueue(internalLinks);
        }
      } catch (e) { console.error(e); }
      await new Promise(r => setTimeout(r, 200));
    }
    workerRef.current = false;
    if (useCrawlerStore.getState().queue.length === 0) stopCrawl();
  };

  // --- Data & Filters ---
  const pageList = Object.values(pages);
  const internalPages = pageList.filter(p => !p.contentType.includes('image') && !p.contentType.includes('css') && !p.contentType.includes('javascript'));
  const assets = pageList.flatMap(p => p.assets);
  const selectedPage = selectedUrl ? pages[selectedUrl] : null;
  const inlinks = selectedUrl ? pageList.filter(p => p.links.some(l => l.url === selectedUrl)) : [];

  const getRows = (): any[] => {
    if (activeFilter) return pageList.filter(activeFilter);

    switch (activeTab) {
      case 'Internal': return internalPages;
      case 'External':
        const extMap = new Map();
        pageList.forEach(p => {
          p.links.filter(l => l.type === 'external').forEach(l => {
            if (!extMap.has(l.url)) {
              extMap.set(l.url, { url: l.url, contentType: 'External', status: 0, details: {} }); // Mock external
            }
          });
        });
        return Array.from(extMap.values());
      case 'Security': return internalPages.filter(p => !p.url.startsWith('https'));
      case 'Response Codes': return pageList;
      case 'Page Titles': return internalPages; // Uses specific col config below
      case 'Meta Description': return internalPages;
      case 'H1': return internalPages;
      case 'H2': return internalPages;
      case 'Images': return assets.filter(a => a.type === 'image').map(a => ({ url: a.url, details: { alt: a.alt }, status: 200 }));
      case 'Links': return internalPages; // Show all pages, cols will show Inlinks/Outlinks count
      case 'AMP': return internalPages.filter(p => p.details.amphtml);
      case 'Pagination': return internalPages.filter(p => p.details.relNext || p.details.relPrev);
      case 'Canonicals': return internalPages;
      case 'Directives': return internalPages;
      case 'Hreflang': return internalPages.filter(p => p.details.hreflang.length > 0);
      case 'Structured Data': return internalPages.filter(p => p.details.structuredData.length > 0);
      case 'Custom Extraction': return internalPages.filter(p => Object.keys(p.customData || {}).length > 0);
      default: return [];
    }
  };
  const rows = getRows();

  // --- Column Configuration ---
  interface Column {
    header: string;
    key: string;
    width?: string;
    value?: string;
    format?: (v: any) => string;
  }

  const getColumns = (): Column[] => {
    const common: Column[] = [
      { header: 'Address', key: 'url', width: '350px' },
      { header: 'Status', key: 'status', width: '80px' },
    ];

    switch (activeTab) {
      case 'Internal':
        return [...common, { header: 'Title', key: 'details.title' }, { header: 'Word Count', key: 'details.wordCount' }, { header: 'Indexability', key: 'indexability', value: 'Indexable' }];
      case 'Page Titles':
        return [...common, { header: 'Title', key: 'details.title' }, { header: 'Length', key: 'details.title.length' }];
      case 'Meta Description':
        return [...common, { header: 'Description', key: 'details.description' }, { header: 'Length', key: 'details.description.length' }];
      case 'H1':
        return [...common, { header: 'H1-1', key: 'details.h1' }, { header: 'Length', key: 'details.h1.length' }];
      case 'H2':
        return [...common, { header: 'H2-1', key: 'details.h2[0]' }, { header: 'H2-2', key: 'details.h2[1]' }];
      case 'Images':
        return [{ header: 'Image URL', key: 'url', width: '400px' }, { header: 'Alt Text', key: 'details.alt' }];
      case 'Links':
        return [...common, { header: 'Outlinks', key: 'links.length' }];
      case 'AMP':
        return [...common, { header: 'AMP URL', key: 'details.amphtml' }];
      case 'Pagination':
        return [...common, { header: 'Rel Next', key: 'details.relNext' }, { header: 'Rel Prev', key: 'details.relPrev' }];
      case 'Canonicals':
        return [...common, { header: 'Canonical Link Element', key: 'details.canonical' }];
      case 'Directives':
        return [...common, { header: 'Meta Robots', key: 'details.metaRobots' }, { header: 'X-Robots-Tag', key: 'details.xRobotsTag' }];
      case 'Custom Extraction':
        return [...common, { header: 'Extracted Data', key: 'customData', width: '500px', format: (v: any) => JSON.stringify(v) }];
      case 'Structured Data':
        return [...common, { header: 'Types', key: 'details.structuredData', format: (v: any[]) => v.map(i => i['@type']).join(', ') }];
      default:
        return [...common, { header: 'Content Type', key: 'contentType' }];
    }
  };
  const columns = getColumns();

  // Helper to extract nested keys safely
  const getValue = (obj: any, path: string) => {
    const keys = path.split('.');
    let val = obj;
    for (const k of keys) {
      if (val === undefined || val === null) return '';
      if (k.includes('[')) { // Handle array index e.g. h2[0]
        const [realKey, index] = k.split('[');
        val = val[realKey]?.[parseInt(index)];
      } else {
        val = val[k];
      }
    }
    return val;
  };

  const handleExport = () => {
    // Basic CSV export logic (simplified for now)
    const headers = columns.map(c => c.header).join(',');
    const csv = [
      headers,
      ...rows.map(r => columns.map(c => `"${getValue(r, c.key) || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = `crawl_export_${activeTab}.csv`;
    a.click();
  };

  return (
    <div className="sf-app">
      <header className="sf-header">
        <div style={{ fontWeight: 800, fontSize: '18px', color: '#4ade80' }}>
          <span style={{ color: '#fff' }}>SPIDER</span>FROG
        </div>
        <div className="top-controls">
          <input className="sf-input" value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://example.com" />
          <button className="sf-btn" onClick={() => setShowConfig(true)} style={{ background: '#4b5563', color: 'white' }}>Config</button>
          <button className="sf-btn start" onClick={() => startCrawl(urlInput)}>Start</button>
          <button className="sf-btn stop" onClick={stopCrawl}>Stop</button>
          <button className="sf-btn" onClick={handleExport} style={{ background: '#2563eb', color: 'white' }}>Export CSV</button>
          <div style={{ flex: 1 }}></div>
          <div style={{ fontSize: '11px', color: '#aaa' }}>{Object.keys(pages).length} URLs</div>
        </div>
      </header>

      {showConfig && <ConfigModal onClose={() => setShowConfig(false)} />}

      <div className="sf-workspace">
        <div className="sf-main-pane">
          {/* Tabs - Scrollable */}
          <div className="sf-tabs-bar" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {['Internal', 'External', 'Security', 'Response Codes', 'URL', 'Page Titles', 'Meta Description', 'H1', 'H2', 'Images', 'Links', 'AMP', 'Pagination', 'Canonicals', 'Directives', 'Hreflang', 'Structured Data', 'Custom Extraction', 'Visualizations'].map(tab => (
              <div key={tab} className={clsx("sf-tab", activeTab === tab && "active")} onClick={() => setActiveTab(tab)}>
                {tab}
              </div>
            ))}
          </div>

          <div className="sf-table-container">
            {activeTab === 'Visualizations' ? (
              <LinkGraph />
            ) : (
              <table className="sf-table">
                <thead>
                  <tr>
                    {columns.map((col, i) => <th key={i} style={{ width: col.width }}>{col.header}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} onClick={() => setSelectedUrl(row.url)} className={clsx(selectedUrl === row.url && "selected")}>
                      {columns.map((col, j) => (
                        <td key={j}>
                          {col.format ? col.format(getValue(row, col.key)) : getValue(row, col.key) || col.value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="sf-bottom-panel">
            {/* Simple Details Inspector (Simplified for brevity) */}
            <div className="sf-tabs-bar" style={{ background: '#f5f5f5' }}>
              <div className="sf-tab active">URL Details</div>
              <div className="sf-tab">Inlinks ({inlinks.length})</div>
            </div>
            <div className="detail-content p-4">
              {selectedPage ? (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div><b>Address:</b> {selectedPage.url}</div>
                  <div><b>Title:</b> {selectedPage.details.title}</div>
                  <div><b>Meta Robots:</b> {selectedPage.details.metaRobots || 'None'}</div>
                  <div><b>Canonical:</b> {selectedPage.details.canonical || 'None'}</div>
                  <div><b>H2s Found:</b> {selectedPage.details.h2.length}</div>
                  <div><b>Structured Data Types:</b> {selectedPage.details.structuredData.map((s: any) => s['@type']).join(', ')}</div>
                </div>
              ) : <div className="text-gray-400">Select a URL</div>}
            </div>
          </div>
        </div>

        <RightSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setFilter={setActiveFilter as any} // Casting for cleaner TS
        />
      </div>
    </div>
  );
}


