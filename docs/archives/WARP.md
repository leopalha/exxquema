# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**FLAME Lounge** is a full-stack platform for a lounge bar, gastronomy and narguilé/tabacaria in Botafogo, RJ. It connects **clients, staff and management in real-time** for orders, reservations, narguilé sessions, payments, inventory and loyalty.

**Tech Stack (current):**
- **Frontend:** Next.js 14 (React 18), Tailwind CSS, Zustand, Socket.IO client, next-pwa
- **Backend:** Node.js/Express, Sequelize ORM, Socket.IO server, node-cron
- **Database:** PostgreSQL (production via Railway), SQLite (local dev)
- **Deployment:** Frontend on Vercel, Backend on Railway
- **External Services:** Stripe (payments), Twilio (SMS), Web Push, Google OAuth

> Older docs sometimes mention the name **Exxquema**, ports `3000/3001` and a **points-based** loyalty system. The codebase has been migrated to **FLAME**, **port 5000 backend**, and a **cashback in R$** system. Treat points-only references as legacy.

## Canonical Documentation

Key design/architecture docs live in `docs/` and should be treated as source-of-truth for domain behavior:

- `docs/01_CONCEITO_FLAME.md` – Brand concept, tone of voice, positioning.
- `docs/02_DESIGN_SYSTEM.md` – Design tokens (colors, typography, spacing, shadows, animations) and Tailwind setup.
- `docs/03_PRD.md` – Product requirements (modules: Cliente, Staff, Estoque, CRM, Fidelidade, Narguilé, Reservas, Caixa).
- `docs/04_USER_FLOWS.md` – ASCII-diagram user flows (QR/matrix flows, balcão, reservas, narguilé, cashback).
- `docs/05_TECHNICAL_ARCHITECTURE.md` – High-level technical architecture, data models and REST API surface.
- `docs/06_ACTIVATION_PROMPT.md` – Project-specific rules for agents (design system, priorities, conventions).
- `docs/07_DEV_BRIEF.md` – Dev quickstart, naming conventions, git workflow, envs, scripts.
- `docs/08_COMPONENT_LIBRARY.md` – Intended React component library (common/layout/customer/staff/admin components).
- `docs/09_CASHBACK_SYSTEM.md` – Canonical description of the cashback-based loyalty system (tiers, API, UX).
- `docs/10_CONTEUDO_PAGINAS.md` – Copy for marketing/content pages (`/historia`, `/conceito`, `/programacao`, footer).
- `docs/tasks.md` – Project status, production URLs, env vars, and **known issues/roadmap** (e.g. order-status fixes).

When behavior seems unclear in the code, check these docs first, then align implementation with current code + `tasks.md`.

## Project Structure

```text
D:\flame\
├── frontend/          # Next.js PWA (public + staff + admin)
│   ├── src/
│   │   ├── pages/           # Next.js pages (routing)
│   │   ├── components/      # Reusable React components (see docs/08_COMPONENT_LIBRARY.md)
│   │   ├── stores/          # Zustand state stores
│   │   ├── services/        # API client (axios), socket, push, etc.
│   │   ├── hooks/           # Custom React hooks
│   │   ├── data/            # Mock data (e.g. mockData.js)
│   │   ├── context/         # React contexts
│   │   ├── styles/          # Global & component styles
│   │   └── utils/           # Formatters, validators, constants
│   ├── public/              # Static assets, PWA files, service workers
│   └── package.json
│
├── backend/           # Express API + Socket.IO + jobs
│   ├── src/
│   │   ├── server.js        # Main entry point (Express + Socket.IO + jobs)
│   │   ├── config/          # Database, etc.
│   │   ├── models/          # Sequelize models (User, Product, Order, etc.)
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # Express routes (REST API)
│   │   ├── services/        # Business logic (socket, payments, notifications...)
│   │   ├── middlewares/     # Auth, validation, rate-limit, error handling
│   │   ├── jobs/            # Scheduled tasks (reservations, reports, etc.)
│   │   ├── migrations/      # DB migrations
│   │   ├── scripts/         # One-off scripts (user creation, migrations, seeds)
│   │   └── __tests__/       # Jest tests
│   └── package.json
│
└── package.json       # Root package (concurrently scripts)
```

## Development Commands

