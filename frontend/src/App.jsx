import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import SignIn from './SignIn.jsx'
import Dashboard from './Dashboard.jsx'

function App() {
  const [role, setRole] = useState(null)

  return (
    <Routes>
      <Route path="/" element={<SignIn setRole={setRole} />} />
      <Route path="/dashboard" element={<Dashboard role={role} />} />
    </Routes>
  )
}

export default App