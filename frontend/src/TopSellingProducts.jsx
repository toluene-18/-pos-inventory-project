function TopSellingProducts() {
  const products = [
    { rank: 1, name: "Basmati Rice 5kg", sku: "CWG-GRN-001", revenue: "₦817,000", sold: "86 sold" },
    { rank: 2, name: "Vegetable Oil 3L", sku: "CWG-COK-003", revenue: "₦532,500", sold: "71 sold" },
    { rank: 3, name: "Indomie Noodles (Carton)", sku: "CWG-SNK-006", revenue: "₦396,800", sold: "64 sold" },
    { rank: 4, name: "Bottled Water Pack of 12", sku: "CWG-BEV-008", revenue: "₦104,400", sold: "58 sold" },
    { rank: 5, name: "Peak Milk Powder 400g", sku: "CWG-DRY-004", revenue: "₦225,600", sold: "47 sold" },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-medium text-gray-900">Top selling products</p>
        <p className="text-xs text-green-700 cursor-pointer">View report</p>
      </div>

      {products.map((product) => (
        <div key={product.rank} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500">
              {product.rank}
            </div>
            <div>
              <p className="text-sm text-gray-900">{product.name}</p>
              <p className="text-xs text-gray-400">{product.sku}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-900">{product.revenue}</p>
            <p className="text-xs text-gray-400">{product.sold}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TopSellingProducts