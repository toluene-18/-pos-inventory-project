# TECHNICAL REPORT ON THE DESIGN AND IMPLEMENTATION OF A MULTI-TIER POINT OF SALE (POS) AND INVENTORY MANAGEMENT SYSTEM FOR RETAIL ENTERPRISES

---

### **A Technical Report Submitted in Partial Fulfilment of the Requirements for the Student Industrial Work Experience Scheme (SIWES) / Industrial Training (IT)**

**Organization of Attachment:** CWG Plc (Computer Warehouse Group)  
**Project Title:** CWG Retail Suite — Enterprise POS, Stock Auditing & Financial Analytics Platform  
**Technology Stack:** Laravel 12 (RESTful Backend API) + React 19 / Vite 8 (Frontend SPA) + MySQL  
**Date:** October 2026  

---

## DEDICATION & ACKNOWLEDGEMENTS

### Dedication
This report is dedicated to Almighty God for the provision of wisdom, strength, and grace throughout the industrial training attachment period.

### Acknowledgements
I express sincere gratitude to the management and engineering teams at **CWG Plc** for providing an enriching environment to learn enterprise-grade software engineering practices. Special appreciation goes to my industrial supervisor, senior team leads, and academic supervisors whose constructive reviews, guidance, and mentorship made the successful development and deployment of this project possible.

---

## EXECUTIVE SUMMARY / ABSTRACT

Manual bookkeeping and decoupled inventory records present significant financial vulnerabilities for modern retail enterprises, leading to stock discrepancies, delayed checkout lines, reconciliation errors, and unauthorized cost price leakages. 

This technical report details the design, engineering, and deployment of **CWG Retail Suite**, a robust, multi-tier Point of Sale (POS) and Inventory Management System developed during the industrial training period. The system comprises a decoupled architecture:
1. A secure RESTful API built on **Laravel 12** and **PHP 8.2**, utilizing **Laravel Sanctum** token-based authentication, database transactions with row-level locks, and strict Role-Based Access Control (**RBAC**).
2. A responsive, high-performance Single Page Application (SPA) developed with **React 19**, **Vite 8**, and a bespoke vanilla CSS design system featuring native Dark and Light modes.

The system enforces strict permission boundaries across three primary roles: **Owner**, **Manager**, and **Cashier**. Features include real-time SKU barcode scanning, inventory-capped cart operations, automated cash change calculation, 80mm thermal receipt rendering, automated profit margin analysis, audit-trailed stock adjustments, product photo uploads, and an owner-governed staff registration approval workflow. Automated testing verified the backend with 62 test cases, and frontend code quality was maintained through strict modular component separation.

---

## TABLE OF CONTENTS

1. **Chapter 1: Introduction and Institutional Background**
   - 1.1 Introduction to the Industrial Training Scheme
   - 1.2 Objectives of the Training
   - 1.3 Overview of the Host Organization (CWG Plc)
   - 1.4 Departmental Structure & Placement Responsibilities

2. **Chapter 2: Problem Statement and Project Objectives**
   - 2.1 Background of the Problem in Modern Retail
   - 2.2 Shortcomings of Legacy Systems
   - 2.3 Project Objectives
   - 2.4 Scope and Delimitations

3. **Chapter 3: System Architecture & Technological Framework**
   - 3.1 Architectural Overview (Decoupled Client-Server Model)
   - 3.2 Backend Framework (Laravel 12, Eloquent ORM, Sanctum)
   - 3.3 Frontend Framework (React 19, Vite 8, Modular CSS)
   - 3.4 Database Engine & Storage Subsystems (MySQL & Public Storage Symlink)

4. **Chapter 4: System Analysis and Design**
   - 4.1 Requirement Engineering (Functional & Non-Functional)
   - 4.2 Role-Based Access Control (RBAC) Matrix
   - 4.3 Database Schema & Entity-Relationship Design
   - 4.4 Data Flow and Transactional State Flow

5. **Chapter 5: Detailed Implementation of Core Modules**
   - 5.1 Authentication, Self-Registration & Owner Approval Workflow
   - 5.2 Real-Time Point of Sale (POS) & Checkout Engine
   - 5.3 Product Catalogue, Photo Management & Live Profit Margin Calculation
   - 5.4 Inventory Auditing & Dual-Mode Stock Adjustment Engine
   - 5.5 Sales History, Financial Filters & Thermal Receipt Printing
   - 5.6 Store Configuration, Branding & Staff Administration

