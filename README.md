# CWG Retail Suite — Point of Sale & Inventory Management

> An enterprise-grade, high-performance retail management system purpose-built for fast-paced provisions and retail stores in Nigeria. Replaces paper records with real-time transactional checkout, automated inventory tracking, low-stock warnings, and visual business intelligence.

---

## 1. System Architecture & Tech Stack

```
cwg-retail-suite/
├── backend/          # Laravel 12.69 API • PHP 8.2 • MySQL • Sanctum Auth • Pest/PHPUnit
├── frontend/         # React 19 SPA • Vite 8 • Modular Dark Theme UI (<300 lines/file)
├── docs/             # Technical Specifications & Architecture
│   ├── api-contract.md  # Exhaustive API endpoint contracts & payloads
│   ├── erd.md           # Database entity-relationship documentation
│   └── docs.md          # Architectural and operational guide
├── docs.md           # Master System Reference & Engineering Guide
├── HANDOVER_PLAN.md  # Live engineering milestone & handover documentation
└── README.md
```

### Technology Highlights
- **Backend:** Laravel 12 API, PHP 8.2, MySQL 8, Laravel Sanctum token auth, Pest / PHPUnit test suite.
- **Frontend:** React 19, Vite 8, Vanilla CSS modern dark-theme tokens, Custom SVG visual charts.
- **Transactional Integrity:** Row-level locking (`SELECT ... FOR UPDATE`) guarantees zero over-selling during concurrent checkouts.
- **Localized for Nigeria:** Native support for Nigerian Naira (`₦`), realistic product pack types (`bag`, `tin`, `carton`, `pack`, `bottle`), and commercial VAT 7.5% thermal receipt breakdown.

---

## 2. Core Modules & Capabilities

### 🛒 1. Point of Sale (POS) (`/pos`)
- Instant SKU search & real-time catalogue filtering.
- Hardware barcode scanner compatible (Enter-key auto tender).
- Cash, Card, and Bank Transfer tender options with automated change calculation.
- Instant 80mm thermal receipt generator with customizable header/footer.

### 📦 2. Products Catalogue (`/products`)
- Dual display modes: interactive **Data Table** and visual **Grid Cards**.
- Automated gross margin badge calculation (`((sell - cost) / sell) * 100`) with visual profit alerts.
- Built-in drag-and-drop product pack image uploader.
- Multi-unit tracking (`bag`, `tin`, `pack`, `carton`, `bottle`, `piece`).

### 📊 3. Inventory Management (`/inventory`)
- Real-time stock status pills (*In Stock*, *Low Stock*, *Out of Stock*).
- 4 KPI metric cards: Products Tracked, Units on Hand, Stock Value (at cost), Needs Attention.
- Instant stock adjustment modal with audit reasoning presets.

### 🚚 4. Restock & Adjustments (`/restock`)
- **3 Intake Modes:** `Restock` (vendor shipments), `Correction` (stocktake reconciliation), and `Damage` (expired or broken goods).
- Real-time stock projection preview (`STOCK NOW → AFTER CHANGE`).
- 4 KPI summary cards: Adjustments count, Units Added, Units Removed, Net Movement.
- Filterable adjustment history with search, product selector, type pills (`All`, `Restock`, `Correction`, `Damage`), and staff author avatars.

### 🧾 5. Sales History & Receipts (`/sales`)
- Paginated transaction stream with time preset pills (*Today*, *Last 7 days*, *Last 30 days*, *All time*).
- Filters by payment method (*Cash*, *Card*, *Bank Transfer*).
- Receipt inspection modal with one-click thermal re-printing.

### 📈 6. Reports & Business Intelligence (`/reports`)
- Financial KPI cards: Revenue, Total Transactions, Average Basket Size, Units Sold.
- 31-day sales over time bar histogram with hover tooltips and best-day badge.
- Multi-color SVG category distribution donut chart.
- Top 10 best-selling products list with unit volume bars.
- One-click CSV export engine for financial spreadsheets.

