import { useState } from 'react'
import './Goals.css'

const CATEGORIES = [
  { id: 'health', label: 'Health', icon: '💪', color: 'green', placeholder: 'e.g., Run 3×/week, 8h sleep...' },
  { id: 'cpp',    label: 'C++',    icon: '⚡', color: 'accent', placeholder: 'e.g., Finish templates chapter...' },
  { id: 'music',  label: 'Music',  icon: '🎵', color: 'pink',   placeholder: 'e.g., Learn new piece by Sunday...' },
]

const TODAY = new Date().toDateString()

function loadDone(id) {
  try {
    const saved = JSON.parse(localStorage.getItem(`goal_done_${id}`) || 'null')
    return saved?.date === TODAY ? saved.value : false
  } catch { return false }
}

function GoalCard({ cat }) {
  const [goal, setGoal]   = useState(() => localStorage.getItem(`goal_${cat.id}`) || '')
  const [editing, setEditing] = useState(false)
  const [done, setDone]   = useState(() => loadDone(cat.id))

  const saveGoal = (val) => {
    setGoal(val)
    localStorage.setItem(`goal_${cat.id}`, val)
  }

  const toggleDone = () => {
    const next = !done
    setDone(next)
    localStorage.setItem(`goal_done_${cat.id}`, JSON.stringify({ date: TODAY, value: next }))
  }

  return (
    <div className={`goal-card goal-${cat.color}`}>
      <div className="goal-header">
        <span className="goal-icon">{cat.icon}</span>
        <span className="goal-label">{cat.label}</span>
        <button
          className={`goal-done-btn ${done ? 'done' : ''}`}
          onClick={toggleDone}
          title="Mark done today"
        >
          {done ? '✓' : '○'}
        </button>
      </div>
      {editing ? (
        <textarea
          className="goal-input"
          value={goal}
          onChange={e => saveGoal(e.target.value)}
          onBlur={() => setEditing(false)}
          placeholder={cat.placeholder}
          autoFocus
        />
      ) : (
        <div
          className={`goal-text ${!goal ? 'empty' : ''}`}
          onClick={() => setEditing(true)}
        >
          {goal || cat.placeholder}
        </div>
      )}
    </div>
  )
}

export default function Goals() {
  return (
    <div className="card goals-card">
      <div className="card-title"><span className="icon">🎯</span> Current Goals</div>
      <div className="goals-row">
        {CATEGORIES.map(cat => <GoalCard key={cat.id} cat={cat} />)}
      </div>
    </div>
  )
}
