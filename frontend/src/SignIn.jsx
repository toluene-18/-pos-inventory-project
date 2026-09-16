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
    <div>
      <h1>Staff Sign In</h1>
      <p>Use your Staff ID and PIN to access the till</p>

      <label>Staff ID</label>
      <input
        type="text"
        placeholder="e.g. CWG-001"
        value={staffId}
        onChange={(e) => setStaffId(e.target.value)}
      />

      <label>PIN</label>
      <input
        type="password"
        placeholder="****"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleSignIn}>Sign in</button>
    </div>
  )
}

export default SignIn