6. **Chapter 6: Quality Assurance, Security & Testing**
   - 6.1 Backend Automated Testing (Unit & Feature Tests)
   - 6.2 Frontend Code Hygiene & Bundle Optimization
   - 6.3 Security Mechanisms (RBAC, Race Condition Guards, Cost Masking)

7. **Chapter 7: Practical Challenges Encountered and Problem Resolution**
   - 7.1 Challenge 1: Stock Concurrency & Race Conditions During Simultaneous Checkout
   - 7.2 Challenge 2: Sensitive Financial Data Leaks to Frontline Staff
   - 7.3 Challenge 3: Code Maintainability and File Size Discipline
   - 7.4 Challenge 4: Authentication Handshake with Pending Account Status

8. **Chapter 8: Conclusion, Skills Acquired and Recommendations**
   - 8.1 Summary of Experience & Skills Acquired
   - 8.2 Conclusion
   - 8.3 Recommendations for Future Improvements

---

## CHAPTER 1: INTRODUCTION AND INSTITUTIONAL BACKGROUND

### 1.1 Introduction to the Industrial Training Scheme
The Student Industrial Work Experience Scheme (SIWES) was established to bridge the gap between theoretical knowledge acquired in academic institutions and practical industrial operations. It exposes students to industry-standard toolchains, software engineering methodologies, project life-cycle management, and professional workplace ethics.

### 1.2 Objectives of the Training
The specific objectives achieved during the industrial training include:
- Gaining hands-on proficiency in building production-ready web APIs with **Laravel 12**.
- Mastering state management, performance optimization, and modular UI engineering with **React 19** and **Vite**.
- Designing normalized relational databases and implementing ACID-compliant transactional flows.
- Understanding enterprise security policies, token management, and role-based privilege isolation.
- Practicing collaborative software development protocols with Git, semantic versioning, and technical documentation.

### 1.3 Overview of the Host Organization (CWG Plc)
**CWG Plc (Computer Warehouse Group)** is one of Africa’s foremost Information and Communications Technology (ICT) conglomerates. Operating across multiple countries in Sub-Saharan Africa, CWG provides cutting-edge technology solutions to banking, telecommunications, government, and retail sectors.

```
[FIGURE 1.1: CWG Plc Corporate Logo & Headquarters Organization Chart]
*Description of Figure 1.1: Insert an image displaying the CWG Plc corporate brand identity and an organizational hierarchy flowchart showing the Engineering, Enterprise Systems, and Operations divisions.*
```

### 1.4 Departmental Placement and Responsibilities
Assigned to the **Software Engineering / Retail Systems Division**, my primary responsibilities encompassed:
- Participating in daily stand-ups and requirement grooming sessions.
- Developing backend API endpoints following standard REST principles.
- Designing responsive, accessible frontend screens matching Figma and Readdy design specifications.
- Writing unit and feature tests to ensure zero regression in business logic.
- Documenting engineering handovers and maintaining software documentation.

---

## CHAPTER 2: PROBLEM STATEMENT AND PROJECT OBJECTIVES

### 2.1 Background of the Problem in Modern Retail
Retail store operations in developing economies often face challenges stemming from fragmented, manual record-keeping or unreliable software. Cashiers frequently record sales on paper or isolated spreadsheet templates, resulting in:
1. **Inventory Discrepancies:** Unrecorded stock depletions, theft, and shrinkage going undetected until annual audits.
2. **Reconciliation Errors:** Discrepancies between cash collected, card terminal receipts, and recorded bank transfers.
3. **Checkout Bottlenecks:** Manual calculation of order totals and cash change slowing customer lines.
4. **Information Asymmetry:** Owners lack real-time visibility into daily revenue, stock valuation, and profit margins.

### 2.2 Shortcomings of Legacy Systems
Many legacy retail desktop solutions suffer from significant shortcomings:
- Rigid monolithic architectures requiring complex on-premise installations.
- Unencrypted local database files prone to tampering.
- Absence of role distinction, allowing cashiers to view supplier cost prices and store profit margins.
- Inability to print clean receipts directly from modern web browsers.

