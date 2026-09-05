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
        // Pin Turbopack to the frontend dir so it does not walk up and pick up
        // skillsense-ai/package-lock.json (multiple-lockfile warning + wrong workspace root).
        root: path.resolve(__dirname),
    },
    devIndicators: false,
};

export default nextConfig;
