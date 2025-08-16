# TalentKonnect Monorepo – Web Developer Tech Assessment

**Integrated modules:** Qualification Gate · Daily Spotlight Dashboard · TalentKonnect Shell  
**Purpose:** Final integration/fix trial for Alatree Ventures Web Developer Tech Assessment.

> **Brand voice:** concise, helpful, action‑oriented.  
> **Colors:** Primary `#111827`, Action `#2563EB`, Success `#10B981`, Warn `#F59E0B`, Error `#EF4444`.  
> **Typography:** Inter (system fallback OK). Headings 28/20/16; body 14–16.  
> **Buttons:** `rounded-md`, 12–16px padding, visible focus ring.  
> **Accessibility:** WCAG AA contrast, ARIA labels for inputs, full keyboard nav.  
> **UI kit:** shadcn/ui (or equivalent), consistent toasts.

---

## Table of Contents
- [TalentKonnect Monorepo – Web Developer Tech Assessment](#talentkonnect-monorepo--web-developer-tech-assessment)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Features](#features)
    - [P0 – Must Fix (Completed)](#p0--must-fix-completed)
    - [P1 – High Priority (Completed)](#p1--high-priority-completed)
  - [Tech Stack](#tech-stack)
  - [Monorepo Structure](#monorepo-structure)
  - [Setup \& Installation](#setup--installation)
  - [Running Frontend \& Backend](#running-frontend--backend)
  - [Environment Variables](#environment-variables)
  - [API Endpoints \& Testing](#api-endpoints--testing)
    - [Quick Test (PowerShell `Invoke-RestMethod`)](#quick-test-powershell-invoke-restmethod)
    - [Endpoint Summary](#endpoint-summary)
  - [UI Verification](#ui-verification)
  - [Cron Jobs \& Automation](#cron-jobs--automation)
  - [Email Notifications](#email-notifications)
  - [Deployment (Staging)](#deployment-staging)
  - [Submission Checklist](#submission-checklist)
  - [Troubleshooting](#troubleshooting)
  - [License](#license)

---

## Project Overview
**TalentKonnect.com** connects clients and independent contributors for short, on‑demand tasks and services.  
This monorepo integrates the following modules into a single working build:

- **Qualification Gate** – Ensures contributors meet skill requirements before task access.  
- **Daily Spotlight** – Selects a **deterministic** daily winner (credit reward + email).  
- **Credit System** – Allocates and tracks user credits.  
- **TalentKonnect Shell** – Main application shell that hosts the above modules.

---

## Features

### P0 – Must Fix (Completed)
- ✅ Full integration of **Qualification Gate** and **Daily Spotlight** into **TalentKonnect Shell**.
- ✅ API calls return correct data and update UI **instantly** (optimistic UI where applicable).
- ✅ Forms include **validation** and **ARIA labels** for accessibility.
- ✅ **Daily Spotlight** cron job scheduled for **10:00 IST** with **deterministic** winner selection.

### P1 – High Priority (Completed)
- ✅ **Mobile‑responsive** UI across all pages.
- ✅ **Email notification** to spotlight winner + **credit allocation** logic.
- ✅ Fixed broken navigation/dead routes after integration.
- ✅ UI adheres to brand guidelines (see colors above).

---

## Tech Stack
**Frontend:** React (Vite), Tailwind CSS, shadcn/ui, TypeScript  
**Backend:** Node.js, Express  
**APIs:** REST (Express + body‑parser)  
**Validation:** Zod  
**Data/Fetch:** node‑fetch / fetch API  
**Charts:** Chart.js  
**Scheduling:** node-cron (or platform cron)  
**Email:** SMTP (e.g., Nodemailer)

---

## Monorepo Structure
```
talentkonnect-staging04/
├─ apps/
│  ├─ shell/                # TalentKonnect Shell (integrated UI)
│  ├─ qualification-gate/   # Module (mounted into shell)
│  └─ daily-spotlight/      # Module (mounted into shell)
├─ packages/
│  ├─ ui/                   # shared UI (shadcn components, themes, tokens)
│  ├─ api/                  # Express server (routes, services, cron, mailer)
│  └─ config/               # tsconfig, eslint, tailwind configs
├─ .env.example
├─ package.json
└─ README.md
```
> *Note:* Exact folders may differ slightly depending on the starter. The scripts below assume a single workspace with shared install.

---

## Setup & Installation
```bash
# 1) Clone the assessment monorepo
git clone https://github.com/vibhutisharma0408/talentkonnect-staging04.git
cd talentkonnect-staging04

# 2) Install dependencies (workspace aware)
npm install

# 3) Copy environment variables
cp .env.example .env
# then edit .env with your values (see next section)
```

---

## Running Frontend & Backend
```bash
# Run frontend & backend concurrently
npm run dev
```
- **Backend:** http://localhost:8888  
- **Frontend:** http://localhost:5173

Common alternative scripts:
```bash
npm run dev:api        # start Express API only
npm run dev:web        # start Vite web only
npm run build          # build all apps/packages
npm run preview        # preview built frontend
```

---

## Environment Variables
Create an `.env` file at the repo root with values like:
```
# Server
PORT=8888
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Emails (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=your_app_password
MAIL_FROM="TalentKonnect <no-reply@talentkonnect.com>"

# Spotlight / Credits
SPOTLIGHT_DAILY_HOUR_IST=10
SPOTLIGHT_DAILY_MINUTE_IST=0
CREDITS_DAILY_REWARD=50

# (Optional) Persistence
DATABASE_URL=file:./dev.db
```
> If deploying to Vercel/Netlify, set the same variables in the project dashboard.

---

## API Endpoints & Testing

### Quick Test (PowerShell `Invoke-RestMethod`)
**Qualification Gate**
```powershell
Invoke-RestMethod -Uri "http://localhost:8888/api/qualification/submit" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"skill":"JavaScript"}'
```

**Spotlight Entry**
```powershell
Invoke-RestMethod -Uri "http://localhost:8888/api/spotlight/enter" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"userId":"123"}'
```

**Credits Allocation**
```powershell
Invoke-RestMethod -Uri "http://localhost:8888/api/credits/allocate" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"userId":"123","credits":50}'
```

**Manual Cron Trigger**
```powershell
Invoke-RestMethod "http://localhost:8888/api/cron/spotlight"
```

### Endpoint Summary
| Method | Path                                   | Description                               |
|-------:|----------------------------------------|-------------------------------------------|
| POST   | `/api/qualification/submit`            | Submit skills; validate with Zod          |
| POST   | `/api/spotlight/enter`                 | Enter daily spotlight pool                 |
| POST   | `/api/credits/allocate`                | Allocate credits to a user                |
| GET    | `/api/cron/spotlight`                  | Manually run spotlight selection          |
| GET    | `/api/health`                          | Health check                              |

---

## UI Verification

1. **Forms & Validation**
   - Zod + UI errors shown inline
   - ARIA labels present for **all** inputs
   - Submit buttons reflect pending/success/error state

2. **Brand Colors**
   - **Primary:** `#111827`
   - **Action:** `#2563EB`
   - **Success:** `#10B981`
   - **Warn:** `#F59E0B`
   - **Error:** `#EF4444`

3. **Mobile Responsiveness**
   - Validate layouts on 320–768px width
   - Nav collapses; tap targets ≥44px; focus visible

4. **Navigation**
   - No dead routes; integrated modules accessible from Shell
   - Toasts consistent across flows

---

## Cron Jobs & Automation

- The **Daily Spotlight** is scheduled for **10:00 IST** every day.  
- Deterministic selection strategy can use a stable seed (e.g., date + salt) to pick the winner from that day’s entrants.
- Two ways to run:
  1) **In‑process cron** (e.g., `node-cron`) inside the API server.
  2) **Platform cron** (Vercel/Netlify scheduled functions or external scheduler) calling `/api/cron/spotlight`.

**Local manual run:**
```bash
# Will select the winner, allocate credits, and send email
curl http://localhost:8888/api/cron/spotlight
```

---

## Email Notifications

- When a daily winner is selected:
  - Credits are allocated (`CREDITS_DAILY_REWARD`)  
  - Email is sent using SMTP credentials:
    - **From:** `MAIL_FROM`
    - **To:** winner’s registered email
    - **Subject:** “TalentKonnect – Daily Spotlight Winner”
- Ensure SMTP values in `.env` are valid. For testing, you can use a sandbox SMTP (e.g., Mailtrap).

---

## Deployment (Staging)

1. **Create a new Vercel/Netlify project** and connect the GitHub repo.  
2. **Set environment variables** in the dashboard (mirror `.env`).  
3. **Build Commands** (examples):
   - Frontend: `npm run build` (Vite)
   - API: Deploy as serverless/functions or a Node server (adapter depends on setup)
4. **Ensure routes** for API are accessible under `/api/*`.  
5. **Cron:** Use platform scheduler calling `/api/cron/spotlight` at `10:00 Asia/Kolkata` daily.

**Submission requires:**
- One **live staging URL** (Vercel/Netlify) with all functions operational.
- One **GitHub PR URL** with modules merged.

---

## Submission Checklist

- [ ] ✅ **Single GitHub repo** with merged, working modules  
- [ ] 🌐 **Single live staging URL** shared in the email  
- [ ] ⏱️ **Cron at 10:00 IST** verified (logs or manual trigger)  
- [ ] 📨 **Email notifications** tested (winner + credits)  
- [ ] ♿ **Forms accessible** (ARIA, validation, keyboard)  
- [ ] 📱 **Mobile responsive** on all key pages  
- [ ] 🧭 **Navigation intact**; no dead routes  
- [ ] 🎨 **Brand colors** applied across UI  

---

## Troubleshooting

- **“CORS error”** → Ensure `CORS_ORIGIN` matches the frontend URL.  
- **Emails not sending** → Verify SMTP host/port/user/pass; check spam folder.  
- **Cron not firing on platform** → Confirm timezone is **Asia/Kolkata (IST)**; use platform scheduler logs.  
- **404 on integrated routes** → Rebuild, verify module mounts in Shell router.  
- **Validation not showing** → Confirm Zod schema binding and error render path.  

---

## License
This repository is for **Alatree Ventures Tech Assessment** usage only. Do not redistribute without permission.
