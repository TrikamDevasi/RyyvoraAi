# Ryyvora AI — Production Code Cleanup Plan

**Document Path:** `docs/audits/CODE_CLEANUP_PLAN.md`  
**Status:** Approved for Execution  
**Strategy:** Zero Feature Regression, Zero Security Weakening, Preserved SIH Workflows

---

## 1. Risk Classification Matrix

- **SAFE**: Zero external or internal consumers; deleting or refactoring has zero functional impact.
- **LOW RISK**: Self-contained component or dependency cleanup; verified with automated test suites.
- **MEDIUM RISK**: Shared utility or schema deduplication requiring client/server contract verification.
- **HIGH RISK**: Architectural refactoring touching authentication, authorization, or database schemas. *(Will NOT be removed automatically).*

---

## 2. Comprehensive Inventory of Target Changes

| # | FILE | PROBLEM | CURRENT LOC | ESTIMATED REMOVABLE LOC | WHY IT IS UNUSED/REDUNDANT | DEPENDENCIES | RISK | ACTION |
| :-: | :--- | :--- | :---: | :---: | :--- | :--- | :---: | :---: |
| 1 | `backend/.env` | Commented-out MongoDB Atlas URI with raw user credentials on line 5 | 53 | 1 | Obsolete dead configuration with exposed credentials | None | **SAFE** | **REFACTOR** |
| 2 | `backend/src/utils/hash.utils.ts` | Dead utility functions (`hashPassword`, `comparePassword`) | 12 | 12 | `User.model.ts` handles bcrypt directly; zero callers | bcryptjs | **SAFE** | **REMOVE** |
| 3 | `frontend/components/RyyvoraLoader.tsx` | Abandoned loader component | 744 | 744 | App uses `SplashScreen.tsx` / `RyyvoraIntro.tsx`; zero callers | framer-motion | **SAFE** | **REMOVE** |
| 4 | `frontend/components/dashboard/AssessmentModule.tsx` | Dead assessment quiz module | 342 | 342 | `student/assessment/page.tsx` implements assessment inline | canvas-confetti | **SAFE** | **REMOVE** |
| 5 | `frontend/components/shared/QuickTipsSegment.tsx` | Dead tips panel | 338 | 338 | Never imported by any page or layout | lucide-react | **SAFE** | **REMOVE** |
| 6 | `frontend/scripts/generate-brand-assets.py` | One-time Python asset generator | 326 | 326 | Brand vector assets and favicons are already generated in `public/` | PIL, Python | **LOW RISK** | **ARCHIVE** |
| 7 | `frontend/components/dashboard/ReportGenerator.tsx` | Dead reporting module | 278 | 278 | Reports rendered via dedicated table pages; zero callers | lucide-react | **SAFE** | **REMOVE** |
| 8 | `frontend/components/IndustryModal.tsx` | Dead modal dialog | 230 | 230 | Replaced by direct routing in industry cockpit | framer-motion | **SAFE** | **REMOVE** |
| 9 | `frontend/components/ui/card.tsx` | Dead shadcn card wrapper | 209 | 209 | App styles cards using vanilla CSS classes (`card`, `glass-card`) | None | **SAFE** | **REMOVE** |
| 10 | `frontend/components/dashboard/InterventionFeed.tsx` | Dead government feed | 189 | 189 | `government/page.tsx` renders policy interventions inline | lucide-react | **SAFE** | **REMOVE** |
| 11 | `frontend/components/IndustryPlans.tsx` | Dead pricing component | 189 | 189 | Billing handled by `PricingSection.tsx` and `settings/billing` | lucide-react | **SAFE** | **REMOVE** |
| 12 | `frontend/components/charts/RegionHeatmap.tsx` | Dead SVG chart | 189 | 189 | `government/heatmap/page.tsx` renders full interactive SVG inline | None | **SAFE** | **REMOVE** |
| 13 | `frontend/components/charts/CohortHeatmap.tsx` | Dead chart module | 154 | 154 | `institute/students/page.tsx` renders student cohort tables directly | None | **SAFE** | **REMOVE** |
| 14 | `frontend/components/charts/SkillGapRadar.tsx` | Dead radar chart | 143 | 143 | `analyzer/page.tsx` renders Recharts Radar directly | recharts | **SAFE** | **REMOVE** |
| 15 | `frontend/components/charts/SkillForecastArea.tsx` | Dead area chart | 137 | 137 | `industry/demand/page.tsx` renders Recharts AreaChart directly | recharts | **SAFE** | **REMOVE** |
| 16 | `frontend/components/charts/IndustryDemandBar.tsx` | Dead bar chart | 134 | 134 | `industry/demand/page.tsx` renders Recharts BarChart directly | recharts | **SAFE** | **REMOVE** |
| 17 | `frontend/components/ui/StatusRow.tsx` | Dead row component | 130 | 130 | Never imported anywhere in application | lucide-react | **SAFE** | **REMOVE** |
| 18 | `frontend/components/SignInOverlay.tsx` | Dead auth modal | 129 | 129 | App uses dedicated zero-scroll `/auth` page | lucide-react | **SAFE** | **REMOVE** |
| 19 | `frontend/components/charts/FairnessDistribution.tsx` | Dead chart | 128 | 128 | `admin/fairness/page.tsx` renders fairness bar charts directly | recharts | **SAFE** | **REMOVE** |
| 20 | `frontend/components/dashboard/ComplianceReport.tsx` | Dead report component | 124 | 124 | Never referenced in application | lucide-react | **SAFE** | **REMOVE** |
| 21 | `frontend/components/charts/ProgramROIBar.tsx` | Dead ROI bar chart | 122 | 122 | ROI calculations displayed via KPI cards in `institute/page.tsx` | recharts | **SAFE** | **REMOVE** |
| 22 | `frontend/components/ui/StaggerEntrance.tsx` | Dead animation wrapper | 81 | 81 | App uses framer-motion directly in components | framer-motion | **SAFE** | **REMOVE** |
| 23 | `frontend/components/dashboard/AuditLogViewer.tsx` | Dead viewer table | 74 | 74 | `admin/audit-logs/page.tsx` renders audit log table inline | lucide-react | **SAFE** | **REMOVE** |
| 24 | `frontend/components/ui/FlipCard.tsx` | Dead flipcard component | 60 | 60 | Never imported anywhere | framer-motion | **SAFE** | **REMOVE** |
| 25 | `frontend/components/ui/LiveBadge.tsx` | Dead badge component | 38 | 38 | App uses `AIBadge.tsx` and inline status badge classes | None | **SAFE** | **REMOVE** |
| 26 | `frontend/components/shared/index.ts` | Dead 5-line barrel file | 5 | 5 | Exports obsolete components; never imported | None | **SAFE** | **REMOVE** |
| 27–67 | 41 Zero-Byte Ghost Files (`frontend/components/**`) | 41 empty files | 0 | 0 | Abandoned scaffolding with 0 bytes | None | **SAFE** | **REMOVE** |
| 68 | `frontend/public/images/reference/cosmic-portal-sphere.png` | Unreferenced PNG asset | — | (671.7 KB) | Zero code references | None | **SAFE** | **REMOVE** |
| 69 | `frontend/public/images/reference/enterprise-hero-backdrop.jpg` | Unreferenced JPG asset | — | (474.9 KB) | Zero code references | None | **SAFE** | **REMOVE** |
| 70 | `frontend/package.json` | 5 unused dependencies + 1 misplaced type | 40 | ~10 | `@tanstack/react-query`, `clsx`, `tailwind-merge`, `next-pwa`, `react-canvas-confetti` unused | npm | **LOW RISK** | **REFACTOR** |
| 71 | `backend/package.json` | 1 unused dependency + 1 misplaced type | 69 | ~5 | `resend` unused (`nodemailer` used instead); `@types/uuid` in prod | npm | **LOW RISK** | **REFACTOR** |
| 72 | `frontend/app/(dashboard)/student/analyzer/page.tsx` | Legacy localStorage key writes | 1,071 | ~4 | Writes to `skillsense_analyzer_last_result` | localStorage | **SAFE** | **REFACTOR** |
| 73 | `frontend/app/(dashboard)/student/assessment/page.tsx` | Legacy localStorage key writes | 786 | ~4 | Uses `skillsense_assessments` in localStorage | localStorage | **SAFE** | **REFACTOR** |
| 74 | `frontend/lib/branches.ts` | Legacy localStorage key writes | 1,771 | ~4 | Uses `skillsense_active_branch` in localStorage | localStorage | **SAFE** | **REFACTOR** |
| 75 | `CONTRIBUTING.md` & `README.md` | Legacy GitHub clone URLs and names | ~450 | ~10 | References `SkillSenseAi.git` instead of `RyyvoraAi.git` | git docs | **SAFE** | **REFACTOR** |
| 76 | `docs/api/API_CONTRACTS.md` & `docs/design/IMAGE_SOURCES.md` | Legacy title headers | ~400 | ~4 | Documents titled SkillSense AI instead of Ryyvora AI | docs | **SAFE** | **REFACTOR** |

