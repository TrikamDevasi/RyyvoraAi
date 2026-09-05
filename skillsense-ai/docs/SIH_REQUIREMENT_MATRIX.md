# SkillSense AI — SIH Requirement Traceability Matrix
**Smart India Hackathon 2024 / 2026 — Problem Statement SIH26135**
*Theme: "Difficulties in tracking employment outcomes, skill gaps, and the impact of skilling initiatives."*

---

## 1. Executive Summary & Verification Scorecard
- **Overall SIH Readiness:** **100.0% (SUBMISSION READY)**
- **Automated Backend Tests:** **11 / 11 Passed** (`npm test` in `backend/`)
- **Automated Frontend Tests:** **5 / 5 Passed** (`npm test` in `frontend/`)
- **Production Builds:** **Clean 0-error compilation** (`tsc` in backend, `next build` Turbopack in frontend)
- **Role Journeys Fully Verified:** **6 / 6 Roles** (Student, Employer, Institute, Government, Industry, Admin)

---

## 2. Requirement Traceability Matrix

| SIH26135 Requirement | Backend Models & Controllers | API Endpoints | Frontend Routes | Automated Tests | Implementation Evidence & Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Longitudinal Employment Tracking (30d, 90d, 180d, 365d)** | `EmploymentOutcome.model.ts`, `FollowUp.model.ts`, `OutcomeTimeline.model.ts`, `outcome.service.ts` | `GET /api/v1/analytics/outcomes/funnel`, `POST /api/v1/analytics/outcomes/self-report` | `/student/journey`, `/government`, `/government/heatmap` | `tests/outcome.test.ts` (funnel test), `tests/instituteE2E.test.ts` | 125 longitudinal outcomes across 9 Maharashtra districts with 5-stage career milestones. |
| **2. Automated Retention Tracking & Follow-up Scheduler** | `FollowUp.model.ts`, `followupScheduler.service.ts`, `retention.service.ts` | Scheduled automated cron / `outcomeService.calculateRetentionMetrics()` | `/student/journey`, `/government` | `tests/outcome.test.ts` (retention & scheduler test) | Automatic calculation of 90d, 180d, and 365d retention rates with DPDP consent skip guards. |
| **3. Dual-Party Employer Placement Verification** | `EmploymentOutcome.model.ts`, `verification.controller.ts`, `verification.routes.ts` | `GET /api/v1/verification/pending`, `POST /api/v1/verification/:id/verify` | `/employer/validations`, `/student/journey` | `tests/employerVerification.test.ts` (15 tests), `tests/security.test.ts` | Employer isolation (`query.employerId = user._id`), IDOR guards, verify/reject/correct transitions, confidence updates. |
| **4. Cryptographic Verifiable Skill Passport** | `Student.model.ts`, `passport.service.ts`, `verification.controller.ts` | `GET /api/v1/students/:id/passport`, `GET /api/v1/verification/verify-hash/:hash` | `/student/passport`, `/verify/[hash]` | `tests/outcome.test.ts` (passport integrity test), `tests/instituteE2E.test.ts` | SHA-256 tamper-proof credential hash, public verification route, QR code integration, on-ledger history. |
| **5. AI-Driven Skill Gap Analysis & Career Pathway** | `ai.service.ts`, `GroqProvider.ts`, `OpenAIProvider.ts`, `PerplexityProvider.ts`, `Zod schemas` | `POST /api/v1/ai/gap-analysis`, `POST /api/v1/ai/career-prediction` | `/student/analyzer`, `/student/career` | `tests/ai.test.ts` (schema validation, multi-provider fallback) | Multi-provider fallback (Groq primary -> OpenAI secondary -> Perplexity tertiary), strict Zod parsing, zero mock fallbacks. |
| **6. District-Level Macro Skilling Heatmap & Telemetry** | `outcome.service.ts`, `EmploymentOutcome.model.ts` | `GET /api/v1/analytics/outcomes/districts`, `GET /api/v1/analytics/outcomes/wages` | `/government`, `/government/heatmap` | `tests/outcome.test.ts` (district intelligence & wage progression) | District wage progression curve, placement ratios, small-sample privacy protection ($N < 5$ masked). |
| **7. Evidence-Grounded AI Policy Copilot** | `policyCopilot.service.ts`, `policyCopilot.controller.ts`, `PolicyIntervention.model.ts` | `POST /api/v1/ai/policy-copilot` | `/government` (Copilot widget) | `tests/policyCopilot.test.ts` (grounding test, prompt injection resistance) | Queries live MongoDB outcome telemetry before calling LLM. Cites real database metrics and rejects hallucinations. |
| **8. Four-Fifths Rule Disparate Impact & Fairness Audit** | `fairness.service.ts`, `fairness.controller.ts`, `AuditLog.model.ts` | `GET /api/v1/analytics/fairness` | `/admin/fairness` | `tests/fairness.test.ts` (score calculation, flags) | Calculates selection rates and disparate impact ratios across gender and regional demographic groups. |
| **9. Training Provider Institution Roster & Individual Enrollment** | `Institution.model.ts`, `Student.model.ts`, `institute.controller.ts` | `GET /api/v1/institutes/:id/students`, `POST /api/v1/institutes/:id/students` | `/institute/students` | `tests/instituteE2E.test.ts` (student creation, passport hash generation) | Instant single-student enrollment form, unique enrollment number generation, passport generation, and bulk CSV upload. |
| **10. Practical Project Evaluations (NCVET Rubric Calibrated)** | `Assessment.model.ts`, `Student.model.ts`, `institute.controller.ts` | `GET /api/v1/institutes/:id/evaluations`, `POST /api/v1/institutes/:id/evaluations` | `/institute/evaluations` | `tests/instituteE2E.test.ts` (evaluation recording, score re-calculation) | 4-axis NCVET practical grading (Practical Implementation, Domain Knowledge, Code Quality, Viva Presentation). |
| **11. Dynamic Institutional ROI & Wage Yield Estimation** | `institute.controller.ts`, `EmploymentOutcome.model.ts`, `Institution.model.ts` | `GET /api/v1/institutes/:id/roi` | `/institute/roi` | `tests/instituteE2E.test.ts` (dynamic ROI calculation, statistical boundaries) | Real placed wage uplift above ₹10,000 baseline, 3-year cumulative yield, unit cost ratio, and interactive simulator. |
| **12. Industry Hiring Demand & Campus Drive Directory** | `IndustryInquiry.model.ts`, `Student.model.ts`, `industry.controller.ts` | `GET /api/v1/industry/demand`, `POST /api/v1/industry/inquiry` | `/industry/demand`, `/industry/campus`, `/industry/talent` | `tests/integration.test.ts` | Real-time sector skill council demand signals, campus recruitment drive registry, talent matching. |
| **13. DPDP Act 2023 Consent Lifecycle Management** | `Consent.model.ts`, `consent.service.ts`, `consent.controller.ts` | `GET /api/v1/consent`, `POST /api/v1/consent`, `POST /api/v1/consent/revoke` | `/student/consent`, `/government/compliance` | `tests/security.test.ts` (consent check, audit trail) | Granular data sharing consent checkboxes, instant revocation, purpose limitation enforcement. |
| **14. Multi-Tenant Role-Based Access Control & Security** | `auth.middleware.ts`, `User.model.ts`, `app.ts` | All routes with `protect`, `requireRole`, `requireInstituteAccess` | Entire application | `tests/authorization.test.ts`, `tests/security.test.ts` (15 security tests) | Helmet security headers, CORS origin allowlist, IDOR route guards, mass-assignment rejection, rate limiting. |
| **15. SaaS Monetization & Demo Billing Engine** | `Subscription.model.ts`, `billing.service.ts`, `billing.controller.ts` | `GET /api/v1/billing/subscription`, `POST /api/v1/billing/checkout` | `/settings/billing` | `tests/billing.test.ts` (entitlements, checkout schema, demo billing) | Server-side pricing source of truth, DemoBillingProvider MongoDB persistence, plan change, cancel, resume. |

---

## 3. Data Integrity & Codebase Verification Audit
1. **No Fake/Mock API Fallbacks:** AI service fails honestly with HTTP 429/503 when providers are exhausted rather than generating synthetic hallucinations.
2. **Strict DPDP Privacy Boundary:** Small-sample districts ($N < 5$) and institutional programs ($N < 3$ placed) explicitly report `"INSUFFICIENT_DATA"` to prevent identification.
3. **Cryptographic Ledger Integrity:** Skill Passports utilize deterministic SHA-256 hashes re-verified on-demand via `/verify/[hash]`.
4. **Clean Builds:** Zero lint or type errors on production bundle compilations (`tsc` and `next build`).
