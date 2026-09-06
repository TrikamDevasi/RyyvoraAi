// frontend/lib/seo.ts
import type { Metadata } from 'next';

export const SITE_CONFIG = {
  name: 'Ryyvora AI',
  legalName: 'Ryyvora AI Technologies',
  title: 'Ryyvora AI | Workforce Outcome Intelligence',
  description:
    'Ryyvora AI is the sovereign workforce outcome intelligence platform connecting skills training, employer verification, retention analytics, and wage progression.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://ryyvora.com').replace(/\/$/, ''),
  ogImage: '/brand/ryyvora-og.png',
  tagline: 'From Skills to Sustainable Outcomes.',
  descriptor: 'Workforce Outcome Intelligence',
  locale: 'en_IN',
  social: {
    twitter: '@ryyvora_ai',
  },
};

/**
 * Returns a normalized, absolute canonical URL for any given path.
 */
export function getCanonicalUrl(path: string = ''): string {
  const base = SITE_CONFIG.url;
  if (!path || path === '/') return base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Strip trailing slashes and query strings for canonical integrity
  const withoutQuery = cleanPath.split('?')[0];
  const normalized = withoutQuery.endsWith('/') && withoutQuery.length > 1
    ? withoutQuery.slice(0, -1)
    : withoutQuery;
  return `${base}${normalized}`;
}

export interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noindex?: boolean;
  ogType?: 'website' | 'article';
  image?: string;
}

/**
 * Factory for creating consistent, high-standard Next.js metadata objects.
 */
export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noindex = false,
  ogType = 'website',
  image,
}: PageMetadataInput): Metadata {
  const canonicalUrl = getCanonicalUrl(path);
  const ogImageUrl = image || `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`;

  // Sanitize title to guarantee exactly one '| Ryyvora AI' brand suffix
  const cleanTitle = title
    .replace(/\s*\|\s*Ryyvora\s*AI.*$/i, '')
    .trim();
  const fullTitle = `${cleanTitle} | ${SITE_CONFIG.name}`;

  const defaultKeywords = [
    'Ryyvora AI',
    'Workforce Outcome Intelligence',
    'Employment Outcomes',
    'Skill Verification',
    'Verifiable Skill Passport',
    'NSQF Alignment',
    'DPDP Act 2023 Compliance',
    'Retention Analytics',
    'Labor Market Intelligence',
  ];

  const mergedKeywords = Array.from(new Set([...defaultKeywords, ...keywords]));

  return {
    title: {
      absolute: fullTitle,
    },
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noindex
      ? {
          index: false,
          follow: true,
          nocache: true,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      type: ogType,
      locale: SITE_CONFIG.locale,
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${cleanTitle} — ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImageUrl],
    },
  };
}