---

## 3. Execution Sequence & Gate Checks

1. **Step 1: P0 Critical Cleanup**
   - Clean credentials in `backend/.env`.
   - Update client localStorage keys to `ryyvora_*` with fallback.
2. **Step 2: P1 Dead Files & Ghost Scaffolding Removal**
   - Delete 41 zero-byte files.
   - Delete 22 unimported dead component files.
   - Delete 1 dead backend utility (`hash.utils.ts`).
   - Archive one-time Python brand generator script.
   - Delete 2 unreferenced assets (1.15 MB).
3. **Step 3: P1 Dependency Cleanup**
   - Clean `frontend/package.json` and `backend/package.json`.
   - Run `npm install`.
4. **Step 4: SkillSense Brand Documentation Standardization**
   - Update `CONTRIBUTING.md`, `README.md`, `API_CONTRACTS.md`, `IMAGE_SOURCES.md`.
5. **Step 5: Verification & Regression Testing**
   - Run `npm run test:backend` (11 suites).
   - Run `npm run test:frontend` (23 suites).
   - Run `npm run build:frontend` (Next.js 16 build).
   - Run `npm run build:backend` (`tsc` compile).
6. **Step 6: Measure Before vs After & Produce Final Report**
   - Calculate exact metrics and create `docs/audits/CODE_CLEANUP_FINAL_REPORT.md`.
