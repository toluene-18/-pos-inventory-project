# Comprehensive SIWES Logbook Generator with explicit "WORK DONE DURING THE WEEK" section
import os, subprocess

weeks_data = [
    # METERING REMAINDER WEEKS
    {
        "week_number": "Week 11",
        "period": "17th August 2026 – 21st August 2026",
        "unit": "Energy Automation & Meter Production",
        "section": "Metering Department",
        "badge_class": "badge-metering",
        "badge_text": "Metering & Energy Engineering",
        "job_done": "Mechanical Meter Coupling, Component Seating & Real-Time Clock Battery Integration",
        "work_done_summary": "During this week in the Metering Assembly Station, I carried out mechanical coupling of 240 single-phase smart prepaid electricity meters. The core work done encompassed matching physical outer casing serials with electronic PCB barcodes, installing long-life 3.6V Li-SOCl2 RTC lithium backup batteries to safeguard non-volatile memory during power outages, seating 4G/GPRS IoT cellular communication daughterboards onto the motherboards, inspecting all internal terminal shunts, tightening casing screws using electric torque screwdrivers calibrated to 1.2 Nm to guarantee IP54 ingress protection against dust and moisture, and documenting the batch in the physical Coupling Records Ledger.",
        "days": [
            ("Monday", "17/08/2026", "PCB & Enclosure Matching", "Conducted 100% serial integrity audit matching front cover nameplate serials with electronic PCB barcodes. Inspected internal current transformer terminations."),
            ("Tuesday", "18/08/2026", "Internal Battery & LCD Integration", "Installed long-life 3.6V Li-SOCl2 lithium backup batteries into PCB retention slots for real-time clock (RTC) retention. Mounted front intermediate housing ensuring clear LCD aperture seating."),
            ("Wednesday", "19/08/2026", "GPRS / Cellular Modem Coupling", "Mounted 4G/GPRS communication daughterboards onto meter motherboards. Fastened internal whip antenna leads and validated SIM card tray retention mechanism."),
            ("Thursday", "20/08/2026", "Torque-Calibrated Screw Fastening", "Secured outer transparent casing screws using calibrated electric torque screwdrivers (1.2 Nm) to ensure IP54/IP65 ingress protection against moisture and dust."),
            ("Friday", "21/08/2026", "Coupling Ledger Batch Reconciliation", "Recorded 240 assembled meter units into the physical Coupling Records Ledger; audited serial batch ranges and routed units to the Post-Test station.")
        ],
        "sketch_title": "Meter Coupling & Component Layout Hierarchy",
        "sketch": """[Outer Transparent Cover] --> [Front Nameplate (Serial # Audit)]
   |--> [Sealing Gasket (IP54 Enclosure Ingress Protection)]
   |--> [Metering PCB Motherboard + LCD Display Aperture]
   |--> [3.6V Li-SOCl2 RTC Backup Battery] + [GPRS/4G IoT Daughterboard]
   |--> [Bi-Stable Magnetic Disconnect Latch Relay (100A Rating)]
   |--> [Base Terminal Housing + Micro-switch Cover Tamper Sensor]""",
        "student_comment": "Learned the critical importance of serial number reconciliation between physical casing and PCB firmware identity to avoid utility billing discrepancies in the Meter Management System (MMS)."
    },
    {
        "week_number": "Week 12",
        "period": "24th August 2026 – 28th August 2026",
        "unit": "Quality Assurance & Post-Test Diagnostics",
        "section": "Metering Department",
        "badge_class": "badge-metering",
        "badge_text": "Metering & Energy Engineering",
        "job_done": "ESD Grounding Setup, Mains Energization, Keypad Verification & Factory-to-Deployment Mode Switching",
        "work_done_summary": "During this week in the Post-Test Inspection Station, I carried out functional testing and operational mode parameterization of coupled smart meters. Work done included setting up anti-static Electrostatic Discharge (ESD) wrist straps grounded to the common copper earth bar (< 1 MOhm) to prevent gate oxide puncture on CMOS/MCU chips, energizing meters at 230V AC / 50Hz nominal mains, sequentially testing all tactile keys on the 12-key elastomer keypad with diagnostic shortcodes (#001#, #002#, #003#), interfacing infrared optical read-heads to execute proprietary Meter Management Software (MMS) scripts that transitioned meters from Factory Mode to Deployment Mode, and generating 20-digit STS tokens to test relay disconnector tripping.",
        "days": [
            ("Monday", "24/08/2026", "ESD Workstation Grounding Setup", "Inspected ESD wrist straps, verified < 1.0 MOhm resistance path to common copper earth bar, and initiated static-safe post-test workbench procedures."),
            ("Tuesday", "25/08/2026", "Mains Energization & LCD Boot Diagnostics", "Connected coupled smart meters to 230V AC / 50Hz bench power supply; checked power-on self-test (POST) sequences, LCD segment illumination, and relay click."),
            ("Wednesday", "26/08/2026", "Elastomer Keypad Verification", "Sequentially entered diagnostic test shortcodes (#001# for Total Energy, #002# for Instantaneous Voltage, #003# for Current) to confirm audio-tactile elastomer keypad functionality."),
            ("Thursday", "27/08/2026", "MMS Optical Firmware Parameterization", "Coupled infrared optical probes to meter front read-heads; used Meter Management Software (MMS) to switch operational mode from Factory Mode to locked Deployment Mode."),
            ("Friday", "28/08/2026", "Relay Disconnector Operation & Token Acceptance", "Generated 20-digit STS test recharge credit tokens via test generator; loaded tokens via keypad to confirm token acceptance and internal latch relay disconnector trip/close.")
        ],
        "sketch_title": "Post-Test Bench Setup & MMS Mode State Machine",
        "sketch": """[Copper Earth Bar] <==== ESD Wrist Strap ====> [Test Technician]
                                                   |
[230V AC Mains Test Jig] ===> [Smart Energy Meter] <=== Optical Probe ===> [MMS Test Laptop]
                                       |
    State: FACTORY MODE ---------------> Transition Command -------------> State: DEPLOYMENT MODE
    (Open Calibration Access)        (Cryptographic Authorization)       (Commercial Anti-Tamper Armed)""",
        "student_comment": "Mastered the use of proprietary Meter Management Software (MMS) and optical read-heads. Understood how ESD grounding prevents latent dielectric breakdown in microcontroller gates."
    },
    {
        "week_number": "Week 13",
        "period": "31st August 2026 – 4th September 2026",
        "unit": "Statutory Certification, Sealing & Packaging",
        "section": "Metering to IT Systems Handover",
        "badge_class": "badge-metering",
        "badge_text": "Metering & Energy Engineering",
        "job_done": "NEMSA Regulatory Compliance Audit, Tamper-Evident Wire Sealing & Palletized Warehouse Transfer",
        "work_done_summary": "During this week at the Final Packaging & Regulatory Certification Station, I performed statutory quality compliance checks and anti-tamper sealing on 300 tested meters. Work done included conducting visual surface audits and cleaning grease/fingerprint residue with anti-static solution, affixing internal QC Pass stickers over enclosure joints, applying statutory Nigerian Electricity Management Services Agency (NEMSA) regulatory certification labels pursuant to the NEMSA Act 2015, threading stainless steel sealing wire through enclosure sealing lugs, crimping serialized poly-carbonate NEMSA seals, affixing CWG holographic warranty security seals, boxing units with user manuals, and reconciling packaging ledgers.",
        "days": [
            ("Monday", "31/08/2026", "Finished Cosmetic & Housing Audit", "Inspected 300 tested meters for cosmetic flaws, stripped terminal screws, or missing terminal cover screws. Cleaned surface grease using anti-static fluid."),
            ("Tuesday", "01/09/2026", "QC Pass & Statutory NEMSA Sticker Application", "Affixed internal QC Pass guarantee stickers over enclosure seam joints; applied official statutory NEMSA (Nigerian Electricity Management Services Agency Act 2015) compliance labels."),
            ("Wednesday", "02/09/2026", "Serialized NEMSA Poly-carbonate Wire Sealing", "Threaded high-tensile stainless steel sealing wire through meter terminal lugs and casing lugs; crimped serialized NEMSA tamper-evident seals using calibrated sealing pliers."),
            ("Thursday", "03/09/2026", "CWG Holographic Sealing & User Manual Insertion", "Affixed CWG Plc corporate holographic tamper-evident warranty seals; inserted user operating manuals, STS quick-start guides, and wiring schematics into product cartons."),
            ("Friday", "04/09/2026", "Packaging Ledger Audit & Departmental Handover", "Completed batch ledger documentation reconciling 300 meter serials with NEMSA seal serials; transferred palletized batch to warehouse store. Prepared for rotation to IT Support.")
        ],
        "sketch_title": "NEMSA & CWG Tamper-Evident Multi-Tier Sealing Scheme",
        "sketch": """+-----------------------------------------------------------------+
| [Internal QC Seal] -> Validates manufacturing & optical calibration
| [NEMSA Sticker]   -> Statutory compliance (NEMSA Act 2015 grid mandate)
| [Wire Crimp Seal] -> Poly-carbonate serialized security wire through lugs
| [CWG Hologram]    -> Factory warranty authentication seal over casing seam
+-----------------------------------------------------------------+
          |=========> Protective Box Packaging with Foam Cushioning
          |=========> User Manual + STS Token Card Enclosure
          |=========> Palletized Warehouse Transfer for Utility Dispatch""",
        "student_comment": "Learned the legal and technical necessity of statutory NEMSA verification for grid-connected metering equipment in Nigeria, and how multi-tier physical security seals deter meter tampering."
    },

    # IT SUPPORT WEEKS (FROM SEP 14 TO PRESENT)
    {
        "week_number": "Week 14 (IT Week 1)",
        "period": "14th September 2026 – 18th September 2026",
        "unit": "IT Support & Proximity Operations",
        "section": "Enterprise IT Infrastructure",
        "badge_class": "badge-itsupport",
        "badge_text": "IT Support & Proximity",
        "job_done": "IT Proximity Helpdesk Orientation, Ticketing SLA Review & POS Retail Suite Architecture Kickoff",
        "work_done_summary": "During this week in the IT Support & Proximity Unit, I commenced enterprise helpdesk operations and software project planning. Work done included participating in orientation on the IT Service Management (ITSM) ticketing tool and SLA escalation matrices, resolving 8 corporate desktop support tickets (printer spooler crashes, Microsoft 365 Outlook profile synching, and local IP mapping), participating in the software architecture kickoff meeting for the CWG Retail Suite (Point of Sale & Inventory), drafting the relational Entity-Relationship Diagram (ERD), scaffolding the Laravel 12 backend with Sanctum authentication, and setting up the Vite-powered React frontend repository on GitHub.",
        "days": [
            ("Monday", "14/09/2026", "Proximity Unit Orientation & ITSM Workflow", "Reported to IT Support & Proximity Unit. Received orientation on enterprise IT service desk operations, SLA priority matrices (Severity 1 to 4), and incident ticketing platforms."),
            ("Tuesday", "15/09/2026", "Corporate User Incident Handling", "Resolved 8 Level-1 user tickets: diagnosed corporate printer spooler crashes, configured local network shared printers, and assisted staff with Microsoft 365 Outlook profile sync."),
            ("Wednesday", "16/09/2026", "CWG Retail Suite Architecture & ERD Review", "Participated in software development kickoff meeting for CWG Retail Suite (POS & Inventory). Reviewed system requirements and drafted relational Entity-Relationship Diagram (ERD)."),
            ("Thursday", "17/09/2026", "Laravel 12 API Scaffold & Sanctum Setup", "Installed Laravel 12 backend framework; configured Laravel Sanctum tokenized authentication and structured database connection parameters for MySQL in .env."),
            ("Friday", "18/09/2026", "Initial React Frontend Scaffolding & Git Tracking", "Scaffolded modern React frontend client using Vite; initialized Git version control repository on GitHub with branch protection rules.")
        ],
        "sketch_title": "ITSM Escalation & Client-Server System Architecture",
        "sketch": """[User Incident / Ticket] ---> [Level-1 Proximity Dispatch] ---> [Level-2 Desktop Support]
                                                                          |
                                  [CWG Retail Suite Web Client (React 19)]
                                                  | (RESTful JSON via HTTP)
                                  [Laravel 12 API Server + Sanctum Token Auth]
                                                  | (Eloquent ORM)
                                  [MySQL Relational Database Engine (Port 3306)]""",
        "student_comment": "Gained clear perspective on enterprise helpdesk operations and corporate incident escalation. Successfully initialized the foundational full-stack decoupled architecture for CWG Retail Suite."
    },
    {
        "week_number": "Week 15 (IT Week 2)",
        "period": "21st September 2026 – 25th September 2026",
        "unit": "IT Support & Software Engineering",
        "section": "Infrastructure & Systems Development",
        "badge_class": "badge-software",
        "badge_text": "Software & IT Systems",
        "job_done": "Enterprise VPN/MFA Support, Database Schema Normalization & Secure RESTful Authentication APIs",
        "work_done_summary": "During this week across IT Proximity and Software Development, I resolved enterprise user identity issues and developed core backend APIs. Work done included configuring secure remote VPN tunnels (Zscaler Private Access and Cisco AnyConnect) for remote executives, enrolling multi-factor authentication (MFA) devices via Microsoft Authenticator, designing and running normalized database migrations in Third Normal Form (3NF) for users, products, sales, and line items, writing tokenized authentication controllers using Bcrypt password hashing, and disassembling two corporate laptops to upgrade failing mechanical HDDs to high-speed 512GB M.2 NVMe SSDs.",
        "days": [
            ("Monday", "21/09/2026", "Remote VPN & MFA Configuration", "Assisted corporate staff with Zscaler / Cisco AnyConnect secure remote VPN configurations and registered Microsoft Authenticator Multi-Factor Authentication (MFA) tokens."),
            ("Tuesday", "22/09/2026", "Database Migrations & Relational Schema (3NF)", "Designed and executed Laravel migrations in 3rd Normal Form: `users`, `products`, `sales`, `sale_items`, and `stock_adjustments` tables with foreign key constraints."),
            ("Wednesday", "23/09/2026", "Sanctum Token Authentication & Breeze Integration", "Implemented user login, password hash verification (Bcrypt), and token issuance endpoints (`POST /api/login`) with role validation attributes."),
            ("Thursday", "24/09/2026", "Hardware RAM/SSD Laptop Diagnostic", "Diagnosed 2 malfunctioning corporate HP laptops: replaced faulty DDR4 SODIMM RAM modules, upgraded failing HDD to 512GB NVMe SSD, and verified BIOS hardware recognition."),
            ("Friday", "25/09/2026", "Product Creation API & Route Testing", "Developed `ProductController.php` with validation rules; created API endpoint for product catalogue management and tested JSON responses via automated test suite.")
        ],
        "sketch_title": "Database Relational Schema (3NF) Topology",
        "sketch": """+---------------+       +------------------+       +-------------------+
|     USERS     |<----->|      SALES       |<----->|    SALE_ITEMS     |
| id, name,     | 1   M | id, user_id,     | 1   M | id, sale_id,      |
| role, status  |       | total, payment   |       | product_id, qty   |
+---------------+       +------------------+       +---------+---------+
                                                             | M
                                                             | 1
                                                   +---------v---------+
                                                   |     PRODUCTS      |
                                                   | id, sku, name,    |
                                                   | sell_price, unit  |
                                                   +-------------------+""",
        "student_comment": "Understood the practical intersection between hardware maintenance (SSD/RAM staging) and software data integrity (database normalization and token security)."
    },
    {
        "week_number": "Week 16 (IT Week 3)",
        "period": "28th September 2026 – 2nd October 2026",
        "unit": "IT Support & Network Infrastructure",
        "section": "Enterprise Networking & Workstation Maintenance",
        "badge_class": "badge-itsupport",
        "badge_text": "IT Support & Networking",
        "job_done": "Structured Cabling, Patch Panel Termination & Network Continuity Diagnostics",
        "work_done_summary": "During this week in the Network Infrastructure & Data Center Unit, I carried out structured cabling and local area network diagnostics. Work done included performing an audit of server rack patch panels on the 2nd floor, tracing unmanaged drop cables, terminating 12 new solid-copper Cat6 cables into 24-port patch panels following the TIA/EIA-568B pinout standard, conducting cable continuity and near-end crosstalk tests with an electronic wire tester, assisting Senior Engineers with switch port patching across departmental VLANs (VLAN 10 Admin, VLAN 20 Engineering), and deploying Aruba enterprise Wi-Fi access points to improve coverage in executive meeting spaces.",
        "days": [
            ("Monday", "28/09/2026", "Data Center Patch Panel Audit", "Audited server rack patch panels on the 2nd floor data room; re-labeled Cat6a drop cables and documented port assignments to Cisco Catalyst 2960 switches."),
            ("Tuesday", "29/09/2026", "Cat6 Structured Cabling & RJ-45 Crimping", "Terminated 12 new Cat6 solid copper patch cables according to the TIA/EIA-568B standard; verified pinout continuity, wire-map, and near-end crosstalk with digital cable tester."),
            ("Wednesday", "30/09/2026", "Cisco Switch VLAN Patching & Trunking", "Assisted Senior Network Engineer in patching workstation ports to designated Departmental VLANs (VLAN 10: Admin, VLAN 20: Engineering, VLAN 30: Guest Wi-Fi)."),
            ("Thursday", "01/10/2026", "Public Holiday: National Independence Day", "Statutory National Holiday (Nigeria Independence Day). Conducted scheduled remote server health checks and UPS power status monitoring."),
            ("Friday", "02/10/2026", "Wireless Access Point (AP) Deployment", "Mounted and configured Aruba Enterprise Wi-Fi Access Points; measured RF signal coverage and resolved channel interference in the executive conference boardroom.")
        ],
        "sketch_title": "TIA/EIA-568B Color Code & Enterprise Switch Patching",
        "sketch": """TIA/EIA-568B Pinout Standard:
Pin 1: White/Orange | Pin 2: Orange      | Pin 3: White/Green | Pin 4: Blue
Pin 5: White/Blue   | Pin 6: Green       | Pin 7: White/Brown | Pin 8: Brown
                       |
[Wall Data Outlet RJ-45] ===Cat6 Drop===> [24-Port Patch Panel] ===Patch Cord===> [Cisco Switch (VLAN Tagged)]""",
        "student_comment": "Mastered precision RJ-45 crimping under TIA/EIA-568B. Gained real-world appreciation for structured cable dressing and cable management in high-density rack enclosures."
    },
    {
        "week_number": "Week 17 (IT Week 4)",
        "period": "5th October 2026 – 9th October 2026",
        "unit": "Enterprise IT Systems Administration",
        "section": "Identity & Access Management",
        "badge_class": "badge-itsupport",
        "badge_text": "Active Directory Administration",
        "job_done": "Active Directory Domain Services, User Provisioning, OUs & Group Policy Object (GPO) Deployment",
        "work_done_summary": "During this week in Systems Administration, I performed user identity management and policy enforcement on Windows Server 2022 Active Directory Domain Services (AD DS). Work done included provisioning new employee accounts in Active Directory Users and Computers (ADUC), categorizing user objects into departmental Organizational Units (OUs), creating and linking Group Policy Objects (GPOs) for screen timeouts, minimum password complexity (12 characters), and USB mass storage write protection, joining 6 corporate Dell laptops to the `cwg.local` domain, verifying DNS and Kerberos authentication tickets, and executing PowerShell scripts to audit inactive user accounts.",
        "days": [
            ("Monday", "05/10/2026", "Active Directory User Provisioning", "Created new corporate user accounts in Windows Server 2022 Active Directory Users and Computers (ADUC); assigned complex password policies and primary email aliases."),
            ("Tuesday", "06/10/2026", "Organizational Units (OUs) & Departmental Groups", "Structured directory tree hierarchy: segregated user objects into nested OUs (`CWG-Staff`, `Metering-Dept`, `IT-Operations`, `Finance`); assigned security group memberships."),
            ("Wednesday", "07/10/2026", "Group Policy Objects (GPOs) Configuration", "Configured and linked Domain GPOs: enforced 15-minute screen lock with password, restricted USB mass storage write access, and mapped departmental network drives (`Z:\\Enterprise_Data`)."),
            ("Thursday", "08/10/2026", "Domain Joining & Kerberos Trust Diagnostics", "Joined 6 new corporate Dell Latitude laptops to domain `cwg.local`; verified DNS server lookups, computer account registration, and Kerberos ticket generation."),
            ("Friday", "09/10/2026", "Audit of Inactive AD Accounts & Password Resets", "Executed PowerShell AD audit scripts to identify user accounts inactive for > 60 days; processed 14 self-service password reset requests from enterprise staff.")
        ],
        "sketch_title": "Active Directory Hierarchy & GPO Inheritance Flow",
        "sketch": """Domain: cwg.local
  |--> OU: Corporate Head Office
         |--> OU: IT-Operations -------> [GPO: Admin Access & Remote Management]
         |--> OU: Metering-Division ---> [GPO: Optical Testing Hardware Drivers]
         |--> OU: Commercial Staff ----> [GPO: USB Write Block & Inactivity Lock]
                 |--> Users: [staff1, staff2] (Members of 'Domain Users' + 'POS-Operators')""",
        "student_comment": "Gained in-depth hands-on experience managing Windows Server Active Directory. Understood how GPOs standardize security policies across hundreds of networked endpoints simultaneously."
    },
    {
        "week_number": "Week 18 (IT Week 5)",
        "period": "12th October 2026 – 16th October 2026",
        "unit": "Software Engineering & Enterprise Solutions",
        "section": "Core POS Engine & Inventory Architecture",
        "badge_class": "badge-software",
        "badge_text": "Software Engineering",
        "job_done": "Product Inventory Normalization, Stock Adjustments Engine & Role-Based Middleware Security",
        "work_done_summary": "During this week in the Software Engineering team, I built the inventory tracking and access control layers of the CWG Retail Suite. Work done included refactoring ProductController to support Route Model Binding and soft deactivation via `is_active` flags, decoupling stock quantities into an independent `inventories` table, developing `StockAdjustmentController.php` with audit reason tagging (`restock`, `damaged`, `audit`), implementing atomic database transactions to guarantee stock consistency during concurrent operations, authoring PHPUnit automated feature tests, and writing role-based middleware that strictly bars cashiers from viewing cost prices, supplier margins, and administrative settings.",
        "days": [
            ("Monday", "12/10/2026", "Product Deactivation & Route Model Binding", "Refactored `ProductController` to use Laravel Route Model Binding; added soft-delete `is_active` flag to archive products safely without breaking historical sales data."),
            ("Tuesday", "13/10/2026", "Decoupled Inventories Table Migration", "Separated stock quantity into dedicated `inventories` table with 1-to-1 product relationship; migrated existing product inventory data seamlessly."),
            ("Wednesday", "14/10/2026", "Stock Adjustment Controller & Audit Routing", "Implemented `StockAdjustmentController.php` supporting stock audit reasons (`damaged`, `restock`, `inventory_audit`); built transaction logging for stock movements."),
            ("Thursday", "15/10/2026", "Multi-Product Automated Feature Tests", "Authored Pest/PHPUnit automated test suites (`StockAdjustmentTest.php`) verifying inventory increments, boundary conditions, and negative stock prevention."),
            ("Friday", "16/10/2026", "Role Middleware & Cashier Restrictions", "Created custom `EnsureUserHasRole` middleware; ensured cashiers are strictly barred from viewing product cost prices, margin data, or store settings.")
        ],
        "sketch_title": "Inventory Audit Logging & Role Gate State Model",
        "sketch": """Request -> [Role Middleware Check]
             |--> Role == Cashier  ---> Returns: sell_price, sku, name (cost_price HIDDEN)
             |--> Role == Owner/Mgr --> Returns: cost_price, profit_margin, full_audit
                                    |
[Stock Adjustment] ---> [DB Transaction Lock] ---> [Adjust Inventory Qty] ---> [Log Audit Event]""",
        "student_comment": "Learned professional test-driven development (TDD) using automated PHPUnit assertions. Successfully protected sensitive business financial metrics using server-side role middleware."
    },
    {
        "week_number": "Week 19 (IT Week 6)",
        "period": "19th October 2026 – 23rd October 2026",
        "unit": "Software Engineering & Enterprise Solutions",
        "section": "POS Checkout, Thermal Printing & Sales Engine",
        "badge_class": "badge-software",
        "badge_text": "Software Engineering",
        "job_done": "POS Checkout Interface, Barcode SKU Search, 80mm Thermal Receipt Generator & Sales History",
        "work_done_summary": "During this week in Software Development, I focused on client-side checkout and peripheral hardware integration. Work done included engineering the Point of Sale (POS) user interface in React with real-time barcode scanning, search auto-complete, and cart quantity capping, building an atomic cash tender dialog with automated change calculation, styling an 80mm browser-native thermal receipt print layout using CSS `@media print` rules for thermal printers, creating a paginated Sales History table with multi-parameter date range filters, seeding 14 authentic Nigerian retail products, and building an inventory Restock intake station.",
        "days": [
            ("Monday", "19/10/2026", "POS Interface Grid & Real-Time Cart State", "Built React POS component with live category filtering, rapid barcode/SKU search, responsive product grid, and stock-capped cart line item management."),
            ("Tuesday", "20/10/2026", "Atomic Cash Checkout & Change Calculator", "Engineered checkout settlement modal supporting Cash, Card, and Bank Transfer tender options with automated change calculation and transactional concurrency locking."),
            ("Wednesday", "21/10/2026", "Browser-Native 80mm Thermal Receipt Engine", "Implemented browser-native 80mm thermal receipt print stylesheet (`@media print`); styled store header, cashier credentials, line items, VAT, and barcode footer."),
            ("Thursday", "22/10/2026", "Sales History Table & Date Range Filter Presets", "Created sales audit table with filtering by payment method and date presets (Today, 7D, 30D); integrated receipt reprint modal."),
            ("Friday", "23/10/2026", "Database Seeding & Restock Intake Station", "Seeded 14 authentic Nigerian retail products with images; developed Restock & Adjustment station with reason-tagged adjustments and visual stock badges.")
        ],
        "sketch_title": "80mm POS Thermal Receipt Layout Structure",
        "sketch": """+---------------------------------------+
|          CWG PROVISIONS STORE         |
|  12 Ogui Road, Abeokuta, Ogun State   |
|  Tel: +234 803 123 4567 | RC: 123456  |
|---------------------------------------|
| Receipt #: RCP-2026-0042              |
| Date: 2026-10-21 14:32 | Cashier: John|
|---------------------------------------|
| Item              Qty   Price   Total |
| MAMADOR OIL 5L      1   14,500 14,500 |
| DANO MILK 800G      2    4,200  8,400 |
|---------------------------------------|
| TOTAL AMOUNT:               NGN 22,900|
| TENDERED (CASH):            NGN 25,000|
| CHANGE DUE:                  NGN 2,100|
|---------------------------------------|
| Thank you for shopping with CWG Store |
+---------------------------------------+""",
        "student_comment": "Built an authentic, high-speed retail checkout flow with strict inventory synchronization. Designed pixel-perfect 80mm thermal receipt layouts that print without browser margins."
    },
    {
        "week_number": "Week 20 (IT Week 7)",
        "period": "26th October 2026 – 30th October 2026",
        "unit": "Software Engineering & Enterprise Solutions",
        "section": "Financial Reports & High-Performance Optimization",
        "badge_class": "badge-software",
        "badge_text": "Software Engineering",
        "job_done": "Financial Reports Engine, SQL B-Tree Indexing, React-Toastify Popups & Activity Audits",
        "work_done_summary": "During this week in Software Engineering, I executed critical database query optimizations and built enterprise analytical reporting tools. Work done included eliminating sequential N+1 query loops across sales lookups, applying compound B-Tree indexes on `sales(created_at, payment_method)` and projecting specific SQL columns to dramatically accelerate database response, developing the 5-tab Reports module (Financial Sales, Inventory Valuation, Stock Health, Product Velocity, and User Staff Audits) with CSV and PDF export, organizing 30-day adaptive sales charts, integrating React-Toastify notifications, and incorporating real-world metering work instructions into the IT technical report.",
        "days": [
            ("Monday", "26/10/2026", "Database Performance & SQL B-Tree Indexing", "Eliminated sequential N+1 query loops; added compound B-Tree indexes on `sales(created_at, payment_method)` and projected columns at SQL level for instant response times."),
            ("Tuesday", "27/10/2026", "Financial Analysis Layout & 5 Report Subtabs", "Constructed comprehensive Reports module: Financial Sales, Inventory Valuation, Stock Level Deficits, Product Velocity, and User Staff Audits with CSV/PDF export."),
            ("Wednesday", "28/10/2026", "Adaptive 30-Day Sales Chart & SweetAlert2 Modals", "Organized 30-day/90-day daily sales revenue chart with collision-free interval ticks; replaced old browser alerts with modern themed dialogs and React-Toastify notifications."),
            ("Thursday", "29/10/2026", "Staff Activity Audit Log & Admin Layer Isolation", "Organized admin-only pages under dedicated `pages/admin` directory; added staff event timeline capturing sales transactions, logins, and inventory restock operations."),
            ("Friday", "30/10/2026", "IT Technical Report Metering Instructions Update", "Incorporated physical manufacturing work instructions from the metering factory (Coupling, Post-Test ESD Safety, and NEMSA Packaging) into the comprehensive IT Report.")
        ],
        "sketch_title": "SQL Query Optimization: Before vs After B-Tree Indexing",
        "sketch": """BEFORE OPTIMIZATION:
  Query: SELECT * FROM sales WHERE created_at BETWEEN ? AND ?
  Execution: Full Table Scan (ALL) -> 5,000+ rows traversed -> High Server Latency (1,800ms)

AFTER B-TREE INDEXING:
  Schema: INDEX sales_created_payment_idx (created_at, payment_method)
  Execution: Range Index Scan (range) -> Directly fetches matched pointer rows -> Sub-10ms response""",
        "student_comment": "Learned the deep technical mechanics of database query optimization, compound B-tree index execution plans, and architectural modularity in enterprise web development."
    },
    {
        "week_number": "Week 21 (IT Week 8)",
        "period": "2nd November 2026 – 6th November 2026",
        "unit": "IT Support, Proximity & Systems Deployment",
        "section": "Enterprise IT Operations",
        "badge_class": "badge-itsupport",
        "badge_text": "IT Support & Systems Deployment",
        "job_done": "Laptop Hardware Staging, Windows OS Provisioning (.ppkg), Essential Software Deployment & Active Directory Domain Integration",
        "work_done_summary": "During this week in the IT Support & Systems Staging Lab, I conducted complete lifecycle preparation and deployment of enterprise laptop hardware for onboarding staff. Work done included unboxing and inspecting 5 Dell Latitude 5440 laptops, configuring UEFI BIOS settings (Secure Boot, TPM 2.0, battery management), performing clean Windows 11 Enterprise installation over GPT partition tables, executing automated staging via Windows Configuration Designer provisioning packages (.ppkg) that injected Wi-Fi profiles, root certificates, and OEM drivers, deploying the enterprise application stack (Microsoft 365, Zscaler VPN, CrowdStrike Falcon), joining devices to the `cwg.local` Active Directory domain, escrowing BitLocker keys to AD, and completing employee handover.",
        "days": [
            ("Monday", "02/11/2026", "New Laptop Unboxing & Hardware POST Verification", "Unboxed batch of 5 brand new corporate enterprise laptops (Dell Latitude 5440); verified battery health, verified UEFI BIOS firmware settings, secure boot, and TPM 2.0 status."),
            ("Tuesday", "03/11/2026", "Windows 11 Enterprise Clean OS Installation", "Configured UEFI bootable flash drives with official Windows 11 Enterprise media; partitioned NVMe SSD storage (GPT scheme) and completed OS base installation."),
            ("Wednesday", "04/11/2026", "Automated Staging via Provisioning Packages (.ppkg)", "Connected corporate provisioning package (.ppkg) generated with Windows Configuration Designer: automatically injected Wi-Fi profiles, corporate root CA certificates, and OEM drivers."),
            ("Thursday", "05/11/2026", "Essential Enterprise Software & Security Suite Installation", "Installed corporate software stack: Microsoft 365 Enterprise Apps (Word, Excel, Outlook, Teams), Zscaler Private Access VPN, CrowdStrike Falcon EDR antivirus, and Google Chrome Enterprise."),
            ("Friday", "06/11/2026", "Domain Joining, Active Directory Staging & User Profile Handover", "Joined newly staged laptops to `cwg.local` Active Directory domain; moved computer objects into `OU=Workstations,OU=CWG-Staff`; tested domain login, BitLocker drive encryption escrow to AD, and handed over to onboarding employee.")
        ],
        "sketch_title": "Complete Laptop Staging & Active Directory Onboarding Workflow",
        "sketch": """[New Laptop Hardware] ===> [UEFI / Secure Boot / TPM 2.0 Verification]
                                    |
[Clean Windows 11 Enterprise Install (GPT Partition Scheme)]
                                    |
[Custom .ppkg Provisioning] ---> Injects Wi-Fi, Root CA, Asset OEM Drivers
                                    |
[Software Suite Deployment] ---> M365 Apps, Zscaler VPN, CrowdStrike EDR
                                    |
[Active Directory Domain Join] -> cwg.local Domain -> GPO Policy Enforcement
                                    |
[BitLocker 256-bit Encryption] -> Recovery Key Escrowed to Active Directory
                                    |
[Final Quality Check & Physical Handover to Onboarding Corporate Staff]""",
        "student_comment": "Acquired comprehensive practical mastery in end-to-end enterprise laptop staging, automated provisioning with .ppkg packages, essential enterprise security deployment, and Active Directory domain enrollment."
    }
]

