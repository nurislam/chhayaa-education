import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["images.unsplash.com", "plus.unsplash.com"],
  },
};

export default nextConfig;
