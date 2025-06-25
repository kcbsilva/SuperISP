import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Your existing config
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Headers to help with font loading in cloud environments
  async headers() {
    return [
      {
        source: '/_next/static/media/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  webpack: (config, { isServer }) => {
    // Fix for 'net', 'tls', 'fs' modules not found in client-side bundle due to mysql2
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        net: false,
        tls: false,
        fs: false,
      };
    }

    // Add SVG support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  },
};

export default nextConfig;