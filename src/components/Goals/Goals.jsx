import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import './Goals.css'

const CATEGORIES = [
  { id: 'health', label: 'Health', icon: '💪', color: 'green',  placeholder: 'e.g., Run 3×/week, 8h sleep...' },
  { id: 'cpp',    label: 'C++',    icon: '⚡', color: 'accent', placeholder: 'e.g., Finish templates chapter...' },
  { id: 'music',  label: 'Music',  icon: '🎵', color: 'pink',   placeholder: 'e.g., Learn new piece by Sunday...' },
]

const TODAY = new Date().toISOString().slice(0, 10)

function GoalCard({ cat, data, onSaveGoal, onToggleDone }) {
  const [editing, setEditing] = useState(false)
  const goal = data?.text || ''
  const done = data?.done || false

  return (
    <div className={`goal-card goal-${cat.color}`}>
      <div className="goal-header">
        <span className="goal-icon">{cat.icon}</span>
        <span className="goal-label">{cat.label}</span>
        <button
          className={`goal-done-btn ${done ? 'done' : ''}`}
          onClick={() => onToggleDone(cat.id, !done)}
          title="Mark done today"
        >
          {done ? '✓' : '○'}
        </button>
      </div>
      {editing ? (
        <textarea
          className="goal-input"
          defaultValue={goal}
          onBlur={e => { onSaveGoal(cat.id, e.target.value); setEditing(false) }}
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
  const [goals, setGoals] = useState({})

  useEffect(() => {
    getDoc(doc(db, 'goals', TODAY)).then(snap => {
      if (snap.exists()) setGoals(snap.data())
    })
  }, [])

  const persist = (next) => {
    setGoals(next)
    setDoc(doc(db, 'goals', TODAY), next, { merge: true })
  }

  const saveGoal = (id, text) => {
    persist({ ...goals, [id]: { ...(goals[id] || {}), text } })
  }

  const toggleDone = (id, done) => {
    persist({ ...goals, [id]: { ...(goals[id] || {}), done } })
  }

  return (
    <div className="card goals-card">
      <div className="card-title"><span className="icon">🎯</span> Current Goals</div>
      <div className="goals-row">
        {CATEGORIES.map(cat => (
          <GoalCard
            key={cat.id}
            cat={cat}
            data={goals[cat.id]}
            onSaveGoal={saveGoal}
            onToggleDone={toggleDone}
          />
        ))}
      </div>
    </div>
  )
}
