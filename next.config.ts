import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
    ],
  },
  allowedDevOrigins: ['9003-idx-studio-1746297214025.cluster-uf6urqn4lned4spwk4xorq6bpo.cloudworkstations.dev'],
  webpack: (config, { isServer }) => {
    // Fix for 'net', 'tls', 'fs' modules not found in client-side bundle due to mysql2
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}), // Spread existing fallbacks if any
        net: false,
        tls: false,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
