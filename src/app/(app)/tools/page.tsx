'use client';

import React from 'react';
import RobotsTxtGenerator from '@/components/RobotsTxtGenerator';
import SitemapGenerator from '@/components/SitemapGenerator';
import KeywordDensityTool from '@/components/KeywordDensityTool';
import ContentAnalyzer from '@/components/ContentAnalyzer';
import UrlCleaner from '@/components/UrlCleaner';
import HeaderChecker from '@/components/HeaderChecker';
import { motion } from 'framer-motion';

export default function ToolsPage() {
    return (
        <div className="main-viewport animate-in">
            <div className="flex-between" style={{ marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>SEO Utility Toolkit</h1>
                    <p style={{ color: '#94a3b8', marginTop: '4px' }}>Essential technical and content optimization tools.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(350px, 1fr) minmax(350px, 1fr)', gap: '24px', paddingBottom: '40px' }}>
                {/* Column 1 - Technical */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <RobotsTxtGenerator />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <HeaderChecker />
                    </motion.div>
                </div>

                {/* Column 2 - Structure */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <SitemapGenerator />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <UrlCleaner />
                    </motion.div>
                </div>

                {/* Column 3 - Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <ContentAnalyzer />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <KeywordDensityTool />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
