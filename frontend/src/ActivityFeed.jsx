function ActivityFeed() {
  const activities = [
    { id: 1, message: "Sale completed — CWG-000184", detail: "₦20,000 · cashier Grace", time: "2m ago" },
    { id: 2, message: "Low stock alert — Toothpaste 140g", detail: "Only 3 left · reorder at 10", time: "18m ago" },
    { id: 3, message: "Restock received — Basmati Rice 5kg", detail: "+40 bags · by Daniel", time: "1h ago" },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mt-6">
      <p className="text-sm font-medium text-gray-900 mb-3">Live activity</p>

      {activities.map((activity) => (
        <div key={activity.id} className="border-b border-gray-100 last:border-0 py-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.detail}</p>
            </div>
            <p className="text-xs text-gray-400 whitespace-nowrap ml-3">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ActivityFeed