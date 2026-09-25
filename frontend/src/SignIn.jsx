import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignIn({ setUser }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const savedAccounts = [
    { name: "Amaka Obi", role: "owner", email: "owner@cwgretail.com" },
    { name: "Chidi Eze", role: "cashier", email: "chidi@cwgretail.com" },
  ]

  async function handleSignIn() {
    setError("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Invalid credentials")
      } else {
        setUser(data.user)
        navigate("/dashboard")
      }
    } catch (err) {
      setError("Could not reach the server. Is the backend running?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      <div className="hidden md:block w-1/2 bg-gradient-to-br from-green-800 to-green-950" />

      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-sm p-8">
          <h1 className="text-xl font-semibold text-gray-900">Staff sign in</h1>
          <p className="text-sm text-gray-500 mt-1">
            Use your email and password to access the till
          </p>

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="e.g. owner@cwgretail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="mt-4 w-full bg-green-700 hover:bg-green-800 text-white text-sm font-medium py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="mt-6 text-xs text-gray-400 text-center">Or use saved accounts</p>

          {savedAccounts.map((account) => (
            <div
              key={account.email}
              onClick={() => setEmail(account.email)}
              className="mt-2 border border-gray-200 rounded-md px-3 py-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{account.name}</p>
                <p className="text-xs text-gray-500">{account.role} · {account.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SignIn