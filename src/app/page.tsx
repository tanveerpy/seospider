'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Terminal,
  ShieldCheck,
  Globe,
  Zap,
  Share2,
  BarChart3,
  Search,
  LayoutDashboard,
  Wrench,
  FileText,
  GitBranch,
  BookOpen,
  Link2,
  Type,
  Activity
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page" style={{
      minHeight: '100vh',
      background: '#020617',
      color: '#fff',
      overflowX: 'hidden',
      fontFamily: 'var(--font-main)'
    }}>

      {/* Dynamic Background Spotlights */}
      <div style={{ position: 'absolute', top: '-20%', left: '20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '20%', right: '-10%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />

      {/* Navigation */}
      <nav style={{
        padding: '24px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        backdropFilter: 'blur(5px)'
      }}>
        <div style={{ fontWeight: 900, fontSize: '26px', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #22c55e, #166534)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={18} color="white" />
          </div>
          <span>SPIDER<span style={{ color: '#22c55e' }}>FROG</span></span>
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link href="/tools" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}>
            Free SEO Tools
          </Link>
          <Link href="/dashboard">
            <button className="glow-btn" style={{ padding: '10px 28px', fontSize: '14px', borderRadius: '99px' }}>
              Open Dashboard <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        padding: '80px 24px 0 24px',
        zIndex: 1
      }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ maxWidth: '900px', margin: '0 auto' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '99px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></span>
            <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 500, letterSpacing: '0.5px' }}>Top-Rated SEO Crawler of 2026</span>
          </div>

          <h1 style={{
            fontSize: '80px',
            fontWeight: 800,
            margin: '0 0 24px 0',
            lineHeight: '1',
            letterSpacing: '-2px',
            background: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            SEO Audits.<br />
            <span style={{
              background: 'linear-gradient(90deg, #22c55e 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>At Light Speed.</span>
          </h1>

          <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '640px', margin: '0 auto 48px auto', lineHeight: '1.6' }}>
            Uncover technical debt, visualize site architecture, and optimize ranking performance with the world's most advanced browser-based crawler.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '80px' }}>
            <Link href="/dashboard">
              <button className="glow-btn" style={{ padding: '18px 48px', fontSize: '16px', borderRadius: '16px', boxShadow: '0 0 40px rgba(34, 197, 94, 0.4)' }}>
                Start Free Audit
              </button>
            </Link>
            <button style={{
              padding: '18px 48px', fontSize: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff', borderRadius: '16px', cursor: 'pointer', fontWeight: 600,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s'
            }}>
              See Live Demo
            </button>
          </div>
        </motion.div>

        {/* 3D Dashboard Preview Hero */}
        <motion.div
          initial={{ opacity: 0, rotateX: 20, y: 100 }}
          animate={{ opacity: 1, rotateX: 10, y: 0 }}
          transition={{ duration: 1, delay: 0.2, type: "spring" }}
          style={{
            perspective: '2000px',
            transformStyle: 'preserve-3d',
            position: 'relative',
            zIndex: 2,
            marginBottom: '-200px' // overlap footer or next section
          }}
        >
          <div style={{
            width: '1100px',
            height: '700px',
            background: '#0f172a',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
            overflow: 'hidden',
            position: 'relative',
            transform: 'rotateX(5deg)', // Slight tilt
          }}>
            {/* Fake UI Header */}
            <div style={{ height: '60px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></div>
              </div>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', height: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 12px', color: '#64748b', fontSize: '13px' }}>
                <Search size={14} style={{ marginRight: '8px' }} />
                https://writeoffcalc.com
              </div>
            </div>

            {/* Fake UI Body */}
            <div style={{ display: 'flex', height: '100%' }}>
              {/* Fake Sidebar */}
              <div style={{ width: '220px', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ height: '12px', width: '60%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                  <div style={{ height: '32px', width: '100%', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)' }}></div>
                  <div style={{ height: '12px', width: '80%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginTop: '8px' }}></div>
                  <div style={{ height: '12px', width: '70%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
                </div>
              </div>
              {/* Fake Content */}
              <div style={{ flex: 1, padding: '32px', background: 'radial-gradient(circle at top right, #1e293b, #020617)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ height: '100px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}></div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                  <div style={{ height: '300px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'end', padding: '24px', gap: '16px' }}>
                    {/* Fake Bars */}
                    <div style={{ width: '10%', height: '40%', background: '#ef4444', borderRadius: '4px 4px 0 0' }}></div>
                    <div style={{ width: '10%', height: '80%', background: '#f59e0b', borderRadius: '4px 4px 0 0' }}></div>
                    <div style={{ width: '10%', height: '60%', background: '#22c55e', borderRadius: '4px 4px 0 0' }}></div>
                    <div style={{ width: '10%', height: '30%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
                    <div style={{ width: '10%', height: '90%', background: '#a855f7', borderRadius: '4px 4px 0 0' }}></div>
                  </div>
                  <div style={{ height: '300px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: '20px solid rgba(255,255,255,0.1)', borderTopColor: '#22c55e' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glass Reflection Overlay */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(120deg, rgba(255,255,255,0.1) 0%, transparent 40%)',
              pointerEvents: 'none'
            }}></div>
          </div>
        </motion.div>

      </section>

      {/* Feature Grid / Details */}
      <section style={{ padding: '240px 48px 100px 48px', position: 'relative', zIndex: 1, background: '#020617' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '16px' }}>Everything You Need. <span style={{ color: '#64748b' }}>Nothing You Don't.</span></h2>
            <p style={{ fontSize: '18px', color: '#94a3b8' }}>Built for performance, scalability, and ease of use.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            <FeatureCard
              icon={Zap}
              color="#f59e0b"
              title="Blazing Fast Crawls"
              desc="Proprietary Node.js crawler engine optimized for speed. Handle thousands of pages in minutes, not hours."
            />
            <FeatureCard
              icon={ShieldCheck}
              color="#22c55e"
              title="Automated Audits"
              desc="Instant health checks. Identify broken links, redirect chains, and missing metadata automatically."
            />
            <FeatureCard
              icon={Share2}
              color="#3b82f6"
              title="Visual Site Maps"
              desc="Interactive force-directed graphs that visualize your internal linking structure and equity flow."
            />
            <FeatureCard
              icon={BarChart3}
              color="#a855f7"
              title="Data Export"
              desc="One-click CSV exports for deeply custom analysis in Excel, Google Sheets, or Looker Studio."
            />
            <FeatureCard
              icon={LayoutDashboard}
              color="#ef4444"
              title="Modern Dashboard"
              desc="Say goodbye to spreadsheets. Our command center gives you the high-level metrics that matter."
            />
            <FeatureCard
              icon={Terminal}
              color="#ec4899"
              title="Developer API"
              desc="Connect your own tools. Full access to raw crawl data via our local JSON API."
            />
          </div>
        </div>
      </section>

      {/* Free SEO Tools Section */}
      <section style={{ padding: '100px 48px', background: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', fontSize: '12px', fontWeight: 600, marginBottom: '16px', letterSpacing: '1px' }}>FREE FOREVER</div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 16px 0' }}>Powerful SEO Utilities</h2>
            <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
              Essential mini-tools to help you fix specific problems instantly. No account required.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <ToolDetailCard
              icon={FileText} color="#3b82f6"
              title="Robots.txt Generator"
              desc="Create custom robot directives to control which parts of your site crawlers can access."
              benefit="Preserves crawl budget and protects sensitive admin pages from being indexed."
            />
            <ToolDetailCard
              icon={GitBranch} color="#22c55e"
              title="XML Sitemap Generator"
              desc="Automatically generate a valid XML sitemap based on your recent crawl data."
              benefit="Helps search engines discover and index your pages faster and more accurately."
            />
            <ToolDetailCard
              icon={BookOpen} color="#ec4899"
              title="Content Readability"
              desc="Analyze your content's Flesch-Kincaid score, word count, and reading time."
              benefit="Ensures your content is accessible and easy to read, improving user engagement signals."
            />
            <ToolDetailCard
              icon={Link2} color="#a855f7"
              title="Slug & URL Cleaner"
              desc="Convert any text into clean, SEO-friendly URL slugs instantly."
              benefit="Optimizes URL structure for better keyword relevance and click-through rates."
            />
            <ToolDetailCard
              icon={Type} color="#f59e0b"
              title="Keyword Density"
              desc="Check frequency of 1-word and 2-word phrases in your content."
              benefit="Helps avoid keyword stuffing penalties while ensuring topical relevance."
            />
            <ToolDetailCard
              icon={Activity} color="#10b981"
              title="Server Status Check"
              desc="Instantly check HTTP status codes (200, 301, 404) and response headers."
              benefit="Debugs connectivity issues and validates redirect chains in real-time."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '80px 48px', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#64748b', fontSize: '14px', background: '#020617' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: '20px', color: '#fff', marginBottom: '16px' }}>SPIDER<span style={{ color: '#22c55e' }}>FROG</span></div>
            <p>The Search Engine Optimizaton suite<br />for the modern web.</p>
          </div>
          <div style={{ display: 'flex', gap: '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <strong style={{ color: '#fff' }}>Product</strong>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Features</a>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Pricing</a>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Changelog</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <strong style={{ color: '#fff' }}>Resources</strong>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Documentation</a>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>API</a>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Community</a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '60px auto 0 auto', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          &copy; 2026 SpiderFrog Online. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, color, title, desc }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      style={{
        padding: '40px',
        background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(30, 41, 59, 0.2) 100%)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '32px',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
      }}></div>

      <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', border: `1px solid ${color}30` }}>
        <Icon size={32} color={color} />
      </div>
      <h3 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 16px 0', color: '#fff' }}>{title}</h3>
      <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: 0, fontSize: '16px' }}>{desc}</p>
      {title === 'SEO Utility Suite' && (
        <Link href="/tools" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '24px', color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
          Try Free Tools <ArrowRight size={16} />
        </Link>
      )}
    </motion.div>
  )
}

function ToolDetailCard({ icon: Icon, color, title, desc, benefit }: any) {
  return (
    <Link href="/tools" style={{ textDecoration: 'none' }}>
      <motion.div
        whileHover={{ y: -5, background: 'rgba(255,255,255,0.03)' }}
        style={{
          padding: '32px',
          background: 'rgba(255,255,255,0.015)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '24px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
            <Icon size={24} color={color} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#fff' }}>{title}</h3>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px 0', flex: 1 }}>
          {desc}
        </p>

        <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: color, textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={12} /> Why it helps
          </div>
          <div style={{ fontSize: '13px', color: '#cbd5e1' }}>{benefit}</div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: color }}>
          Launch Tool <ArrowRight size={14} />
        </div>
      </motion.div>
    </Link>
  )
}