### Initial Setup

```powershell
# From repo root
npm run install:all   # installs root, then frontend, then backend

# Or manually
cd frontend; npm install
cd ../backend; npm install
```

### Running Development Servers

> Some older docs describe `frontend:3001` / `backend:3000`. Current dev setup is **frontend:3000** and **backend:5000**.

**From root (recommended):**
```powershell
npm run dev           # runs frontend and backend via concurrently
```

**Separately:**
```powershell
# Frontend (Next.js)
cd frontend
npm run dev           # http://localhost:3000

# Backend (Express)
cd backend
npm run dev           # http://localhost:5000 (API base)
```

### Frontend Scripts

```powershell
cd frontend

npm run dev           # Next.js dev
npm run build         # Production build
npm start             # Start production server

npm run lint          # ESLint
npm run cypress       # Open Cypress UI
npm run cypress:run   # Headless Cypress
npm run e2e           # Start dev + run Cypress tests
npm run analyze       # Bundle analyzer (ANALYZE=true)
```

### Backend Scripts

```powershell
cd backend

npm run dev           # Dev (nodemon)
npm start             # Production

npm run migrate       # Run DB migrations
npm run seed          # Seed DB with initial data

npm test              # Jest test suite
npm run test:watch    # Jest watch mode
```

### User & Data Management Scripts (backend)

```powershell
cd backend

node check-users.js        # Inspect existing users
node create-admin.js       # Create admin user
node create-all-users.js   # Create default staff + test users
node delete-user.js        # Delete a user by criteria
```

## High-Level Architecture & Modules

### Ecosystem View

From `docs/03_PRD.md` and `docs/05_TECHNICAL_ARCHITECTURE.md` the ecosystem is:

- **Cliente (public app)** – QR-based table entry, menu, cart, checkout, narguilé, reservations, cashback.
- **Staff** – Role-based dashboards for Cozinha, Bar, Atendente, Caixa.
- **Admin/Gerente** – Analytics, CRM, configuration, campaigns and reports.
- **Backoffice Modules** – Estoque, CRM, Fidelidade (cashback), Narguilé, Reservas, Caixa/PDV, Relatórios.

### Staff Roles & Routing

Roles (see `docs/03_PRD.md`, `docs/04_USER_FLOWS.md`):

- **Cozinha** – `/cozinha` – Food queue, timers, late alerts.
- **Bar** – `/staff/bar` – Drinks queue only.
- **Atendente** – `/atendente` – Picks up "ready" orders, delivers, manages **narguilé sessions**.
- **Caixa** – `/staff/caixa` – Cashier/PDV, opening/closing, payments.
- **Gerente/Admin** – `/admin/*` – Dashboards, configs, CRM, stock, campaigns, logs.
- **Cliente** – `/cardapio`, `/checkout`, `/pedidos`, `/cashback`, `/reservas`, `/perfil`.

> Important: Narguilé control is owned by **Atendente**, not Bar (see `docs/03_PRD.md` and `docs/04_USER_FLOWS.md`).

### Order Lifecycle (target / canonical)

Docs + `docs/tasks.md` define how the order status **should** work (some pieces are still being aligned in code):

1. `pending` – Order created by client.
2. `confirmed/preparing` – Kitchen/Bar accepts and starts prep.
3. `ready` – Sector finishes prep; order ready for pickup.
4. `on_way` – Atendente picked up from kitchen/bar.
5. `delivered` – Atendente delivered to table/counter.
6. `paid` – (Optional) Cashier marks as paid.
7. `cancelled` – Final state, may happen from various earlier states.

`docs/tasks.md` proposes a dedicated `orderStatus.service` with allowed transitions and per-role permissions; check that file before changing status logic.

### Real-Time & Socket.IO

- Socket.IO is initialized in `backend/src/server.js` via a dedicated service (`services/socket.service.js`).
- Docs propose namespaces for `customer`, `kitchen`, `bar`, `attendant`, `admin`, but current code centralises logic in one service file.
- Key conceptual events from `docs/05_TECHNICAL_ARCHITECTURE.md` / `docs/04_USER_FLOWS.md`:
  - `new_order`, `order_status_update`, `order_ready`, `order_delivered`.
  - `new_hookah_request`, `hookah_coal_alert`, `hookah_timer_update`.
  - `dashboard_update`, `stock_alert`, `new_reservation`.

When adding/changing behavior:
- Emit events from the **service layer**, not directly from controllers.
- Keep staff UIs listening to sector-appropriate events only.

### Data & Domain Models (conceptual)

See `backend/src/models` and `docs/05_TECHNICAL_ARCHITECTURE.md`.

Core aggregates:
- **User** – Roles, auth, profile, loyalty fields (cashback balance, totalSpent, loyaltyTier).
- **Product** – Menu items; category/subcategory drive routing (kitchen vs bar vs other).
- **Order / OrderItem** – Orders and line items, including per-item sector and status.
- **Table** – Physical tables, QR codes, current order.
- **Inventory (Stock + InventoryMovement)** – Insumos, movements for entries/exits.
- **HookahSession / HookahFlavor** – Narguilé sessions and flavors.
- **Reservation** – Table reservations with status + reminders.
- **Cashier / CashierMovement** – Cash register sessions and movements (sale, withdrawal, deposit, refund).
- **CashbackHistory** – All cashback earn/redeem events.
- **Campaign / CRM** – Campaigns + CRM behavior (see `docs/03_PRD.md`).

Use docs for field-level expectations, but always confirm against actual model files.

## Loyalty / Cashback System

The **cashback system in `docs/09_CASHBACK_SYSTEM.md` and `docs/tasks.md` is canonical**. Older "points" docs are legacy.

- Cashback is stored directly in **R$**, **not points**.
- Users have `cashbackBalance`, `totalSpent`, `loyaltyTier` (bronze, silver, gold, platinum).
- Tier thresholds are based on **lifetime totalSpent**.
- Cashback is earned as a % of order total based on tier (2–10%).
- Cashback is applied as discount on later orders (auto-application at checkout).
- `CashbackHistory` records all changes with `amount`, `type`, `balanceBefore/After`.
- Client-facing UX: `/cashback` page, checkout integration, and toasts on earn/upgrade.

When touching loyalty logic, read **`docs/09_CASHBACK_SYSTEM.md` + `backend` models/services** and prefer these rules over older points-based ones.

## Design System & UI Guidelines

Design is documented in `docs/01_CONCEITO_FLAME.md`, `docs/02_DESIGN_SYSTEM.md`, `docs/08_COMPONENT_LIBRARY.md`, and enforced in code via Tailwind + CSS variables + themeStore.

### Core Principles

- **Dark-first:** background is black / near-black, FLAME never uses a light theme by default.
- **Brand gradient:** magenta `#FF006E` → cyan `#00D4FF` over purple.
- **No hard-coded brand colors** in JSX – always go through Tailwind tokens or CSS variables.
- **Layout tokens:** spacing, radii, shadows, transitions defined in Tailwind config.

### Theme Variables

From `docs/tasks.md` and `themeStore`:

```css
--theme-primary      /* main brand (magenta) */
--theme-secondary    /* secondary (cyan) */
--theme-accent       /* purple accent */
--theme-primary-rgb
--theme-accent-rgb
--theme-secondary-rgb
```

`frontend/src/stores/themeStore.js` exposes multiple palettes (flame, inferno, etc.) and keeps these vars in sync with the active palette.

### Layout & Components

- Use the **Layout + Header + BottomNav** pattern described in `docs/08_COMPONENT_LIBRARY.md` for app shells.
- For buttons, inputs, cards, modals, toasts, badges, avatar, spinner, skeleton, empty state, etc, follow the APIs in that doc when editing or creating components.
- Staff/admin UIs should use the **new inline header with clock + logout** pattern documented in `PADRONIZACAO_COMPLETA.md` and implemented in `/cozinha` and other staff/admin pages.

When editing visual code:
- Prefer updating **design tokens** (Tailwind config, CSS vars) over scattering style changes.
- Avoid reintroducing legacy orange/amber or Exxquema colors; migrate them to FLAME tokens if encountered.

## Coding Conventions (from docs/07_DEV_BRIEF.md & docs/06_ACTIVATION_PROMPT.md)

### Naming

