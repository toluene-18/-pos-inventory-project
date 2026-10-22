# TECHNICAL REPORT ON STUDENTS’ INDUSTRIAL WORK EXPERIENCE SCHEME (SIWES)

### UNDERTAKEN AT

## COMPUTER WAREHOUSE GROUP (CWG) PLC
**PLOT 8, COMMERCIAL ENCLAVE, VICTORIA ISLAND, LAGOS STATE**

---

### BY

**[STUDENT FULL NAME]**  
**MATRICULATION NO: [MATRIC / REGISTRATION NUMBER]**

---

### SUBMITTED TO:

**DEPARTMENT OF COMPUTER ENGINEERING**  
**SCHOOL OF ELECTRICAL SYSTEMS ENGINEERING**  
**[NAME OF YOUR INSTITUTION / UNIVERSITY, e.g., FEDERAL UNIVERSITY OF TECHNOLOGY, AKURE (FUTA)]**

---

### IN PARTIAL FULFILMENT OF THE REQUIREMENT FOR THE AWARD OF THE DEGREE OF BACHELOR OF ENGINEERING (B. ENG) IN COMPUTER ENGINEERING

**DECEMBER 2026**

---

## CERTIFICATION

This is to certify that this technical report is a detailed and authentic account of the Student Industrial Work Experience Scheme (SIWES) undertaken by **[STUDENT FULL NAME]** with matriculation number **[MATRIC NUMBER]** at **CWG PLC (COMPUTER WAREHOUSE GROUP)**, Plot 8, Commercial Enclave, Victoria Island, Lagos State. The author is the sole author of this technical report, which represents both theoretical foundations and practical applications executed during the training period. 

This report has been prepared in accordance with the regulatory standards guiding industrial training reporting in the Department of Computer Engineering.

<br><br>

_____________________________________________  
**[STUDENT FULL NAME]**  
*Student (Author)* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**SIGNATURE / DATE**

<br><br>

_____________________________________________  
**[INDUSTRY BASED SUPERVISOR]**  
*Head of IT Support & Systems Engineering, CWG Plc* &nbsp;&nbsp;&nbsp;&nbsp;**SIGNATURE / DATE**

<br><br>

_____________________________________________  
**[INSTITUTIONAL SIWES COORDINATOR]**  
*Departmental SIWES Coordinator* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**SIGNATURE / DATE**

<br><br>

_____________________________________________  
**[HEAD OF DEPARTMENT]**  
*Head, Department of Computer Engineering* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**SIGNATURE / DATE**

---

## DEDICATION

I dedicate this technical report to Almighty God for His unfailing grace, wisdom, divine protection, and sustenance throughout the duration of this industrial training program. 

I also dedicate this work to my beloved parents, family members, and mentors for their relentless prayers, moral foundation, and unwavering financial support throughout my educational journey.

---

## ACKNOWLEDGMENTS

I express my deepest gratitude to Almighty God for His guidance, love, mercy, and provision that saw me successfully through this internship program.

My profound appreciation goes to the **Student Industrial Work Experience Scheme (SIWES) Unit**, the **Industrial Training Fund (ITF)**, and the **Department of Computer Engineering** for providing an institutional framework enabling undergraduates to acquire practical industry competencies. Special thanks go to the Departmental SIWES Coordinator and the Head of Department for their academic supervision and leadership.

I am profoundly grateful to the management of **CWG Plc (Computer Warehouse Group)** for granting me the privilege to intern within their engineering and IT enterprise divisions. Sincere appreciation goes to my industry-based supervisors, the **IT Support & Infrastructure Leads**, and the **Metering & Energy Engineering Supervisors** for their patience, constructive technical feedback, and mentorship. 

I also extend heartfelt gratitude to the senior engineering personnel who guided my rotations:
- The **Metering & Field Calibration Engineers** for teaching me hardware meter diagnostics, prepaid smart meter calibration, and firmware integrity testing.
- The **IT Support & Systems Administrators** for guiding me through Active Directory management, enterprise domain joining, automated laptop provisioning (`.ppkg`), hardware maintenance, and network infrastructure management.
- The **Software Engineering & Application Development Team Leads** for assigning me the two major enterprise software projects:
  1. **CWG Retail Suite** (Enterprise Point of Sale, Barcode Scanning, and Inventory Auditing Platform).
  2. **LeaveTrack** (Corporate Employee Leave, Absence Workflow, and Approval Management Application).

Finally, I acknowledge my fellow interns and colleagues for the mutual collaboration, code reviews, and camaraderie shared throughout this rewarding experience.

---

## TABLE OF CONTENTS

- **COVER PAGE** ..................................................................................... i
- **CERTIFICATION** ................................................................................. ii
- **DEDICATION** .................................................................................... iii
- **ACKNOWLEDGMENTS** ............................................................................... iv
- **TABLE OF CONTENTS** ............................................................................. v
- **LIST OF FIGURES** .............................................................................. vii
- **CHAPTER ONE: INTRODUCTION TO SIWES PROGRAM** ................................................. 1
  - 1.1 Background of SIWES ........................................................................ 1
  - 1.2 The Industrial Training Fund (ITF) .......................................................... 2
  - 1.3 Aims and Objectives of the SIWES Program ................................................... 2
  - 1.4 Bodies Involved in the Management of SIWES ................................................. 3
  - 1.5 Attachment Schedule and Rotation Overview ................................................. 3
- **CHAPTER TWO: OVERVIEW OF COMPUTER WAREHOUSE GROUP (CWG) PLC** ................................... 5
  - 2.1 Corporate Background and History of CWG Plc ................................................ 5
  - 2.2 Core Business Sectors and Subsidiaries ..................................................... 6
  - 2.3 Corporate Vision, Mission, and Core Values ................................................. 7
  - 2.4 Organizational Structure and Hierarchy ..................................................... 8
  - 2.5 Contributions to Nigeria’s Digital Economy and Technological Growth ........................ 9
