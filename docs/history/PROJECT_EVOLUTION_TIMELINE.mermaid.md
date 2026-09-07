# Ryyvora AI — Visual Project Evolution & Architecture Flow

This document provides visual flowcharts, chronological timelines, and architectural diagrams illustrating the full evolution of **Ryyvora AI** (Smart India Hackathon Problem Statement SIH26135, Team Quantum Coders).

---

## 1. Master Historical Evolution Flow

```mermaid
flowchart TD
    subgraph STAGE1 ["Stage 1: Hackathon Genesis (March 14, 2026)"]
        A1["Sangam University Hackathon 2026<br/>'SkillSense AI' Initialized"]
        A2["Core Concept: Student Diagnostic Tests,<br/>Resume Parsing & Skill Gap Prediction"]
        A3["Repo & Folder Scaffolding<br/>(Commit 66ee2d0)"]
        A1 --> A2 --> A3
    end

    subgraph STAGE2 ["Stage 2: Monorepo Foundation (March 14-17, 2026)"]
        B1["Vite Prototype Discarded<br/>(eventarena removed in 8a83f73)"]
        B2["Express 5 REST API + MongoDB 8<br/>7 Foundational Mongoose Models"]
        B3["Google OAuth 2.0 + JWT Auth<br/>AI Fallbacks (OpenAI + Perplexity)"]
        B1 --> B2 --> B3
    end

    subgraph STAGE3 ["Stage 3: Compiler Awakening (August 22, 2026)"]
        C1["5-Month Development Pause"]
        C2["Next.js 16 + Turbopack Migration<br/>TypeScript Strictness & ESLint Flat Config"]
        C1 --> C2
    end

    subgraph STAGE4 ["Stage 4: Mock Elimination & Live Integration (August 29, 2026)"]
        D1["Backend Security Hardening<br/>(IDOR & CORS Wildcard Fixed)"]
        D2["Purge of Static UI Arrays<br/>Real Backend API Wiring"]
        D3["Groq LPU Engine Activated<br/>First Automated Tests (runAllTests.ts)"]
        D1 --> D2 --> D3
    end

    subgraph STAGE5 ["Stage 5: AI Mesh Overhaul (September 1, 2026)"]
        E1["Modular ProviderPool Architecture<br/>(Groq -> Gemini -> OpenAI -> Perplexity)"]
        E2["Regex jsonRepair Engine<br/>Removal of Fabricated AI Stubs"]
        E3["Public Skill Passport Verification<br/>(/verify/[hash] Route Launched)"]
        E1 --> E2 --> E3
    end

    subgraph STAGE6 ["Stage 6: The SIH26135 Pivot (September 2, 2026)"]
        F1["Reframing to SIH26135 Problem Statement<br/>(Commit b6762cf: 5,442 LOC Added)"]
        F2["5 New Models: EmploymentOutcome, FollowUp,<br/>OutcomeTimeline, Consent, PolicyIntervention"]
        F3["Longitudinal Follow-Ups (30/60/90/180/365d)<br/>DPDP Act 2023 Consent (N < 5 Masking)"]
        F4["Maharashtra 36-District Telemetry<br/>Live-Grounded AI Policy Copilot"]
        F1 --> F2 --> F3 --> F4
    end

    subgraph STAGE7 ["Stage 7: 6-Role Cockpits & SaaS Billing (September 2-3, 2026)"]
        G1["Full Stakeholder Suites:<br/>Government, Trainee, Employer, Institute, Industry, Admin"]
        G2["Cryptographic Employer Verification Queue<br/>(HMAC SHA-256 Digitally Signed Claims)"]
        G3["SaaS Demo Billing & Entitlements Engine<br/>(Subscription & UsageRecord Models)"]
        G4["10 Automated Backend Test Suites (Commit 27be057)"]
        G1 --> G2 --> G3 --> G4
    end

    subgraph STAGE8 ["Stage 8: Sovereign UI & Usability Overhaul (September 3-5, 2026)"]
        H1["Card Design System (11 Standardized Variants)"]
        H2["4-Destination Role Mobile Bottom Navigation"]
        H3["Purging of Neon Glow & Emojis<br/>Lucide Iconography & Photography Integration"]
        H1 --> H2 --> H3
    end

    subgraph STAGE9 ["Stage 9: Rebrand to Ryyvora AI (September 5-6, 2026)"]
        I1["Official Rebrand Migration (Commit 621627d)<br/>477 Brand Occurrences Migrated"]
        I2["Framer-to-React Cosmic Design Landing Page"]
        I3["Official RY Monogram Logo & Favicon System"]
        I4["Independent Institutional Light Theme Architecture"]
        I1 --> I2 --> I3 --> I4
    end

    subgraph STAGE10 ["Stage 10: Monorepo Reorganization (September 6, 2026)"]
        J1["Flattening Nested skillsense-ai/ Paths"]
        J2["Frontend Contract Test Suite (testFrontend.ts)"]
        J1 --> J2
    end

    subgraph STAGE11 ["Stage 11: Enterprise Security Hardening (September 7, 2026)"]
        K1["Client Demo Token Forgery Eradicated"]
        K2["Next.js Edge Proxy Server-Side RBAC"]
        K3["OAuth Origin Validation & httpOnly Cookies"]
        K4["Prompt Injection Sanitization (sanitizePromptInput)"]
        K1 --> K2 --> K3 --> K4
    end

    subgraph STAGE12 ["Stage 12: Production Cleanup & Final State (September 7, 2026)"]
        L1["Deletion of 41 Ghost Files & 23 Dead Components"]
        L2["Uninstallation of 6 Unused npm Packages"]
        L3["Quality Score: 93.5/100 | 80/80 Routes Clean Turbopack Build"]
        L4["11/11 Backend Tests Green | 23/23 Frontend Tests Green"]
        L1 --> L2 --> L3 --> L4
    end

    STAGE1 --> STAGE2 --> STAGE3 --> STAGE4 --> STAGE5 --> STAGE6 --> STAGE7 --> STAGE8 --> STAGE9 --> STAGE10 --> STAGE11 --> STAGE12
```

