<div align="center">

# ⚡ SkillSense AI

### **Smart India Hackathon 2026 · Problem Statement SIH26135**
#### **Organization:** Government of Maharashtra  
#### **Theme:** Miscellaneous | **Category:** Software

> *"Difficulties in tracking employment outcomes, skill gaps, and the impact of skilling initiatives"*

[![Next.js](https://img.shields.io/badge/Next.js-16.x-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-ioredis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

**Developed with 💡 by Team Quantum Coders for Smart India Hackathon 2026**

---

</div>

## 📌 Table of Contents

- [🏛️ The Problem & SIH26135 Alignment](#️-the-problem--sih26135-alignment)
- [🌟 Longitudinal Skilling Outcome Pipeline](#-longitudinal-skilling-outcome-pipeline)
- [✨ Key Platform Capabilities](#-key-platform-capabilities)
- [👥 Four Stakeholder Cockpits](#-four-stakeholder-cockpits)
- [🛡️ DPDP Act 2023 Consent & Privacy Center](#️-dpdp-act-2023-consent--privacy-center)
- [🤖 Multi-Provider AI Architecture & Policy Copilot](#-multi-provider-ai-architecture--policy-copilot)
- [🏗️ System Architecture](#️-system-architecture)
- [🔑 Hackathon Demo Credentials](#-hackathon-demo-credentials)
- [🚀 Getting Started (Local Development)](#-getting-started-local-development)
- [🧪 Automated Test Suites & Verification](#-automated-test-suites--verification)
- [🌐 Production Deployment Guide (Vercel + Render)](#-production-deployment-guide-vercel--render)
- [📂 Project Structure](#-project-structure)

---

## 🏛️ The Problem & SIH26135 Alignment

Traditional vocational training tracking in India ends at course completion or initial placement numbers. State directorates lack **longitudinal verification**, resulting in:
1. **Unverified Placement Claims**: Self-reported numbers inflated without employer validation.
2. **Invisible Career Trajectories**: Zero visibility into 90-day, 180-day, and 365-day job retention or wage growth.
3. **Curriculum & Geographic Disconnect**: High training numbers in trades that lack local industry demand.
4. **Data Privacy Deficits**: Lack of explicit consent handling required under India's **DPDP Act 2023**.

**SkillSense AI** solves this by creating a unified, privacy-first **Longitudinal Skilling & Outcome Intelligence Platform** for the Government of Maharashtra.

---

## 🌟 Longitudinal Skilling Outcome Pipeline

SkillSense connects every phase of the vocational lifecycle:

```
TRAINEE ──► TRAINING PROGRAM ──► ASSESSMENT ──► CERTIFICATION (SHA-256)
                                                        │
┌───────────────────────────────────────────────────────┘
▼
PLACEMENT / SELF-EMPLOYMENT / APPRENTICESHIP ──► EMPLOYER VERIFICATION LEDGER
                                                        │
┌───────────────────────────────────────────────────────┘
▼
30d-365d FOLLOW-UPS ──► 90d RETENTION ──► WAGE PROGRESSION (+22%) ──► AI POLICY COPILOT
```

---

## ✨ Key Platform Capabilities

1. **📜 Verifiable NSQF Skill Passport**:
   - Cryptographic SHA-256 HMAC-signed credentials verifiable publicly via URL and QR code.
   - Transparent competency breakdowns linked to NSQF qualification tiers.

2. **⏳ Trainee Longitudinal Milestone Ledger (`/student/journey`)**:
   - Visual milestone timeline tracing Enrollment $\to$ Assessment $\to$ Certification $\to$ Placement $\to$ Retention Checks.
   - Interactive self-reporting modal for Salaried Employment, Self-Employment, Apprenticeship, or Non-Placement Barriers.
   - Automated 30d, 90d, and 365d survey submission modals.

3. **🏛️ Maharashtra State Skilling Intelligence Cockpit (`/government`)**:
   - **9-Stage Outcome Funnel**: Live MongoDB conversion telemetry from enrolled to 365-day retention.
   - **9-District Intelligence Drilldown**: Real-time metrics across Pune, Mumbai Suburban, Nagpur, Nashik, Chhatrapati Sambhaji Nagar, Thane, Solapur, Kolhapur, and Amravati.
   - **Small-Sample Protection ($N < 5$)**: Suppresses unreliable micro-rankings to protect candidate privacy and statistical validity.
   - **Longitudinal Wage Progression Curve**: Visualizes salary growth (+22% average increase from ₹25,174 to ₹34,200).
   - **Evidence-Based Policy Interventions**: Actionable directives for local industrial clusters.

4. **💼 Employer Validation Queue (`/employer/validations`)**:
   - 1-click **Verify Placement**, **Reject Claim**, and **Request Correction** workflows that upgrade claim confidence to 98%+.

5. **🤖 Grounded AI Policy Copilot (`/api/v1/ai/policy-copilot`)**:
   - Query engine grounded strictly in live MongoDB aggregation metrics with zero hallucinations.

---

## 👥 Four Stakeholder Cockpits

| Persona | Role Key | Dashboard Route | Core Capability |
| :--- | :--- | :--- | :--- |
| **State Government** | `government` | `/government` | Outcome funnel, district intelligence, wage curve, AI policy copilot. |
| **Training Institute** | `institute` | `/institute` | Batch upload, cohort retention rates, curriculum relevance analytics. |
| **Trainee / Student** | `student` | `/student/journey` | Verifiable milestone timeline, self-report modal, DPDP privacy center. |
| **Hiring Employer** | `employer` | `/employer/validations`| Candidate verification ledger, skill-matched talent pool. |

---

## 🛡️ DPDP Act 2023 Consent & Privacy Center

Built directly to comply with India's **Digital Personal Data Protection (DPDP) Act 2023**:
- **5-Pillar Transparency**: Explains WHAT is collected, WHY, WHO has access, HOW long it is retained, and HOW consent can be withdrawn.
- **Granular Consent Toggles**:
  - `outcome_tracking`: Longitudinal career tracking.
  - `employer_verification`: Employer verification access.
  - `longitudinal_followup`: Post-certification surveys.
  - `salary_benchmarking`: Anonymized wage analytics.
  - `policy_analytics`: State policy feedback.
- **Audit Trail**: Full cryptographic history of every grant and withdrawal event.

---

## 🤖 Multi-Provider AI Architecture & Policy Copilot

SkillSense features an intelligent multi-provider LLM manager with automated runtime health probes, strict Zod validation, and zero-hallucination guarantees:

```
Request ──► AIProviderManager ──► [ Groq Cloud (Primary) ] ──► Healthy (788ms)
                                       │ (if failed)
                                       ▼
                                [ Google Gemini ]
                                       │ (if failed)
                                       ▼
                                [ OpenAI GPT-4o ]
                                       │ (if failed)
                                       ▼
                               [ Perplexity Sonar ]
```

---

## 🔑 Hackathon Demo Credentials

Pre-seeded accounts ready for jury evaluation:

| Role | Email | Password | Access URL |
| :--- | :--- | :--- | :--- |
| **State Government** | `government@skillsense.demo` | `Demo@1234` | `/government` |
| **Training Provider** | `provider@skillsense.demo` | `Demo@1234` | `/institute` |
| **Trainee** | `trainee@skillsense.demo` | `Demo@1234` | `/student/journey` |
| **Employer** | `employer@skillsense.demo` | `Demo@1234` | `/employer/validations` |
| **System Admin** | `admin@skillsense.demo` | `Demo@1234` | `/admin` |

*(OAuth with **GitHub** and **Google** is also supported on `/auth`).*

---

## 🚀 Getting Started (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/TrikamDevasi/TEAM_QUANTUM_CODERS-SU-.git
cd TEAM_QUANTUM_CODERS-SU-/skillsense-ai

# Install root, backend, and frontend dependencies
npm run install:all
```

### 2. Configure Environment Variables
- In `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/skillsense
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
JWT_SECRET=skillsense_jwt_secret_key_32_chars_min
SESSION_SECRET=skillsense_session_secret_key_32_chars
PASSPORT_SECRET=skillsense-passport-verification-secret
GROQ_API_KEY=your_groq_api_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```
- In `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Seed Realistic Maharashtra Outcome Data
```bash
npm --prefix backend run seed:outcomes
```

### 4. Run Development Servers
```bash
npm run dev
```
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/health](http://localhost:5000/health)
- **AI Diagnostics**: [http://localhost:3000/ai-health](http://localhost:3000/ai-health)

---

## 🧪 Automated Test Suites & Verification

Run the comprehensive 6-stage backend automated test runner:
```bash
npm --prefix backend test
```

### Verified Test Suites (6/6 Passing):
1. **Authentication Tests**: Argon2 password hashing, JWT generation, demo role verification.
2. **Authorization & RBAC Tests**: Role access control, multi-tenant institute isolation, IDOR guards.
3. **Algorithmic Fairness & Bias Tests**: 4/5ths Rule (80% Disparate Impact Ratio) across genders and districts.
4. **AI Multi-Provider Fallback Tests**: Groq, Gemini, OpenAI, Perplexity failover checks.
5. **SIH26135 Longitudinal Outcomes & Policy Copilot Tests**: 9-stage funnel, district intelligence with small-sample protection, wage curves, and grounded citations.
6. **Express Route & Security Integration Tests**: CORS security, Helmet headers, mass-assignment Zod validation.

---

## 🌐 Production Deployment Guide (Vercel + Render)

- **Frontend Deployment (Vercel)**:
  - Framework: Next.js (App Router)
  - `NEXT_PUBLIC_API_URL=https://skillsense-backend.onrender.com/api/v1`
  - `NEXT_PUBLIC_APP_URL=https://skillsense-ai-seven.vercel.app`
- **Backend Deployment (Render / Railway)**:
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
  - `FRONTEND_URL=https://skillsense-ai-seven.vercel.app`
  - `CORS_ORIGIN=https://skillsense-ai-seven.vercel.app`
  - `GITHUB_CALLBACK_URL=https://skillsense-backend.onrender.com/api/v1/auth/github/callback`

---

## 📂 Project Structure

```
skillsense-ai/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Redis, Passport, Cloudinary, Env schemas
│   │   ├── controllers/     # Outcome, Consent, Followup, Verification, AI, Auth
│   │   ├── models/          # OutcomeTimeline, EmploymentOutcome, Consent, FollowUp, PolicyIntervention
│   │   ├── services/        # outcome.service, policyCopilot.service, consent.service, followup.service
│   │   ├── routes/          # Express API route definitions (/api/v1/...)
│   │   ├── scripts/         # seedLongitudinalOutcomes.ts (Realistic Maharashtra dataset)
│   │   └── utils/           # Logger, JWT, fairness auditor
│   └── tests/               # 6-suite automated test runner
├── frontend/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── government/  # Maharashtra State Outcome Cockpit & Funnel
│   │   │   ├── student/
│   │   │   │   ├── journey/ # Trainee Longitudinal Milestones & Self-Report
│   │   │   │   └── consent/ # DPDP Act 2023 Consent Center
│   │   │   ├── employer/
│   │   │   │   └── validations/ # Employer Candidate Verification Queue
│   │   │   └── institute/   # Training Provider Analytics & Upload
│   │   ├── ai-health/       # Real-Time Multi-Provider Telemetry & Latency
│   │   ├── verify/[hash]/   # Public Cryptographic Skill Passport Verifier
│   │   ├── auth/            # Auth & OAuth Callback handler
│   │   └── page.tsx         # SIH26135 Public Landing Page
│   └── components/          # UI design system components, charts, and widgets
└── README.md
```

---

<div align="center">

**Smart India Hackathon 2026 · Problem Statement SIH26135 · Government of Maharashtra**  
*SkillSense AI — From Training Data to Real Employment Outcomes.*

</div>
