import { useState } from 'react'
import './RoutineChecks.css'

const ROUTINES = [
  { id: 'wake',      label: 'Wake up on time',         section: 'morning' },
  { id: 'exercise',  label: 'Exercise / stretch',       section: 'morning' },
  { id: 'breakfast', label: 'Eat breakfast',            section: 'morning' },
  { id: 'cpp',       label: 'C++ practice (30 min+)',   section: 'day' },
  { id: 'music',     label: 'Music practice (20 min+)', section: 'day' },
  { id: 'water',     label: 'Drink 8 glasses of water', section: 'day' },
  { id: 'review',    label: 'Review the day',           section: 'evening' },
  { id: 'read',      label: 'Read / learn something',   section: 'evening' },
  { id: 'sleep',     label: 'Sleep before midnight',    section: 'evening' },
]

const SECTIONS = [
  { key: 'morning', label: '☀️ Morning' },
  { key: 'day',     label: '⚡ During the Day' },
  { key: 'evening', label: '🌙 Evening' },
]

const TODAY = new Date().toDateString()

function loadChecked() {
  try {
    const saved = JSON.parse(localStorage.getItem('routine_checks') || '{}')
    return saved.date === TODAY ? (saved.checks || {}) : {}
  } catch { return {} }
}

export default function RoutineChecks() {
  const [checked, setChecked] = useState(loadChecked)

  const toggle = (id) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem('routine_checks', JSON.stringify({ date: TODAY, checks: next }))
      return next
    })
  }

  const doneCount = Object.values(checked).filter(Boolean).length
  const total = ROUTINES.length

  return (
    <div className="card routine-card">
      <div className="card-title">
        <span className="icon">✅</span> Daily Routine
        <span className="routine-counter">{doneCount}/{total}</span>
      </div>
      <div className="routine-bar-wrap">
        <div className="routine-bar" style={{ width: `${(doneCount / total) * 100}%` }} />
      </div>
      {SECTIONS.map(sec => (
        <div key={sec.key} className="routine-section">
          <div className="routine-sec-label">{sec.label}</div>
          {ROUTINES.filter(r => r.section === sec.key).map(item => (
            <label key={item.id} className={`routine-item ${checked[item.id] ? 'checked' : ''}`}>
              <input type="checkbox" checked={!!checked[item.id]} onChange={() => toggle(item.id)} />
              <span className="check-box" />
              <span className="routine-label">{item.label}</span>
            </label>
          ))}
        </div>
      ))}
    </div>
  )
}