### ⚙️ 7. Store Settings (5 Full Tabs) (`/settings`)
- **Store Profile:** Live store preview card with emerald monogram, contact details, and operating hours.
- **Staff & Access:** Staff roster table, role badges, active/inactive toggles, and `+ Add Staff` modal.
- **Preferences:** Global reorder threshold selector (`5`, `10`, `15`, `20`, `25`, `30`), bulk threshold applicator, and low-stock alert switch.
- **Receipt Basics:** Currency selector (NGN, USD, EUR, GBP), timezone, header/footer notes, and live 80mm thermal receipt preview.
- **Activity Log:** Comprehensive audit stream tracking every staff, threshold, profile, and receipt change.

---

## 3. Role-Based Permissions (RBAC)

| Area / Feature | Cashier | Manager | Owner | Enforcement Guard |
| :--- | :---: | :---: | :---: | :--- |
| **Login / Register** | ✔ | ✔ | ✔ | Public endpoints |
| **Staff Registration Approvals** | ✖ | ✖ | ✔ | `role:owner` |
| **View Staff Roster** | ✖ | ✔ | ✔ | `role:owner,manager` |
| **Point of Sale (POS Checkout)**| ✔ | ✔ | ✔ | Authenticated & Active |
| **Sales History** | Own sales only | All sales | All sales | `auth:sanctum` (`user_id` scoped) |
| **View Product Selling Price** | ✔ | ✔ | ✔ | Authenticated |
| **View Product Cost Price** | ✖ (Masked) | ✔ | ✔ | `ProductController@index` filter |
| **Create / Edit / Deactivate Products** | ✖ | ✔ | ✔ | `role:owner,manager` |
| **Stock Adjustments & Restock** | ✖ | ✔ | ✔ | `role:owner,manager` |
| **Reports & Financial KPIs** | ✖ | ✔ | ✔ | `role:owner,manager` |

---

## 4. Getting Started & Installation

### Prerequisites
- PHP >= 8.2 & Composer
- Node.js >= 18 & npm
- MySQL Server (e.g. via XAMPP)

### Backend Setup (Laravel 12)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure your DB credentials in .env:
# DB_DATABASE=cwg_retail_suite
# DB_USERNAME=root
# DB_PASSWORD=

php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve --port=8000
```

### Frontend Setup (React 19 + Vite)
```bash
cd frontend
npm install
npm run dev
```
The application opens at `http://localhost:5173`.

### Frontend Architecture & Admin Layer
- **Admin Separation:** Admin-only views (`Reports`, `Settings`, `Restock`) are isolated in `frontend/src/pages/admin/`, providing a clean architectural boundary between general staff flows and administrative controls.
- **Audit & Activity Tracking:** Comprehensive staff activity logging accessible in both Settings and User Reports with per-staff member filtering.
- **Modern Dialogs:** SweetAlert2 integration styled to match dark and light themes, completely replacing legacy browser dialogs.
- **Frontend Standard:** 100% of `.jsx`, `.js`, and `.css` files are strictly **under 300 lines**.

### Default Seeded User Credentials
- **Owner Account:** `owner@cwgretail.com` / `password`
- **Manager Account:** `manager@cwgretail.com` / `password`
- **Cashier Account:** `cashier@cwgretail.com` / `password`

---

## 5. Testing & Code Quality

- **Backend Test Suite:**
  ```bash
  cd backend
  php artisan test
  ```
  Result: **69 passed tests (211 assertions)** covering authentication, role middleware, concurrency, stock adjustments, cashier data isolation, sales reports, and multi-browser store settings persistence.

- **Frontend Quality & Build:**
  ```bash
  cd frontend
  npm run lint
  npm run build
  ```
  Result: **0 lint errors**, clean Vite production build in under 1 second.
  **Modularity Standard:** 100% of `.jsx`, `.js`, and `.css` files are strictly **under 300 lines**.

---

## 6. Technical Documentation Index

- [`docs.md`](docs.md) — Comprehensive Architecture & Engineering Guide.
- [`docs/api-contract.md`](docs/api-contract.md) — Complete REST API contract specification for all 16 endpoints.
- [`docs/erd.md`](docs/erd.md) — Entity-Relationship Diagram and database schema specifications.
- [`HANDOVER_PLAN.md`](HANDOVER_PLAN.md) — Detailed milestone tracking and developer handover plan.
- [`INDUSTRIAL_TRAINING_TECHNICAL_REPORT.md`](INDUSTRIAL_TRAINING_TECHNICAL_REPORT.md) — Complete academic Industrial Training / SIWES technical report.