---

## 2. Chronological Milestones Timeline

```mermaid
timeline
    title Ryyvora AI Development Milestones (March 2026 – September 2026)
    section March 2026: Origin & Prototype
        March 14 : Repository initialized (Commit 66ee2d0)
                 : Initial Sangam University README (Commit 8937900)
                 : Express 5 backend API & Redis cache (Commit 7f35612)
                 : eventarena Vite prototype removed (Commit 8a83f73)
        March 15 : Google OAuth 2.0 integrated (Commit 8b142ac)
                 : Groq primary AI fallback cascade (Commit 0a5c119)
                 : Next.js CVE-2025-66478 patched (Commit 3f44b0f)
        March 17 : Dashboard prototype stabilization (Commit f0266bb)
    section August 2026: Modernization & Live Integration
        August 22 : Next.js 16 & Turbopack build migration (Commit a3d9427)
        August 29 : IDOR fix & first backend test suites (Commit ac85e48)
                  : Purge of static mocks & live API wiring (Commit d297c6d)
                  : Groq LPU engine activated with SSE (Commit 8c6aab7)
    section Early September 2026: The SIH Pivot & Ecosystem Expansion
        September 1 : ProviderPool & jsonRepair engine (Commit e895c6f)
                    : Public Skill Passport verification (Commit 57f168d)
                    : Google Gemini LLM integration (Commit 463c4bc)
        September 2 : The SIH26135 Pivot Commit (Commit b6762cf)
                    : Longitudinal tracking, 5 new models, DPDP consent
                    : 6-Role stakeholder cockpits built (Government, Trainee, Employer)
                    : SaaS billing engine & entitlement gates (Commit d17c230)
        September 3 : 10 Automated backend test suites (Commit 27be057)
                    : Mobile bottom navigation 4-destination bar (Commit a1cdf88)
                    : Standardized 11-variant Card Design System (Commit 2e236d2)
        September 4 : Sovereign Institutional design system (Commit e4d9a62)
                    : Photographic assets & emoji purging (Commit fdcc3db)
    section September 5-7, 2026: Rebranding, Hardening & Cleanup
        September 5 : Official Rebrand to Ryyvora AI (Commit 621627d)
                    : Framer-to-React cosmic landing page (Commit 6dc7065)
        September 6 : End-to-end real AI features (Commit 4afa307)
                    : Monorepo folder flattening & reorganization (Commit d68e819)
                    : Official RY monogram logo & favicon system (Commit d223ef7)
                    : Institutional light mode redesign (Commit eef4788)
        September 7 : Comprehensive application security hardening (Commit 3544b29)
                    : Landing page demo access removal
                    : Production code cleanup (70 files & 6 packages removed)
                    : Quality Score: 93.5/100 | 11/11 & 23/23 tests passing
```

