import fs from 'fs';
import path from 'path';

const APP_DIR = path.resolve(process.cwd(), '.next/server/app');

interface AuditResult {
  route: string;
  file: string;
  title: string | null;
  description: string | null;
  canonical: string | null;
  h1Count: number;
  h1Texts: string[];
  robots: string | null;
  jsonLdCount: number;
  errors: string[];
}

const PUBLIC_PAGES = [
  { route: '/', file: 'index.html', canonical: 'https://ryyvora.com' },
  { route: '/about', file: 'about.html', canonical: 'https://ryyvora.com/about' },
  { route: '/how-it-works', file: 'how-it-works.html', canonical: 'https://ryyvora.com/how-it-works' },
  { route: '/for-government', file: 'for-government.html', canonical: 'https://ryyvora.com/for-government' },
  { route: '/for-employers', file: 'for-employers.html', canonical: 'https://ryyvora.com/for-employers' },
  { route: '/for-training-providers', file: 'for-training-providers.html', canonical: 'https://ryyvora.com/for-training-providers' },
  { route: '/for-trainees', file: 'for-trainees.html', canonical: 'https://ryyvora.com/for-trainees' },
  { route: '/workforce-analytics', file: 'workforce-analytics.html', canonical: 'https://ryyvora.com/workforce-analytics' },
  { route: '/employer-verification', file: 'employer-verification.html', canonical: 'https://ryyvora.com/employer-verification' },
  { route: '/skill-passport', file: 'skill-passport.html', canonical: 'https://ryyvora.com/skill-passport' },
  { route: '/policy-intelligence', file: 'policy-intelligence.html', canonical: 'https://ryyvora.com/policy-intelligence' },
  { route: '/dpdp-trust', file: 'dpdp-trust.html', canonical: 'https://ryyvora.com/dpdp-trust' },
  { route: '/pricing', file: 'pricing.html', canonical: 'https://ryyvora.com/pricing' },
  { route: '/faq', file: 'faq.html', canonical: 'https://ryyvora.com/faq' },
  { route: '/contact', file: 'contact.html', canonical: 'https://ryyvora.com/contact' },
];

const PRIVATE_PAGES = [
  { route: '/auth', file: 'auth.html', expectedRobots: 'noindex, follow', expectedCanonical: 'https://ryyvora.com/auth' },
  { route: '/admin', file: 'admin.html', expectedRobots: 'noindex, nofollow', expectedCanonical: null },
  { route: '/student', file: 'student.html', expectedRobots: 'noindex, nofollow', expectedCanonical: null },
  { route: '/institute', file: 'institute.html', expectedRobots: 'noindex, nofollow', expectedCanonical: null },
  { route: '/government', file: 'government.html', expectedRobots: 'noindex, nofollow', expectedCanonical: null },
  { route: '/employer', file: 'employer.html', expectedRobots: 'noindex, nofollow', expectedCanonical: null },
  { route: '/ai-health', file: 'ai-health.html', expectedRobots: 'noindex, nofollow', expectedCanonical: null },
  { route: '/exam', file: 'exam.html', expectedRobots: 'noindex, nofollow', expectedCanonical: null },
];

function extractMeta(html: string, name: string): string | null {
  const match = html.match(new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`, 'i'))
    || html.match(new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+name=["']${name}["']`, 'i'));
  return match ? match[1] : null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1] : null;
}

function extractCanonical(html: string): string | null {
  const match = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i)
    || html.match(/<link\s+href=["']([^"']*)["']\s+rel=["']canonical["']/i);
  return match ? match[1] : null;
}

function extractH1s(html: string): string[] {
  const matches: string[] = [];
  const regex = /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    // Strip inner HTML tags
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    matches.push(text);
  }
  return matches;
}

function extractJsonLd(html: string): any[] {
  const scripts: any[] = [];
  const regex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      scripts.push(JSON.parse(match[1]));
    } catch (e) {
      scripts.push({ parseError: true, raw: match[1] });
    }
  }
  return scripts;
}

console.log('====================================================');
console.log('RYYVORA AI POST-BUILD TECHNICAL SEO AUDIT');
console.log('====================================================\n');

let totalErrors = 0;
const seenTitles = new Map<string, string>();
const seenDescriptions = new Map<string, string>();

