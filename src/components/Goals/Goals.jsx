import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import './Goals.css'

const IconHealth = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 14S2 10 2 5.5a3.5 3.5 0 0 1 6-2.45A3.5 3.5 0 0 1 14 5.5C14 10 8 14 8 14z"/>
  </svg>
)

const IconCpp = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="5,4 1,8 5,12"/>
    <polyline points="11,4 15,8 11,12"/>
  </svg>
)

const IconMusic = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M6 13V4.5l8-2V11"/>
    <circle cx="4" cy="13" r="2"/>
    <circle cx="12" cy="11" r="2"/>
  </svg>
)

const CATEGORIES = [
  { id: 'health', label: 'Health', Icon: IconHealth, color: 'green',  placeholder: 'e.g., Run 3×/week, 8h sleep...' },
  { id: 'cpp',    label: 'C++',    Icon: IconCpp,    color: 'accent', placeholder: 'e.g., Finish templates chapter...' },
  { id: 'music',  label: 'Music',  Icon: IconMusic,  color: 'pink',   placeholder: 'e.g., Learn new piece by Sunday...' },
]

const TODAY = new Date().toISOString().slice(0, 10)

function GoalCard({ cat, data, onSaveGoal, onToggleDone }) {
  const [editing, setEditing] = useState(false)
  const goal = data?.text || ''
  const done = data?.done || false

  return (
    <div className={`goal-card goal-${cat.color}`}>
      <div className="goal-header">
        <span className="goal-icon"><cat.Icon /></span>
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
