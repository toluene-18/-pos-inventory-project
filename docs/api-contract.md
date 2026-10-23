# CWG Retail Suite — Complete API Contract Reference

> **API Base URL:** `http://localhost:8000/api` (Local) / `/api`  
> **Authentication:** Bearer Token via Laravel Sanctum  
> **Data Format:** `application/json` (Multipart for photo uploads)  
> **Current Version:** v1.2 (October 2026)

---

## 1. Authentication & Staff Management

### `POST /api/register`
Creates a self-registered staff member in `pending` status until approved by an Owner.

- **Access:** Public
- **Request Body:**
```json
{
  "name": "Amina Bello",
  "email": "amina@cwgretail.com",
  "password": "Password123!",
  "password_confirmation": "Password123!"
}
```
- **Response (201 Created):**
```json
{
  "message": "Account created successfully. Please wait for an Owner to approve your account.",
  "user": {
    "id": 4,
    "name": "Amina Bello",
    "email": "amina@cwgretail.com",
    "role": "cashier",
    "status": "pending"
  }
}
```

---

### `POST /api/login`
Authenticates an active user and issues a Sanctum Bearer token.

- **Access:** Public
- **Request Body:**
```json
{
  "email": "owner@cwgretail.com",
  "password": "password"
}
```
- **Response (200 OK):**
```json
{
  "message": "Login successful.",
  "token": "1|qW8eR9tY0uI...",
  "user": {
    "id": 1,
    "name": "Chinedu Okafor",
    "email": "owner@cwgretail.com",
    "role": "owner",
    "status": "active"
  }
}
```
- **Response (403 Forbidden - Pending Account):**
```json
{
  "message": "Your account is currently pending owner approval."
}
```
- **Response (401 Unauthorized):**
```json
{
  "message": "Invalid email or password."
}
```

---

### `GET /api/user`
Retrieves the currently authenticated user's session profile.

- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "id": 1,
  "name": "Chinedu Okafor",
  "email": "owner@cwgretail.com",
  "role": "owner",
  "status": "active",
  "created_at": "2026-10-22T08:00:00.000000Z"
}
```

---

### `GET /api/staff`
Retrieves all registered staff members with approval status and roles.

- **Access:** `role:owner,manager`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Chinedu Okafor",
    "email": "owner@cwgretail.com",
    "role": "owner",
    "status": "active"
  },
  {
    "id": 2,
    "name": "Amina Bello",
    "email": "amina@cwgretail.com",
    "role": "cashier",
    "status": "active"
  }
]
```

---

### `PATCH /api/staff/{user}/approve`
Updates a staff member's role and approval status.

