<div align="center">

# ⚡ SkillSense AI

### **Next-Gen AI-Powered Skill Assessment, Career Prediction & Workforce Intelligence Platform**

*Bridging the gap between Education, Industry, and Governance with verifiable competencies, multi-provider AI reasoning, and premium workforce analytics.*

[![Next.js](https://img.shields.io/badge/Next.js-16.x-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-ioredis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Developed with 💡 by Team Quantum Coders**

---

</div>

## 📌 Table of Contents

- [🌟 Executive Summary](#-executive-summary)
- [✨ Key Capabilities](#-key-capabilities)
- [🎨 Modern SaaS Design System](#-modern-saas-design-system)
- [🤖 Multi-Provider AI Architecture](#-multi-provider-ai-architecture)
- [👥 Multi-Stakeholder Ecosystem](#-multi-stakeholder-ecosystem)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Database Seeding & Demo Accounts](#database-seeding--demo-accounts)
  - [Running the Application](#running-the-application)
- [🧪 Testing & Quality Assurance](#-testing--quality-assurance)
- [🛡️ Security, Fairness & Governance](#️-security-fairness--governance)
- [📡 API Reference](#-api-reference)
- [📂 Project Structure](#-project-structure)
- [📄 License & Credits](#-license--credits)

---

## 🌟 Executive Summary

**SkillSense AI** is a comprehensive workforce intelligence and skill analytics platform engineered to eliminate the disconnect between academia and industry in India. By leveraging resilient multi-provider Large Language Models (Groq Cloud, OpenAI GPT-4o, Perplexity Sonar), multi-factor competency modeling, real-time assessment sandboxes, and cryptographic digital passports, SkillSense delivers transparent, verifiable, and bias-audited skill pathways for learners, academic institutions, enterprises, and policymakers.

---

## ✨ Key Capabilities

- **🧠 Deep Semantic AI Skill Analyzer**: Performs deep neural extraction across resumes, GitHub repositories, and submitted code/projects across 50+ competency vectors calibrated to NSQF levels.
- **📜 Cryptographic Skill Passport**: Generates SHA-256 HMAC-signed, tamper-proof digital credentials that can be verified and shared publicly.
- **🎯 Predictive Career Pathways & Salary Mapping**: ML-backed role matching and transparent compensation forecasting in INR aligned with Indian IT benchmarks.
- **📊 Dynamic Gap Analysis & Roadmap Engine**: Pinpoints missing skills against targeted job descriptions and generates step-by-step upskilling roadmaps.
- **⚖️ Algorithmic Fairness & Bias Governance Engine**: Monitors disparate impact ratios (80% / 4/5ths rule), demographic parity, and regional/gender equity.
- **💬 Real-Time AI Copilot**: Native conversational assistant embedded in the student dashboard with streaming typewriter responses and session history.
- **⚡ Distraction-Free Assessment Engine**: Adaptive topic quizzes, keyboard navigation (`A`, `B`, `C`, `D`), instant grading, and automated passport ledger updates.

---

## 🎨 Modern SaaS Design System

SkillSense AI features a **Linear/Vercel/Stripe-inspired** dark-first design system:
- **Obsidian Dark Palette**: `#090A0F` background, `#0F111A` card surfaces, and `#151824` elevated popovers.
- **Linear Borders & Restrained Accents**: 1px crisp borders (`rgba(255, 255, 255, 0.08)`) with refined amber accents (`#F59E0B` / `#D97706`).
- **Typography Hierarchy**: `Inter` body text, `Space Grotesk` metric display headers, and `JetBrains Mono` for hash signatures and telemetry.
- **Specialized AI Visual Language**:
  - `AIInsightCard`: Prominent intelligence briefing banner with actionable next steps.
  - `ConfidenceScore`: Model confidence rating (0-100%) indicator.
  - `ScanningState`: Laser scan pulse animation during active AI inference.
  - `AIBadge`: Subtle status tags (`AI ASSISTED`, `VERIFIED CREDENTIAL`, `LIVE TELEMETRY`, `NSQF LEVEL 4`).
  - `EmptyState` & `ErrorState`: Purposeful contextual error diagnosis and recovery actions.

---

## 🤖 Multi-Provider AI Architecture

```
User Prompt / Assessment / Profile
              │
              ▼
   [ AIProviderManager ]
              │
   ┌──────────┼──────────┐
   ▼          ▼          ▼
[ Groq ]  [ OpenAI ]  [ Perplexity ]
 (Llama)   (GPT-4o)     (Sonar)
   │          │          │
   └──────────┼──────────┘
              ▼
    [ jsonRepair & Zod ]
   (Markdown Strip, Regex,
    Trailing Comma Fix)
              │
              ▼
  Typed Verified Result
```

- **Resilient Fallback**: Automatic failover chain from Groq $\to$ OpenAI $\to$ Perplexity $\to$ typed fallback.
- **Safe JSON Repair**: Strips markdown backticks (````json ... ````), isolates JSON boundaries, and fixes trailing commas.
- **Strict Zod Validation**: Validates all structured LLM responses against runtime schemas.

---

## 👥 Multi-Stakeholder Ecosystem

| Role | Core Capabilities |
| :--- | :--- |
| **🎓 Students** | Skill scoring, verified Skill Passport, AI resume parser, gap roadmaps, career predictions, interactive quizzes, job recommendations. |
| **🏛️ Institutions** | Cohort skill benchmarking, curriculum gap detection, batch analytics, placement readiness index, automated institutional reports. |
| **🏢 Industry / Employers** | Precision skill search, verified candidate talent pools, automated candidate matching, direct inquiry & contact workflow. |
| **🏛️ Government** | Macro-economic skill intelligence, regional talent supply/demand heatmaps, policy impact simulation, national workforce forecasting. |
| **🛡️ Administrators** | System health diagnostics, multi-provider AI latency tracking, audit logs, user management, and security governance. |

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client["Next.js 16 Client App (Turbopack + Tailwind + Framer Motion)"]
    
    subgraph Gateway & Middleware
        RateLimit["Rate Limiter (ioredis)"]
        HelmetCors["Helmet + Strict CORS"]
        AuthMid["JWT & Passport Authentication"]
    end
    
    subgraph Express.js Backend API
        AuthRoutes["/api/v1/auth"]
        StudentRoutes["/api/v1/students"]
        InstituteRoutes["/api/v1/institutes"]
        IndustryRoutes["/api/v1/industry"]
        GovRoutes["/api/v1/governance"]
        AIRoutes["/api/v1/ai"]
        AssessmentRoutes["/api/v1/assessments"]
        AnalyticsRoutes["/api/v1/analytics"]
    end

    subgraph Intelligence & Services
        AIService["AI Engine (Groq / OpenAI / Perplexity)"]
        PassportService["Skill Passport (SHA-256 Signing)"]
        FairnessService["Fairness & Disparate Impact Engine"]
    end

    subgraph Data Layer
        MongoDB[(MongoDB Database)]
        Redis[(Redis Cache)]
    end

    Client --> Gateway
    Gateway --> Express.js Backend API
    Express.js Backend API --> Intelligence & Services
    Express.js Backend API --> Data Layer
    Intelligence & Services --> Data Layer
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS & Vanilla CSS Design System
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query + Axios
- **Animations**: Framer Motion
- **Visualizations**: Recharts (Radar, Area, Bar, Composed charts)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express 5
- **Language**: TypeScript 5
- **Database**: MongoDB + Mongoose 8
- **Cache & Rate Limiting**: Redis (ioredis)
- **Authentication**: JWT (JSON Web Tokens) + Bcrypt.js + Passport
- **AI Integrations**: Groq SDK (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`), OpenAI SDK (`gpt-4o-mini`, `gpt-4o`), Perplexity API (`sonar`)
- **Validation**: Zod
- **Security**: Helmet, CORS, Express Rate Limit, Mongo Sanitize

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.x or later
- **npm**: v10.x or later
- **MongoDB**: Local instance running on port 27017 or a MongoDB Atlas URI
- **Redis**: Local instance on port 6379 or Redis Cloud instance

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TrikamDevasi/TEAM_QUANTUM_CODERS-SU-.git
   cd TEAM_QUANTUM_CODERS-SU-/skillsense-ai
   ```

2. **Install Root, Backend, and Frontend Dependencies**:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

### Environment Configuration

Configure environment variables in both `backend/.env` and `frontend/.env.local`.

#### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/skillsense
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
PASSPORT_SECRET=your_passport_hmac_secret_here

# AI Provider Keys
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

#### Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Running the Application

In separate terminal windows:

```bash
# Start Backend (Port 5000)
cd backend
npm run dev

# Start Frontend (Port 5173 with Turbopack)
cd frontend
npm run dev
```

Navigate to `http://localhost:5173` to explore SkillSense AI.

---

## 🧪 Testing & Quality Assurance

SkillSense AI includes an end-to-end automated test runner covering all architectural layers:

```bash
cd backend
npm test
```

### Test Matrix

```
====================================================
🚀 SkillSense AI Backend Automated Test Runner
====================================================

🧪 Running Authentication & Password Security Tests...
  ✅ Password hashing & verification working
  ✅ JWT token signing & verification working
  ✅ Auth token extraction & decoding working

🧪 Running Role-Based Authorization Tests...
  ✅ Student role permissions enforced
  ✅ Institute multi-tenant isolation enforced
  ✅ Government role policy checks verified
  ✅ Admin privileged access verified

🧪 Running NSQF Alignment & Fairness Math Tests...
  ✅ NSQF Level 4 mapped to Advanced Diploma tier
  ✅ Demographic parity metric computed
  ✅ Disparate impact ratio 4/5ths rule verified

🧪 Running AI Provider, Schemas, Fallback & Service Tests...
  ✅ AI Provider hierarchy registered (Groq, OpenAI, Perplexity)
  ✅ Markdown code fence extraction & stripping passed
  ✅ Trailing comma cleanup passed
  ✅ SkillAnalysisSchema Zod validation passed
  ✅ CareerPredictionSchema Zod validation passed
  ✅ GapAnalysisSchema Zod validation passed
  ✅ AssessmentGenerationSchema Zod validation passed
  ✅ AssessmentEvaluationSchema Zod validation passed
  ✅ AIService.analyzeSkills returned score: 78/100 with 4 competencies
  ✅ AIService.testConnectivity reports all 3 provider telemetries

🧪 Running Express Route, Security & Authorization Integration Tests...
  ✅ Root & Health endpoints operational
  ✅ Trusted CORS origin accepted with Access-Control-Allow-Origin
  ✅ Untrusted CORS origin blocked from credentialed access
  ✅ Public privilege escalation (admin self-registration) blocked with 400
  ✅ Unauthenticated request blocked with 401
  ✅ Student accessing admin route blocked with 403
  ✅ Analytics student IDOR guarded with 403 Forbidden
  ✅ Institute multi-tenancy isolation enforced (403 Forbidden)
  ✅ Mass assignment attack rejected with 400 (strict schema validation)

====================================================
🎉 ALL AUTOMATED INTEGRATION, UNIT & AI TESTS PASSED! (5/5)
====================================================
```

---

## 🛡️ Security, Fairness & Governance

- **Credential Isolation**: All LLM API keys remain strictly on the backend.
- **Rate Limiting**: Tiered endpoint rate limiting with Redis backing (`100 req/15min` general, `30 req/min` AI inference).
- **IDOR Protection**: Strict student ownership middleware ensuring candidates can only access/modify their own ledgers.
- **Fairness Governance**: Automated bias auditing tracking demographic parity across Indian states, genders, and institutional categories.

---

## 📡 API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user | No |
| `POST` | `/api/v1/auth/login` | Authenticate user & get JWT | No |
| `GET` | `/api/v1/students/me` | Fetch authenticated student profile | Yes (`student`) |
| `POST` | `/api/v1/students/analyze-skills` | Extract competencies from text/GitHub/projects | Yes (`student`) |
| `GET` | `/api/v1/students/:id/passport` | Retrieve cryptographic Skill Passport | Yes |
| `POST` | `/api/v1/assessments/submit` | Submit diagnostic assessment result | Yes (`student`) |
| `GET` | `/api/v1/assessments/history` | Retrieve student assessment history | Yes (`student`) |
| `POST` | `/api/v1/ai/predict-career` | AI career matching & salary estimation | Yes |
| `POST` | `/api/v1/ai/chat` | AI Career Copilot SSE stream | Optional |
| `GET` | `/api/v1/ai-health` | Multi-provider latency & telemetry check | No |
| `GET` | `/api/v1/analytics/skill-gaps/:id` | Detailed gap analysis & roadmap | Yes |

---

## 📄 License & Credits

Developed with ❤️ by **Team Quantum Coders**.
Licensed under the [MIT License](LICENSE).
