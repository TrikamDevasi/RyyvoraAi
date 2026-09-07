# Ryyvora AI — Evaluator & Demo Access Guide (SIH Testing)

This guide is intended for SIH evaluators, hackathon judges, QA engineers, and authorized development teams who need to evaluate the full capabilities of **Ryyvora AI** across all 6 stakeholder personas.

> **Security Notice**:
> In accordance with national cyber-defense and DPDP Act 2023 principles, all public landing page demo bypasses, mock token generators, and unauthenticated dashboard launch buttons have been completely eliminated. Access to real stakeholder workspaces is strictly enforced through authenticated sessions via `/auth`.

---

## 1. Quick Start: Seeding Test Data

To populate MongoDB with complete longitudinal test cohorts, verifiable NSQF competency records, and 6 pre-configured stakeholder accounts:

```bash
# In the root repository directory
npm run seed:db
```

This populates:
- 6 Role Accounts (Aarav Deshmukh, TCS Corporate, MSSDS Pune, Maharashtra Directorate, SSC Intelligence, System Admin)
- 40+ Student skill passports with SHA-256 HMAC cryptographic signatures
- Real longitudinal employment outcome records spanning 9 lifecycle stages
- Regional district telemetry for Maharashtra skilling centers

---

## 2. Authorized Evaluator Credentials

All 6 stakeholder accounts share a standardized, memorable evaluation password:

| Stakeholder Persona | Email Address | Password | Landing Workspace | Key Capabilities to Test |
| :--- | :--- | :--- | :--- | :--- |
| **Student / Trainee** | `trainee@skillsense.demo` | `DemoPassword123!` | `/student` | Cryptographic Skill Passport, NSQF Level 5 Analyzer, AI Career Copilot, Placement Submissions |
| **Corporate Employer** | `employer@skillsense.demo` | `DemoPassword123!` | `/employer` | Cryptographic Ledger Verifier, Fraud-Proof Candidate Matching, Placement Verifications |
| **Training Provider / Institute** | `provider@skillsense.demo` | `DemoPassword123!` | `/institute` | Cohort Longitudinal Outcomes, Dynamic ROI Engine, Batch Assessment & Credential Minting |
| **Government / Directorate** | `government@skillsense.demo` | `DemoPassword123!` | `/government` | District Skill Gap Heatmaps, Macro Outcome Funnels, Policy Intelligence Copilot |
| **Sector Skill Council / Industry** | `industry@skillsense.demo` | `DemoPassword123!` | `/industry` | Labor Demand Forecasting, Regional Hiring Benchmarks, Emerging Skill Cluster Telemetry |
| **Platform Administrator** | `admin@skillsense.demo` | `DemoPassword123!` | `/admin` | Algorithmic Fairness Engine, Demographic Parity Auditing, System Governance, Audit Logs |

---

## 3. How to Access the Workspaces

1. Navigate to the official sign-in page: **[`/auth`](http://localhost:3000/auth)**.
2. Select **Email & Password** sign-in tab.
3. Enter the evaluation email and password from the table above.
4. Click **Sign In to Workspace**.
5. The system automatically verifies your credentials against the backend API, sets secure HTTP-only cookies, and routes you to the authoritative role dashboard.

### Testing Role-Based Access Control (RBAC):
- If you sign in as a **Student** (`trainee@skillsense.demo`) and manually attempt to browse to `/admin` or `/employer`, the **Next.js Edge Proxy** will intercept your request and redirect you back to `/student`.
- Attempting to bypass route guards with forged client-side tokens will result in immediate termination of the session and redirection to `/auth`.

---

## 4. Mobile Phone OTP Evaluation Flow

You can also test passwordless mobile OTP authentication:

1. Navigate to **[`/auth?method=mobile`](http://localhost:3000/auth?method=mobile)**.
2. Enter any 10-digit Indian mobile number (e.g. `9876543210`).
3. In development environments (`NODE_ENV=development`), the terminal console logs the generated 6-digit OTP code, and the response data includes the test code helper.
4. Enter the 6-digit code on `/auth/mobile/verify` to complete authentication.

---

## 5. Public Product & Architectural Showcases

Public visitors and non-authenticated evaluators can explore the platform through official public architecture pages without entering protected environments:

| Public Page | URL | Purpose |
| :--- | :--- | :--- |
| **Public Landing Page** | `/` | Product overview, live telemetry status, and NSQF Level 4–8 compliance |
| **Trainee Product Hub** | `/for-trainees` | Overview of verifiable skill portfolios and career mobility tools |
| **Employer Solutions Hub** | `/for-employers` | Cryptographic verification and credential fraud prevention overview |
| **Training Provider Hub** | `/for-training-providers` | Longitudinal placement tracking and dynamic ROI methodology |
| **Government Policy Hub** | `/for-government` | Macro skilling analytics and district allocation architecture |
| **Workforce Analytics** | `/workforce-analytics` | Macro outcome metrics and retention intelligence overview |
| **Cryptographic Skill Passport** | `/skill-passport` | W3C verifiable credential specifications and SHA-256 HMAC proofs |
| **Public Ledger Verifier** | `/employer-verification` | Public credential hash verification tool (rate-limited) |
| **DPDP Compliance & Trust** | `/dpdp-trust` | DPDP Act 2023 compliance, data residency, and algorithmic fairness audit |

---

## 6. Environment Flags for Staging Deployments

| Variable | Recommended Production | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables strict HTTPS cookies, hides dev OTPs, and prevents mock auth bypasses. |
| `DEMO_MODE` | `false` | When set to `false`, `/api/v1/auth/demo-login` returns `404 Not Found`. |
| `JWT_SECRET` | *(32+ char high-entropy secret)* | Required in production. Weak/default keys will cause backend startup failure. |
| `CORS_ORIGIN` | `https://ryyvora.ai,https://www.ryyvora.ai` | Strict allowlist of authorized frontend web clients. |
