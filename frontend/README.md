# 🖥️ Ryyvora AI — Frontend Application

Next.js 15 App Router frontend client for **Ryyvora AI**, the verifiable longitudinal skilling and outcome intelligence platform for the Government of Maharashtra.

[![Next.js](https://img.shields.io/badge/Next.js-15.x-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📌 Architecture & Design System

The frontend is crafted in modern **Obsidian Gold / Deep Space Cyberpunk** design tokens:
- **Design Tokens**: `card-linear`, `card-accent`, `btn-gold`, `btn-secondary`, `AIBadge`, `FadeIn`, and `ErrorBoundary`.
- **Theme Accents**: Primary Gold (`#D4A843` / `var(--gold)`), Emerald Verification (`#10B981`), Sapphire Telemetry (`#60A5FA`), and Crimson Alerts (`#EF4444`).
- **Responsive Animations**: Micro-interactions powered by CSS transitions and Framer Motion / Canvas Confetti.

---

## 👥 6-Stakeholder Dashboard Matrix

### 1. 🏛️ State Government (`/government`)
- `/government` — Maharashtra skilling intelligence cockpit, 9-stage conversion funnel, wage curves.
- `/government/heatmap` — Interactive 36-district telemetry matrix, metric layers, and inspection drawer.
- `/government/compliance` — NSQF, DPDP Act 2023, and IEEE 7000 regulatory audit runner.
- `/government/fund-targeting` — Neural ROI allocation simulator with interactive budget sliders (₹10 Cr – ₹500 Cr).
- `/government/news` — Official Maharashtra skilling policy & government gazette intelligence wire.

### 2. 🎓 Training Institute (`/institute`)
- `/institute` — Multi-institution preset switcher (*Govt Polytechnic Pune, VJTI Mumbai, GCE Nagpur*), batch passport minter.
- `/institute/students` — Student roster with candidate profile modals, SHA-256 passport inspection, enrollment form.
- `/institute/evaluations` — 4-axis NCVET practical project rubric grading modal and cryptographic ledger commitment.
- `/institute/roi` — Vocational wage impact simulator (18.3x–27.5x ROI) and fiscal dossier generator.

### 3. 💼 Hiring Employer (`/employer`)
- `/employer` — Pre-assessed candidate recruiter cockpit with 1-click SHA-256 hash verifier.
- `/employer/validations` — Cryptographic HMAC signing queue for candidate employment outcome claims.
- `/employer/placements` — Verified placement registry and campus recruitment drive management suite.
- `/employer/feedback` — Candidate performance reviews with ratings across technical execution, problem solving, and PPO filters.

### 4. 🏭 Sector Skill Council & Industry Radar (`/industry`)
- `/industry` — Sector Skill Council demand vs supply gap radar and NOS qualification packs matrix.
- `/industry/talent` — Pre-assessed technical talent pool with GitHub code audit scores and interview dispatch.
- `/industry/campus` — Campus recruitment drive partnership desk and scheduling suite.
- `/industry/demand` — Real-time demand signals and 24-month wage projection area charts.
- `/industry/news` — Corporate hiring alliances, MSDE stipend co-funding regulations, and DPDP advisory feed.

### 5. 🛡️ State Administrator (`/admin`)
- `/admin` — System operations cockpit with 1-click security audit scanner.
- `/admin/users` — Multi-role user identity provisioning and access governance registry.
- `/admin/fairness` — IEEE 7000 algorithmic fairness, demographic parity, and 80% 4/5ths disparate impact telemetry.
- `/admin/audit-logs` — Tamper-evident append-only cryptographic system event stream.
- `/admin/institutes` — Institutional accreditation and NSQF tier calibration desk.
- `/admin/reports` — Executive state census compiler and gazette dossier exporter.

### 6. 🎓 Student & Trainee (`/student`)
- `/student/journey` — Longitudinal career milestone timeline (Enrollment $\to$ Placement $\to$ 365d retention).
- `/student/analyzer` — Diagnostic skill analyzer with 6-axis radar scoring and curriculum recommendations.
- `/student/passport` — QR-verifiable SHA-256 cryptographic digital skill passport.

---

## 🚀 Running Locally

```bash
# From frontend directory
cd frontend

# Install dependencies
npm install

# Start development server (Port 5173 / Next.js default)
npm run dev

# Run TypeScript compilation verification
npx tsc --noEmit
```

---

## 🌐 Environment Configuration (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:5173
```
