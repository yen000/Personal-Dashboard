import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import './RoutineChecks.css'

const PERIODS = ['morning', 'evening', 'night']
const PERIOD_LABELS = { morning: '☀️ Morning', evening: '🌆 Evening', night: '🌙 Night' }
const CATEGORIES = ['life', 'work']
const CAT_LABELS = { life: '🌿 Life', work: '💼 Work' }

const DEFAULT_ITEMS = {
  morning: {
    life: [
      { id: 'l-m-1', label: 'Drink water' },
      { id: 'l-m-2', label: 'Take vitamin' },
    ],
    work: [
      { id: 'w-m-1', label: 'Daily LeetCode' },
      { id: 'w-m-2', label: 'Trading book' },
      { id: 'w-m-3', label: 'Work' },
    ],
  },
  evening: {
    life: [
      { id: 'l-e-1', label: 'Drink water' },
    ],
    work: [
      { id: 'w-e-1', label: 'LeetCode ×2' },
      { id: 'w-e-2', label: 'Work' },
    ],
  },
  night: {
    life: [
      { id: 'l-n-1', label: 'Leg massage' },
      { id: 'l-n-2', label: 'Face mask' },
      { id: 'l-n-3', label: 'Apply ointment' },
    ],
    work: [
      { id: 'w-n-1', label: 'Trading QA book' },
      { id: 'w-n-2', label: 'C++ implementation' },
    ],
  },
}

const TODAY = new Date().toISOString().slice(0, 10)

function getDefaultPeriod() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 18) return 'evening'
  return 'night'
}

function CategoryBlock({ period, cat, items, checked, onToggle, onDelete, onAdd }) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const text = input.trim()
    if (!text) return
    onAdd(period, cat, text)
    setInput('')
  }

  return (
    <div className="routine-cat-block">
      <div className="routine-cat-label">{CAT_LABELS[cat]}</div>
      {items.map(item => (
        <div key={item.id} className={`routine-item ${checked[item.id] ? 'checked' : ''}`}>
          <span className="check-box" onClick={() => onToggle(item.id)} />
          <span className="routine-label" onClick={() => onToggle(item.id)}>{item.label}</span>
          <button className="routine-del" onClick={() => onDelete(period, cat, item.id)}>×</button>
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
  const [tab, setTab]         = useState(getDefaultPeriod)
  const [items, setItems]     = useState(DEFAULT_ITEMS)
  const [checked, setChecked] = useState({})

  useEffect(() => {
    getDoc(doc(db, 'routine_config', 'items')).then(snap => {
      if (snap.exists()) {
        const data = snap.data()
        if (data.morning) {
          setItems(data)
        } else {
          // old structure detected — overwrite with new format
          setDoc(doc(db, 'routine_config', 'items'), DEFAULT_ITEMS)
        }
      }
    })
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

  const deleteItem = (period, cat, id) => {
    saveItems({
      ...items,
      [period]: {
        ...items[period],
        [cat]: items[period][cat].filter(i => i.id !== id),
      },
    })
  }

  const addItem = (period, cat, label) => {
    const id = `${period}-${cat}-${Date.now()}`
    saveItems({
      ...items,
      [period]: {
        ...items[period],
        [cat]: [...items[period][cat], { id, label }],
      },
    })
  }

  const tabItems  = CATEGORIES.flatMap(c => items[tab]?.[c] || [])
  const doneCount = tabItems.filter(i => checked[i.id]).length
  const total     = tabItems.length

  return (
    <div className="card routine-card">
      <div className="card-title"><span className="icon">✅</span> Routine</div>

      <div className="routine-tabs">
        {PERIODS.map(p => (
          <button
            key={p}
            className={`tab-btn ${tab === p ? 'active' : ''}`}
            onClick={() => setTab(p)}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
        <span className="tab-counter">{doneCount}/{total}</span>
      </div>

      <div className="routine-bar-wrap">
        <div className="routine-bar" style={{ width: `${total ? (doneCount / total) * 100 : 0}%` }} />
      </div>

      {CATEGORIES.map(cat => (
        <CategoryBlock
          key={cat}
          period={tab}
          cat={cat}
          items={items[tab]?.[cat] || []}
          checked={checked}
          onToggle={toggle}
          onDelete={deleteItem}
          onAdd={addItem}
        />
      ))}
    </div>
  )
}
