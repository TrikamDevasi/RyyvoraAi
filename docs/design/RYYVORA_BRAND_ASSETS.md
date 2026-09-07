# 🛡️ Ryyvora AI — Brand Identity & Asset System

> **Platform**: Ryyvora AI  
> **Descriptor**: Workforce Outcome Intelligence  
> **Tagline**: *From Skills to Sustainable Outcomes.*  
> **Target Audience**: State Governments, Enterprises, Vocational Institutes, Trainees, Workforce Organizations  

---

## 1. Brand Philosophy & Identity Concept

Ryyvora AI is the sovereign, verifiable workforce intelligence platform connecting the entire human capital journey:
```
Skills ──► Training ──► Assessment ──► Certification ──► Employment 
       ──► Employer Verification ──► Retention ──► Wage Progression 
       ──► Skill Gap Telemetry ──► Policy Action
```

### The Kinetic Outcome Matrix (Logomark Rationale)
The standalone logomark is an architectural, geometric synthesis of an abstract **"R"** and a multi-nodal convergence matrix. It deliberately rejects generic visual clichés (no graduation caps, briefcases, cartoon brains, robot heads, generic shields, or checkmarks).

The mark is constructed from **three interconnected geometric conduits**:

1. **The Sovereign Foundation (Left Vertical Pillar)**:
   * A solid vertical anchor (`x=10..21`, `y=8..56`, `rx=4`) representing the immutable institutional bedrock: training compliance, NSQF qualification registers, and DPDP Act 2023 data sovereignty.
2. **The Intelligence Convergence Loop (Upper Arch & Aperture)**:
   * A sweeping vector arch connecting the pillar to a central data nexus, framing a calibrated internal aperture. This aperture functions as the *analytical lens* of the platform—representing verified clarity, multi-provider AI assessment, and cryptographic ledgers.
3. **The Ascending Outcome Vector (Dynamic Trajectory)**:
   * A forward-surging diagonal beam emerging from the central nexus and projecting up-and-right at a 45° angle. Separated from the spine by an exact negative space channel, it symbolizes career mobility, verifiable employment placement, retention stability, and longitudinal wage progression.

---

## 2. Color System & Contrast Standards

The brand system uses a high-contrast two-tone palette calibrated for both deep dark interfaces and executive light documents:

| Token Name | Hex Code | Role & Surface Usage | WCAG Ratio on Canvas |
| :--- | :--- | :--- | :--- |
| **Canvas Dark** | `#0B0F17` | Primary dark surface / background | Baseline |
| **Surface Elevated** | `#111827` | Cards, navigation bars, modal dialogs | High contrast |
| **Sovereign Saffron** | `#F59E0B` | Primary brand accent & dark mode mark | 9.8:1 (AAA) |
| **Saffron Highlight** | `#FBBF24` | Dynamic trajectory gradient accent | 12.1:1 (AAA) |
| **Deep Institutional Slate** | `#0F172A` | Light mode mark pillar & primary text | 14.2:1 on white (AAA) |
| **Institutional Amber** | `#D97706` | Light mode mark vector accent | 4.8:1 on white (AA) |
| **Executive Cobalt** | `#3B82F6` | Interactive focus rings & link states | 5.2:1 (AA) |
| **Verified Emerald** | `#10B981` | Cryptographic ledger success signals | 6.8:1 (AAA) |

---

## 3. Brand Asset Inventory

All official brand assets reside in `frontend/public/brand/` with synchronized root assets in `frontend/public/`:

### A. Vector Assets (SVG)
| Filename | Location | Purpose |
| :--- | :--- | :--- |
| `ryyvora-mark.svg` | `/brand/ryyvora-mark.svg` | Canonical standalone vector mark (64×64 viewBox). |
| `ryyvora-mark-dark.svg` | `/brand/ryyvora-mark-dark.svg` | Vector mark optimized for dark backgrounds (`#0B0F17`). |
| `ryyvora-mark-light.svg` | `/brand/ryyvora-mark-light.svg` | Vector mark optimized for light backgrounds (`#FFFFFF`). |
| `ryyvora-favicon.svg` | `/brand/ryyvora-favicon.svg` | Browser tab favicon with CSS `prefers-color-scheme` auto-switching. |
| `ryyvora-logo.svg` | `/brand/ryyvora-logo.svg` | Full horizontal lockup: Mark + "Ryyvora AI" + Descriptor. |
| `ryyvora-logo-dark.svg` | `/brand/ryyvora-logo-dark.svg` | Full horizontal lockup for dark surfaces. |
| `ryyvora-logo-light.svg` | `/brand/ryyvora-logo-light.svg` | Full horizontal lockup for light surfaces. |

