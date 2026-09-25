import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import SignIn from './SignIn.jsx'
import Dashboard from './Dashboard.jsx'

function App() {
  const [user, setUser] = useState(null)

  return (
    <Routes>
      <Route path="/" element={<SignIn setUser={setUser} />} />
      <Route path="/dashboard" element={<Dashboard user={user} />} />
    </Routes>
  )
}

export default App