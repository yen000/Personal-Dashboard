import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth, provider } from './firebase'
import Login from './components/Login/Login'
import './App.css'
import Goals from './components/Goals/Goals'
import WeeklyEvents from './components/WeeklyEvents/WeeklyEvents'
import RoutineChecks from './components/RoutineChecks/RoutineChecks'
import LeetcodeTracker from './components/LeetcodeTracker/LeetcodeTracker'
import FinancialStatus from './components/FinancialStatus/FinancialStatus'
import TodoList from './components/TodoList/TodoList'
import CppArticle from './components/CppArticle/CppArticle'

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const IconDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="1" y="1" width="6" height="6" rx="1.2"/>
    <rect x="9" y="1" width="6" height="6" rx="1.2"/>
    <rect x="1" y="9" width="6" height="6" rx="1.2"/>
    <rect x="9" y="9" width="6" height="6" rx="1.2"/>
  </svg>
)

const IconFinancial = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="1" y="9" width="3.5" height="6" rx="1"/>
    <rect x="6.25" y="5.5" width="3.5" height="9.5" rx="1"/>
    <rect x="11.5" y="1" width="3.5" height="14" rx="1"/>
  </svg>
)

const IconMusic = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 13V4.5l8-2V11"/>
    <circle cx="4" cy="13" r="2"/>
    <circle cx="12" cy="11" r="2"/>
  </svg>
)

const NAV = [
  { id: 'dashboard', Icon: IconDashboard, label: 'Dashboard' },
  { id: 'financial', Icon: IconFinancial, label: 'Financial' },
  { id: 'music',     Icon: IconMusic,     label: 'Music' },
]

function useNow() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

function Avatar({ className }) {
  const [err, setErr] = useState(false)
  if (err) return <div className={className + ' avatar-fallback'}>🐸</div>
  return <img src="/avatar.png" className={className} onError={() => setErr(true)} alt="Yen" />
}

export default function App() {
  const [user, setUser]             = useState(null)
  const [checking, setChecking]     = useState(true)
  const [activePage, setActivePage] = useState('dashboard')
  const now = useNow()

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u)
      setChecking(false)
      if (u) {
        const token = localStorage.getItem('cal_token')
        const exp   = parseInt(localStorage.getItem('cal_token_exp') || '0', 10)
        if (!token || Date.now() >= exp) {
          try {
            const result     = await signInWithPopup(auth, provider)
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const newToken   = credential?.accessToken
            if (newToken) {
              localStorage.setItem('cal_token', newToken)
              localStorage.setItem('cal_token_exp', Date.now() + 3500 * 1000)
            }
          } catch (_) { /* token stays stale; WeeklyEvents shows "Sign in to load" */ }
        }
      }
    })
  }, [])

  const handleSignOut = async () => {
    localStorage.removeItem('cal_token')
    localStorage.removeItem('cal_token_exp')
    await signOut(auth)
  }

  if (checking) return null
  if (!user) return <Login onLogin={setUser} />

  const pad = n => n.toString().padStart(2, '0')
  const dayStr  = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  return (
    <div className="app-shell">

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Avatar className="sidebar-avatar-img" />
          <span className="brand-name">Yen's Hub</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ id, Icon, label }) => (
            <button
              key={id}
              className={`nav-item ${activePage === id ? 'active' : ''}`}
              onClick={() => setActivePage(id)}
            >
              <span className="nav-icon"><Icon /></span>
              <span className="nav-label">{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="sidebar-signout" onClick={handleSignOut}>Sign out</button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="main-area">

        <header className="topbar">
          <h1 className="topbar-title">{NAV.find(n => n.id === activePage)?.label}</h1>
          <div className="topbar-right">
            <div className="topbar-date">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <rect x="1" y="3" width="14" height="12" rx="2"/>
                <path d="M1 7h14M5 1v4M11 1v4"/>
              </svg>
              <span>{dayStr}</span>
              <span className="topbar-sep">·</span>
              <span className="topbar-time">{timeStr}</span>
            </div>
          </div>
        </header>

        <main className="page-content">
          {activePage === 'dashboard' && (
            <>
              <div className="dash-top mobile-hide"><Goals /></div>
              <div className="main-grid">
                <div className="col-panel">
                  <div className="mobile-hide"><WeeklyEvents /></div>
                  <TodoList />
                </div>
                <div className="col-panel">
                  <RoutineChecks />
                  <div className="mobile-hide"><FinancialStatus /></div>
                </div>
                <div className="col-panel">
                  <LeetcodeTracker />
                  <CppArticle />
                </div>
              </div>
            </>
          )}

          {activePage === 'financial' && (
            <div className="blank-page">
              <div className="blank-icon">💰</div>
              <div className="blank-title">Financial</div>
              <div className="blank-sub">Coming soon</div>
            </div>
          )}

          {activePage === 'music' && (
            <div className="blank-page">
              <div className="blank-icon">🎵</div>
              <div className="blank-title">Music</div>
              <div className="blank-sub">Coming soon</div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
