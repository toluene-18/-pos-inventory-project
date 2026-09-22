import { Routes, Route } from 'react-router-dom'
import SignIn from './SignIn.jsx'
import Dashboard from './Dashboard.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App