### 2.3 Project Objectives
The objective was to engineer **CWG Retail Suite**—a secure, cloud-ready, web-based POS and Inventory Management platform that delivers:
1. Real-time catalogue search with barcode SKU integration.
2. Dynamic cart management with automated stock validation.
3. Multi-payment processing (Cash, Card, Bank Transfer) with automated change calculation.
4. Browser-native 80mm thermal receipt generation.
5. Role-segregated management: Owners, Managers, and Cashiers.
6. Transparent stock auditing with reason logging and live stock level projections.
7. Product photo uploads and automatic profit margin percentage analytics.

### 2.4 Scope and Delimitations
The scope covers single-store and multi-terminal operations. While payment gateway integration (e.g. direct card reader communication) is represented via settlement logging, direct hardware device drivers for proprietary cash drawers are abstracted via browser print hooks.

---

## CHAPTER 3: SYSTEM ARCHITECTURE & TECHNOLOGICAL FRAMEWORK

### 3.1 Architectural Overview (Decoupled Client-Server Model)
The system adopts a modern decoupled architecture where the frontend Single Page Application (SPA) communicates with the backend via stateless JSON REST endpoints.

```
+-----------------------------------------------------------+
|                   Client Browser                          |
|  React 19 SPA + Vite 8 + Context API + Responsive CSS     |
+-----------------------------------------------------------+
                             |
                   HTTPS / JSON API Calls
                   (Sanctum Bearer Token)
                             v
+-----------------------------------------------------------+
|                   Laravel 12 API Engine                   |
|  - Middleware: Authenticate, EnsureRole, EnsureActive     |
|  - Controllers: Auth, Product, Sale, StockAdjustment      |
|  - Database Transactions & Row-Level Locking (Pessimistic)|
+-----------------------------------------------------------+
                             |
                     SQL Queries / PDO
                             v
+-----------------------------------------------------------+
|                   MySQL Database                          |
|  - Tables: users, products, inventories, sales,           |
|            sale_items, stock_adjustments                  |
|  - File System: storage/app/public/products (Symlinked)   |
+-----------------------------------------------------------+
```

```
[FIGURE 3.1: System Architecture Diagram]
*Description of Figure 3.1: Insert a technical architecture diagram illustrating the interaction between the React 19 Frontend SPA, HTTP Axios/Fetch Request Layer, Laravel Sanctum Middleware Guard, API Controllers, MySQL Relational Database, and the File Storage Engine.*
```

### 3.2 Backend Framework (Laravel 12)
- **Language & Runtime:** PHP 8.2+.
- **Framework:** Laravel 12.69.2.
- **Authentication:** Laravel Sanctum issuing cryptographically secure Bearer tokens.
- **Database Abstraction:** Eloquent ORM supporting relational relationships (`hasOne`, `hasMany`, `belongsTo`).
- **Data Validation:** Form request validation enforcing strict typing, bounds checking, and unique SKU constraints.

### 3.3 Frontend Framework (React 19 & Vite 8)
- **Library:** React 19.
- **Build Tool:** Vite 8.3.4 (providing Instant HMR and Rolldown/Rollup optimized production bundling).
- **Routing:** `react-router-dom` v7 with role-aware route protection.
- **Styling Architecture:** Pure vanilla CSS custom properties (variables) supporting dynamic, persistent Dark and Warm-Light mode themes.
- **Constraint Enforcement:** Strict modular component architecture ensuring every source file remains under 300 lines of code.

### 3.4 Database Engine & Storage
- **Relational Database:** MySQL 8.0 on XAMPP development environment.
- **Asset Storage:** Public storage symlink (`php artisan storage:link`) mapping `storage/app/public` to `backend/public/storage` for high-speed serving of product imagery.

---

## CHAPTER 4: SYSTEM ANALYSIS AND DESIGN

### 4.1 Requirement Engineering
- **Functional Requirements:** User registration, Owner account approval, SKU catalogue lookup, Cart checkout, Receipt rendering, Stock audit adjustment, Staff role modification, Store profile customization.
- **Non-Functional Requirements:** Sub-second checkout latency, zero stock overselling (concurrency protection), responsive layout (tablets to 4K monitors), WCAG-compliant contrast ratios in both dark and light modes.

