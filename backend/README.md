# ⚙️ Ryyvora AI — Microservices Backend

Express + TypeScript RESTful microservices backend powering **Ryyvora AI**, the verifiable longitudinal skilling and outcome intelligence platform.

[![Node.js](https://img.shields.io/badge/Node.js-20+-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-ioredis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

---

## 📌 Architecture & Microservices Overview

The backend is built with clean architecture principles, separating concerns into controllers, services, models, and middleware:
- **Authentication & RBAC**: JWT bearer auth supporting `student`, `institute`, `employer`, `industry`, `government`, and `admin` roles.
- **Cryptographic Ledgers**: SHA-256 HMAC-signed skill passport generation and Merkle root verification.
- **AI Provider Mesh**: Multi-provider failover routing through Groq Cloud, Google Gemini, OpenAI GPT-4o, and Perplexity Sonar.
- **DPDP Act 2023 Sovereignty**: Purpose-bound consent storage, PII masking middleware, and instant audit trails.

---

## 🔌 API Route Modules (`/api/v1`)

| Module | Route Prefix | Primary Operations |
| :--- | :--- | :--- |
| **Authentication** | `/auth` | Register, login, refresh JWT, verify session, logout. |
| **Trainees & Students**| `/students` | Trainee profiles, milestone logging, diagnostic quiz submissions. |
| **Outcomes & Claims** | `/outcomes` | Employment claims, 30d-365d longitudinal surveys, salary updates. |
| **Employer Validations**| `/employer` | HMAC signing of placement claims, candidate search, performance reviews. |
| **Government Telemetry**| `/government` | 36-District heatmap aggregation, fund targeting simulation, compliance scans. |
| **Institutions** | `/institutes` | Polytechnic roster management, batch passport minting, NCVET grading. |
| **Industry Intelligence**| `/industry` | Demand vs supply gap radar, qualification packs, campus connects. |
| **Administration** | `/admin` | User provisioning, IEEE 7000 fairness audits, append-only system logs. |
| **AI Copilot** | `/ai` | Grounded policy copilot queries, neural fiscal projections, code audits. |

---

## 🤖 Multi-Provider AI Engine

```
Incoming Prompt
      │
      ▼
AIProviderManager.ts
      │
      ├─► [1] Groq (Llama 3.3 70B Versatile) ──► Ultra-Fast (~780ms)
      │        │ (fallback on rate-limit / timeout)
      ├─► [2] Google Gemini 2.0 Flash
      │        │ (fallback)
      ├─► [3] OpenAI GPT-4o Mini
      │        │ (fallback)
      └─► [4] Perplexity Sonar (Citations)
```

---

## 🚀 Running Locally

```bash
# From backend directory
cd backend

# Install dependencies
npm install

# Start development server with auto-reload (Port 5000)
npm run dev

# Run TypeScript compilation check
npx tsc --noEmit

# Execute automated Jest test suites
npm test
```

---

## 🌐 Environment Variables (`.env`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/skillsense
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-256-bit-secret-key
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```