- **CHAPTER THREE: INDUSTRIAL WORK EXPERIENCE & TECHNICAL ACTIVITIES** ............................ 11
  - 3.1 SECTION A: METERING DEPARTMENT & ENERGY AUTOMATION ......................................... 11
    - 3.1.1 Overview of Electrical Energy Metering Systems ........................................ 11
    - 3.1.2 Single-Phase and Three-Phase Smart Meter Operations .................................... 12
    - 3.1.3 Meter Testing, Bench Calibration, and Voltage-Current Diagnostics ...................... 14
    - 3.1.4 Firmware Flashing, Parameterization, and Optical Port Configuration .................... 16
    - 3.1.5 Tamper Detection, Anti-Fraud Mechanisms, and Field Auditing ........................... 18
  - 3.2 SECTION B: IT SUPPORT, PROXIMITY, AND INFRASTRUCTURE MANAGEMENT ........................... 20
    - 3.2.1 Help Desk Operations, Ticket Resolution, and SLA Compliance ............................ 20
    - 3.2.2 System Staging, Custom Windows Deployment, and `.ppkg` Provisioning .................. 22
    - 3.2.3 Microsoft Active Directory (AD) Administration ......................................... 24
      - *3.2.3.1 User Provisioning, Organizational Units (OUs), and Group Policies (GPOs)* ......... 25
      - *3.2.3.2 Domain Joining, Account Delegation, and Access Control Lists (ACLs)* .............. 26
    - 3.2.4 Computer Hardware Maintenance, Component-Level Repairs, and Upgrades ................. 27
    - 3.2.5 Enterprise Networking and Structured Cabling Systems ................................... 29
      - *3.2.5.1 Structured Cabling, Patch Panels, and Switch Patching* ............................. 30
      - *3.2.5.2 Cisco Packet Tracer Network Simulations and Wireless AP Deployments* .............. 32
    - 3.2.6 IT Asset Management, Hardware Tagging, and Inventory Audit Control ..................... 34
  - 3.3 SECTION C: SOFTWARE DEVELOPMENT AND ENTERPRISE APPLICATIONS ............................... 36
    - 3.3.1 Full-Stack Web Development Architecture and Methodologies ............................ 36
    - 3.3.2 Major Project I: CWG Retail Suite (POS & Inventory Management Platform) .............. 38
      - *3.3.2.1 Problem Analysis and Architectural Design (Decoupled React + Laravel)* ........... 38
      - *3.3.2.2 Database Normalization (3NF) and Schema Implementation* ........................... 40
      - *3.3.2.3 Point of Sale (POS) Checkout Engine, Barcode Scanning, and Cash Tender* ........... 42
      - *3.3.2.4 Browser-Native 80mm Thermal Receipt Generation Engine* ............................ 44
      - *3.3.2.5 Product Catalogue, Image Upload Subsystem, and Live Profit Margin Badge* .......... 45
      - *3.3.2.6 Inventory Auditing, Multi-Unit Tracking, and Stock Adjustment Projection* ........ 47
      - *3.3.2.7 Sales History, Multi-Date Filter Presets, and Thermal Reprinting* ................. 49
      - *3.3.2.8 Staff Access Control, Self-Registration, and Owner Approval Security* ............ 50
    - 3.3.3 Major Project II: LeaveTrack (Employee Leave & Absence Workflow System) .............. 52
      - *3.3.3.1 Background and System Requirements Analysis* ...................................... 52
      - *3.3.3.2 Leave Allocation, Balance Ledger, and Multi-Tier Approval Workflows* ............. 53
      - *3.3.3.3 Automated Email Notification and Calendar Synchronization Engine* ................. 55
      - *3.3.3.4 User Interface Architecture and Administrative Reporting Dashboard* ................ 56
- **CHAPTER FOUR: CONCLUSION, CHALLENGES ENCOUNTERED, AND RECOMMENDATIONS** ......................... 58
  - 4.1 Conclusion ................................................................................. 58
  - 4.2 Practical Technical Challenges Encountered and Resolutions ................................ 59
  - 4.3 Recommendations to Educational Institutions and Industry Employers ....................... 61
- **REFERENCES** ................................................................................... 63

---

## LIST OF FIGURES

- **Figure 1.1:** Official Logo of the Industrial Training Fund (ITF) ........................................ 2
- **Figure 2.1:** Corporate Brand Identity and Logo of CWG Plc ............................................... 5
- **Figure 2.2:** CWG Corporate Organizational Hierarchy (Organogram) ........................................ 8
- **Figure 3.1:** Single-Phase and Three-Phase Smart Prepaid Energy Meters Under Bench Inspection ........... 13
- **Figure 3.2:** Energy Meter Test Bench Calibration Setup with Reference Meter Standard .................... 15
- **Figure 3.3:** Optical Probe Interface and Parameterization Software Configuration ....................... 17
- **Figure 3.4:** Meter Terminal Cover Tamper Switch Mechanism and Terminal Block ........................... 19
- **Figure 3.5:** Enterprise IT Help Desk Incident Logging and Ticketing Interface ........................... 21
- **Figure 3.6:** Laptop Provisioning Package (`.ppkg`) Automated Staging Screen ............................. 23
- **Figure 3.7:** Microsoft Active Directory Users and Computers (ADUC) Management Console .................. 25
- **Figure 3.8:** Domain Controller Group Policy Management Console (GPMC) Configuration .................... 26
- **Figure 3.9:** Hardware Maintenance: Component Replacement of Laptop RAM and NVMe SSD Hard Drive .......... 28
- **Figure 3.10:** Data Centre Server Rack with Structured Cat6a Cabling and Patch Panel .................... 31
- **Figure 3.11:** Cisco Packet Tracer Enterprise Network Simulation and VLAN Topology ...................... 33
- **Figure 3.12:** Barcode Asset Tagging and Physical Hardware Verification in IT Store ..................... 35
- **Figure 3.13:** Decoupled Full-Stack Architecture of CWG Retail Suite (React 19 + Laravel 12) ........... 39
- **Figure 3.14:** Relational Entity-Relationship Diagram (ERD) of CWG Retail Suite ........................ 41
- **Figure 3.15:** Point of Sale (POS) Interface with Live Barcode Search and Cart Line Items ................ 43
- **Figure 3.16:** Automatic Change Calculator and Tender Settlement Dialog ................................. 44
- **Figure 3.17:** Browser-Native 80mm Thermal Receipt Preview and Print Layout ............................. 45
- **Figure 3.18:** Product Form Modal with Product Photo Uploader and Dynamic Profit Margin Badge ........... 46
- **Figure 3.19:** Dual-View Product Catalogue: Table View vs Visual Grid Card View .......................... 47
- **Figure 3.20:** Inventory Stock Valuation Screen and Dual-Mode Stock Adjustment Modal .................... 48
- **Figure 3.21:** Sales History Audit Trail with Preset Date Range Filters ................................. 49
- **Figure 3.22:** Settings Page Showing Owner-Governed Staff Approval and Role Assignment .................. 51
- **Figure 3.23:** LeaveTrack Application Architecture and Leave Request State Machine ..................... 54
- **Figure 3.24:** LeaveTrack Employee Dashboard and Leave Balance Accrual Ledger ........................... 56
- **Figure 3.25:** LeaveTrack Multi-Tier Manager Approval Interface and Calendar View ....................... 57
- **Figure 4.1:** Automated Backend Unit and Feature Test Execution Summary (62 Passing Tests) ............... 60

---

## CHAPTER ONE: INTRODUCTION TO SIWES PROGRAM

### 1.1 Background of the SIWES Program
The Student Industrial Work Experience Scheme (SIWES) was established in 1973 by the Federal Government of Nigeria through the Industrial Training Fund (ITF). The scheme was conceived as a vital human-capital development strategy to bridge the widening gap between the theoretical concepts taught in tertiary academic institutions and the practical, technological competencies required in the industrial and corporate labor markets.

