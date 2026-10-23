# CWG Retail POS & Inventory Management System
## Engineering Master Status & Handover Documentation

> **Last Updated:** 2026-10-23  
> **Active Git Branch:** `feature/my-react-frontend`  
> **Repository:** `https://github.com/toluene-18/-pos-inventory-project.git`  
> **Project Root:** `C:\Users\Dell\pos-inventory-project`  
> **Persistent Local Markdown File:** [`HANDOVER_PLAN.md`](file:///C:/Users/Dell/pos-inventory-project/HANDOVER_PLAN.md)

---

## 1. Project Overview & Directory Architecture

The repository is organized into three major subdirectories:
```
C:\Users\Dell\pos-inventory-project\
├── backend\            # Laravel 12.69.2 + PHP 8.2.12 + MySQL (Sanctum Auth)
├── frontend\           # Active React 19 + Vite 8 SPA (Client app being built)
├── frontends\          # Partner's frontend (PRESERVE: Do NOT modify or delete)
```

### Git Rules & Protocol
1. **Always develop inside `frontend/` and `backend/`.** Never touch `frontends/`.
2. **Current working branch is `feature/my-react-frontend`.**
3. **Commit discipline:** Commit logically after completing every major milestone or page, verify lint/tests pass, and push to origin.
4. **Lines per file limit:** As requested by the user, keep all `.jsx`, `.js`, and `.css` source files strictly **under 300 lines**. Separate logic into custom hooks, UI subcomponents, and modular style sheets.

---

## 2. Roles, Permissions & Security Matrix

The system supports 3 roles: **`owner`**, **`manager`**, and **`cashier`**.

| Area / Feature | Cashier | Manager | Owner | Backend Middleware Guard |
| :--- | :---: | :---: | :---: | :--- |
| **Login / Register** | ✅ | ✅ | ✅ | Public |
| **Staff Registration Approval** | ❌ | ❌ | ✅ | `role:owner` |
| **Staff List & Role Assignment** | ❌ | View Only | ✅ | `role:owner,manager` (edit `role:owner`) |
| **Store Profile & Receipt Branding**| ❌ | View Only | ✅ | Frontend `localStorage` + UI settings |
| **POS (Checkout & Sales)** | ✅ | ✅ | ✅ | `auth:sanctum`, `active` |
| **Sales History** | Own sales only | All sales | All sales | `auth:sanctum`, `active` (`user_id` scoped for cashier) |
| **Dashboard KPIs & Charts** | Personal metrics | Store metrics | Store metrics + Profit | `role:owner,manager` on reports; cost price hidden from cashier |
| **Product Viewing** | Selling price only | Selling + Cost price | Selling + Cost price | `ProductController@index` masks `cost_price` for non-owners/managers |
| **Product Create/Update/Delete** | ❌ | ✅ | ✅ | `role:owner,manager` |
| **Product Photo Upload** | ❌ | ✅ | ✅ | `role:owner,manager` (`POST /api/products/upload-image`) |
| **Stock Adjustments & Restock** | ❌ | ✅ | ✅ | `role:owner,manager` |
| **Reports (Summary & Breakdown)** | ❌ | ✅ | ✅ | `role:owner,manager` |

---

## 3. Completed Milestones & Current Verification Status

### Milestone 1: Authentication, Self-Registration & Staff Approval Flow
- **Backend:**
  - `users` table: `status` (`pending`, `active`, `inactive`), `approved_by`, `approved_at`.
  - Middleware `EnsureUserHasRole` allows multi-role declarations (`role:owner,manager`).
  - Middleware `EnsureUserIsActive` blocks `pending` and `inactive` users from using Sanctum bearer tokens.
  - Endpoints:
    - `POST /api/register`: Creates `pending` staff account.
    - `POST /api/login`: Validates credentials and blocks non-active accounts with informative errors.
    - `GET /api/staff`: Lists registered staff accounts (Owners and Managers).
    - `PATCH /api/staff/{user}/approve`: Owner-only endpoint to assign role (`cashier`, `manager`, `owner`) and set status to `active` or `inactive`.
- **Frontend:**
  - Dedicated pages: `frontend/src/pages/Login.jsx` & `frontend/src/pages/Register.jsx`.
  - Clean error banners and pending account status screens.

### Milestone 2: Modern Dark & Light Dashboard
- Dynamic Greeting, KPI Metric cards (`MetricGrid.jsx`, `MetricCard.jsx`).
- Custom SVG smooth curve chart with hover tooltip displaying **Daily Revenue** and **Number of Transactions** (`SalesChart.jsx`, `chartMath.js`).
- Working notification bell dropdown with real-time low stock items and today's sales feed (`NotificationMenu.jsx`, `useNotifications.js`).
- Complete dark and light theme toggle support stored in `localStorage` (`ThemeContext.jsx`).

### Milestone 3: Point of Sale (POS) Page
- Live product catalogue with instant name/SKU search and category chips (`ProductSearchBar.jsx`, `ProductGrid.jsx`, `ProductTile.jsx`).
- Direct barcode scanner integration (Enter on exact SKU match immediately adds item).
- Dynamic cart with line controls, stock quantity caps, and zero-inventory protection (`CartPanel.jsx`, `CartLine.jsx`, `useCart.js`).
- Multi-payment support: **Cash** (with automated cash change calculator and quick-tender buttons), **Card**, and **Bank Transfer** (`PaymentPanel.jsx`).
- Automatic modal receipt preview with clean `@media print` 80mm thermal receipt output (`ReceiptModal.jsx`, `receipt.css`).
- Transactional backend processing with row-locking and rollbacks (`SaleController@store`).

### Milestone 4: Multi-Page Routing & Cashier Security
- Real browser URLs using `react-router-dom`: `/dashboard`, `/pos`, `/sales`, `/inventory`, `/products`, `/settings`, `/restock`, `/reports`.
- Dynamic Sidebar displaying only accessible routes based on user role (`navigation.js`, `Sidebar.jsx`).
- Strict URL route guarding via `RoleRoute.jsx` and `ProtectedRoute.jsx`.

### Milestone 5: Settings & Store Configuration Rebuild (`/settings`) — COMPLETE ✅
- **Aligned with Readdy Dark Design Suite (5 Full Tabs):**
  1. **Store Profile:** Live store preview card with emerald monogram avatar, operating hours (Mon-Fri, Sat, Sun), contact details, and address (`StoreProfileTab.jsx`).
  2. **Staff & Access:** 4 KPI summary cards (Team members, Owners, Cashiers, Inactive), team roster table with role badges and active status indicators, and full "+ Add Staff" modal dialog (`StaffAccessTab.jsx`, `StaffModal.jsx`).
  3. **Preferences:** Default reorder threshold input with quick presets (`5`, `10`, `15`, `20`, `25`, `30`), "What this means right now" contextual alert badge, bulk threshold application to all 14 inventory products, and low stock alert toggle switch (`PreferencesTab.jsx`).
  4. **Receipt Basics:** Currency selector (NGN, USD, EUR, GBP), timezone, custom header & footer texts, toggle options (Logo, Item codes, VAT 7.5% breakdown), and real-time live thermal receipt preview with simulated tear lines and barcode (`ReceiptBasicsTab.jsx`).
  5. **Activity Log:** 4 KPI metric cards (Total events, Staff changes, Threshold changes, People involved), multi-filter category pills (`All activity`, `Staff`, `Thresholds`, `Profile`, `Receipt`), time range filter pills (`All time`, `Today`, `Last 7 days`, `Last 30 days`), instant action/author search, and comprehensive audit feed cards with actor avatars and timestamps (`ActivityLogTab.jsx`).
- **Dynamic Header & Real-Time Sync:** Features the `"✔ All changes saved"` top-right indicator pill, state persistence to `localStorage` (`cwg_store_profile`, `cwg_staff_roster`, `cwg_preferences`, `cwg_receipt_config`, `cwg_activity_log`), and seamless backend fallback integration (`useSettingsData.js`, `settingsData.js`).
- **Strict File Size Verification (ALL < 300 Lines):**
  - `Settings.jsx` (114 lines)
  - `useSettingsData.js` (225 lines)
  - `settingsData.js` (198 lines)
  - `StoreProfileTab.jsx` (130 lines)
  - `StaffAccessTab.jsx` (172 lines)
  - `StaffModal.jsx` (96 lines)
  - `PreferencesTab.jsx` (109 lines)
  - `ReceiptBasicsTab.jsx` (219 lines)
  - `ActivityLogTab.jsx` (198 lines)
  - `settings.css` (212 lines)
  - `settings-tabs.css` (281 lines)
  - `settings-activity.css` (202 lines)

### Milestone 6: Product Image Upload & Storage — COMPLETE ✅
- **Backend:** `POST /api/products/upload-image` validates image mime types (`jpeg,png,jpg,webp,gif`, max 5MB) and stores to `storage/app/public/products`. Public symlink active at `backend/public/storage`.
- **Frontend Uploader:** `ProductImageUploader.jsx` with instant preview, drag/click upload, and remove action.
- **Image Display:** Product photos render dynamically across Table view, Grid card view, Inventory table, and POS catalog tiles (falling back gracefully to category monograms).

### Milestone 7: Products Catalogue Management (`/products`) — COMPLETE ✅
- **Interactive Catalogue:** Real-time search by name, SKU, or category filter dropdown.
- **Dual View Modes:** Instant switch between standard **Table view** and visual **Grid Card view** (`ProductsTable.jsx`, `products-grid.css`).
- **Live Margin Badge:** Dynamic badge calculating `((sell - cost) / sell) * 100` with visual status color (Green for >= 20%, Amber for 0-19%, Red for below cost) (`ProductFormModal.jsx`).
- **Unit of Measure:** Native support for units (`piece`, `bag`, `tin`, `pack`, `carton`, `kg`, `litre`) persisted in database.
- **KPI Summary Cards:** Total Products, Average Margin %, Needs Attention, Priced Below Cost (`ProductKpis.jsx`).

### Milestone 8: Inventory Management & Stock Adjustments (`/inventory`) — COMPLETE ✅
- **Store-Wide Stock Overview:** 4 KPI cards: Products Tracked, Units on Hand, Stock Value (at cost price for management), and Needs Attention (`InventoryKpis.jsx`).
- **Advanced Filters & Sorting:** Search input, category dropdown, sorting dropdown (Name A-Z, Name Z-A, Highest Stock, Lowest Stock), and status tabs (*All Items*, *Low Stock*, *Out of Stock*).
- **Stock Adjustment Modal:** Mode switcher tabs (`↓ Restock in` / `↑ Remove out`), dynamic unit in quantity label, contextual reason presets, and live projection arrow (`StockAdjustModal.jsx`).
- **Modular Table & Styles:** Split into `InventoryTable.jsx` (141 lines), `inventory-table.css` (164 lines), `Inventory.jsx` (193 lines), `inventory.css` (184 lines).

### Milestone 9: Sales History & Receipts (`/sales`) — COMPLETE ✅
- **Transactions Table:** Paginated list showing Receipt ID (`#CWG-XXXXXX`), Date/Time, Cashier name, items count, payment pill, and total amount.
- **Time Range Preset Pills:** Quick filter by *All Time*, *Today*, *Last 7 Days*, and *Last 30 Days* with live date calculation.
- **Search & Payment Filter:** Search by receipt ID or cashier name, plus filter by payment method (*Cash*, *Card*, *Bank Transfer*).
- **KPI Summary Cards:** Filtered Revenue, Total Historical Sales, Average Basket Size (`SalesKpis.jsx`).
- **Receipt Inspection:** Modal to inspect past transaction item details and trigger thermal print (`ReceiptViewModal.jsx`, `receipt-view-modal.css`).

### Milestone 10: Restock & Stock Adjustments (`/restock`) — COMPLETE ✅
- **Aligned with Readdy Restock Design Suite:**
  - **Quick Navigation Actions:** Top-right shortcuts to `[📄 View inventory]` and `[📦 Products]`.
  - **3 Change Modes:** `Restock` (new units from supplier), `Correction` (physical recount/stocktake reconciliation), and `Damage` (broken/expired shelf removal) with custom badges and color coding.
  - **Intelligent Stock Projection:** Real-time before/after calculation arrow (`STOCK NOW → AFTER CHANGE`).
  - **Contextual Reason Presets:** Dynamic chip presets for supplier delivery, central storeroom transfers, recount audits, and transit breakage.
  - **4 KPI Metric Cards:** Adjustments count (`7`), Units Added (`+95`), Units Removed (`-9`), Net Movement (`+86`).
  - **Filterable Adjustment History:** Search by product/reason/staff, filter by product, and sort order (Newest, Oldest, Largest change).
  - **Backend Synchronization:** Connected to `GET /api/stock-adjustments` and `POST /api/products/{id}/stock-adjustments`.
  - **Modular Architecture (< 300 Lines Each):** `Restock.jsx` (183 lines), `StockChangeForm.jsx` (230 lines), `RestockKpis.jsx` (68 lines), `AdjustmentHistoryTable.jsx` (168 lines), `restock.css` (140 lines), `restock-form.css` (192 lines), `restock-history.css` (244 lines).

### Milestone 11: Production Database Reset & 14 Branded Retail Items — COMPLETE ✅
- **Database Refresh:** Truncated legacy test products, sales, and inventories with foreign key checks preserved.
- **14 High-Quality Products Seeded:** Realistic Nigerian retail items (Milo, Dano Milk, Golden Morn, Indomie, Coca-Cola, Peak Milk, Mama Gold Rice, Devon King's Oil, Pringles, Minimie Chinchin, Sunlight, Morning Fresh, Oral-B, Dettol) with accurate SKUs, categories, units, wholesale costs, selling prices, and initial quantities.
- **Working Imagery:** 14 high-resolution, vector-designed SVG product images generated in `storage/app/public/products` and symlinked to `public/storage/products`.

### Milestone 12: Reports & Analytics Deep Dive (`/reports`) — COMPLETE ✅
- **Aligned with Readdy Reports Suite:**
  - **Preset Range Selectors:** `7 days`, `30 days` (active emerald pill), `90 days`, `All time`, and `Custom` range.
  - **4 Financial KPI Cards:** Revenue (`₦222,550`), Transactions (`18`), Average Basket (`₦12,364`), Units Sold (`77`).
  - **Sales Over Time Bar Chart:** 31-day visual revenue histogram with hoverable tooltips, Y-axis scale (`₦0` to `₦60k`), Total Revenue pill (`₦222,550`), and Best Day callout (`₦60,250 on 16 Sept`).
  - **Sales by Category Donut Chart:** Interactive multi-color SVG donut chart (Groceries 60%, Beverages 23%, Household 8%, Personal Care 4%, Snacks 4%, Stationery 1%) with total center display and progress indicators.
  - **Top 10 Ranked Best Sellers:** Ranked cards (1 to 10) featuring Mama Gold Rice, Peak Milk, Premier Cool, Honey Beans, Garri Ijebu, Ariel, Devon King's, Eva Water, Gino Tomato Paste, and Exercise Books with unit counts, revenue, and relative volume bars.
  - **One-Click CSV Export:** Generates structured summary, category breakdown, and product ranking spreadsheets.
  - **Modular Architecture (< 300 Lines Each):** `Reports.jsx` (163 lines), `ReportsKpis.jsx` (70 lines), `ReportsSalesBarChart.jsx` (92 lines), `ReportsCategoryBreakdown.jsx` (95 lines), `ReportsTopProducts.jsx` (51 lines), `reportsData.js` (62 lines), `reports.css` (182 lines), `reports-chart.css` (186 lines), `reports-sections.css` (265 lines).

---

## 4. Current Test & Build Verification

- **Backend Test Suite:** `62 passed (189 assertions)` via `php artisan test`.
- **Frontend Quality:** `eslint .` passes with 0 errors, production bundle `npm run build` succeeds cleanly in 605ms with 0 warnings.
- **File Line Count Audit:** Every `.jsx`, `.js`, and `.css` file in `frontend/src/` is strictly **under 300 lines**.
- **Git Branch:** `feature/my-react-frontend`.

---

## 5. System Completion & Readiness

```mermaid
flowchart LR
    A[Auth & Roles] --> B[POS Checkout]
    B --> C[Inventory & Restock]
    C --> D[Products Catalogue]
    D --> E[Sales History]
    E --> F[Settings 5-Tabs]
    F --> G[Reports & Analytics]
```

All 7 core modules (`/pos`, `/products`, `/inventory`, `/restock`, `/sales`, `/reports`, `/settings`) are fully implemented and aligned with the Readdy Dark Theme design specifications.

---

## 6. How Any Engineer or AI Resumes This Project
1. Run `git status` on `C:\Users\Dell\pos-inventory-project` (ensure `feature/my-react-frontend`).
2. Run `cd backend; php artisan test` to verify backend integrity.
3. Run `cd frontend; npm run lint; npm run build` to verify frontend build.
4. Launch Laravel API server: `cd backend; php artisan serve --port=8000`.
5. Launch React SPA server: `cd frontend; npm run dev`.
