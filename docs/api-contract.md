POST /api/login

Request:
{
  "email": "owner@cwgretail.com",
  "password": "secret123"
}

Response (200):
{
  "token": "1|abcdEXAMPLEtokenstring",
  "user": {
    "id": 1,
    "name": "Amaka Obi",
    "email": "owner@cwgretail.com",
    "role": "owner"
  }
}

Response (401):
{
  "message": "Invalid credentials"
}


GET /api/products

Query params: ?category=drinks  ?sort=stock_asc  ?status=low_stock

Response (200):
{
  "products": [
    {
      "id": 1,
      "name": "Coca-Cola 50cl",
      "sku": "CC-50",
      "category": "drinks",
      "sell_price": 500,
      "current_stock": 3,
      "reorder_threshold": 10,
      "stock_status": "low_stock"
    }
  ]
}