console.log('--- 1. AUDITING 15 PUBLIC INDEXABLE PAGES ---');
for (const page of PUBLIC_PAGES) {
  const filePath = path.join(APP_DIR, page.file);
  if (!fs.existsSync(filePath)) {
    console.error(`[FAIL] File missing: ${page.file}`);
    totalErrors++;
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  const title = extractTitle(html);
  const desc = extractMeta(html, 'description');
  const canonical = extractCanonical(html);
  const h1s = extractH1s(html);
  const jsonLd = extractJsonLd(html);
  const robots = extractMeta(html, 'robots');

  const errors: string[] = [];

  // Title check
  if (!title) {
    errors.push('Missing <title>');
  } else {
    if (!title.endsWith('Ryyvora AI')) {
      errors.push(`Title does not end with "Ryyvora AI": "${title}"`);
    }
    if (seenTitles.has(title)) {
      errors.push(`DUPLICATE Title! Also used on ${seenTitles.get(title)}: "${title}"`);
    } else {
      seenTitles.set(title, page.route);
    }
  }

  // Description check
  if (!desc) {
    errors.push('Missing meta description');
  } else {
    if (desc.length < 50 || desc.length > 200) {
      errors.push(`Description length suboptimal (${desc.length} chars): "${desc}"`);
    }
    if (seenDescriptions.has(desc)) {
      errors.push(`DUPLICATE Description! Also used on ${seenDescriptions.get(desc)}`);
    } else {
      seenDescriptions.set(desc, page.route);
    }
  }

  // Canonical check
  if (!canonical) {
    errors.push('Missing <link rel="canonical">');
  } else if (canonical !== page.canonical) {
    errors.push(`Canonical mismatch: expected "${page.canonical}", got "${canonical}"`);
  }

  // H1 check (Exactly 1 H1 per page)
  if (h1s.length === 0) {
    errors.push('Missing <h1> tag');
  } else if (h1s.length > 1) {
    errors.push(`Multiple <h1> tags detected (${h1s.length}): ${JSON.stringify(h1s)}`);
  }

  // Robots check (Should NOT be noindexed)
  if (robots && robots.includes('noindex')) {
    errors.push(`Public page has unexpected robots noindex: "${robots}"`);
  }

  // JSON-LD check
  if (jsonLd.length === 0) {
    errors.push('Missing structured data (JSON-LD)');
  } else {
    for (const item of jsonLd) {
      if (item.parseError) {
        errors.push(`Invalid JSON-LD syntax: ${item.raw.slice(0, 50)}...`);
      }
    }
  }

  if (errors.length === 0) {
    console.log(`[PASS] ${page.route.padEnd(26)} | H1: 1 ("${h1s[0]}") | Title: "${title}"`);
  } else {
    console.error(`[FAIL] ${page.route.padEnd(26)}:`);
    errors.forEach(err => console.error(`       - ${err}`));
    totalErrors += errors.length;
  }
}

console.log('\n--- 2. AUDITING PRIVATE / PROTECTED PAGES (NOINDEX CHECKS) ---');
for (const page of PRIVATE_PAGES) {
  const filePath = path.join(APP_DIR, page.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`[SKIP] File not generated statically: ${page.file}`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  const robots = extractMeta(html, 'robots');
  const canonical = extractCanonical(html);
  const errors: string[] = [];

  if (!robots) {
    errors.push(`Missing robots meta tag (expected "${page.expectedRobots}")`);
  } else if (page.expectedRobots && !robots.includes(page.expectedRobots.split(',')[0].trim())) {
    errors.push(`Robots mismatch: expected "${page.expectedRobots}", got "${robots}"`);
  }

  if (page.expectedCanonical) {
    if (canonical !== page.expectedCanonical) {
      errors.push(`Canonical mismatch: expected "${page.expectedCanonical}", got "${canonical}"`);
    }
  }

  if (errors.length === 0) {
    console.log(`[PASS] ${page.route.padEnd(20)} | Robots: "${robots}" | Canonical: ${canonical || 'None'}`);
  } else {
    console.error(`[FAIL] ${page.route.padEnd(20)}:`);
    errors.forEach(err => console.error(`       - ${err}`));
    totalErrors += errors.length;
  }
}

console.log('\n--- 3. AUDITING SITEMAP & ROBOTS.TXT ---');
const sitemapPath = path.join(APP_DIR, 'sitemap.xml.body');
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const urlCount = (sitemapContent.match(/<loc>/g) || []).length;
  console.log(`[INFO] sitemap.xml contains ${urlCount} URLs.`);
  if (urlCount === 15) {
    console.log(`[PASS] sitemap.xml contains exactly 15 public URLs.`);
  } else {
    console.warn(`[WARN] sitemap.xml URL count is ${urlCount} (expected 15).`);
  }
  // Check for private leaks
  if (sitemapContent.includes('/student') || sitemapContent.includes('/admin') || sitemapContent.includes('/auth')) {
    console.error(`[FAIL] sitemap.xml contains private routes!`);
    totalErrors++;
  } else {
    console.log(`[PASS] sitemap.xml is free from private route leaks.`);
  }
} else {
  console.warn(`[WARN] sitemap.xml.body not found at ${sitemapPath}`);
}

const robotsPath = path.join(APP_DIR, 'robots.txt.body');
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
  if (robotsContent.includes('Disallow: /admin/') && robotsContent.includes('Disallow: /student/') && robotsContent.includes('Sitemap: https://ryyvora.com/sitemap.xml')) {
    console.log(`[PASS] robots.txt disallows private dashboards and advertises sitemap.`);
  } else {
    console.error(`[FAIL] robots.txt missing required disallow rules.`);
    totalErrors++;
  }
}

console.log('\n====================================================');
if (totalErrors === 0) {
  console.log('>>> [SUCCESS] 100% OF TECHNICAL SEO AUDIT CHECKS PASSED! <<<');
  process.exit(0);
} else {
  console.error(`>>> [FAILURE] ${totalErrors} AUDIT ISSUE(S) DETECTED! <<<`);
  process.exit(1);
}
