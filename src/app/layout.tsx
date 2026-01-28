import type { Metadata } from "next";
// Google Fonts removed for stability
import "./globals.css";

export const metadata: Metadata = {
  title: "CrawlLogic | Technical SEO Spider & Website Crawler",
  description: "Free online SEO crawler for technical audits. Analyze HTTP headers, JavaScript rendering, internal linking, and Core Web Vitals without installation.",
  keywords: "seo spider, website crawler, technical seo audit, javascript seo, core web vitals, dom analysis, http headers",
  openGraph: {
    title: "CrawlLogic - Technical SEO Scanner",
    description: "Deep-dive technical SEO analysis for modern React/Next.js websites.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
