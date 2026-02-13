# MerisLabs Legal: Platform Strategy & Architecture

## 1. Executive Summary

MerisLabs Legal is transitioning from a "Custom Reports Agency" to a "SaaS Platform" similar to Norebase. The goal is to provide a single, unified interface for Law Firms (e.g., JEE) and Enterprises (e.g., Union Bank) to manage compliance, view intelligence reports, finding lawyers, and access legal tools.

## 2. Competitive Feature Set (The "Norebase" Parity)

Based on Norebase's public offerings, MerisLabs Legal should implement the following modules:

### A. Core Modules
| Module | Description | Implementation Status |
| :--- | :--- | :--- |
| **AutoComply (Compliance)** | Automated tracking of regulatory obligations, deadlines, and risk status. | **Target** (High Value) |
| **Incorporation Engine** | Digital rails for company registration (Africa, US, UK, BVI). | **Planned** |
| **IP Management** | Dashboard for trademarks, patents, and intellectual property assets. | **Planned** |
| **Tax & Filings** | Document upload and status tracking for tax returns. | **Planned** |

### B. Strategic Additions
| Module | Description | Implementation Status |
| :--- | :--- | :--- |
| **Lawyer Directory** | A curated, searchable directory of vetted lawyers and law firms. | **Immediate Win** |
| **Litigation Intelligence** | Interactive dashboards transforming case files into strategic data (e.g., Union Bank Report). | **MVP Live** |

## 3. Recommended Architecture: The "Platform of Platforms"

To manage complexity while ensuring scalability, we will leverage the existing **Monorepo** structure (`merislabs-official`).

### A. The Structure
Instead of separate fragmented sites, we consolidate under a unified "Identity Layer".

```bash
merislabs-official/
├── apps/
│   ├── legal/               # THE MOTHERSHIP (SaaS Platform)
│   │   ├── src/app/
│   │   │   ├── (auth)/      # Unified Login/Signup (NextAuth.js)
│   │   │   ├── dashboard/   # The Main "AutoComply" Interface
│   │   │   ├── directory/   # The Lawyer Directory (Public/Private)
│   │   │   ├── library/     # Legal Library (Acts, Gazettes)
│   │   │   └── reports/     # Secure Client Reports (e.g., JEE/Union Bank)
│   │
│   ├── compass/             # SPECIALIZED TOOLS (Ecobank Compass)
│   │   # Can be developed here but deployed as 'compass.merislabs.com'
│   │   # SHARES authentication with 'legal' app.
│   │
│   └── web/                 # Landing Page (Marketing Site)
│
└── packages/
    ├── ui/                  # Shared Design System (Buttons, Navbars)
    ├── auth/                # Shared Session Logic
    └── db/                  # Shared Database Schema
```

### B. Consolidate vs. Link?
**Verdict: Consolidate Code, Segment Access.**
*   **Why**: A single `apps/legal` codebase allows you to share components, styles, and-most importantly-**User Sessions**.
*   **User Experience**: A user logs in *once* to MerisLabs. They can then click "Compass" or "Reports" without needing new credentials.

## 4. Immediate Roadmap (Next 4 Weeks)

### Phase 1: The Identity Layer (Security)
*   **Action**: Implement **NextAuth.js** in `apps/legal`.
*   **Goal**: Secure the "Union Bank Report" and future dashboards behind a login.
*   **Quick Win**: Use a "Credentials Provider" (email/password) initially, then move to DB.

### Phase 2: The Directory (The "Network Effect")
*   **Action**: Build `apps/legal/src/app/directory/page.tsx`.
*   **Goal**: Create a visually stunning, searchable list of lawyers.
*   **Content**: Start with JEE partners/associates as the seed data.

### Phase 3: The Dashboard (The "Product")
*   **Action**: Transform the static "Union Bank Report" into a dynamic `/dashboard/union-bank`.
*   **Goal**: Show "Live" data:
    *   *Upcoming Deadlines (AutoComply)*
    *   *Risk Heatmap*
    *   *Filings History*

## 5. Technical Directives for Developers

1.  **URL Structure**:
    *   Use: `legal.merislabs.com/reports/[firm]/[client]/[project]`
    *   Avoid: `.../union-bank-report-1` (Flat structures are tech debt).

2.  **Authentication**:
    *   All `/dashboard/*` and `/reports/*` routes MUST be protected by Middleware.
    *   Public routes: `/`, `/library`, `/directory` (optional).

3.  **Data Strategy**:
    *   Start with hardcoded JSON data (Content Layer).
    *   Migrate to a real Database (Postgres/Prisma) only when user-generated content (e.g., "Add Company") is required.
