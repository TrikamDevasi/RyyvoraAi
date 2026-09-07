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
        // package-lock.json (multiple-lockfile warning + wrong workspace root).
        root: path.resolve(__dirname),
    },
    devIndicators: false,
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
                ],
            },
        ];
    },
};

export default nextConfig;
