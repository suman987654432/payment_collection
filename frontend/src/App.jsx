import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import RegistrationForm from './components/RegistrationForm'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem('isAdmin');
    if (admin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* User Side */}
          <Route path="/" element={<RegistrationForm />} />

          {/* Admin Login */}
          <Route
            path="/admin-login"
            element={isAdmin ? <Navigate to="/admin" /> : <AdminLogin onLogin={setIsAdmin} />}
          />

          {/* Protected Admin View */}
          <Route
            path="/admin"
            element={isAdmin ? <AdminDashboard onLogout={setIsAdmin} /> : <Navigate to="/admin-login" />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App