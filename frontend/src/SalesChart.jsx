import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function SalesChart() {
  const salesData = [
    { day: "Mon", revenue: 180000 },
    { day: "Tue", revenue: 220000 },
    { day: "Wed", revenue: 310000 },
    { day: "Thu", revenue: 280000 },
    { day: "Fri", revenue: 190000 },
    { day: "Sat", revenue: 250000 },
    { day: "Sun", revenue: 300000 },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mt-6">
      <p className="text-sm font-medium text-gray-900">Sales trend</p>
      <p className="text-xs text-gray-500 mb-4">Last 7 days performance</p>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#15803d" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SalesChart