Before the inception of SIWES, employers across major industrial sectors in Nigeria raised grave concerns that engineering, technological, and scientific graduates lacked hands-on proficiency with industrial machinery, commercial software platforms, and real-world problem-solving methodologies. Consequently, SIWES was incorporated as an accredited, mandatory graduation requirement for undergraduate students across disciplines including Engineering, Technology, Environmental Studies, Computer Science, and Information Systems.

### 1.2 The Industrial Training Fund (ITF)
The Industrial Training Fund (ITF), established under Decree No. 47 of 1971 (now an Act of the National Assembly), serves as Nigeria's premier agency for workforce skill acquisition and industrial development. ITF collaborates with regulatory bodies—including the National Universities Commission (NUC), the National Board for Technical Education (NBTE), and the National Commission for Colleges of Education (NCCE)—to administer, monitor, and fund industrial training across all tertiary institutions in Nigeria.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 1.1]                                      |
|                                                                       |
|  Figure 1.1: Official Logo of the Industrial Training Fund (ITF)      |
|  Description: Insert a clean graphic displaying the official seal and |
|  emblem of the Industrial Training Fund (ITF) of Nigeria.             |
+-----------------------------------------------------------------------+
```

### 1.3 Aims and Objectives of the SIWES Program
The core aims and objectives of the SIWES program include:
1. **Practical Skill Exposure:** To provide tertiary students with direct practical exposure to real-world industrial tools, hardware diagnostics, and enterprise software engineering environments.
2. **Transition Facilitation:** To facilitate a seamless transition from the academic environment into the professional industrial workplace.
3. **Equipment Handling:** To allow students to interact with, calibrate, and service specialized equipment, instrumentation, and infrastructure not readily accessible within university teaching laboratories.
4. **Professional Conduct & Ethics:** To inculcate professional work ethics, team collaboration, safety compliance protocols, and organizational communication standards.
5. **Employment Assessment:** To provide prospective corporate employers with the opportunity to evaluate undergraduate talent for future post-graduation employment.

### 1.4 Bodies Involved in the Management of SIWES
The efficient coordination of the SIWES initiative relies on four institutional pillars:
- **The Federal Government of Nigeria:** Provides policy formulation and funding through budgetary allocations.
- **The Industrial Training Fund (ITF):** Manages national logistics, coordinates supervisor zonal visitations, distributes allowances, and organizes orientation seminars.
- **Educational Institutions (NUC / NBTE / Universities):** Assign institutional supervisors, establish departmental SIWES units, define academic credit units, and assess technical defense presentations.
- **Host Employers & Industries:** Offer technical placement slots, assign industry-based supervisors, and integrate students into live commercial and technical operations.

### 1.5 Attachment Schedule and Rotation Overview
I commenced my six-month industrial attachment at **CWG Plc (Computer Warehouse Group)** on **[START DATE, e.g., 2nd of June 2026]**. To provide a comprehensive, multi-disciplinary experience spanning hardware engineering, enterprise IT infrastructure, and modern software development, my industrial training was structured across three major operating units:
1. **The Metering & Energy Engineering Department:** Hardware diagnostics, smart prepaid energy meter calibration, terminal testing, and optical firmware parameterization.
2. **The IT Support, Proximity & Systems Administration Unit:** Level-2 end-user proximity support, laptop staging via custom Windows provisioning packages (`.ppkg`), Microsoft Active Directory domain management, hardware component repairs, and data center structured cabling.
3. **The Software Engineering & Enterprise Solutions Unit:** Software Development Life Cycle (SDLC) methodologies, agile project delivery, and the end-to-end development of two flagship web applications:
   - **CWG Retail Suite:** A multi-tier, decoupled Point of Sale (POS), Inventory Management, and Stock Auditing system built with Laravel 12 and React 19.
   - **LeaveTrack:** An enterprise Employee Absence, Leave Accrual, and Multi-Tier Approval Workflow Management platform.

---

## CHAPTER TWO: OVERVIEW OF COMPUTER WAREHOUSE GROUP (CWG) PLC

### 2.1 Corporate Background and History of CWG Plc
**Computer Warehouse Group (CWG) Plc** is one of Africa’s largest and most respected Information and Communications Technology (ICT) conglomerates. Founded in 1992, CWG transitioned from a hardware supply vendor into a full-service Pan-African technology integrator and pan-African technology solutions provider. The company is publicly quoted on the Nigerian Exchange Limited (NGX) and operates regional operational subsidiaries across Nigeria, Ghana, Uganda, and Cameroon.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 2.1]                                      |
|                                                                       |
|  Figure 2.1: Corporate Brand Identity and Logo of CWG Plc            |
|  Description: Insert the official high-resolution corporate logo and |
|  brand insignia of Computer Warehouse Group (CWG) Plc.               |
+-----------------------------------------------------------------------+
```

### 2.2 Core Business Sectors and Subsidiaries
CWG Plc operates through specialized strategic business units delivering enterprise-grade technological infrastructure:
- **Enterprise IT Systems & Cloud Infrastructure:** Deployment of high-availability data center servers, enterprise virtualization (VMware, Hyper-V), SAN storage systems, and cloud migration services.
- **Banking Automation & Payment Solutions:** Deployment and maintenance of Automated Teller Machines (ATMs), hardware security modules (HSM), core banking integration, and transaction switching software.
- **Smart Metering & Energy Utilities:** Provision of smart prepaid electricity meters, Advanced Metering Infrastructure (AMI), meter data management (MDM), and utility revenue collection platforms.
- **Communications & Network Infrastructure:** VSAT satellite links, metropolitan fiber optic backbones, structured enterprise cabling, and SD-WAN networks.
- **Custom Enterprise Software & ERP Solutions:** In-house design and deployment of specialized SaaS applications for retail POS, supply chain tracking, and workforce automation.

### 2.3 Corporate Vision, Mission, and Core Values
- **Corporate Vision:** To be the leading Pan-African technology solutions provider, empowering businesses and governments through reliable and innovative technology.
- **Corporate Mission:** To deliver innovative, reliable, and secure technology solutions that generate tangible business value and drive operational excellence for our clients.
- **Core Values (C-W-G):**
  - **Competence:** Relentless pursuit of world-class technical expertise and continuous professional mastery.
  - **Integrity:** Uncompromising transparency, ethical corporate conduct, and data security standards.
  - **Innovation:** Designing forward-thinking technological solutions that anticipate evolving industry challenges.
  - **Customer Centricity:** Prioritizing customer satisfaction, rapid incident turnaround, and high system uptime.

