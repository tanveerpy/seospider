import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/seospider',
  assetPrefix: '/seospider',
};

export default nextConfig;
