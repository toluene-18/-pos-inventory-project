import { Search } from 'lucide-react'

function TopBar({ user }) {
  const initials = user.name.split(" ").map((namePart) => namePart[0]).join("")

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6">
      <div className="flex items-center flex-1 max-w-md bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search products, receipts, staff..."
          className="bg-transparent outline-none text-sm ml-2 w-full"
        />
      </div>

      <div className="ml-auto w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-medium">
        {initials}
      </div>
    </div>
  )
}

export default TopBar