### 2.4 Organizational Structure and Hierarchy
CWG Plc is headed by the Group Managing Director / Chief Executive Officer (GMD/CEO), supported by executive directors overseeing core directorates.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 2.2]                                      |
|                                                                       |
|  Figure 2.2: CWG Corporate Organizational Hierarchy (Organogram)     |
|  Description: Insert a clear organizational chart showing the executive|
|  management hierarchy of CWG Plc: Board of Directors -> GMD/CEO ->     |
|  Director of Enterprise Systems -> IT Operations -> Metering Division|
|  -> Software Development -> Support Services.                         |
+-----------------------------------------------------------------------+
```

### 2.5 Contributions to Nigeria’s Digital Economy and Technological Growth
CWG Plc plays a pivotal role in the modernization of Nigeria's digital infrastructure:
1. **Financial Inclusion:** Processing millions of transactions daily across commercial banks and fintech operators via CWG ATM and switching infrastructure.
2. **Power Sector Transformation:** Providing hundreds of thousands of smart prepaid meters to electricity distribution companies (DisCos) under national metering programs, reducing electricity theft and improving revenue reconciliation.
3. **Local Talent Development:** Annually training engineering and computer science undergraduates through structured industrial placement schemes, contributing to local engineering capacity.

---

## CHAPTER THREE: INDUSTRIAL WORK EXPERIENCE & TECHNICAL ACTIVITIES

---

### 3.1 SECTION A: METERING DEPARTMENT & ENERGY AUTOMATION

#### 3.1.1 Overview of Electrical Energy Metering Systems
During my rotation in the **Metering Department**, I was integrated into the team responsible for inspecting, testing, parameterizing, and certifying smart prepaid and postpaid electrical energy meters before deployment to power distribution utilities. Energy meters measure real power consumption ($kWh$) by continuously sampling line voltage and load current.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.1]                                      |
|                                                                       |
|  Figure 3.1: Single-Phase and Three-Phase Smart Prepaid Energy Meters  |
|  Description: Insert a photograph of single-phase and three-phase     |
|  smart electricity meters on the diagnostic inspection workbench,     |
|  showing the digital LCD screens, keypad interfaces, and terminals.  |
+-----------------------------------------------------------------------+
```

#### 3.1.2 Single-Phase and Three-Phase Smart Meter Operations
I worked with two principal classifications of electricity meters:
1. **Single-Phase Residential Meters:** Operates at $230\text{V}$, $50\text{Hz}$ with current ratings up to $60\text{A}$ or $100\text{A}$. These meters utilize a current shunt resistor or current transformer (CT) along with a voltage divider network feeding an Analog Front End (AFE) metering Integrated Circuit (IC).
2. **Three-Phase Commercial & Industrial Meters:** Operates at $400\text{V}$ line-to-line ($230\text{V}$ line-to-neutral). These meters measure three active phase currents and voltages, computing instantaneous real power ($P$), reactive power ($Q$), power factor ($\cos \phi$), and total active energy consumption ($E$).

#### 3.1.3 Meter Testing, Bench Calibration, and Diagnostics
To ensure compliance with national metering standards (NEMSA regulations), meters undergo automated test bench verification. I operated multi-position automated meter test benches capable of simultaneously testing up to 20 meters.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.2]                                      |
|                                                                       |
|  Figure 3.2: Energy Meter Test Bench Calibration Setup                |
|  Description: Insert a photograph of the meter calibration test bench |
|  showing reference standard meters, voltage/current injection sources,|
|  and optical pulse-detection sensors verifying meter accuracy.        |
+-----------------------------------------------------------------------+
```

Key testing routines executed included:
- **Starting Current Test:** Ensuring the meter registers energy accumulation at the threshold starting current ($0.4\% I_b$).
- **No-Load Creep Test:** Ensuring zero pulses are emitted when voltage is applied but the load circuit is open ($0\text{A}$).
- **Accuracy / Calibration Verification:** Injecting nominal current at unity ($1.0$) and lagging ($0.5$) power factors. The percentage error is calculated as:
  $$\text{Percentage Error } (\%) = \left(\frac{E_{\text{meter}} - E_{\text{reference}}}{E_{\text{reference}}}\right) \times 100$$
  Meters with errors exceeding Class $1.0$ tolerances ($\pm 1.0\%$) were flagged for firmware recalibration or shunt realignment.

#### 3.1.4 Firmware Flashing, Parameterization, and Optical Port Configuration
Meters communicate with field calibration laptops via **IEC 62056-21** optical communication probes magnetically affixed to the front panel port.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.3]                                      |
|                                                                       |
|  Figure 3.3: Optical Probe Interface and Parameterization Software   |
|  Description: Insert a screenshot or photo showing an optical read-head|
|  connected to a smart meter's infrared optical port, with configuration|
|  software setting tariffs, meter IDs, and encryption keys on laptop.  |
+-----------------------------------------------------------------------+
```

Tasks performed included:
- Configuring the Standard Transfer Specification (STS) encryption keys and Tariff Index.
- Programming the Maximum Demand (MD) limits and over-current trip thresholds.
- Generating and loading 20-digit STS recharge credit tokens via optical communication scripts to test credit acceptance and relay disconnector operation.

#### 3.1.5 Tamper Detection, Anti-Fraud Mechanisms, and Field Auditing
Electricity theft is a significant operational challenge in power distribution. Smart meters incorporate hardware and firmware anti-tamper protections:
- **Terminal Cover Open Detection:** A mechanical micro-switch trips when the terminal cover is unbolted, logging a tamper event timestamp and opening the internal disconnect latch.
- **Magnetic Field Immunity:** Hall-effect sensors detect strong external neodymium magnets placed near the current sensors, tripping safety shutoffs.
- **Neutral Missing / Current Bypass Detection:** Comparing phase current with neutral return current ($|I_{\text{phase}} - I_{\text{neutral}}| > \Delta I_{\text{threshold}}$). When a disparity is detected, the meter measures energy consumption based on the higher current channel.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.4]                                      |
|                                                                       |
|  Figure 3.4: Meter Terminal Cover Tamper Switch Mechanism             |
|  Description: Insert a photo showing the interior of an energy meter  |
|  revealing the micro-switch tamper sensor, current transformers, and  |
|  the heavy-duty internal bi-stable disconnect latch relay.           |
+-----------------------------------------------------------------------+
```

---

### 3.2 SECTION B: IT SUPPORT, PROXIMITY, AND INFRASTRUCTURE MANAGEMENT

#### 3.2.1 Help Desk Operations, Ticket Resolution, and SLA Compliance
During my assignment to the **IT Support & Proximity Unit**, I functioned as a Level-2 support technician responding to corporate user incidents logged through the enterprise IT Service Management (ITSM) ticketing platform.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.5]                                      |
|                                                                       |
|  Figure 3.5: Enterprise IT Help Desk Incident Logging Interface       |
|  Description: Insert a screenshot showing the ITSM ticket dashboard   |
|  displaying logged user incidents, severity levels, assignees, and    |
|  Service Level Agreement (SLA) countdown metrics.                     |
+-----------------------------------------------------------------------+
```

My responsibilities included:
- Diagnosing corporate software anomalies, operating system blue-screen (BSOD) faults, and local printer driver issues.
- Configuring corporate Microsoft 365 Outlook accounts, Microsoft Teams, and secure remote VPN connections using Zscaler and Cisco AnyConnect.
- Enforcing Multi-Factor Authentication (MFA) registrations via Microsoft Authenticator.

