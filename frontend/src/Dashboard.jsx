function Dashboard({ user }) {
  const ownerNavItems = ["Dashboard", "Point of Sale", "Inventory", "Products", "Sales", "Reports", "Settings"]
  const cashierNavItems = ["Dashboard", "Point of Sale", "Sales"]

  const navItems = user.role === "owner" ? ownerNavItems : cashierNavItems

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
      <div className="flex-1 p-8">
        <p className="text-2xl font-semibold text-gray-900">
          Good morning, {user.name}
        </p>
        <p className="text-sm text-gray-500 mt-1">Role: {user.role}</p>
      </div>
    </div>
  )
}

export default Dashboard