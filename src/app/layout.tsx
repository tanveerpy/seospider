import type { Metadata } from "next";
// Google Fonts removed for stability
import "./globals.css";

export const metadata: Metadata = {
  title: "SpiderFrog Online - SEO Spider",
  description: "Advanced Online SEO Crawler and Analyzer",
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