#### 3.2.2 System Staging, Custom Windows Deployment, and `.ppkg` Provisioning
To maintain security compliance, corporate laptops were not deployed with standard retail Windows operating systems. Instead, all systems underwent a rigorous staging workflow using custom **Windows Provisioning Packages (`.ppkg`)** created with the Windows Configuration Designer:

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.6]                                      |
|                                                                       |
|  Figure 3.6: Laptop Provisioning Package (`.ppkg`) Staging Screen     |
|  Description: Insert a screenshot showing an automated Windows         |
|  provisioning screen executing unattended installation of software,   |
|  encryption, security certificates, and domain profile bindings.     |
+-----------------------------------------------------------------------+
```

The automated staging pipeline involved:
1. Booting the laptop via a specialized bootable USB media containing the customized corporate `.ppkg` package.
2. The provisioning engine applied enterprise security baselines, enforced BitLocker full-disk encryption with recovery keys escrowed to the corporate cloud, installed enterprise antivirus agents, and provisioned corporate Wi-Fi certificates.
3. Once the package execution completed, the system was registered in the endpoint inventory database and connected via Ethernet to complete Microsoft SCCM/Intune software distribution.

#### 3.2.3 Microsoft Active Directory (AD) Administration
A cornerstone of my IT support training was hands-on administration within the **Microsoft Active Directory Domain Services (AD DS)** environment running on Windows Server.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.7]                                      |
|                                                                       |
|  Figure 3.7: Active Directory Users and Computers (ADUC) Console      |
|  Description: Insert a screenshot of the Active Directory Users and   |
|  Computers interface showing the organizational tree structure, user  |
|  attributes, departmental OUs, and security group memberships.        |
+-----------------------------------------------------------------------+
```

##### 3.2.3.1 User Provisioning, Organizational Units (OUs), and Group Policies (GPOs)
- **User Lifecycle Management:** Creating and onboarding new corporate user identities according to naming standards (e.g. `firstname.lastname@cwg-plc.com`), configuring user principal names (UPNs), department metadata, and managerial reporting hierarchies.
- **Organizational Unit (OU) Architecture:** Navigating and structuring OUs aligned with operational departments (Finance, Enterprise Systems, Metering, Software Engineering).
- **Group Policy Objects (GPOs):** Assisting senior administrators in enforcing domain-wide security GPOs, such as mandatory 90-day password expiration, minimum 12-character complexity requirements, automated screen locks after 5 minutes of inactivity, and disabling unauthorized USB removable mass storage drives.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.8]                                      |
|                                                                       |
|  Figure 3.8: Domain Controller Group Policy Management Console (GPMC) |
|  Description: Insert a screenshot of the Group Policy Management       |
|  Console showing password policies, account lockout thresholds, and   |
|  USB port restriction rules enforced across the enterprise domain.    |
+-----------------------------------------------------------------------+
```

##### 3.2.3.2 Domain Joining, Account Delegation, and Access Control Lists (ACLs)
- Binding newly staged endpoint laptops to the enterprise domain (`cwg-plc.local`), ensuring DNS resolution was pointed to the internal Active Directory Domain Controllers.
- Resolving trust relationship failures between workstations and the primary domain controller (`Test-ComputerSecureChannel`).
- Unlocking locked-out user accounts following consecutive failed logon attempts and executing secure password resets with mandatory password change upon next logon.
- Assigning granular NTFS folder permissions and Access Control Lists (ACLs) to network share drives based on Security Group memberships.

#### 3.2.4 Computer Hardware Maintenance, Component-Level Repairs, and Upgrades
Beyond software diagnostics, I performed physical hardware repairs on corporate workstations and laptops (predominantly Dell Latitude and HP EliteBook series).

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.9]                                      |
|                                                                       |
|  Figure 3.9: Hardware Maintenance: Laptop RAM and NVMe SSD Upgrades   |
|  Description: Insert a photograph showing a disassembled laptop chassis|
|  on an anti-static ESD workbench, demonstrating the installation of   |
|  DDR4 RAM modules, M.2 NVMe solid-state drives, and battery units.    |
+-----------------------------------------------------------------------+
```

Key operations performed:
- Disassembling system chassis following Electrostatic Discharge (ESD) safety protocols.
- Upgrading obsolete mechanical hard drives (HDDs) to high-speed PCIe M.2 NVMe Solid State Drives (SSDs), followed by clean OS imaging.
- Diagnosing faulty memory channels through MemTest86 diagnostic passes and reseating or upgrading DDR4/DDR5 SO-DIMM RAM modules.
- Replacing swollen lithium-ion battery packs, cracked LCD display assemblies, and damaged charging ports.
- Cleaning thermal heat sinks, de-dusting cooling fan assemblies, and reapplying high-conductivity thermal paste to CPU/GPU dies to remediate thermal throttling.

#### 3.2.5 Enterprise Networking and Structured Cabling Systems
I participated in enterprise network maintenance within the corporate office and regional branch sites.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.10]                                     |
|                                                                       |
|  Figure 3.10: Data Centre Server Rack with Structured Cat6a Cabling   |
|  Description: Insert a photograph of a data center server rack showing|
|  modular patch panels, horizontal cable management ducting, Cisco     |
|  Catalyst switches, fiber patch leads, and neat cabling bundles.      |
+-----------------------------------------------------------------------+
```

##### 3.2.5.1 Structured Cabling, Patch Panels, and Switch Patching
- Measuring, pulling, and routing Category 6 (Cat6) and Category 6A (Cat6a) Unshielded/Shielded Twisted Pair cables through overhead cable trays and trunking.
- Terminating Cat6 cables to **RJ45 keystones** and standard modular **patch panels** according to the **TIA/EIA-568B** wiring standard:
  $$\text{Pinout: } \text{White/Orange, Orange, White/Green, Blue, White/Blue, Green, White/Brown, Brown}$$
- Using multi-function cable testers to verify continuity, wire map alignment, and identify short circuits, split pairs, or open pins.
- Patching wall data outlets to Cisco Catalyst 2960/3850 network switches using color-coded patch cords, maintaining precise port-to-desk documentation.

##### 3.2.5.2 Cisco Packet Tracer Network Simulations and Wireless AP Deployments
Under the tutelage of senior network engineers, I simulated enterprise network designs in **Cisco Packet Tracer**:
- Designing hierarchical network architectures comprising Core, Distribution, and Access layers.
- Configuring Virtual Local Area Networks (VLANs) to segregate corporate traffic into Data, Voice (VoIP), Guest Wi-Fi, and Management subnets.
- Setting up Inter-VLAN routing using Router-on-a-Stick and Layer 3 Switch Switch Virtual Interfaces (SVIs).
- Configuring access lists (ACLs) and Dynamic Host Configuration Protocol (DHCP) snooping on access switches.
- Physically deploying and mounting enterprise Cisco and Ubiquiti Wireless Access Points (WAPs), configuring Power over Ethernet (PoE 802.3af/at) ports on network switches.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.11]                                     |
|                                                                       |
|  Figure 3.11: Cisco Packet Tracer Enterprise Network Simulation       |
|  Description: Insert a screenshot of a Cisco Packet Tracer simulation |
|  topology showing core routers, distribution switches, access switches,|
|  VLAN assignments, DHCP pools, and workstation endpoints.             |
+-----------------------------------------------------------------------+
```

