import { useState } from 'react'

function SignIn() {
  const [staffId, setStaffId] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")

  function handleSignIn() {
    if (pin !== "1234") {
      setError("Invalid Staff ID or PIN. Please try again.")
    } else {
      setError("")
      console.log("Signed in successfully!")
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left side: background image */}
      <div className="hidden md:block w-1/2 bg-gradient-to-br from-green-800 to-green-950" />

      {/* Right side: sign-in card */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-sm p-8">
          <h1 className="text-xl font-semibold text-gray-900">Staff sign in</h1>
          <p className="text-sm text-gray-500 mt-1">
            Use your Staff ID and PIN to access the till
          </p>

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700">Staff ID</label>
            <input
              type="text"
              placeholder="e.g. CWG-001"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">PIN</label>
            <input
              type="password"
              placeholder="****"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
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
            className="mt-4 w-full bg-green-700 hover:bg-green-800 text-white text-sm font-medium py-2 rounded-md"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignIn