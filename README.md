# -pos-inventory-project

# CWG Retail Suite — Point of Sale & Inventory Management

A full-stack POS & Inventory Management system built for a small retail shop, replacing paper-based stock and sales tracking. Built as a 12-week individual project under CWG IT Department — Track A, WEB-08.

## Team

| Role     | Owner                   | Scope                                                                  |
| -------- | ----------------------- | ---------------------------------------------------------------------- |
| Backend  | AbdulRahman (@arkanexe) | Laravel API — auth, models, stock-deduction logic, reporting endpoints |
| Frontend | [toluene-18]            | React + Tailwind UI, built from the Ready prototype                    |

## Tech Stack

- **Backend:** Laravel, MySQL, Sanctum (auth), Pest (testing)
- **Frontend:** React, Tailwind CSS
- **Currency:** Nigerian Naira (₦)
- **Roles:** Owner/Admin (full access), Cashier (Checkout + own sales history only)

## Repo Structure

```
cwg-retail-suite/
├── backend/          # Laravel API
├── frontend/         # React + Tailwind app
├── docs/
│   ├── erd.md         # Database schema & relationships
│   └── api-contract.md   # Every endpoint, request/response shape
└── README.md
```

## Core Feature: Transactional Stock Deduction

Every sale deducts stock inside a database transaction with row-level locking, guaranteeing stock never goes negative even under concurrent sales on the same low-stock item. This is explicitly tested (see `backend/tests`).

## Getting Started

### Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Create a local MySQL database named cwg_retail_suite, then set DB_* vars in .env.
php artisan migrate --seed
php artisan serve
```

Runs at `http://localhost:8000`.

### Frontend (React + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173` (Vite default). Set the API base URL in `frontend/.env` (e.g. `VITE_API_URL=http://localhost:8000/api`).

## Modules

- Dashboard (sales summary, low-stock alerts, trend chart)
- Point of Sale / Checkout (large-touch-target UI, transactional stock deduction)
- Inventory (stock levels, badges: In Stock / Low Stock / Out of Stock)
- Products (CRUD)
- Sales (transaction history, receipt view)
- Reports (sales trend, by category, top sellers, slow movers)
- Restock / Stock Adjustment (restock, corrections, damage/loss)
- Settings (store profile, staff management, reorder thresholds)

## Docs

- [`docs/erd.md`](docs/erd.md) — database schema, agreed before any backend code was written
- [`docs/api-contract.md`](docs/api-contract.md) — endpoint list, request/response shapes both sides build against

## Git Workflow

- Branch naming: `feature/backend-*`, `feature/frontend-*`
- All merges to `main` require at least one PR review
- Keep `docs/erd.md` and `docs/api-contract.md` as the source of truth — update them first if either side's data needs change, don't let code and docs drift apart

## Project Board

Tracked on GitHub Projects, columns P1–P8 matching the delivery phases in the project spec (Discovery → DB Design → Backend Foundation → REST API → Frontend Build → Integration/Advanced Features → Testing/QA → Deployment/Handover).
