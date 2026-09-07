# 🤝 Ryyvora AI Contribution Guidelines

This document establishes the official engineering workflow for **Ryyvora AI** to ensure code quality, proper contributor attribution, and seamless continuous deployment on our **Vercel Hobby** infrastructure.

---

## 🔒 Important Notice on Production Deployments

The repository owner (`TrikamDevasi`) maintains the production hosting on **Vercel Hobby**. 

> [!WARNING]
> **Do NOT push directly to the `main` branch.**
> 
> Because this is a private repository on a Vercel Hobby plan, Vercel strictly blocks automated deployments if a commit pushed directly to `main` is authored by any account other than the repository owner (`TrikamDevasi`).
> 
> Error encountered when teammates push directly to `main`:
> ```
> "The deployment was blocked because the commit author did not have contributing access to the project on Vercel."
> "The Hobby Plan does not support collaboration for private repositories."
> ```
> 
> **Never modify commit author identities to bypass this restriction.** All team members must retain full, genuine Git attribution for their work. Instead, follow the standard Pull Request and Owner-Controlled Deployment workflow below.

---

## 🌿 Standard Git Feature Workflow

All team members must follow this feature branch workflow:

### 1. Sync Your Local `main` Branch
Before beginning any new work, ensure your local repository is up to date:
```bash
git checkout main
git pull origin main
```

### 2. Create a Feature Branch
Create a descriptive feature branch prefixed with `feature/`, `fix/`, or `refactor/`:
```bash
git checkout -b feature/<feature-name>

# Examples:
# git checkout -b feature/employer-feedback-modal
# git checkout -b fix/mobile-layout-overflow
```

### 3. Develop & Test Locally
Implement your changes while preserving all existing functionality and test suites:
```bash
# Run tests to ensure all invariants pass
cd frontend
npm test

# Verify local build succeeds
npm run build
```

### 4. Commit Your Work with Proper Attribution
Commit your changes using your own authentic Git identity:
```bash
git add -A
git commit -m "feat(scope): brief description of change"
```

### 5. Push Feature Branch to GitHub
Push your branch to GitHub:
```bash
git push -u origin feature/<feature-name>
```

### 6. Open a Pull Request (PR)
1. Go to the GitHub repository: `https://github.com/TrikamDevasi/RyyvoraAi`
2. Click **Compare & pull request**.
3. Select base: `main` ◄ compare: `feature/<feature-name>`.
4. Provide a clear summary of changes, tested scenarios, and screenshots/recordings if UI was modified.
5. Request review from the repository owner (`TrikamDevasi`).

---

## 👑 Repository Owner Workflow (Review & Deployment)

1. **Review Code**: The repository owner inspects the PR diff, verifies tests, and ensures design system and security guidelines are upheld.
2. **Merge PR**: The repository owner merges the Pull Request into `main`.
3. **Production Deployment**:
   - **Automated (via GitHub Actions)**: The configured `.github/workflows/deploy.yml` workflow triggers on push to `main` and deploys using the Owner's Vercel token stored in repository secrets.
   - **Local CLI (Fallback)**: Alternatively, the repository owner pulls the merged `main` locally and executes:
     ```bash
     git checkout main
     git pull origin main
     cd frontend
     npx vercel --prod
     ```

---

## 🛡️ Best Practices & Quality Standards
- **No Direct Pushes to `main`**: All changes to `main` must arrive via Pull Requests.
- **No Secrets in Git**: Never commit `.env.local`, API keys, or Vercel tokens.
- **Genuine Author Attribution**: Never rewrite author headers or use someone else's email to disguise commit authorship.
- **Preserve Existing Functionality**: Verify that all 15 automated integration tests (`npm test`) pass before opening a PR.
