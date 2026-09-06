// frontend/app/robots.ts
import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/how-it-works',
          '/for-government',
          '/for-employers',
          '/for-training-providers',
          '/for-trainees',
          '/workforce-analytics',
          '/employer-verification',
          '/skill-passport',
          '/policy-intelligence',
          '/dpdp-trust',
          '/pricing',
          '/faq',
          '/contact',
          '/auth',
        ],
        disallow: [
          '/admin/',
          '/student/',
          '/employer/',
          '/government/',
          '/industry/',
          '/institute/',
          '/profile/',
          '/settings/',
          '/ai-health',
          '/exam',
          '/api/',
          '/*?*',
        ],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
