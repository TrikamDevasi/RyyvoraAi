# 🏛️ Ryyvora AI — Repository Architecture & Engineering Blueprint

> **Product**: Ryyvora AI  
> **Tagline**: Workforce Outcome Intelligence  
> **Repository Model**: Unified Monorepo (Next.js 16 App Router + Express 5 Backend + Multi-Provider AI)  
> **Compliance Alignment**: Smart India Hackathon 2026 · Problem Statement SIH26135 · NCVET & DPDP Act 2023  

---

## 1. Directory Structure & Responsibilities

The Ryyvora AI monorepo maintains strict separation of concerns, eliminating circular dependencies and isolating production code from test fixtures and reference designs:

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml                       # CI/CD pipeline deploying frontend to Vercel
├── frontend/                                # Next.js 16 Turbopack Web Application
│   ├── app/                                 # Next.js App Router (Routes & Layouts only)
│   ├── components/                          # Shared UI, visualizers, charts, and layout
│   ├── config/                              # Global navigation and route metadata
│   ├── data/                                # Legitimate demo seed data
│   ├── hooks/                               # Reusable React state & hydration hooks
│   ├── lib/                                 # API clients, auth helpers, and theme tokens
│   ├── public/                              # Static public assets (brand, high-res photography)
│   ├── scripts/                             # Automated test & SEO validation runners
│   ├── store/                               # Zustand global client stores
│   ├── types/                               # Frontend TypeScript types & interfaces
│   ├── utils/                               # Pure client utilities (PDF export, formatters)
│   ├── next.config.ts                       # Next.js configuration & compiler rules
│   ├── package.json                         # ryyvora-ai-frontend
│   └── tsconfig.json                        # Path alias (@/* -> ./*)
│
├── backend/                                 # Express.js 5 REST API & Outcome Engine
│   ├── src/
│   │   ├── config/                          # Environment, MongoDB, Redis, and logger configs
│   │   ├── controllers/                     # Thin HTTP request handlers
│   │   ├── data/                            # System constants & district maps
│   │   ├── middleware/                      # Auth, RBAC, Rate-limit, Error, and CORS middleware
│   │   ├── models/                          # Mongoose schemas (User, Student, Institution, Outcome)
│   │   ├── routes/                          # REST API v1 route declarations
│   │   ├── scripts/                         # Seed scripts (seedDemo, seedLongitudinalOutcomes)
│   │   ├── services/                        # Business logic, HMAC engine, and AI Provider Mesh
│   │   │   └── providers/                   # Groq LPU, Gemini, OpenAI, and Perplexity adapters
│   │   ├── types/                           # Backend TypeScript definitions
│   │   ├── utils/                           # Crypto, Phone, Logging, and JWT utilities
│   │   ├── app.ts                           # Express application assembly & security headers
│   │   └── index.ts                         # Server entrypoint
│   ├── tests/                               # 13 Automated test suites (11/11 tests pass)
│   ├── package.json                         # ryyvora-ai-backend
│   ├── Procfile                             # Container/Heroku process configuration
│   ├── railway.toml                         # Railway configuration
│   └── tsconfig.json                        # Backend TypeScript configuration
│
├── docs/                                    # Central Documentation Hub
│   ├── architecture/                        # Architectural blueprints & diagrams
│   ├── api/                                 # REST API specifications (API_CONTRACTS.md)
│   ├── product/                             # Demo guide & SIH requirement matrix
│   ├── design/                              # Image inventory & design specifications
│   ├── audits/                              # 20 Historical & remediation audit reports
│   ├── references/                          # Isolated Framer design reference materials
│   └── README.md                            # Master documentation index
│
├── scripts/                                 # Monorepo maintenance & verification
│   └── verify-all.js                        # Master cross-stack test runner
├── .gitignore                               # Root ignore rules for Git hygiene
├── package.json                             # Monorepo orchestration scripts
├── CONTRIBUTING.md                          # Contribution and branching workflows
└── README.md                                # Platform overview & Quickstart guide
```

---

## 2. Frontend Architecture (Next.js 16 Turbopack)

### 2.1 Route Organization (`frontend/app/`)
- **Route Handlers**: Standardized App Router convention. No business logic in pages.
- **Protected Cockpits (`frontend/app/(dashboard)/`)**:
  - `/government`: Statewide telemetry, Maharashtra 36-district heatmap, fiscal grant simulator, news.
  - `/student`: Longitudinal career journey, AI skill analyzer, diagnostic assessment, digital passport.
  - `/employer`: HMAC candidate validation queue, placement records, recruiter feedback.
  - `/institute`: NCVET rubric grading modal, student roster, dynamic ROI calculation.
  - `/industry`: Sector Skill Council deficit radar, talent sourcing pool, wage horizons.
  - `/admin`: System audit ledger, IEEE 7000 algorithmic fairness, multi-tenancy controls.
- **15 Public Indexable SEO Routes**:
  - `/`, `/about`, `/how-it-works`, `/for-government`, `/for-employers`, `/for-training-providers`, `/for-trainees`, `/workforce-analytics`, `/employer-verification`, `/skill-passport`, `/policy-intelligence`, `/dpdp-trust`, `/pricing`, `/faq`, `/contact`.
  - All public routes include structured JSON-LD schemas (`BreadcrumbList`, `FAQPage`, `GovernmentService`, `TechArticle`, `SoftwareApplication`).

### 2.2 Component Hierarchy (`frontend/components/`)
- **`ui/`**: Atomic, design-system tokens and components (`Button`, `Card`, `Badge`, `AIBadge`, `ConfidenceScore`, `DataTable`, `FlipCard`, `SectionHeader`, etc.).
- **`charts/`**: Recharts visualizers (`DistrictOutcomeHeatmap`, `RetentionSankeyFunnel`, `WageProgressionCurve`).
- **`landing/`**: High-performance cosmic landing modules migrated from Framer.
- **`layout/`**: `Navbar`, `Footer`, `Sidebar`, and mobile-optimized `MobileBottomNav` (4 unique destinations contract).
- **`public/`**: Reusable public page header and footer wrappers.
- **`seo/`**: `BreadcrumbNav` and `JsonLd` schema generators.
- **`shared/`**: `GlassCard`, `AnimatedCounter`, `GoldBadge`, `ThemeToggle`.
- **`three/`**: WebGL Canvas visualizers (`AIOrb`, `ParticleField`, `SkillGlobe`).

### 2.3 State Management & Auth Flow
- **Zustand Stores (`frontend/store/`)**:
  - `authStore.ts`: Authentication lifecycle, active persona, token hydration. Dual-token compatible (`ryyvora_token` + `skillsense_token`).
  - `navigationStore.ts`: Persistent sidebar preferences, active mobile view.
  - `themeStore.ts`: Dark/Light theme toggle with CSS variable synchronization.
- **Edge Middleware (`frontend/proxy.ts`)**:
  - Server-side route gating protecting all `(dashboard)` paths.
  - Decodes authoritative JWT claims to prevent stale cookie role desynchronization.

---

## 3. Backend Architecture (Express.js 5 + TypeScript)

### 3.1 Layer Responsibilities (`backend/src/`)
- **Controllers (`controllers/`)**: Thin HTTP coordinators. Parse request schemas, invoke services, return standardized envelopes (`{ success, data, message }`).
- **Services (`services/`)**: Encapsulate all business logic, database mutations, and cryptographic hashing.
- **Models (`models/`)**: Mongoose schemas enforcing strict indexes, enum validation, and type safety.
- **Routes (`routes/`)**: Explicit endpoint registrations bound with rate limiters and auth middleware.
- **Middleware (`middleware/`)**:
  - `protect`: Validates JWT token from `Authorization: Bearer` or cookie (`ryyvora_token` / `skillsense_token`).
  - `requireRole`: Enforces role-based access control (RBAC).
  - `rateLimiter`: Protects AI and authentication endpoints via Redis or in-memory token buckets.

### 3.2 AI Provider Orchestration (`backend/src/services/providers/`)
All generative and analytical AI routes resolve through a resilient multi-provider manager:
1. **Primary**: **Groq LPU** (`llama-3.3-70b-versatile`) — ultra-low latency (~350ms).
2. **Failover 1**: **Google Gemini** (`gemini-2.5-flash`).
3. **Failover 2**: **OpenAI** (`gpt-4o-mini`).
4. **Failover 3**: **Perplexity** (`sonar-pro`).
5. **Guardrails**:
   - Strict Zod schema parsing and automated repair of trailing commas/markdown fences.
   - Grounded policy briefs in Phase 8 structured format.
   - Phase 9 DPDP Statistical Threshold ($N < 5$) preventing small-cohort re-identification.

---

## 4. Asset Structure & Naming Conventions

### 4.1 Asset Directories (`frontend/public/`)
```
frontend/public/
├── brand/                           # Official platform branding
│   ├── ryyvora-logo.png             # Primary vector/raster logo
│   └── ryyvora-logo-theme.png       # Dark theme suited logo
├── images/                          # High-resolution production imagery
│   ├── auth/                        # Mobile & desktop authentication visual
│   ├── brand/                       # Guilloche security patterns & state seal
│   ├── credentials/                 # Skill passport & DPDP security graphics
│   ├── employers/                   # Industrial & enterprise photography
│   ├── empty-states/                # Clean SVG empty states (no-candidates, etc.)
│   ├── government/                  # Directorate & policy analytics imagery
│   ├── landing/                     # Cosmic hero photography & telemetry maps
│   ├── reference/                   # Telemetry preview banners & mobile mockups
│   ├── stakeholders/                # 6-Role persona portraiture
│   ├── students/                    # Trainee vocational journey photography
│   ├── training/                    # Lab assessments & NCVET diagnostic photos
│   └── workforce/                   # Career pathway & wage progression graphics
├── logo.png                         # PWA icon & manifest reference (192x192, 512x512)
├── manifest.json                    # Progressive Web App manifest
└── robots.txt                       # Search engine crawler directive
```

### 4.2 Reference Materials Isolation (`docs/references/`)
Design inspiration and Framer landing export assets are stored strictly in `docs/references/framer-landing/`:
- `fonts.gstatic.com`
- `framerusercontent.com`
- `zainarts.framer.website`
> **Rule**: Production code must NEVER import from `docs/references/`.

---

## 5. Deployment Architecture

### 5.1 Frontend Deployment (Vercel)
- **Platform**: Vercel
- **Workflow**: Automated GitHub Actions (`.github/workflows/deploy.yml`) on push to `main`.
- **Root Directory**: `frontend`
- **Build Command**: `next build`
- **Output Directory**: `.next`

### 5.2 Backend Deployment (Render / Railway / Container)
- **Platform**: Render / Railway
- **Build Command**: `npm install && npm run build` (in `backend/`)
- **Start Command**: `node dist/index.js`
- **Process File**: `backend/Procfile` (`web: npm start`)
- **Port**: `5000` (configurable via `process.env.PORT`)

---

## 6. Engineering Naming Conventions

- **React Components**: PascalCase (e.g., `RyyvoraIntro.tsx`, `DashboardShell.tsx`, `ConfidenceScore.tsx`).
- **Utility Functions & Hooks**: camelCase (e.g., `useAuth.ts`, `downloadPDF.ts`, `verifySeo.ts`).
- **Route Folders**: lowercase-kebab-case (e.g., `for-government/`, `skill-passport/`, `employer-verification/`).
- **API Endpoints**: RESTful kebab-case (e.g., `/api/v1/ai/policy-copilot`, `/api/v1/verification/public/:hash`).
- **Brand Tokens**: `ryyvora` for all public-facing assets, cookies, and storage keys, with backwards-compatible read fallbacks.
