function NeedsRestocking() {
  const items = [
    { id: 1, name: "Semovita 2kg", status: "low", left: "8 pack left", reorder: "reorder 15", percent: 40 },
    { id: 2, name: "Golden Morn Cereal 900g", status: "low", left: "5 pack left", reorder: "reorder 12", percent: 25 },
    { id: 3, name: "Coca-Cola Pack of 12", status: "out", left: "0 pack left", reorder: "reorder 10", percent: 0 },
    { id: 4, name: "Toothpaste 140g", status: "low", left: "3 tube left", reorder: "reorder 10", percent: 20 },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-medium text-gray-900">Needs restocking</p>
        <p className="text-xs text-green-700 cursor-pointer">Open inventory</p>
      </div>

      {items.map((item) => (
        <div key={item.id} className="py-3 border-b border-gray-100 last:border-0">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-gray-900">{item.name}</p>
            <span className={item.status === "out" ? "text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600" : "text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700"}>
              {item.status === "out" ? "Out of stock" : "Low"}
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className={item.status === "out" ? "h-1.5 rounded-full bg-red-500" : "h-1.5 rounded-full bg-yellow-500"}
              style={{ width: `${item.percent}%` }}
            />
          </div>

          <p className="text-xs text-gray-400 mt-1">{item.left} · {item.reorder}</p>
        </div>
      ))}
    </div>
  )
}

export default NeedsRestocking