### 4.2 Role-Based Access Control (RBAC) Matrix

| Module / Operation | Cashier | Manager | Owner | Enforcement Mechanism |
| :--- | :---: | :---: | :---: | :--- |
| **POS Checkout** | Yes | Yes | Yes | `auth:sanctum`, `active` |
| **Reprint Own Receipts** | Yes | Yes | Yes | Query scoped to `user_id` |
| **View Store-Wide Sales**| No | Yes | Yes | Restricted in `SaleController@index` |
| **Product Cost Prices** | Masked (`null`)| Visible | Visible | Eloquent `$product->makeHidden('cost_price')` |
| **Create/Edit Product** | No | Yes | Yes | Route middleware `role:owner,manager` |
| **Upload Product Photo**| No | Yes | Yes | Route middleware `role:owner,manager` |
| **Stock Level Adjust** | No | Yes | Yes | Route middleware `role:owner,manager` |
| **Approve New Staff** | No | No | Yes | Route middleware `role:owner` |
| **Staff Deactivation** | No | No | Yes | Route middleware `role:owner` |

### 4.3 Database Schema & Entity-Relationship Design
The relational schema is normalized to 3NF to eliminate redundancy:

```
[FIGURE 4.1: Entity-Relationship Diagram (ERD)]
*Description of Figure 4.1: Insert the Entity-Relationship Diagram depicting the entities: USERS (id, name, email, role, status), PRODUCTS (id, name, sku, category, unit, cost_price, sell_price, image_path, is_active), INVENTORIES (id, product_id, quantity, reorder_threshold), SALES (id, user_id, payment_method, total), SALE_ITEMS (id, sale_id, product_id, quantity, unit_price, line_total), and STOCK_ADJUSTMENTS (id, product_id, user_id, type, quantity_change, reason).*
```

1. **`users` Table:**
   - Primary key: `id` (unsigned big integer).
   - Attributes: `name`, `email` (unique), `password` (bcrypt hash), `role` (`owner`, `manager`, `cashier`), `status` (`pending`, `active`, `inactive`), `approved_by` (foreign key nullable), `approved_at` (timestamp nullable).
2. **`products` Table:**
   - Primary key: `id`.
   - Attributes: `name`, `sku` (unique indexed), `category`, `unit` (default `piece`), `cost_price` (decimal 10,2), `sell_price` (decimal 10,2), `image_path` (nullable string), `is_active` (boolean default true).
3. **`inventories` Table:**
   - Primary key: `id`.
   - Relationships: `product_id` (foreign key to `products.id` with cascade delete).
   - Attributes: `quantity` (integer), `reorder_threshold` (integer).
4. **`sales` Table:**
   - Primary key: `id`.
   - Relationships: `user_id` (foreign key to `users.id`).
   - Attributes: `payment_method` (`cash`, `card`, `bank_transfer`), `subtotal`, `total`, `created_at`.
5. **`sale_items` Table:**
   - Attributes: `sale_id`, `product_id`, `quantity`, `unit_price`, `line_total`.
6. **`stock_adjustments` Table:**
   - Attributes: `product_id`, `user_id`, `type` (`increase`, `decrease`), `quantity_change` (signed integer), `reason` (string/text), `created_at`.

---

## CHAPTER 5: DETAILED IMPLEMENTATION OF CORE MODULES

### 5.1 Authentication, Self-Registration & Owner Approval Workflow
Security begins at user onboarding. Rather than granting immediate administrative rights:
1. A new staff member registers at `/register`, submitting their name, email, password, and requested role.
2. The backend stores the account with status set to `pending`.
3. If the user attempts to log in immediately, the system prevents token generation and displays:  
   *"Your account is still pending approval. Please wait for the store owner to activate it."*
4. The Store Owner logs in, navigates to `/settings`, and reviews pending accounts. The owner can click **Approve** (assigning the finalized role) or **Reject**. Once approved, the account becomes active.

```
[FIGURE 5.1: Staff Registration & Approval Workflow Interface]
*Description of Figure 5.1: Insert two screenshots side-by-side: (a) The staff login screen showing the amber warning banner for a pending user, and (b) The Store Owner's Settings screen displaying the Pending Staff Approvals card grid with one-click 'Approve' and 'Reject' action buttons.*
```

