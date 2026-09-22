import StatCard from './StatCard.jsx'
import SalesChart from './SalesChart.jsx'
import ActivityFeed from './ActivityFeed.jsx'

function Dashboard({ user }) {
  const ownerNavItems = ["Dashboard", "Point of Sale", "Inventory", "Products", "Sales", "Reports", "Settings"]
  const cashierNavItems = ["Dashboard", "Point of Sale", "Sales"]

  const navItems = user.role === "owner" ? ownerNavItems : cashierNavItems

  const baseStats = [
    { title: "Today's Sales", value: "₦108,700", subtitle: "vs. same time yesterday" },
    { title: "Transactions", value: "27", subtitle: "86 items checked out" },
    { title: "Avg. Basket", value: "₦4,026", subtitle: "per completed sale" },
  ]

  const cashierExtraStat = { title: "Low Stock Alerts", value: "4", subtitle: "1 out of stock" }

  const stats = user.role === "cashier" ? [...baseStats, cashierExtraStat] : baseStats

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <p className="font-bold text-gray-900">CWG</p>
          <p className="text-xs text-gray-500">Retail Suite</p>
        </div>

        <p className="text-xs text-gray-400 px-4 mt-4 mb-2">OPERATIONS</p>

        {navItems.map((item) => (
          <div
            key={item}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            {item}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-semibold text-gray-900">
              Good morning, {user.name}
            </p>
            <p className="text-sm text-gray-500 mt-1">Role: {user.role}</p>
          </div>

          {user.role === "cashier" && (
            <button className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-md">
              + New Sale
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} subtitle={stat.subtitle} />
          ))}
        </div>

        <SalesChart />
        <ActivityFeed />
      </div>
    </div>
  )
}

export default Dashboard