---

## 3. Architecture Evolution: Early vs. Current

```mermaid
graph TD
    subgraph EARLY ["Early Architecture (March 2026)"]
        E_Client["React 18 / Next.js 14 Client"]
        E_API["Express 5 REST API"]
        E_DB[("MongoDB (7 Models)")]
        E_AI["OpenAI API / Perplexity Fallback"]

        E_Client -->|Cookie JWT| E_API
        E_API -->|Mongoose CRUD| E_DB
        E_API -->|Direct Call| E_AI
    end

    subgraph CURRENT ["Current Architecture (September 7, 2026)"]
        C_Proxy["Next.js 16 Edge Proxy (Server RBAC)"]
        C_Client["Next.js 16 Turbopack (Dual Theme + Recharts)"]
        C_API["Express 5 Hardened API Server"]
        C_Sec["Security Middleware (Rate Limiting, IDOR Guard, CORS)"]
        C_DPDP["DPDP Privacy Engine (N < 5 Masking)"]
        C_Sched["Longitudinal FollowUp Scheduler (30-365d)"]
        C_Pass["SHA-256 HMAC Credential Engine"]
        C_Pool["ProviderPool Mesh (Groq LPU -> Gemini -> OpenAI)"]
        C_DB[("MongoDB 8 (17 Indexed Collections)")]

        C_Client -->|httpOnly Secure Cookie| C_Proxy
        C_Proxy -->|Authorized Request| C_API
        C_API --> C_Sec
        C_Sec --> C_DPDP
        C_Sec --> C_Sched
        C_Sec --> C_Pass
        C_Sec --> C_Pool
        C_DPDP & C_Sched & C_Pass -->|Strict Mongoose Schemas| C_DB
        C_Pool -->|~350ms Grounded Inference| C_API
    end
```

---

## 4. SIH26135 Workforce Outcome Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Trainee as Vocational Trainee
    participant Portal as Ryyvora Portal
    participant Backend as Express Engine
    participant DB as MongoDB 8
    actor Employer as Corporate Employer
    actor Govt as State Policy Maker

    Note over Trainee, Govt: Phase 1: Skill Assessment & Graduation
    Trainee->>Portal: Complete trade diagnostic exam
    Portal->>Backend: Submit assessment scores
    Backend->>DB: Save scores & generate SHA-256 Skill Passport
    DB-->>Portal: Return QR code & verified passport link

    Note over Trainee, Employer: Phase 2: Outcome Reporting & Employer Verification
    Trainee->>Portal: Report employment at TCS (Role, Salary, Start Date)
    Portal->>Backend: POST /api/v1/outcomes/self-report
    Backend->>DB: Insert EmploymentOutcome (Status: SELF_REPORTED)
    Employer->>Portal: Login to Employer Verification Queue
    Portal->>Backend: GET /api/v1/verification/pending (IDOR isolated)
    Backend-->>Portal: List pending claims for TCS
    Employer->>Portal: Click "Verify Claim" (with optional salary correction)
    Portal->>Backend: POST /api/v1/verification/action (VERIFY)
    Backend->>DB: Commit HMAC SHA-256 digital signature & audit log

    Note over Trainee, Govt: Phase 3: Longitudinal Tracking (30, 90, 180, 365 Days)
    Backend->>DB: Automated FollowUp Scheduler triggers milestone
    Backend->>Trainee: Dispatch SMS/Email follow-up check-in
    Trainee->>Portal: Submit retention survey (Still employed, wage change)
    Portal->>Backend: POST /api/v1/followups/submit
    Backend->>DB: Update retention telemetry & recalculate cohort curves

    Note over Govt, DB: Phase 4: State Macro Telemetry & Policy Interventions
    Govt->>Portal: Access Maharashtra Macro Cockpit
    Portal->>Backend: GET /api/v1/outcomes/districts
    Backend->>DB: Run MongoDB aggregations with DPDP N < 5 suppression
    Backend-->>Portal: Return 36-district heatmap & retention funnels
    Govt->>Portal: Query AI Policy Copilot ("Allocate fund to Nashik CNC")
    Portal->>Backend: POST /api/v1/ai/policy-copilot
    Backend->>DB: Fetch live district aggregations & sanitize prompt
    Backend->>Portal: Stream grounded policy recommendations & fiscal impact
