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

export default function App() {
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

      {/* Row 2–3: 3×2 grid */}
      <div className="main-grid">
        <WeeklyEvents />
        <RoutineChecks />
        <LeetcodeTracker />
        <FinancialStatus />
        <TodoList />
        <CppArticle />
      </div>

    </div>
  )
}
