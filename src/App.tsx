import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import CandidateUpload from './pages/CandidateUpload'
import VerificationReport from './pages/VerificationReport'
import './styles/index.css'

function App() {
  const [user, setUser] = useState<string | null>(null)
  const [userType, setUserType] = useState<'user' | 'hr' | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedUserType = localStorage.getItem('userType') as 'user' | 'hr' | null
    if (storedUser && storedUserType) {
      setUser(storedUser)
      setUserType(storedUserType)
    }
  }, [])

  const handleLogin = (username: string, type: 'user' | 'hr') => {
    setUser(username)
    setUserType(type)
    localStorage.setItem('user', username)
    localStorage.setItem('userType', type)
  }

  const handleLogout = () => {
    setUser(null)
    setUserType(null)
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            user ? <Navigate to={userType === 'hr' ? '/dashboard' : '/upload'} /> : <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            user && userType === 'hr' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/upload" 
          element={<CandidateUpload />} 
        />
        <Route 
          path="/report/:candidateId"
          element={user && userType === 'hr' ? <VerificationReport /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
