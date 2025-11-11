import { useState } from 'react'
import NavBar from './components/shared/NavBar/NavBar'
import HomePage from './pages/Home/Home'
import SessionsPage from './pages/Sessions/Sessions'
import AnalyticsPage from './pages/Analytics/Analytics'
import SocialPage from './pages/Social/Social'
import SettingsPage from './pages/Settings/Settings'
import './App.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const pages = {
    home: <HomePage />,
    sessions: <SessionsPage />,
    analytics: <AnalyticsPage />,
    social: <SocialPage />,
    settings: <SettingsPage />
  }

  return (
    <div className="app-container">
      <main className="page-content">
        {pages[currentPage]}
      </main>
      <NavBar current={currentPage} onChange={setCurrentPage} />
    </div>
  )
}