#### 3.2.6 IT Asset Management, Hardware Tagging, and Inventory Audit Control
An essential aspect of IT governance is asset lifecycle accountability. I assisted in maintaining the corporate IT Asset Management Register:
- Printing and adhering tamper-evident **barcode asset tags** to all incoming enterprise hardware (monitors, laptops, servers, UPS units).
- Using handheld barcode scanners to audit physical hardware within the secure IT storage facilities.
- Reconciling physical audit tallies with the digital database register, documenting decommissioned hardware, and scheduling retired systems for secure cryptographic data erasure.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.12]                                     |
|                                                                       |
|  Figure 3.12: Barcode Asset Tagging and Physical Hardware Verification|
|  Description: Insert a photograph showing the application of barcode  |
|  asset tags onto laptops, asset barcode scanners, and inventory logs  |
|  maintained within the secure IT hardware storage vault.              |
+-----------------------------------------------------------------------+
```

---

### 3.3 SECTION C: SOFTWARE DEVELOPMENT AND ENTERPRISE APPLICATIONS

#### 3.3.1 Full-Stack Web Development Architecture and Methodologies
Assigned to the software development unit, I applied modern engineering practices using the **Agile Scrum** methodology:
- Developing full-stack applications following clean architecture, separation of concerns, and REST architectural constraints.
- Utilizing Git for version control, branching strategies (`feature/*`, `bugfix/*`), pull requests, and peer code reviews.
- Adhering to strict code quality standards, automated linting via ESLint, comprehensive unit testing, and keeping individual frontend components strictly under 300 lines of code for optimal maintainability.

---

#### 3.3.2 Major Project I: CWG Retail Suite (POS & Inventory Management Platform)

##### 3.3.2.1 Problem Analysis and Architectural Design (Decoupled React + Laravel)
Small-to-medium retail outlets in Nigeria often suffer from stock discrepancies, cashier reconciliation disputes, and lack of real-time visibility into inventory valuation. To address these issues, I designed and developed **CWG Retail Suite**—an enterprise web-based Point of Sale, Barcode Scanning, and Inventory Auditing platform.

The system features a **decoupled client-server architecture**:
1. **Backend Engine:** Built on **Laravel 12** and **PHP 8.2**, providing a stateless JSON REST API guarded by **Laravel Sanctum** token authentication.
2. **Frontend SPA:** Built on **React 19** and bundled with **Vite 8**, featuring responsive vanilla CSS with native Dark and Warm-Light mode themes.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.13]                                     |
|                                                                       |
|  Figure 3.13: Decoupled Full-Stack Architecture of CWG Retail Suite   |
|  Description: Insert a technical block diagram illustrating the flow   |
|  from React 19 Frontend -> Sanctum Bearer Token Auth -> Laravel 12 API |
|  Controllers -> Transactional Eloquent ORM -> MySQL Database.        |
+-----------------------------------------------------------------------+
```

##### 3.3.2.2 Database Normalization (3NF) and Schema Implementation
The database schema was normalized to Third Normal Form (3NF) to eliminate data redundancy and preserve referential integrity:

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.14]                                     |
|                                                                       |
|  Figure 3.14: Relational Entity-Relationship Diagram (ERD) of CWG POS |
|  Description: Insert the detailed database ERD showing tables:        |
|  users, products, inventories, sales, sale_items, stock_adjustments,  |
|  their primary/foreign keys, and relational cardinality connections.  |
+-----------------------------------------------------------------------+
```

1. **`users`:** Stores identity and authorization attributes (`id`, `name`, `email`, `password`, `role`: `owner|manager|cashier`, `status`: `pending|active|inactive`, `approved_by`, `approved_at`).
2. **`products`:** Tracks catalogue items (`id`, `name`, `sku` [indexed unique], `category`, `unit`, `cost_price`, `sell_price`, `image_path`, `is_active`).
3. **`inventories`:** Dedicated stock tracking linked 1:1 with products (`id`, `product_id`, `quantity`, `reorder_threshold`).
4. **`sales`:** Transaction records (`id`, `user_id`, `payment_method`, `subtotal`, `total`, `created_at`).
5. **`sale_items`:** Line-item breakdown (`id`, `sale_id`, `product_id`, `quantity`, `unit_price`, `line_total`).
6. **`stock_adjustments`:** Immutable audit log (`id`, `product_id`, `user_id`, `type`: `increase|decrease`, `quantity_change`, `reason`, `created_at`).

##### 3.3.2.3 Point of Sale (POS) Checkout Engine, Barcode Scanning, and Cash Tender
The POS checkout interface (`PointOfSale.jsx`) provides rapid cashier workflows:
- **Instant Search & Barcode Scan:** Captures hardware barcode scanner inputs; pressing `Enter` on an exact SKU match immediately appends the product to the active cart.
- **Stock-Capped Cart:** Increments are validated against real-time database stock levels, preventing overselling.
- **Multi-Payment Tender & Cash Calculator:** Supports **Cash**, **Card**, and **Bank Transfer**. For cash payments, entering the cash tendered immediately computes the change due, with quick-tender buttons (₦500, ₦1,000, ₦5,000, ₦10,000, ₦20,000).

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.15]                                     |
|                                                                       |
|  Figure 3.15: POS Checkout Interface with Barcode Search and Cart     |
|  Description: Insert a screenshot of the POS screen showing catalogue  |
|  tiles with stock indicators, cart lines on the sidebar, and payment  |
|  method selection pills in Dark Mode.                                 |
+-----------------------------------------------------------------------+
```

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.16]                                     |
|                                                                       |
|  Figure 3.16: Automatic Change Calculator and Tender Settlement Dialog|
|  Description: Insert a screenshot showing the payment panel with cash |
|  tender inputs, automated change calculation display, and checkout    |
|  completion button.                                                   |
+-----------------------------------------------------------------------+
```

##### 3.3.2.4 Browser-Native 80mm Thermal Receipt Generation Engine
Upon checkout completion, the system renders a clean, modal receipt preview formatted for 80mm POS thermal printers (`ReceiptModal.jsx`). Using specialized `@media print` CSS rules, clicking **Print Receipt** targets only the receipt layout, omitting all background navigation, toolbars, and buttons.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.17]                                     |
|                                                                       |
|  Figure 3.17: Browser-Native 80mm Thermal Receipt Layout              |
|  Description: Insert a screenshot showing the rendered 80mm thermal   |
|  receipt preview with store branding, date, receipt ID, line items,   |
|  tax, payment method, and custom footer note.                         |
+-----------------------------------------------------------------------+
```

##### 3.3.2.5 Product Catalogue, Image Upload Subsystem, and Live Profit Margin Badge
The Products module (`Products.jsx`) allows management to add and edit products:
- **Product Photo Upload:** An integrated uploader (`ProductImageUploader.jsx`) accepts drag-and-drop or file selection, sending files to `POST /api/products/upload-image`, which validates formats (JPEG, PNG, WebP) and stores files in `storage/app/public/products`.
- **Live Profit Margin % Badge:** In the product form modal, typing Cost Price and Selling Price triggers dynamic margin calculations:
  $$\text{Profit Margin } (\%) = \left(\frac{\text{Selling Price} - \text{Cost Price}}{\text{Selling Price}}\right) \times 100$$
  The badge highlights in **Green** ($\ge 20\%$), **Amber** ($0-19\%$), or **Red** if priced below cost.
- **Dual View Modes:** Instant toggle between standard **Table View** and image-centric **Grid Card View**.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.18]                                     |
|                                                                       |
|  Figure 3.18: Product Form Modal with Photo Uploader and Margin Badge |
|  Description: Insert a screenshot of the Add Product modal displaying  |
|  SKU, category, unit, cost price, sell price, dynamic green profit    |
|  margin badge (+₦X, XX%), and the image upload zone.                  |
+-----------------------------------------------------------------------+
```

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.19]                                     |
|                                                                       |
|  Figure 3.19: Product Catalogue: Table View vs Visual Grid Card View  |
|  Description: Insert a side-by-side screenshot showing the products   |
|  catalogue in (a) tabular data view and (b) visual grid card view.    |
+-----------------------------------------------------------------------+
```

##### 3.3.2.6 Inventory Auditing, Multi-Unit Tracking, and Stock Adjustment Projection
The Inventory module (`Inventory.jsx`) centralizes stock oversight:
- **KPI Summary Cards:** Displays *Products Tracked*, *Units on Hand*, *Stock Valuation at Cost Price* (Owner/Manager only), and *Needs Attention*.
- **Stock Adjustment Modal (`StockAdjustModal.jsx`):** Allows stock adjustments with dual-mode selector pills: `↓ Restock in` vs `↑ Remove out`. The input reflects the product's unit (e.g. `Quantity (bag)`). The user selects an audit reason (e.g. Supplier delivery, damaged goods, physical count discrepancy, spoilage). A live projection indicator displays:
  $$\text{New Level: } [\text{Current Stock}] \rightarrow [\text{Projected Stock}]$$

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.20]                                     |
|                                                                       |
|  Figure 3.20: Inventory Stock Valuation & Adjustment Projection Modal |
|  Description: Insert a screenshot of the Inventory table showing stock|
|  valuation KPI cards alongside the Stock Adjustment modal with live   |
|  projection arrow (Current -> Projected).                             |
+-----------------------------------------------------------------------+
```

##### 3.3.2.7 Sales History, Multi-Date Filter Presets, and Thermal Reprinting
The Sales screen (`Sales.jsx`) provides audit tracking:
- **Role Scoping:** Cashiers see only their own transactions; Owners and Managers inspect store-wide sales.
- **Time Presets:** Fast filtering by *All Time*, *Today*, *Last 7 Days*, and *Last 30 Days*.
- **Reprinting:** Past receipts can be re-opened in the thermal receipt modal and reprinted.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.21]                                     |
|                                                                       |
|  Figure 3.21: Sales History Audit Trail with Preset Date Range Filters|
|  Description: Insert a screenshot showing historical transactions,     |
|  payment method pills, cashier badges, total revenue calculations,    |
|  and receipt view buttons.                                            |
+-----------------------------------------------------------------------+
```

##### 3.3.2.8 Staff Access Control, Self-Registration, and Owner Approval Security
To prevent unauthorized account creation:
1. New staff register via `/register`. Accounts start with status set to `pending`.
2. Attempts to log in before approval are rejected with an informative error message.
3. The store owner logs in, navigates to `/settings`, and reviews pending accounts. The owner can click **Approve** (assigning the finalized role: Cashier, Manager, or Owner) or **Reject**. Once approved, the account becomes active.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.22]                                     |
|                                                                       |
|  Figure 3.22: Settings Page: Staff Approval & Role Assignment Modal   |
|  Description: Insert a screenshot of the Settings screen showing the  |
|  Pending Approvals card banner, staff roster table, role assignment   |
|  dropdown, and deactivation toggles.                                  |
+-----------------------------------------------------------------------+
```

---

#### 3.3.3 Major Project II: LeaveTrack (Employee Leave & Absence Workflow System)

##### 3.3.3.1 Background and System Requirements Analysis
The second enterprise application developed during my internship was **LeaveTrack**—an automated Employee Leave, Absence Workflow, and Attendance Ledger application. In many corporate organizations, leave applications are tracked using manual paper forms or disconnected spreadsheets, resulting in lost documentation, disputes regarding remaining leave days, and uncoordinated absences.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.23]                                     |
|                                                                       |
|  Figure 3.23: LeaveTrack Architecture and Leave Request State Machine |
|  Description: Insert an architectural diagram illustrating the request|
|  lifecycle: Employee Draft -> Pending Supervisor -> Approved/Rejected |
|  -> HR Clearance -> Calendar Ledger Update.                           |
+-----------------------------------------------------------------------+
```

LeaveTrack was designed to deliver:
1. **Self-Service Leave Applications:** Allowing employees to submit leave requests with date pickers, type selection (Annual, Sick, Maternity/Paternity, Compassionate, Study), and document attachments (e.g. medical certificates).
2. **Dynamic Entitlement & Accrual Calculator:** Automatically computing annual leave allocations based on job grade and tenure, prorating monthly entitlements, and enforcing maximum leave carry-overs.
3. **Multi-Tier Hierarchical Approval Workflow:** Routing requests automatically to the employee’s immediate Line Manager, followed by departmental Head, and final HR clearance.
4. **Active Directory User Synchronization:** Integrating with the enterprise Active Directory to map employee records, managerial reporting lines, and email addresses.

##### 3.3.3.2 Leave Allocation, Balance Ledger, and Multi-Tier Approval Workflows
The core backend architecture tracks leave ledgers using double-entry accounting principles:
- Each employee record maintains a `leave_balance` ledger recording:
  $$\text{Available Days} = \text{Annual Entitlement} + \text{Carryover} - \text{Approved Days Taken} - \text{Pending Days Requested}$$
- Submitting an application places requested days into an escrow state (`pending_approval`), preventing duplicate applications during holiday seasons.
- Line managers receive email review notifications with one-click approval/rejection links. Rejections require a mandatory review note.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.24]                                     |
|                                                                       |
|  Figure 3.24: LeaveTrack Employee Dashboard and Balance Ledger        |
|  Description: Insert a screenshot of the LeaveTrack staff dashboard    |
|  showing leave balance cards (Annual, Sick, Casual days remaining),   |
|  leave history timeline, and new request modal.                       |
+-----------------------------------------------------------------------+
```

##### 3.3.3.3 Automated Email Notification and Calendar Synchronization Engine
LeaveTrack integrates background job queues for automated notifications:
- Email dispatches alert managers of pending approvals and notify employees of application decisions.
- Generates **iCalendar (`.ics`)** calendar invitations, synchronizing approved leave dates directly into Microsoft Outlook and Google Calendars to prevent meeting scheduling conflicts.

##### 3.3.3.4 User Interface Architecture and Administrative Reporting Dashboard
The user interface features role-segregated screens:
- **Employee Portal:** Application submission, leave balance ledger, and calendar tracker.
- **Supervisor Management Console:** Team availability calendar, pending approval inbox, and historical approval audit trail.
- **HR Administrator Dashboard:** Analytics charts showing monthly absentee trends, departmental leave balances, and CSV export functionality for payroll integration.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 3.25]                                     |
|                                                                       |
|  Figure 3.25: LeaveTrack Supervisor Approval Interface & Calendar View|
|  Description: Insert a screenshot showing the Manager Approval inbox  |
|  with pending team requests, employee leave balance history, and team  |
|  monthly calendar overlay.                                            |
+-----------------------------------------------------------------------+
```

---

## CHAPTER FOUR: CONCLUSION, CHALLENGES ENCOUNTERED, AND RECOMMENDATIONS

### 4.1 Conclusion
My six-month Student Industrial Work Experience Scheme (SIWES) at **Computer Warehouse Group (CWG) Plc** provided valuable practical exposure across the computer engineering discipline. Rotating across the **Metering Department**, **IT Support & Infrastructure Unit**, and the **Software Development Unit** allowed me to bridge academic theoretical concepts with enterprise industrial execution.

Key competencies gained include:
- Precision hardware testing, calibration, and firmware parameterization of smart electricity meters.
- Enterprise systems administration through Microsoft Active Directory, Windows provisioning packages (`.ppkg`), hardware troubleshooting, and structured network cabling.
- Full-stack web engineering, database normalization (3NF), transactional row-level locking, and decoupled UI component design across two flagship applications (**CWG Retail Suite** and **LeaveTrack**).
- Professional workplace communication, agile sprint collaboration, and adherence to security baselines.

### 4.2 Practical Technical Challenges Encountered and Resolutions

#### 1. Concurrency and Race Conditions During Simultaneous POS Checkout
- **Challenge:** Multiple cashiers attempting to sell the final inventory unit of a product simultaneously created race conditions leading to negative stock counts.
- **Resolution:** Implemented pessimistic database row-level locking (`lockForUpdate()`) within transactional closures (`DB::transaction`). The first checkout locks the inventory row, forcing subsequent requests to evaluate updated stock levels before proceeding.

#### 2. Cost Price and Margin Information Masking
- **Challenge:** Prevent frontline cashiers from accessing wholesale cost prices and gross profit margins on POS terminals.
- **Resolution:** Enforced security at the API serialization boundary. In `ProductController@index`, if the authenticated user role is not `owner` or `manager`, the Eloquent collection executes `$products->each->makeHidden('cost_price')`, preventing cost data from ever reaching client-side network traffic.

#### 3. Enterprise Active Directory Trust Relationship Failures
- **Challenge:** Workstations staged with custom images occasionally failed domain authentication with the error: *"The trust relationship between this workstation and the primary domain failed."*
- **Resolution:** Diagnosed duplicate secure channel machine account passwords caused by cloning. Utilized administrative PowerShell commands (`Reset-ComputerMachinePassword` and `Test-ComputerSecureChannel -Repair -Credential`) to re-establish domain controller synchronization without requiring full operating system re-installation.

#### 4. Frontend Component Maintainability and Code Quality
- **Challenge:** As features grew, files like `Inventory.jsx` and `ProductFormModal.jsx` expanded beyond 400 lines, making maintainability difficult.
- **Resolution:** Refactored monolithic files into modular sub-components (`InventoryKpis.jsx`, `InventoryTable.jsx`, `ProductImageUploader.jsx`, `ProductKpis.jsx`, `ProductsTable.jsx`, `SalesKpis.jsx`). All frontend source files now remain strictly under 300 lines of code.

```
+-----------------------------------------------------------------------+
|  [SPACE RESERVED FOR FIGURE 4.1]                                      |
|                                                                       |
|  Figure 4.1: Automated Backend Test Execution Summary (62 Passing)    |
|  Description: Insert a screenshot of the command terminal displaying  |
|  the green 'PASS' summary of the 62 passing Laravel feature and unit  |
|  tests verifying security, checkout, and inventory business logic.    |
+-----------------------------------------------------------------------+
```

### 4.3 Recommendations to Educational Institutions and Industry Employers

#### Recommendations to Educational Institutions (Universities & Polytechnics):
1. **Incorporate Modern Web Frameworks and Tools:** Academic curricula should integrate modern web technologies—such as React, Laravel, Node.js, and Git version control—alongside traditional procedural languages.
2. **Practical Enterprise Systems Labs:** Establish practical lab modules covering Active Directory, enterprise virtualization (hypervisors), domain administration, and structured cabling.
3. **Structured Mentorship Monitoring:** Increase academic supervisor interaction during the training period to provide continuous alignment with industrial demands.

#### Recommendations to Industry Employers (Host Organizations):
1. **Structured Rotational Frameworks:** Formalize inter-departmental rotations (such as between Hardware/Metering and Software) so interns gain well-rounded technical exposure.
2. **Access to Cloud and Sandbox Tooling:** Provide interns with safe sandbox environments for hands-on experimentation with cloud services, CI/CD pipelines, and enterprise software platforms.
3. **Soft Skills and Communication Workshops:** Incorporate workshops focused on professional presentation, technical documentation, and agile communication.

---

## REFERENCES

1. Industrial Training Fund. (2004). *Information and Guideline for Students Industrial Work Experience Scheme (SIWES)*. Jos, Nigeria: ITF Publications.
2. Akerejola, O. (2008). *Information and Guidelines on Students Industrial Work Experience Scheme*. Revised Edition, ITF, Jos.
3. Otwell, T. (2026). *Laravel Documentation: The PHP Framework for Web Artisans*. Laravel LLC. Retrieved from https://laravel.com/docs
4. React Core Team. (2026). *React: The Library for Web and Native User Interfaces*. Meta Platforms Inc. Retrieved from https://react.dev
5. Microsoft Corporation. (2025). *Active Directory Domain Services Overview*. Microsoft Learn. Retrieved from https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview
6. Cisco Systems Inc. (2024). *CCNA Routing and Switching Study Guide: Network Fundamentals and LAN Switching Technologies*. Cisco Press.
7. International Electrotechnical Commission. (2020). *Electricity Metering Equipment (AC) - General Requirements, Tests and Test Conditions*. IEC 62052-11. Geneva: IEC.
8. Computer Warehouse Group. (2026). *CWG Plc Corporate Profile and Technical Systems Engineering Standards*. Lagos, Nigeria: CWG Corporate Communications.
