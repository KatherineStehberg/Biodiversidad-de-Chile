import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    webpackBuildWorker: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh4.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh6.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Supabase Storage
      {
        protocol: 'https',
        hostname: 'jqlwkrfpodfwczvhbimh.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // biodiversidad.cl WordPress media
      {
        protocol: 'https',
        hostname: 'biodiversidad.cl',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.biodiversidad.cl',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
