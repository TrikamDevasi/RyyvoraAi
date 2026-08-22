import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: false,
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
            { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
        ],
        unoptimized: true,
    },
    turbopack: {
        root: path.resolve(__dirname),
    },
};

export default nextConfig;