### 5.2 Real-Time Point of Sale (POS) & Checkout Engine
The POS screen (`frontend/src/pages/PointOfSale.jsx`) provides rapid cashier workflow:
- **Instant Search & Category Filtering:** Instant filtering of active products by name, SKU, or category chips.
- **Hardware Barcode Integration:** The search bar captures barcode scanner input. When a scan emits an `Enter` keystroke matching an exact SKU, the product is added directly to the cart.
- **Cart & Quantity Protection:** Increments are capped at the database stock count. Items with zero stock cannot be added.
- **Settlement Calculator:** When **Cash** is selected, cashiers enter the cash tendered (or click preset bills: ₦500, ₦1,000, ₦5,000, ₦10,000, ₦20,000). The UI automatically calculates the exact change due.
- **Thermal Receipt Generation:** Upon checkout completion, an 80mm thermal receipt modal renders automatically. Using `@media print` CSS rules, clicking **Print** sends only the receipt slip to connected USB or network POS printers.

```
[FIGURE 5.2: Point of Sale (POS) Checkout Screen in Dark Mode]
*Description of Figure 5.2: Insert a high-resolution screenshot of the POS interface showing product tiles with stock badges, active cart lines on the right sidebar, payment method toggle pills, and the cash tender change calculator.*
```

```
[FIGURE 5.3: 80mm Thermal Receipt Preview Modal]
*Description of Figure 5.3: Insert a screenshot showing the rendered thermal receipt modal with CWG Retail Suite branding, receipt number, date, cashier identifier, itemized table, total, payment method, and custom footer notice.*
```

### 5.3 Product Catalogue, Photo Management & Live Profit Margin Calculation
The Products module (`frontend/src/pages/Products.jsx`) allows management to administer inventory items:
- **Dual View Modes:** Users can toggle between an informational **Table View** and an image-centric **Grid Card View**.
- **Product Photo Upload:** A custom uploader (`ProductImageUploader.jsx`) accepts drag-and-drop or file selection. It calls `POST /api/products/upload-image`, stores the file in `storage/app/public/products`, and renders an immediate preview.
- **Dynamic Profit Margin Indicator:** In the Add/Edit Product modal, entering Cost Price and Selling Price triggers a real-time calculation:
  $$\text{Margin } (\%) = \left(\frac{\text{Selling Price} - \text{Cost Price}}{\text{Selling Price}}\right) \times 100$$
  The badge highlights in **Green** ($\ge 20\%$), **Amber** ($0\% - 19\%$), or **Red** if priced below cost.
- **Units of Measure:** Native support for units (`piece`, `bag`, `tin`, `pack`, `carton`, `kg`, `litre`) persisted in database migrations.

```
[FIGURE 5.4: Add/Edit Product Modal with Live Margin Badge and Photo Uploader]
*Description of Figure 5.4: Insert a screenshot of the Add Product modal displaying the product name, SKU, unit dropdown, cost price, sell price, the dynamic green profit margin badge (+₦X, XX%), and the image dropzone.*
```

```
[FIGURE 5.5: Product Catalogue Grid Card View]
*Description of Figure 5.5: Insert a screenshot of the Products page in Grid View mode showing product photo cards with category tags, pricing, margin percentages, stock counters, and edit/deactivate action icons.*
```

### 5.4 Inventory Auditing & Dual-Mode Stock Adjustment Engine
The Inventory screen (`frontend/src/pages/Inventory.jsx`) serves as the operational hub for stock management:
- **Executive Metric Cards:** Displays *Products Tracked*, *Units on Hand*, *Stock Valuation at Cost Price* (Owner/Manager only), and *Needs Attention*.
- **Sorting & Filters:** Search by SKU/name, filter by category, sort by name or stock levels, and toggle between *All Items*, *Low Stock*, and *Out of Stock*.
- **Stock Adjustment Modal (`StockAdjustModal.jsx`):** Allows stock adjustments with dual-mode selector pills:
  - `↓ Restock in` (addition)
  - `↑ Remove out` (deduction)
  The input reflects the product's unit (e.g. `Quantity (bag)`). The user selects an audit reason (e.g. Supplier delivery, damaged goods, physical count discrepancy, spoilage). A live projection indicator displays:
  $$\text{New Level: } [\text{Current Stock}] \rightarrow [\text{Projected Stock}]$$

