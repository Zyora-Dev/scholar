# 🇮🇳 TRIBAL SAKSHAM AI
### *"From Scholarship Discovery to Successful Disbursement"*

**Problem Statement ID:** SIH26239  
**Ministry:** Ministry of Tribal Affairs (MoTA)  
**Theme:** Smart Education | **Category:** Software  

---

## 🌟 Executive Summary

Scheduled Tribe (ST) students across India frequently face systemic hurdles: navigating fragmented portals, confusing eligibility criteria, stringent document specifications, minor phonetic spelling variations, opaque rejection loops, and missed renewal windows.

**TRIBAL SAKSHAM AI** transforms this experience from a passive scholarship directory into an **end-to-end AI lifecycle guardian**. It proactively guides ST students through every single stage:

$$\text{Discovery} \longrightarrow \text{Eligibility} \longrightarrow \text{Document Vault} \longrightarrow \text{Readiness Check} \longrightarrow \text{Smart Wizard} \longrightarrow \text{Institution Scrutiny} \longrightarrow \text{Application Rescue} \longrightarrow \text{DBT Disbursement} \longrightarrow \text{Renewal Guardian} \longrightarrow \text{Career Opportunities}$$

---

## 🚀 Key Differentiators & Core Pillars

### 1. 🛡️ Application Rescue Center (*The Big Differentiator*)
- In traditional portals, an institutional or departmental return is a dead end that leads to dropout.
- Saksham AI's **Rescue Center** translates bureaucratic return notices into plain language, explains the exact correction required, and provides a direct **"Fix & Resubmit"** workflow with an active countdown clock.
- Seeded with real scenario: Indhira Iyappan's National Overseas Scholarship returned for income certificate renewal, rectified and resubmitted in 1 click.

### 2. 🔍 Explainable AI Eligibility Engine
- Calculates percentage match scores (0–100%) against multi-criteria rules (income ceiling, community, academic score, domicile).
- Categorizes rules into **Eligible Criteria**, **Missing Items**, and **Potential Roadblocks**.
- **Governance Safety Guarantee:** Prominently displays official disclaimers confirming that final decisions rest exclusively with designated government authorities.

### 3. 📂 Document Intelligence Vault with Spelling Mismatch Tolerance
- OCR & metadata extraction analyzes certificates before submission.
- **Fuzzy Levenshtein Distance Matching:** Detects phonetic variations (e.g., `Indhira Iyappan` on Aadhaar vs `Indhira Iyyappan` on Income Certificate).
- **Golden Rule:** Never automatically rejects; flags as *Requires Review* and prepares a correction guidance banner.

### 4. 🚦 Pre-Submission Gatekeeper (Readiness Score)
- Computes a holistic readiness score (0–100%) across Profile, Documents, Eligibility, and Form completeness.
- Distinguishes **Blocking Errors** (e.g., missing ST certificate) from **Advisory Warnings** (e.g., recommended bonafide seal verification).

### 5. 🔁 Renewal Guardian
- Tracks ongoing multi-year scholarships and alerts students **30, 15, and 7 days** before the renewal portal closes.
- Validates year-over-year continuity conditions (minimum 75% attendance, passing marks) to prevent mid-degree funding lapses.

### 6. 🌐 Low-Bandwidth Mode & Offline Drafts
- Designed for tribal hamlets and remote hill districts with 2G/3G connectivity.
- Disables heavy images, optimizes font rendering, and automatically caches wizard drafts in local storage.

### 7. 🗣️ Multilingual & Voice-Assisted Interface
- Fully localized in **English**, **தமிழ் (Tamil)**, and **हिंदी (Hindi)**.
- Voice Speech-to-Text (STT) and Audio Text-to-Speech (TTS) readback for students who prefer auditory guidance.

---

## 👥 4 User Roles & 1-Click Demo Logins

The application features complete Role-Based Access Control (RBAC). On the Login page or top navigation bar, use the **1-Click Demo Login** buttons:

| Role | Demo Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **ST Student** | `student@demo.saksham.gov.in` | `Demo@123` | Discovery, Eligibility, Vault, Wizard, Tracking, Rescue Center, Renewal |
| **Institution Nodal Officer** | `institution@demo.saksham.gov.in` | `Demo@123` | Scrutiny Queue, Student Verification Checklist, Recommend / Return |
| **State / Central Admin** | `admin@demo.saksham.gov.in` | `Demo@123` | Real-time Analytics, Regional Map, AI Anomaly Flags, Audit Logs |
| **Super Admin** | `superadmin@demo.saksham.gov.in` | `Demo@123` | Master Data Manager (Add States, Tribal Districts, Scheme Rules dynamically) |

---

## 🧭 Step-by-Step Hackathon Evaluation Flow (5 Mins)

1. **Discovery & Eligibility (Student):**
   - Navigate to `http://localhost:5173` and click **"Demo: ST Student"**.
   - Open **Scholarships** to view verified schemes with `VERIFIED` and `DEMO` badges.
   - Run the **AI Eligibility Engine** to see the 97% match score breakdown with transparent explanations.