```

---

## 5. Multi-Provider AI Fallback Mesh

```mermaid
flowchart TD
    Req["Incoming AI Request<br/>(Policy Copilot, Skill Gap, Career Predictor)"]
    Sanitize["Prompt Sanitization<br/>(sanitizePromptInput: Strip delimiters, cap length)"]
    Ground["Database Context Injection<br/>(5 Live MongoDB Aggregations)"]

    Req --> Sanitize --> Ground --> Groq

    subgraph PROVIDER_POOL ["ProviderPool Resilience Mesh"]
        Groq["Primary: Groq LPU<br/>(llama-3.3-70b-versatile, ~350ms)"]
        Gemini["Secondary: Google Gemini<br/>(gemini-1.5-flash / 2.0-flash)"]
        OpenAI["Tertiary: OpenAI<br/>(gpt-4o-mini / gpt-3.5-turbo)"]
        Perplexity["Quaternary: Perplexity<br/>(sonar-reasoning / search)"]
        JsonRepair["jsonRepair Engine<br/>(Regex parse, unquoted keys, fence strip)"]
        ErrorState["Honest Error State<br/>(429 Rate Limit / User Notification)"]

        Groq -->|Success| JsonRepair
        Groq -->|429 / Timeout / 5xx| Gemini
        Gemini -->|Success| JsonRepair
        Gemini -->|Failure| OpenAI
        OpenAI -->|Success| JsonRepair
        OpenAI -->|Failure| Perplexity
        Perplexity -->|Success| JsonRepair
        Perplexity -->|All Exhausted| ErrorState
    end

    JsonRepair --> ValidJson["Validated Zod Schema Output"]
    ValidJson --> ClientResponse["Rendered Structured UI Output"]
```

---

## 6. Security Defense-in-Depth Pipeline

```mermaid
flowchart LR
    Browser["Client Browser Request"] --> EdgeProxy["Next.js 16 Edge Proxy<br/>(proxy.ts)"]

    subgraph EDGE_LAYER ["Edge Verification"]
        EdgeProxy -->|Check Path| RouteType{"Is Route Protected?"}
        RouteType -->|No (Public / Landing)| AllowPublic["Serve Public Page"]
        RouteType -->|Yes (/admin, /government, etc.)| ValidateCookie{"Check ryyvora_token Cookie"}
        ValidateCookie -->|Missing / Fake Token| RedirectLogin["302 Redirect to /auth"]
        ValidateCookie -->|Valid JWT| CheckRole{"Edge Role Authorization"}
        CheckRole -->|Unauthorized Role| ForbiddenRedirect["302 Redirect to User Role Root"]
        CheckRole -->|Authorized Role| ForwardBackend["Forward to Express API"]
    end

    subgraph API_LAYER ["Express 5 Hardened Core"]
        ForwardBackend --> OriginCheck["Strict CORS & Trusted Origins"]
        OriginCheck --> RateLimit["Route Rate Limiters (Auth, AI, Public)"]
        RateLimit --> AuthMiddleware["JWT Verify & Cookie Guard"]
        AuthMiddleware --> IDORGuard["Multi-Tenant IDOR Guard (employerId)"]
        IDORGuard --> DPDPCheck["DPDP Act Purpose & N < 5 Masking"]
        DPDPCheck --> ServiceExec["Execute Business Logic & Database Commit"]
    end
```