```
[FIGURE 5.6: Inventory Management Table & Valuation Metrics]
*Description of Figure 5.6: Insert a screenshot of the Inventory page showing the four top KPI cards (including Stock Value at Cost), the filter controls, and the stock status pills (Optimal, Low Stock, Out of Stock).*
```

```
[FIGURE 5.7: Stock Adjustment Modal with Live Projection]
*Description of Figure 5.7: Insert a screenshot of the Stock Adjustment modal displaying the '↓ Restock in' and '↑ Remove out' toggle pills, quantity input with unit label, reason dropdown, and the projection arrow.*
```

### 5.5 Sales History, Financial Filters & Thermal Receipt Printing
The Sales module (`frontend/src/pages/Sales.jsx`) provides a complete audit trail of transactions:
- **Role-Aware Visibility:** Cashiers view only transactions they processed; Owners and Managers inspect store-wide transactions.
- **Quick-Time Presets:** Fast filtering by *All Time*, *Today*, *Last 7 Days*, and *Last 30 Days*.
- **Metrics Summary:** Dynamic computation of page revenue, total transaction counts, and average basket size.
- **Inspection & Reprint:** Clicking **View Receipt** opens the past receipt modal for review and reprinting.

```
[FIGURE 5.8: Sales Transactions History & Time Filter Presets]
*Description of Figure 5.8: Insert a screenshot of the Sales page displaying the revenue and basket size KPI cards, the time preset pills, search bar, payment method dropdown, and the paginated transactions table.*
```

### 5.6 Store Configuration, Branding & Staff Administration
The Settings module (`frontend/src/pages/Settings.jsx`) centralizes store customization:
- **Staff Administration:** Full directory of staff members with role switching (`Cashier`, `Manager`, `Owner`) and account activation toggles.
- **Store Profile & Thermal Branding:** Configuration of store name, physical address, phone line, currency symbol, and custom receipt headers/footers stored in `localStorage`.
- **My Profile Inspector:** Overview of active credentials and role permissions.

```
[FIGURE 5.9: Settings Page — Store Profile & Staff Management Tabs]
*Description of Figure 5.9: Insert a screenshot of the Settings page showing the Staff Management roster, role selection dropdowns, and the Store Profile branding configuration form.*
```

---

## CHAPTER 6: QUALITY ASSURANCE, SECURITY & TESTING

### 6.1 Backend Automated Testing
To guarantee business logic integrity, automated tests were developed using PHPUnit/Pest. All 62 test cases pass:

```
PASS Tests\Unit\ExampleTest
PASS Tests\Feature\Auth\AuthenticationTest (Login, Invalid Password, Logout)
PASS Tests\Feature\Auth\RegistrationTest (New staff registration)
PASS Tests\Feature\ProductVisibilityTest (Cost price masking from cashiers)
PASS Tests\Feature\SaleCheckoutTest (Transaction rollbacks, insufficient stock guards)
PASS Tests\Feature\SalesReportTest (Date range summaries, cashier report restrictions)
PASS Tests\Feature\StaffApprovalTest (Pending state enforcement, manager permissions)
PASS Tests\Feature\StockAdjustmentTest (Increase, decrease floor protection, cashier rejection)

Total: 62 passed (189 assertions)
Duration: ~5.2 seconds
```

```
[FIGURE 6.1: Automated Backend Test Execution Terminal Output]
*Description of Figure 6.1: Insert a screenshot of the command terminal displaying the green 'PASS' summary of the 62 passing Laravel feature tests.*
```

### 6.2 Frontend Code Hygiene & Bundle Optimization
1. **Linting:** ESLint was configured to verify React hooks dependency rules and coding standards. Zero errors or warnings are emitted.
2. **Production Build:** Vite produces an optimized, minified production distribution bundle (`dist/`) in ~3.6 seconds.
3. **File Size Discipline:** Every `.jsx`, `.js`, and `.css` source file was kept **strictly under 300 lines** (the largest file is `ProductFormModal.jsx` at 258 lines).

