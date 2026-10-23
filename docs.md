# CWG Retail Suite — Technical Documentation & Architecture Reference

> **Project Name:** CWG Retail Management Suite  
> **System Scope:** Point of Sale (POS), Real-Time Inventory Control & Retail Analytics  
> **Target Environment:** Fast-moving Nigerian Neighborhood Provisions & Retail Outlets  
> **Currency:** Nigerian Naira (₦, NGN)  
> **Active Branch:** `main` & `feature/my-react-frontend`  
> **Last Updated:** October 2026

---

## 1. System Architecture Overview

CWG Retail Suite is a decoupled, modern enterprise web application composed of a high-performance **Laravel 12 API backend** and an ultra-responsive **React 19 SPA frontend**.

```
+--------------------------------------------------------------------------+
|                        Client Layer (React 19 SPA)                       |
|   Vite 8 • Custom Modern Dark Theme • 7 Full Modules • Clean REST Client |
+--------------------------------------------------------------------------+
                                    |
                            HTTP / JSON (Sanctum)
                                    v
+--------------------------------------------------------------------------+
|                      API Service Layer (Laravel 12)                      |
|       Role Guards • Transaction Handlers • Row-Locking Controllers       |
+--------------------------------------------------------------------------+
                                    |
                               SQL Queries
                                    v
+--------------------------------------------------------------------------+
|                         Database Layer (MySQL 8)                         |
|   Users • Products • Inventories • Sales • SaleItems • StockAdjustments  |
+--------------------------------------------------------------------------+
```

---

## 2. Security & Role-Based Access Control (RBAC)

The system enforces 3 user roles across backend middleware and frontend navigation routing:

| Feature / Action | Cashier | Manager | Owner | Enforcement Mechanism |
| :--- | :---: | :---: | :---: | :--- |
| **Authentication & Profile** | ✔ | ✔ | ✔ | Public login / Sanctum session guard |
| **Pending Staff Approval** | ✖ | ✖ | ✔ | Backend `role:owner` |
| **View Staff Roster** | ✖ | ✔ | ✔ | Backend `role:owner,manager` |
| **Edit Staff Accounts / Status**| ✖ | ✖ | ✔ | Backend `role:owner` |
| **Point of Sale (POS Checkout)**| ✔ | ✔ | ✔ | Authenticated & Active status |
| **Sales History** | Own Sales | All Sales | All Sales | `auth:sanctum` (`user_id` query scoping) |
| **View Product Selling Price** | ✔ | ✔ | ✔ | Authenticated |
| **View Product Cost Price** | ✖ (Masked) | ✔ | ✔ | Eloquent `ProductController@index` filter |
| **Create / Edit Products** | ✖ | ✔ | ✔ | Backend `role:owner,manager` |
| **Upload Product Photo** | ✖ | ✔ | ✔ | Backend `role:owner,manager` |
| **Stock Intake & Adjustments** | ✖ | ✔ | ✔ | Backend `role:owner,manager` |
| **Reports & Financial KPIs** | ✖ | ✔ | ✔ | Backend `role:owner,manager` |
| **Store Branding & Preferences**| ✖ | ✔ | ✔ | LocalStorage + Settings management |

---

## 3. Transaction Safety & Concurrency

To ensure inventory integrity in fast-paced retail checkouts, stock deductions are wrapped inside database transactions using pessimistic row-level locking:

```php
DB::transaction(function () use ($request, $items) {
    foreach ($items as $item) {
        $inventory = Inventory::where('product_id', $item['product_id'])
            ->lockForUpdate()
            ->firstOrFail();

        if ($inventory->quantity < $item['quantity']) {
            throw ValidationException::withMessages([
                'stock' => ["Insufficient stock for {$inventory->product->name}"]
            ]);
        }

        $inventory->decrement('quantity', $item['quantity']);
    }
});
```

- **Zero Over-Selling Guarantee:** Prevents negative inventory balances even during simultaneous checkouts on the last remaining stock.
- **Rollback Resilience:** If any item fails validation, the entire basket is rolled back cleanly.

---

## 4. Frontend Application Modules

The frontend is built with strict modularity (every source file is **under 300 lines**):

1. **Point of Sale (`/pos`):**
   - Instant search by name or SKU.
   - Hardware barcode scanner integration (instant Enter-to-cart).
   - Cash checkout with automated change calculation and quick tender buttons.
   - Automatic 80mm thermal receipt generator with thermal tear styling.
2. **Products Catalogue (`/products`):**
   - Dual table and card grid view modes.
   - Real-time gross margin badge with dynamic threshold coloring.
   - Drag-and-drop image uploader.
   - Multi-unit support (`bag`, `tin`, `pack`, `carton`, `bottle`, `piece`).
3. **Inventory Management (`/inventory`):**
   - 4 KPI metric cards: Products Tracked, Units on Hand, Stock Value, Needs Attention.
   - Status filters (*All Items*, *Low Stock*, *Out of Stock*).
   - Fast stock adjustment modal with audit reasoning.
4. **Restock & Adjustments (`/restock`):**
   - 3 change modes: `Restock`, `Correction`, `Damage`.
   - Live before/after projection arrow.
   - Contextual reason note chips.
   - 4 summary cards: Adjustments count, Units Added, Units Removed, Net Movement.
   - Historical audit table with search, product filters, type pills, and recorded-by avatars.
5. **Sales History (`/sales`):**
   - Searchable transactions stream with time preset pills (*All time*, *Today*, *7 days*, *30 days*).
   - Payment method filters (*Cash*, *Card*, *Bank Transfer*).
   - Receipt reprint modal.
6. **Reports & Analytics (`/reports`):**
   - Financial KPIs: Total Revenue, Transactions, Average Basket, Units Sold.
   - 31-day sales over time bar histogram with hover tooltips and best-day badge.
   - Multi-color SVG category sales distribution donut chart.
   - Top 10 best-selling products list with unit volume bars.
   - One-click CSV export engine.
7. **Settings (`/settings`):**
   - 5 specialized tabs: Store Profile, Staff & Access, Preferences, Receipt Basics (with live thermal receipt preview), and Activity Log.

---

## 5. Database Schema & Tables

- **`users`:** Staff credentials, role (`owner`, `manager`, `cashier`), status (`pending`, `active`, `inactive`), `approved_by`.
- **`products`:** SKU, name, category, unit, cost price, selling price, image URL, active status.
- **`inventories`:** Foreign key `product_id`, `quantity`, `reorder_threshold`.
- **`sales`:** Receipt number (`#CWG-YYYYMMDD-XXXX`), cashier reference, total amount, payment method, timestamps.
- **`sale_items`:** Foreign keys `sale_id`, `product_id`, quantity, unit price, subtotal.
- **`stock_adjustments`:** Foreign keys `product_id`, `user_id`, type (`increase`, `decrease`), quantity change, reason note.

---

## 6. Testing & Quality Assurance

- **Backend Pest/PHPUnit Test Suite:**
  - `62 passed tests (189 assertions)`
  - Covers authentication, staff approval workflows, product visibility restrictions, cashier cost-price masking, sales checkout race conditions, and reports.
- **Frontend Quality:**
  - Clean ESLint analysis with 0 errors and 0 warnings.
  - Production Vite bundle builds cleanly in < 1 second.
  - Strict line count compliance: 100% of `.jsx`, `.js`, and `.css` files remain under 300 lines.
