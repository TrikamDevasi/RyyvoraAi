# SkillSense AI — Official Evaluator Demonstration & Click-Through Guide
**Smart India Hackathon 2024 / 2026 — Problem Statement SIH26135**
*Theme: "Difficulties in tracking employment outcomes, skill gaps, and the impact of skilling initiatives."*

---

## 1. Quick Start & Evaluation Credentials

All roles are pre-seeded with rich longitudinal data across 9 Maharashtra districts (125 trainees, longitudinal milestone timelines, 30d/90d/180d/365d follow-ups, and SHA-256 verifiable Skill Passports).

### Pre-Configured Demo Credentials (Password: `Demo@1234` for all):
| Role | Demo Email | Persona & Entity | Key Capability to Inspect |
| :--- | :--- | :--- | :--- |
| **Trainee / Student** | `trainee@skillsense.demo` | **Aarav Deshmukh** (MSSDS Trainee) | Longitudinal Career Journey, Self-Report, SHA-256 Passport |
| **Employer** | `employer@skillsense.demo` | **Tata Consultancy Services (TCS)** | Placement Claims Queue, Verify/Reject Claims, IDOR Guard |
| **Training Institute**| `provider@skillsense.demo`| **MSSDS Pune Regional Center** | 120 Trainee Roster, Enroll Student, Grade Capstone, Dynamic ROI |
| **Government** | `government@skillsense.demo`| **Maharashtra Skilling Directorate** | 9-District Macro Telemetry, Retention Curves, AI Policy Copilot |
| **Industry / SSC** | `employer@skillsense.demo` | **Sector Skill Council Intelligence Lead** | Hiring Demand Signals, Campus Recruitment Directory |
| **System Admin** | `admin@skillsense.demo` | **SkillSense Chief Administrator** | Four-Fifths Fairness Audit, Tamper-Proof Audit Trail |

> **One-Click Instant Login:** On the `/auth` login screen, click any of the **"One-Click Demo Personas"** buttons (Student, Employer, Institute, Government, Admin) to immediately sign in without typing passwords.

---

## 2. Recommended 5-Minute Evaluator Journey

### Step 1: Trainee Longitudinal Journey & Cryptographic Passport (2 minutes)
1. Navigate to `/auth` and click **"Demo Student"** (signs in as `trainee@skillsense.demo`).
2. Visit **Longitudinal Journey** (`/student/journey`):
   - Observe the 5 verified milestone stages: *Enrolled* -> *Certified (NSQF Level 5)* -> *Placed at TCS* -> *90-Day Retention Verified* -> *365-Day Continuous Employment*.
   - Notice the confidence scores and cryptographic ledger hashes.
3. Visit **Verifiable Skill Passport** (`/student/passport`):
   - View the state-certified digital credential with QR code and cryptographic hash `0x8f4c2e91...`.
   - Click **"Verify Authenticity"** (`/verify/0x8f4c2e91b5a3d76e48c10927fa118239cb72e01a`) to observe client-side and server-side SHA-256 verification passing with 100% integrity.
4. Visit **Employment Self-Report** (`/student/profile` or `/student/journey`):
   - Submit a placement self-report entering employer as `"Tata Consultancy Services"`.
   - The backend `outcomeService.resolveEmployerId` normalizes the name and automatically links the claim to TCS's verification queue.

---

### Step 2: Employer Verification & Claims Ledger (1.5 minutes)
1. Logout and click **"Demo Employer"** (signs in as `employer@skillsense.demo` — Tata Consultancy Services).
2. Visit **Placement Validations** (`/employer/validations`):
   - Notice the **PENDING CLAIMS** queue populated with seeded TCS trainees and new self-reports.
   - Click **"Verify Employment"**: verify starting salary, employment type, and add verification notes.
   - Click submit: observe the status transition to `VERIFIED`, confidence updating to `0.96`, and a formal milestone added to the trainee's longitudinal timeline.
   - Switch to the **"VERIFIED"** tab to see historical confirmed placements.
   - *Security Check:* Notice that claims from other companies (e.g. Infosys, Bajaj Auto) are strictly hidden via tenant isolation (`query.employerId = user._id`).

---

### Step 3: Government Directorate Macro Telemetry & AI Policy Copilot (1.5 minutes)
1. Logout and click **"Demo Government"** (signs in as `government@skillsense.demo` — Maharashtra Skilling Directorate).
2. Visit **Macro Analytics & Heatmap** (`/government` and `/government/heatmap`):
   - View the 9-stage longitudinal funnel across Maharashtra districts: Enrolled (125) -> Trained -> Certified -> Placed -> 30d -> 90d -> 180d -> 365d -> Retained (100%).
   - Observe district wage progression curves and retention charts.
   - Notice the **DPDP Privacy Guard**: districts with small samples (< 5 trainees) are automatically protected to prevent trainee re-identification.
