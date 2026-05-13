import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    // Mengizinkan production build selesai meskipun ada error ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Mengizinkan production build selesai meskipun ada error TypeScript
    ignoreBuildErrors: true,
  },
};
export default nextConfig;
