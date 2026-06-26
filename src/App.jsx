import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import Login from './components/Login/Login'
import './App.css'
import Profile from './components/Profile/Profile'
import DateTime from './components/DateTime/DateTime'
import Goals from './components/Goals/Goals'
import WeeklyEvents from './components/WeeklyEvents/WeeklyEvents'
import RoutineChecks from './components/RoutineChecks/RoutineChecks'
import LeetcodeTracker from './components/LeetcodeTracker/LeetcodeTracker'
import FinancialStatus from './components/FinancialStatus/FinancialStatus'
import TodoList from './components/TodoList/TodoList'
import CppArticle from './components/CppArticle/CppArticle'
// import SystemDesign from './components/SystemDesign/SystemDesign'

export default function App() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setChecking(false)
    })
  }, [])

  if (checking) return null
  if (!user) return <Login onLogin={setUser} />

  return (
    <div className="dashboard">

      {/* Row 1: [Profile | DateTime] + [Goals wide] */}
      <div className="top-row">
        <div className="top-left-pair">
          <Profile />
          <DateTime />
        </div>
        <Goals />
      </div>

      {/* Main 3-column grid */}
      <div className="main-grid">
        <div className="col-panel">
          <WeeklyEvents />
          <TodoList />
        </div>
        <div className="col-panel">
          <RoutineChecks />
          <FinancialStatus />
        </div>
        <div className="col-panel">
          <LeetcodeTracker />
          <CppArticle />
          {/* <SystemDesign /> */}
        </div>
      </div>

    </div>
  )
}