3. Visit **AI Policy Copilot** (`/government` widget):
   - Ask: *"Which district has the highest 90-day retention rate and what are the primary attrition factors?"*
   - Observe the response: grounded strictly in MongoDB evidence with cited database metrics, zero hallucinated facts, and clear policy recommendations.

---

### Step 4: Training Institute Management, Capstone Grading & Dynamic ROI (1 minute)
1. Logout and click **"Demo Institute"** (signs in as `provider@skillsense.demo` — MSSDS Pune Regional Center).
2. Visit **Student Roster** (`/institute/students`):
   - View the 120 enrolled students with enrollment numbers, programs, and NSQF levels.
   - Click **"Enroll Candidate"**: fill in candidate name, email, program, and NSQF level.
   - Click submit: candidate is enrolled and a verifiable SHA-256 Skill Passport is generated instantly.
3. Visit **Project Evaluations** (`/institute/evaluations`):
   - Click **"Evaluate Trainee Project"**: select an enrolled student, choose project category (*Full-Stack Capstone Project*).
   - Adjust the **4-Axis NCVET Rubric sliders**: Practical Implementation, Domain Knowledge, Code Quality, Viva Presentation.
   - Click submit: evaluation is recorded on the ledger, candidate score is updated, and verifiable credential is re-certified.
4. Visit **Institutional ROI** (`/institute/roi`):
   - Observe the dynamic longitudinal ROI multipliers calculated from real placed wages versus state standard training costs (₹25,000 unit cost norm).
   - Notice the **Statistical Safeguard**: cohorts with insufficient placement data (< 3 placed) display an explicit `"Insufficient Data (N < 3 Placed)"` badge rather than fabricating numbers.
   - Use the **Interactive Cohort Fiscal Yield Simulator** to model prospective batch sizes, wage rates, and projected economic multipliers.

---

### Step 5: SaaS Demo Billing & Administration (30 seconds)
1. Visit **Settings > Billing & Subscription** (`/settings/billing`):
   - Notice the active subscription loaded directly from the backend `DemoBillingProvider`.
   - Click **"Change Plan"** to upgrade to Growth or Enterprise. The backend executes the plan transition, stores state in MongoDB `subscriptions`, and enforces server-side feature entitlements.
2. Logout and click **"Demo Admin"** (`admin@skillsense.demo`):
   - Visit **Fairness & Disparate Impact** (`/admin/fairness`): inspect the 80% Four-Fifths disparate impact audit comparing gender and district placement parity.
   - Visit **Audit Logs** (`/admin/audit-logs`): inspect the immutable audit trail recording all verification actions, evaluations, and logins.

---

## 3. Automated Test Verification

Evaluators can execute the automated test suites in terminal:

### Backend Automated Test Runner (11 Suites):
```bash
cd backend
npm test
```
**Output:**
- `runAuthTests` (Registration, login, password hashing, JWT validation)
- `runAuthorizationTests` (Role-based access control across 6 roles)
- `runFairnessTests` (Four-fifths disparate impact calculation)
- `runAITests` (Multi-provider fallback, Zod schema validation, honest rate-limit handling)
- `runOutcomeTests` (Macro funnel, wage progression curve, retention calculation)
- `runEmployerVerificationTests` (Claims isolation, IDOR guards, transition integrity)
- `runPolicyCopilotTests` (Database grounding, prompt injection resistance)
- `runBillingTests` (Entitlement limits, checkout schema, demo billing provider)
- `runSecurityTests` (Rate limiting, CORS allowlist, helmet headers, no client secrets)
- `runInstituteE2ETests` (Student enrollment, project evaluations, dynamic ROI guards)
- `runIntegrationTests` (Express HTTP route integration, mass assignment protection)
- **Result: 11/11 PASSED (100%)**

### Frontend Automated Test Runner (5 Suites):
```bash
cd frontend
npm test
```
**Output:**
- Institute ID priority and null-safety resolver
- Demo credentials alignment with MongoDB seeder
- Billing tier pricing and annual discount invariants
- Dynamic ROI sample size threshold guards ($N < 5$, placed $< 3$)
- Cryptographic Skill Passport hash format structure
- **Result: 5/5 PASSED (100%)**
