import type { NextConfig } from 'next';

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
                hostname: 'placehold.co',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                port: '',
                pathname: '/**',
            },
        ],
    },
    // This is the correct location for allowedDevOrigins in Next.js 15.4.7
    allowedDevOrigins: [
        'https://9000-firebase-protrack-1758210492947.cluster-l6vkdperq5ebaqo3qy4ksvoqom.cloudworkstations.dev',
    ],
};

export default nextConfig;
