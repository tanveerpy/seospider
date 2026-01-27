import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages often runs on a subdirectory (e.g. /repo-name).
  // If the user uses a custom domain, basePath is not needed.
  // We'll leave basePath commented out for now as the user didn't specify a repo subpath layout.
  // basePath: '/seospider',
};

export default nextConfig;