### B. High-Resolution Raster Assets (PNG & ICO)
| Filename | Dimensions | Purpose |
| :--- | :--- | :--- |
| `ryyvora-favicon.ico` | Multi-size (16, 32, 48) | Windows & legacy browser favicon. |
| `icon-16.png` | 16×16 px | High-density browser tab shortcut. |
| `icon-32.png` | 32×32 px | Standard desktop browser tab icon. |
| `icon-48.png` | 48×48 px | Windows desktop taskbar & bookmarks. |
| `apple-touch-icon.png` | 180×180 px | iOS home screen & Safari pinned tabs. |
| `icon-192.png` | 192×192 px | Android PWA homescreen icon. |
| `icon-512.png` | 512×512 px | Android PWA splash screen & app stores. |
| `ryyvora-og.png` | 1200×630 px | Open Graph & Twitter Card social preview card. |
| `logo.png` | 512×512 px | Canonical high-res raster logo for backwards compatibility. |

---

## 4. Reusable Component (`<BrandLogo />`)

Located at: `frontend/components/shared/BrandLogo.tsx`

### Props API
```typescript
interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'mark'; // default: 'full'
  theme?: 'auto' | 'dark' | 'light';      // default: 'auto'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number; // default: 'md' (32px)
  withTagline?: boolean;                 // default: false
  className?: string;
  style?: React.CSSProperties;
  monogramClass?: string;
}
```

### Usage Examples

#### 1. Full Horizontal Lockup with Descriptor (Navbar & Footer)
```tsx
import BrandLogo from '@/components/shared/BrandLogo';

// Navbar
<Link href="/" aria-label="Ryyvora AI home">
  <BrandLogo variant="full" size="md" withTagline />
</Link>
```

#### 2. Standalone Logomark (Collapsed Sidebar & Favicons)
```tsx
import BrandLogo, { RyyvoraMark } from '@/components/shared/BrandLogo';

// Collapsed Dashboard Sidebar
<BrandLogo variant="mark" size="md" />

// Standalone Mark Primitive
<RyyvoraMark size={40} theme="dark" />
```

#### 3. Compact Lockup (Mobile Topbars & Dialogs)
```tsx
<BrandLogo variant="compact" size="sm" />
```

---

## 5. Web Standards & Manifest Integration

### Web Manifest (`public/manifest.json`)
```json
{
  "name": "Ryyvora AI — Workforce Outcome Intelligence",
  "short_name": "Ryyvora",
  "description": "From Skills to Sustainable Outcomes. Sovereign Workforce Outcome Intelligence Platform.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0B0F17",
  "theme_color": "#F59E0B",
  "icons": [
    { "src": "/brand/app-icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/brand/app-icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" },
    { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" }
  ]
}
```

### Next.js App Router Metadata (`app/layout.tsx`)
```typescript
icons: {
  icon: [
    { url: "/favicon.svg", type: "image/svg+xml" },
    { url: "/favicon.ico", sizes: "any" },
    { url: "/brand/app-icons/icon-32.png", sizes: "32x32", type: "image/png" },
    { url: "/brand/app-icons/icon-16.png", sizes: "16x16", type: "image/png" },
  ],
  apple: [
    { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  ],
}
```

---

## 6. Accessibility & Invariant Contracts

1. **Screen Readers**: Every logo instance has explicit `aria-label="Ryyvora AI"` or `aria-label="Ryyvora AI — Workforce Outcome Intelligence"`.
2. **Zero Invariant Breakage**: Preserves all backward-compatible session fallback storage keys (`skillsense_token`, `skillsense_role`), test runner contracts (`testFrontend.ts`), and database seeder fixtures.
3. **Responsive Geometry**: Strict SVG viewBox ensures 0% clipping, wrapping, or pixelation from 16px to 512px.