### 6.3 Security Mechanisms
- **Pessimistic Row Locking (`lockForUpdate`):** Prevents race conditions during simultaneous checkout.
- **Database Transactions (`DB::transaction`):** Ensures that if one item fails stock verification, all database changes roll back completely.
- **Information Masking:** Frontline cashiers never receive cost prices or profit margins over the network.
- **SQL Injection & XSS Prevention:** Prepared statements via PDO and sanitized JSX output prevent common web vulnerabilities.

---

## CHAPTER 7: PRACTICAL CHALLENGES ENCOUNTERED AND PROBLEM RESOLUTION

### 7.1 Challenge 1: Stock Concurrency & Race Conditions During Simultaneous Checkout
- **Problem:** If two cashiers sell the last unit of a product simultaneously, uncoordinated queries could allow both sales through, creating negative inventory.
- **Resolution:** Implemented pessimistic database locking (`lockForUpdate()`) inside a transactional closure (`DB::transaction`). The first transaction locks the inventory row until completion, forcing concurrent requests to wait and evaluate updated stock counts.

### 7.2 Challenge 2: Sensitive Financial Data Leaks to Frontline Staff
- **Problem:** Exposing supplier cost prices to cashiers presents business risks (unauthorized margin disclosure).
- **Resolution:** Rather than relying on frontend CSS hiding, security was enforced at the API serialization level. In `ProductController@index`, if `$request->user()->role` is not `owner` or `manager`, the Eloquent collection executes `$products->each->makeHidden('cost_price')`.

### 7.3 Challenge 3: Code Maintainability and File Size Discipline
- **Problem:** As features grew, files like `Inventory.jsx` and `Products.jsx` expanded beyond 400 lines, making maintenance difficult.
- **Resolution:** Decomposed monolithic pages into specialized sub-components (`InventoryKpis.jsx`, `InventoryTable.jsx`, `ProductKpis.jsx`, `ProductsTable.jsx`, `ProductImageUploader.jsx`). All source files now remain strictly under 300 lines.

### 7.4 Challenge 4: Authentication Handshake with Pending Account Status
- **Problem:** Standard Laravel Sanctum tokens were issued upon registration, allowing unapproved staff immediate API access.
- **Resolution:** Engineered the `EnsureUserIsActive` middleware. Added a `status` column (`pending`, `active`, `inactive`) to the `users` table, and updated `AuthController` to verify active status prior to issuing authentication tokens.

---

## CHAPTER 8: CONCLUSION, SKILLS ACQUIRED AND RECOMMENDATIONS

### 8.1 Summary of Experience & Skills Acquired
The industrial training provided practical experience in modern full-stack engineering:
- **Backend Competencies:** Advanced Laravel routing, middleware design, Eloquent relations, transaction management, REST API architecture.
- **Frontend Competencies:** React 19 functional components, custom hooks, dynamic CSS theming, print stylesheets, Vite asset bundling.
- **DevOps & Collaboration:** Git branching strategies, database migrations, seeders, environment configurations, and technical reporting.

### 8.2 Conclusion
The **CWG Retail Suite** project demonstrates how modern full-stack web technologies can streamline enterprise retail operations. By decoupling the interface from the backend API, the application delivers fast checkout times, robust inventory auditing, and role-based data security. The project met all functional and non-functional specifications.

### 8.3 Recommendations for Future Improvements
1. **Batch Supplier Intake Station (`/restock`):** Develop a dedicated multi-product batch intake workflow for scanning incoming supplier manifests.
2. **Offline Local Storage Synchronization:** Integrate IndexedDB and Service Workers to allow cashiers to complete sales offline during internet disruptions, synchronizing automatically upon reconnection.
3. **Automated Low-Stock Email/SMS Alerts:** Integrate queuing services (e.g. Laravel Queues with Redis) to trigger notifications to managers when items cross their reorder thresholds.

---

## REFERENCES
1. Otwell, T. (2026). *Laravel Documentation: The PHP Framework for Web Artisans*. Laravel LLC.
2. React Core Team. (2026). *React: The Library for Web and Native User Interfaces*. Meta Platforms Inc.
3. MDN Web Docs. (2026). *CSS Print Stylesheets and Media Queries*. Mozilla Developer Network.
4. Computer Warehouse Group. (2026). *CWG Corporate Engineering Guidelines and Enterprise Best Practices*. Lagos, Nigeria.
