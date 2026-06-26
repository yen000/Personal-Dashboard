import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import './RoutineChecks.css'

const TIMES = ['morning', 'evening', 'night']
const TIME_LABELS = { morning: '☀️ Morning', evening: '🌆 Evening', night: '🌙 Night' }

const DEFAULT_ITEMS = {
  life: [
    { id: 'l-m-1', label: 'Drink water',    time: 'morning' },
    { id: 'l-m-2', label: 'Take vitamin',   time: 'morning' },
    { id: 'l-e-1', label: 'Drink water',    time: 'evening' },
    { id: 'l-n-1', label: 'Leg massage',    time: 'night' },
    { id: 'l-n-2', label: 'Face mask',      time: 'night' },
    { id: 'l-n-3', label: 'Apply ointment', time: 'night' },
  ],
  work: [
    { id: 'w-m-1', label: 'Daily LeetCode',    time: 'morning' },
    { id: 'w-m-2', label: 'Trading book',       time: 'morning' },
    { id: 'w-m-3', label: 'Work',               time: 'morning' },
    { id: 'w-e-1', label: 'LeetCode ×2',        time: 'evening' },
    { id: 'w-e-2', label: 'Work',               time: 'evening' },
    { id: 'w-n-1', label: 'Trading QA book',    time: 'night' },
    { id: 'w-n-2', label: 'C++ implementation', time: 'night' },
  ],
}

const TODAY = new Date().toISOString().slice(0, 10)

function TimeBlock({ time, items, checked, onToggle, onDelete, onAdd }) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const text = input.trim()
    if (!text) return
    onAdd(time, text)
    setInput('')
  }

  return (
    <div className="time-block">
      <div className="time-label">{TIME_LABELS[time]}</div>
      {items.map(item => (
        <div key={item.id} className={`routine-item ${checked[item.id] ? 'checked' : ''}`}>
          <span className="check-box" onClick={() => onToggle(item.id)} />
          <span className="routine-label" onClick={() => onToggle(item.id)}>{item.label}</span>
          <button className="routine-del" onClick={() => onDelete(item.id)}>×</button>
        </div>
      ))}
      <div className="routine-add-row">
        <input
          className="routine-add-input"
          placeholder="Add habit..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button className="routine-add-btn" onClick={handleAdd}>+</button>
      </div>
    </div>
  )
}

export default function RoutineChecks() {
  const [tab, setTab]         = useState('life')
  const [items, setItems]     = useState(DEFAULT_ITEMS)
  const [checked, setChecked] = useState({})

  useEffect(() => {
    // Load habit definitions
    getDoc(doc(db, 'routine_config', 'items')).then(snap => {
      if (snap.exists()) setItems(snap.data())
    })
    // Load today's checks
    getDoc(doc(db, 'routine_checks', TODAY)).then(snap => {
      if (snap.exists()) setChecked(snap.data())
    })
  }, [])

  const saveItems = (next) => {
    setItems(next)
    setDoc(doc(db, 'routine_config', 'items'), next)
  }

  const toggle = (id) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] }
      setDoc(doc(db, 'routine_checks', TODAY), next)
      return next
    })
  }

  const deleteItem = (id) => {
    saveItems({
      life: items.life.filter(i => i.id !== id),
      work: items.work.filter(i => i.id !== id),
    })
  }

  const addItem = (time, label) => {
    const id = `${tab}-${time}-${Date.now()}`
    saveItems({ ...items, [tab]: [...items[tab], { id, label, time }] })
  }

  const tabItems  = items[tab]
  const doneCount = tabItems.filter(i => checked[i.id]).length
  const total     = tabItems.length

  return (
    <div className="card routine-card">
      <div className="card-title"><span className="icon">✅</span> Routine</div>

      <div className="routine-tabs">
        <button className={`tab-btn ${tab === 'life' ? 'active' : ''}`} onClick={() => setTab('life')}>🌿 Life</button>
        <button className={`tab-btn ${tab === 'work' ? 'active' : ''}`} onClick={() => setTab('work')}>💼 Work</button>
        <span className="tab-counter">{doneCount}/{total}</span>
      </div>

      <div className="routine-bar-wrap">
        <div className="routine-bar" style={{ width: `${total ? (doneCount / total) * 100 : 0}%` }} />
      </div>

      {TIMES.map(time => (
        <TimeBlock
          key={`${tab}-${time}`}
          time={time}
          items={tabItems.filter(i => i.time === time)}
          checked={checked}
          onToggle={toggle}
          onDelete={deleteItem}
          onAdd={addItem}
        />
      ))}
    </div>
  )
}