def generate_html(weeks):
    pages_html = []
    
    for w in weeks:
        rows_html = []
        for day, date, nature, details in w["days"]:
            rows_html.append(f"""
            <tr>
              <td class="col-day">{day}<small>{date}</small></td>
              <td class="col-nature">{nature}</td>
              <td class="col-details">{details}</td>
            </tr>
            """)
        
        table_rows = "".join(rows_html)
        
        page = f"""
        <div class="logbook-page">
          <div class="doc-header">
            <div>
              <div class="doc-title-main">COMPUTER WAREHOUSE GROUP (CWG) PLC</div>
              <div class="doc-title-sub">STUDENT INDUSTRIAL WORK EXPERIENCE SCHEME (SIWES) — TECHNICAL LOGBOOK</div>
            </div>
            <div class="doc-header-meta">
              <strong>TRAINING RECORD</strong><br>
              CWG Infrastructure & Engineering
            </div>
          </div>

          <div class="info-bar">
            <div class="info-item">
              <span>Section / Department</span>
              <strong>{w["section"]}</strong>
            </div>
            <div class="info-item">
              <span>Operational Unit</span>
              <strong><span class="section-badge {w["badge_class"]}">{w["badge_text"]}</span></strong>
            </div>
            <div class="info-item">
              <span>Period of Training</span>
              <strong>{w["period"]}</strong>
            </div>
            <div class="info-item">
              <span>Logbook Week</span>
              <strong style="color: #059669; font-size: 13px;">{w["week_number"]}</strong>
            </div>
          </div>

          <div class="weekly-project-box">
            <div class="box-tag">PROJECT / MAIN JOB ASSIGNED DURING THE WEEK:</div>
            <div class="box-heading">{w["job_done"]}</div>
          </div>

          <div class="work-done-box">
            <div class="box-tag">WORK DONE DURING THE WEEK:</div>
            <div class="work-done-text">{w["work_done_summary"]}</div>
          </div>

          <table class="logbook-table">
            <thead>
              <tr>
                <th style="width: 14%;">Day & Date</th>
                <th style="width: 25%;">Nature of Work Done</th>
                <th style="width: 61%;">Daily Detailed Technical Activities & Operations Performed</th>
              </tr>
            </thead>
            <tbody>
              {table_rows}
            </tbody>
          </table>

          <div class="sketch-box">
            <div class="sketch-header">
              <span class="sketch-title">Technical Diagram / Schematic / Architectural Workflow ({w["sketch_title"]})</span>
            </div>
            <div class="sketch-content">{w["sketch"]}</div>
          </div>

          <div class="footer-signoff">
            <div>
              <div class="signoff-box-title">Student Comments & Key Learnings for the Week</div>
              <div class="student-comment-text">"{w["student_comment"]}"</div>
            </div>
            <div>
              <div class="signoff-box-title">Industry Supervisor</div>
              <div class="signature-line"></div>
              <div class="signature-caption">Signature & Date Stamp</div>
            </div>
            <div>
              <div class="signoff-box-title">Institutional Supervisor</div>
              <div class="signature-line"></div>
              <div class="signature-caption">SIWES Coordinator Signature</div>
            </div>
          </div>
        </div>
        """
        pages_html.append(page)
    
    all_pages = "".join(pages_html)
    
    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CWG Plc - SIWES Technical Logbook (Weeks 11 to 21)</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 8mm 11mm 10mm 11mm;
  }}
  * {{ box-sizing: border-box; }}
  body {{
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background: #ffffff;
    font-size: 9.5px;
    line-height: 1.35;
    margin: 0;
    padding: 0;
  }}
  .logbook-page {{
    page-break-after: always;
    padding-bottom: 2px;
    height: 100%;
  }}
  .logbook-page:last-child {{
    page-break-after: avoid;
  }}
  .doc-header {{
    border-bottom: 2px solid #059669;
    padding-bottom: 4px;
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }}
  .doc-title-main {{
    font-size: 12.5px;
    font-weight: 800;
    color: #065f46;
    letter-spacing: -0.01em;
    text-transform: uppercase;
  }}
  .doc-title-sub {{
    font-size: 9.5px;
    color: #475569;
    font-weight: 600;
  }}
  .doc-header-meta {{
    text-align: right;
    font-size: 8.5px;
    color: #64748b;
  }}
  .doc-header-meta strong {{
    color: #0f172a;
  }}
  .info-bar {{
    display: grid;
    grid-template-columns: 1.8fr 1.4fr 1.4fr 0.9fr;
    gap: 6px;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 5px;
    padding: 5px 8px;
    margin-bottom: 6px;
    font-size: 9px;
  }}
  .info-item span {{
    display: block;
    font-size: 7.5px;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748b;
    letter-spacing: 0.04em;
  }}
  .info-item strong {{
    color: #0f172a;
    font-size: 9.5px;
  }}
  .section-badge {{
    display: inline-block;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }}
  .badge-metering {{
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
  }}
  .badge-itsupport {{
    background: #dbeafe;
    color: #1e40af;
    border: 1px solid #bfdbfe;
  }}
  .badge-software {{
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }}

  /* Weekly Project Box */
  .weekly-project-box {{
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-left: 3.5px solid #059669;
    border-radius: 4px;
    padding: 5px 8px;
    margin-bottom: 5px;
  }}
  .box-tag {{
    font-size: 8px;
    font-weight: 800;
    color: #065f46;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-bottom: 1px;
  }}
  .box-heading {{
    font-size: 9.5px;
    font-weight: 700;
    color: #0f172a;
  }}

  /* Explicit WORK DONE DURING THE WEEK Box */
  .work-done-box {{
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-left: 3.5px solid #16a34a;
    border-radius: 4px;
    padding: 5px 8px;
    margin-bottom: 6px;
  }}
  .work-done-box .box-tag {{
    color: #15803d;
  }}
  .work-done-text {{
    font-size: 9px;
    color: #166534;
    line-height: 1.35;
    text-align: justify;
  }}

  /* Daily Table */
  table.logbook-table {{
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 6px;
    font-size: 9px;
  }}
  table.logbook-table th {{
    background: #f1f5f9;
    color: #334155;
    text-align: left;
    padding: 4px 6px;
    font-weight: 700;
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border: 1px solid #cbd5e1;
  }}
  table.logbook-table td {{
    padding: 4px 6px;
    vertical-align: top;
    border: 1px solid #cbd5e1;
    line-height: 1.3;
  }}
  table.logbook-table tr:nth-child(even) td {{
    background: #f8fafc;
  }}
  .col-day {{
    font-weight: 700;
    color: #0f172a;
    white-space: nowrap;
  }}
  .col-day small {{
    display: block;
    font-weight: 500;
    color: #64748b;
    font-size: 8px;
  }}
  .col-nature {{
    font-weight: 600;
    color: #065f46;
  }}
  .col-details {{
    color: #1e293b;
  }}

  /* Sketch / Diagram Box */
  .sketch-box {{
    border: 1px dashed #94a3b8;
    background: #f8fafc;
    border-radius: 4px;
    padding: 4px 8px;
    margin-bottom: 6px;
  }}
  .sketch-header {{
    margin-bottom: 2px;
  }}
  .sketch-title {{
    font-size: 8px;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }}
  .sketch-content {{
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8px;
    line-height: 1.25;
    color: #0f172a;
    white-space: pre-wrap;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 3px;
    padding: 4px 6px;
    margin: 0;
  }}

  /* Bottom Comment & Signoff Box */
  .footer-signoff {{
    display: grid;
    grid-template-columns: 2.2fr 1fr 1fr;
    gap: 6px;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 5px 8px;
    font-size: 8.5px;
  }}
  .signoff-box-title {{
    font-size: 7.5px;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 1px;
  }}
  .student-comment-text {{
    color: #1e293b;
    font-style: italic;
    line-height: 1.25;
  }}
  .signature-line {{
    margin-top: 8px;
    border-bottom: 1px dotted #94a3b8;
    height: 8px;
  }}
  .signature-caption {{
    font-size: 7.5px;
    color: #64748b;
    text-align: center;
    margin-top: 1px;
  }}
</style>
</head>
<body>
{all_pages}
</body>
</html>
"""
    return full_html

html_output = generate_html(weeks_data)
with open('SIWES_TECHNICAL_LOGBOOK.html', 'w', encoding='utf-8') as f:
    f.write(html_output)

print("Generated SIWES_TECHNICAL_LOGBOOK.html with explicit WORK DONE DURING THE WEEK successfully.")

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
html_abs = os.path.abspath('SIWES_TECHNICAL_LOGBOOK.html')
pdf_abs = os.path.abspath('SIWES_TECHNICAL_LOGBOOK_REPORT.pdf')

cmd = [
    edge_path,
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    f'--print-to-pdf={pdf_abs}',
    html_abs
]

res = subprocess.run(cmd, capture_output=True, text=True)
print(f"Edge conversion exit code: {res.returncode}")
if os.path.exists(pdf_abs):
    print(f"SUCCESS! Updated PDF at {pdf_abs} with size {os.path.getsize(pdf_abs)} bytes.")
else:
    print("PDF generation failed.")