2. **Document Vault & Fuzzy Mismatch Detection:**
   - Go to **Document Vault**. Notice the warning banner on the Income Certificate:
     *`Phonetic variation detected: 'Indhira Iyappan' vs 'Indhira Iyyappan'`*.
   - Click "Upload Document" to test live client-side validation.

3. **Application Rescue Center (Key Differentiator):**
   - Go to **Application Rescue Center** (marked with a red badge in the sidebar).
   - See the returned application for the *National Overseas Scholarship*.
   - Read the Nodal Officer remarks, attach the endorsed certificate, and click **"Fix & Resubmit to Institution"**.

4. **Institution Scrutiny (Nodal Officer):**
   - Click **"Demo: Institution"** in the top navigation bar.
   - Open the **Verification Queue**. Click on the student application.
   - Review the AI pre-scrutiny signal, inspect the scrutiny checklist, and click **"Recommend for Department Approval"**.

5. **State Analytics & Anomaly Detection (Admin):**
   - Click **"Demo: State Admin"**.
   - View the interactive charts: Application status ratios, Monthly sanction trends, State demand breakdown.
   - Open **Tribal Region Map** to explore geographic clusters across Nilgiris, Mayurbhanj, Bastar, Ranchi, etc.
   - Open **AI Anomaly Flags** and **Immutable Audit Logs** to verify end-to-end transparency.

6. **Dynamic Master Data Management (Super Admin):**
   - Click **"Demo: Super Admin"** and navigate to **Master Data & Rules**.
   - Add a new state, tribal district, or scheme rule dynamically without editing source code.

---

## 🛠️ Architecture & Tech Stack

```
tribal-saksham-ai/
├── client/                     # Vite + React 18 Single Page Application
│   ├── src/
│   │   ├── components/         # Badges, Navbar, Sidebar, SakshamAiDrawer (STT/TTS)
│   │   ├── contexts/           # Auth, Language (en/ta/hi), Low-Bandwidth, Accessibility
│   │   ├── pages/
│   │   │   ├── student/        # Discovery, Detail, Eligibility, Vault, Wizard, Rescue, Renewal
│   │   │   ├── institution/    # Verification Queue & Scrutiny modal
│   │   │   ├── admin/          # Analytics (Recharts), Region Map (Leaflet), Flags, Audit
│   │   │   └── superadmin/     # Dynamic Master Data & Scheme Rule Manager
│   │   ├── services/api.ts     # Centralized Axios API client with bearer interceptor
│   │   └── types/index.ts      # Shared TypeScript domain contracts
│   ├── index.html
│   ├── tailwind.config.js      # Saffron (#E85D26) & Tribal Green (#1B6B3A) theme
│   └── vite.config.ts          # Reverse proxy config to backend
│
└── server/                     # Node.js + Express + TypeScript Backend
    ├── src/
    │   ├── config/index.ts     # Port 5000, JWT secrets, AI mode toggles
    │   ├── routes/api.ts       # RESTful API endpoints for all modules
    │   ├── services/
    │   │   ├── store.ts        # In-memory reactive store (Pre-seeded Pan-India data)
    │   │   ├── eligibilityEngine.ts     # Match scoring & transparent rule evaluator
    │   │   ├── documentIntelligence.ts  # Levenshtein mismatch analyzer
    │   │   ├── preSubmissionService.ts  # Readiness score & blocking error check
    │   │   ├── aiService.ts             # Grounded multilingual assistance
    │   │   └── auditService.ts          # Append-only immutable audit trail
    │   └── index.ts            # Express server initialization
```

---

## 🏃 Running the Application Locally

### Render Deployment

See [DEPLOY_RENDER.md](DEPLOY_RENDER.md) for the separate Render API and static-site setup, configuration, verification and limitations. The root [render.yaml](render.yaml) defines both services. GitHub Actions checks builds; it no longer deploys GitHub Pages.

**Demo-only warning:** the current backend uses mock authentication and in-memory records. Passwords are not verified and demo role switching is public; the role descriptions above are not a production RBAC guarantee. Do not use real student data or documents.

### Prerequisites
- Node.js LTS (v18+)

### 1. Start the Backend Server
```powershell
cd server
npm install
npm run dev
# Running on http://localhost:5000
```

### 2. Start the Frontend Client
```powershell
cd client
npm install
npm run dev
# Running on http://localhost:5173
```

---

## ⚖️ Safety & Compliance Commitments
- **Zero Hallucinated Claims:** All demo schemes and entities carry clear `DEMO` and `VERIFIED` visual tags.
- **Fairness & Non-Discrimination:** AI assists in discovery, readiness scoring, and phonetic spelling reconciliation; it never makes arbitrary or automated rejection decisions.
- **Auditability:** Every document upload, scrutiny action, resubmission, and approval creates an unalterable audit log entry.
