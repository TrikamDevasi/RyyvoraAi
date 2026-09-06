// frontend/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getCanonicalUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const publicRoutes: {
    path: string;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
  }[] = [
    { path: '/', changeFrequency: 'daily', priority: 1.0 },
    { path: '/for-government', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/for-employers', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/for-training-providers', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/for-trainees', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/workforce-analytics', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/employer-verification', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/skill-passport', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/policy-intelligence', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/how-it-works', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/pricing', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/dpdp-trust', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/faq', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  ];

  return publicRoutes.map((route) => ({
    url: getCanonicalUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