- **Access:** `role:owner`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "role": "cashier",
  "status": "active"
}
```
- **Response (200 OK):**
```json
{
  "message": "Staff member updated successfully.",
  "user": {
    "id": 2,
    "name": "Amina Bello",
    "role": "cashier",
    "status": "active",
    "approved_by": 1,
    "approved_at": "2026-10-23T10:00:00.000000Z"
  }
}
```

---

## 2. Product Catalogue

### `GET /api/products`
Retrieves all active inventory products. For Cashiers, the `cost_price` is automatically masked from the response payload for store financial privacy.

- **Access:** Authenticated (`role:owner,manager,cashier`)
- **Query Params:** `?category=Groceries&search=Rice`
- **Response (200 OK - Owner/Manager):**
```json
[
  {
    "id": 1,
    "name": "Mama Gold Rice 5kg",
    "sku": "RIC-MG-005",
    "category": "Groceries",
    "unit": "bag",
    "cost_price": "6500.00",
    "selling_price": "7800.00",
    "image_url": "http://localhost:8000/storage/products/mama_gold_rice_5kg.svg",
    "inventory": {
      "id": 1,
      "product_id": 1,
      "quantity": 42,
      "reorder_threshold": 10
    }
  }
]
```
- **Response (200 OK - Cashier):**
```json
[
  {
    "id": 1,
    "name": "Mama Gold Rice 5kg",
    "sku": "RIC-MG-005",
    "category": "Groceries",
    "unit": "bag",
    "cost_price": null,
    "selling_price": "7800.00",
    "image_url": "http://localhost:8000/storage/products/mama_gold_rice_5kg.svg",
    "inventory": {
      "quantity": 42,
      "reorder_threshold": 10
    }
  }
]
```

---

### `POST /api/products/create`
Creates a new product with an initial stock inventory record.

- **Access:** `role:owner,manager`
- **Request Body:**
```json
{
  "name": "Peak Milk Powder 400g Tin",
  "sku": "MLK-PK-400",
  "category": "Groceries",
  "unit": "tin",
  "cost_price": 3200.00,
  "selling_price": 3900.00,
  "quantity": 28,
  "reorder_threshold": 10,
  "image_url": "http://localhost:8000/storage/products/peak_milk_powder_400g.svg"
}
```
- **Response (201 Created):** Returns created product object with initialized inventory relation.

---

### `POST /api/products/upload-image`
Uploads a product photograph or vector pack SVG to the server public storage.

- **Access:** `role:owner,manager`
- **Content-Type:** `multipart/form-data`
- **Form Data:** `image: <binary file>` (Supported: JPEG, PNG, WEBP, GIF, SVG. Max: 5MB)
- **Response (200 OK):**
```json
{
  "message": "Image uploaded successfully.",
  "image_url": "http://localhost:8000/storage/products/prod_1729688400.png"
}
```

---

### `PATCH /api/products/{product}`
Updates product catalogue details, prices, or unit of measurement.

- **Access:** `role:owner,manager`
- **Request Body:**
```json
{
  "selling_price": 4100.00,
  "reorder_threshold": 15
}
```
- **Response (200 OK):** Returns updated product object.

---

### `DELETE /api/products/{product}`
Soft-deactivates a product so historical sales and receipts remain mathematically intact.

- **Access:** `role:owner,manager`
- **Response (200 OK):**
```json
{
  "message": "Product deactivated successfully."
}
```

---

## 3. Stock Adjustments & Restock Station

### `GET /api/stock-adjustments`
Returns a running historical audit feed of all incoming deliveries, recount reconciliations, and recorded damages.

- **Access:** `role:owner,manager`
- **Response (200 OK):**
```json
[
  {
    "id": 1,
    "product_id": 1,
    "user_id": 1,
    "type": "increase",
    "quantity_change": 30,
    "reason": "RESTOCK: Supplier delivery — Olam Agri Direct Waybill #OA-891",
    "created_at": "2026-10-23T14:00:00.000000Z",
    "product": {
      "id": 1,
      "name": "Mama Gold Rice 5kg",
      "sku": "RIC-MG-005",
      "unit": "bag"
    },
    "user": {
      "id": 1,
      "name": "Chinedu Okafor"
    }
  }
]
```

---

### `POST /api/products/{product}/stock-adjustments`
Executes an atomic inventory modification with row-locking and writes an audit log entry.

- **Access:** `role:owner,manager`
- **Request Body:**
```json
{
  "type": "increase",
  "quantity": 25,
  "reason": "RESTOCK: Delivery from Dufil Prima Foods"
}
```
- **Response (201 Created):**
```json
{
  "message": "Stock adjusted successfully.",
  "inventory": {
    "product_id": 1,
    "quantity": 67
  },
  "adjustment": {
    "id": 8,
    "quantity_change": 25,
    "type": "increase"
  }
}
```

---

## 4. Point of Sale & Checkout

### `POST /api/sales`
Completes an atomic retail transaction. Evaluates inventory with `SELECT ... FOR UPDATE`, deducts stock, records sale items, and returns the generated receipt.

- **Access:** Authenticated (`role:owner,manager,cashier`)
- **Request Body:**
```json
{
  "payment_method": "cash",
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 5,
      "quantity": 1
    }
  ]
}
```
- **Response (201 Created):**
```json
{
  "message": "Sale completed successfully.",
  "sale": {
    "id": 42,
    "receipt_number": "CWG-20261023-0042",
    "cashier_id": 2,
    "total": "18400.00",
    "payment_method": "cash",
    "created_at": "2026-10-23T14:15:00.000000Z",
    "items": [
      {
        "id": 84,
        "product_id": 1,
        "quantity": 2,
        "unit_price": "7800.00",
        "subtotal": "15600.00",
        "product": {
          "name": "Mama Gold Rice 5kg",
          "sku": "RIC-MG-005"
        }
      }
    ]
  }
}
```
- **Response (422 Unprocessable Entity - Insufficient Stock):**
```json
{
  "message": "Insufficient stock for product 'Mama Gold Rice 5kg'. Available: 1"
}
```

---

### `GET /api/sales`
Lists historical sales transactions with pagination and filters. Cashiers only receive their own transactions; Owners and Managers receive store-wide transactions.

- **Query Params:**
  - `page`: Page number (default: `1`)
  - `payment_method`: Filter by `cash`, `card`, `transfer`
  - `from`: Start date `YYYY-MM-DD`
  - `to`: End date `YYYY-MM-DD`
- **Response (200 OK):** Standard Laravel paginated collection with `data`, `current_page`, `last_page`, `total`.

---

### `GET /api/sales/{sale}`
Retrieves itemized details for a specific receipt.

- **Response (200 OK):** Sale object populated with full item relations, unit prices, and cashier author.

---

## 5. Reports & Business Intelligence

### `GET /api/reports/sales`
Returns high-level business intelligence metrics and payment method distributions.

- **Access:** `role:owner,manager`
- **Query Params:** `?from=2026-09-01&to=2026-10-23`
- **Response (200 OK):**
```json
{
  "summary": {
    "total_sales": 18,
    "total_revenue": "222550.00",
    "average_sale_value": "12363.88"
  },
  "payment_breakdown": [
    {
      "payment_method": "cash",
      "count": 10,
      "total": "125000.00"
    },
    {
      "payment_method": "card",
      "count": 5,
      "total": "62550.00"
    },
    {
      "payment_method": "transfer",
      "count": 3,
      "total": "35000.00"
    }
  ]
}
```
