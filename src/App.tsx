import React from 'react';
import { useAuth } from './hooks/useAuth'
import { LandingPage } from './components/LandingPage'
import { AuthForm } from './components/AuthForm'
import { Dashboard } from './components/Dashboard'
import { AdminPanel } from './components/AdminPanel'
import { WorkPage } from './components/WorkPage'
import { useState } from 'react'

function App() {
  const { user, profile, loading } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'work' | 'admin'>('dashboard')

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-fixed bg-top flex items-center justify-center" style={{ backgroundImage: "url('/Untitled design (11).png')" }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-cover bg-fixed bg-top" style={{ backgroundImage: "url('/Untitled design (11).png')" }}>
        {currentPage === 'admin' && profile?.role === 'admin' ? (
          <AdminPanel onNavigateBack={() => setCurrentPage('dashboard')} />
        ) : currentPage === 'work' ? (
          <WorkPage onNavigateBack={() => setCurrentPage('dashboard')} />
        ) : (
          <Dashboard onNavigate={setCurrentPage} userRole={profile?.role || 'pilot'} />
        )}
      </div>
    )
  }

  if (showAuth) {
    return (
      <div className="min-h-screen bg-cover bg-fixed bg-top" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url('/Untitled design (11).png')" }}>
        <AuthForm onBack={() => setShowAuth(false)} />
      </div>
    )
  }

  return (
    <LandingPage onGetStarted={() => setShowAuth(true)} />
  )
}

export default App;