- Components: `PascalCase` (e.g. `ProductCard.js`).
- Pages: kebab-case filenames (e.g. `meus-pedidos.js`).
- Hooks: `useXyz` in camelCase (e.g. `useCart.js`).
- Stores: camelCase + `Store` suffix (e.g. `cartStore.js`).
- Services: camelCase (e.g. `api.js`, `orderService.js`).
- Constants: `SCREAMING_SNAKE_CASE`.
- CSS classes: kebab-case.
- Functions/variables: camelCase.

### Git

Commit types:

- `feat:` new feature
- `fix:` bug fix
- `refactor:` behavior-preserving refactor
- `style:` formatting only
- `docs:` documentation
- `test:` tests
- `chore:` maintenance/deps
- `perf:` performance

Branching (from `docs/07_DEV_BRIEF.md`):

- `main` – production.
- `develop` – integration branch.
- `feature/x`, `fix/x`, `hotfix/x` – topic branches.

## Testing

(Complementary to commands listed earlier.)

- Backend unit/integration tests live under `backend/src/__tests__/`.
- Frontend E2E tests use Cypress (`frontend/cypress.config.js`).
- `docs/07_DEV_BRIEF.md` documents structure and how to run a **single test file** (e.g. `npm test -- --testPathPattern=order.service`).
- `GUIA_TESTES_MANUAL.md` and other root `.md` files describe full **manual test flows** (e.g. ordering a Caipirinha and verifying Bar/Kitchen/Atendente behavior, SMS, inventory changes, etc.).

Use automated tests where possible, and fall back to those manual guides for cross-role flows.

## Environment & Deployment

### Local Dev Env

- **Frontend:** `NEXT_PUBLIC_API_URL=http://localhost:5000/api`, `NEXT_PUBLIC_SOCKET_URL=http://localhost:5000`.
- **Backend:** defaults to SQLite for dev when `DATABASE_URL` is not set.
- `.env.example` files exist for both frontend and backend; copy to `.env.local` / `.env` as needed.

### Production (current as of docs/tasks.md)

- **Frontend (Vercel):** `https://flame-lounge.vercel.app`.
- **Backend (Railway):** `https://backend-production-28c3.up.railway.app`.
- Env vars for both are summarised in `docs/tasks.md`; do **not** hardcode them in code.

### Deploy Automation

- `DEPLOY_AGORA.bat` / `DEPLOY_AGORA.sh` – end-to-end deploy scripts for Railway + Vercel.
- They also show which env vars must be configured for a clean deploy (DB, JWT, Twilio, Stripe, VAPID, FRONTEND_URL).

## Known Legacy / Gotchas

- **Exxquema vs FLAME:** If you encounter `Exxquema` in code, comments, copy or envs, it should be migrated to **FLAME** terminology and branding.
- **Ports 3000/3001 vs 5000:** Older docs mention 3000/3001; code now expects **frontend:3000, backend:5000** (see `frontend/src/services/api.js` and backend CORS config).
- **Points vs Cashback:** PRD/architecture docs contain a points-based system; current implementation and docs/09 use **cashback in R$**. Don't add new features on top of the legacy points model.
- **Narguilé responsibilities:** Some early diagrams attach narguilé to Bar; new PRD and UI spec move it to **Atendente**. Keep this consistent.
- **Design tokens:** There was a large audit to remove hard-coded colors and gradients; do **not** reintroduce inline brand hex codes.

## Notes for AI Assistants

- Respect the brand voice from `docs/01_CONCEITO_FLAME.md` and content specs in `docs/10_CONTEUDO_PAGINAS.md` when editing copy (warm, confident, urban, avoid cold corporate tone).
- Favor **real-time-aware** solutions (Socket.IO, toasts, live updating UIs) over purely request/response flows.
- Before implementing new features, cross-check:
  1. `docs/03_PRD.md` (does it exist there?),
  2. `docs/04_USER_FLOWS.md` (what is the intended user journey?),
  3. `docs/05_TECHNICAL_ARCHITECTURE.md` (where should it live?),
  4. `docs/09_CASHBACK_SYSTEM.md` (if loyalty-related),
  5. `docs/tasks.md` (is it already planned / partially implemented?).
- When behavior in code conflicts with newer docs under `docs/` or `STATUS_SISTEMA.md` / `tasks.md`, **assume the docs plus current production config are authoritative** and plan migrations accordingly, instead of reintroducing legacy behavior.
