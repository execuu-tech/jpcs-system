import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ⬅️ don’t fail builds on eslint errors
  },
  typescript: {
    ignoreBuildErrors: true, // ⬅️ don’t fail builds on ts errors
  },
  images: {
    domains: ["your-backend-domain.com"], // if you load images from backend
  },
};

export default nextConfig;
