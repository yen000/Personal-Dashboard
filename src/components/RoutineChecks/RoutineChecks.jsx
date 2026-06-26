import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import './RoutineChecks.css'

const PERIODS = ['morning', 'evening', 'night']
const PERIOD_LABELS = { morning: '☀️ Morning', evening: '🌆 Evening', night: '🌙 Night' }
const CATEGORIES = ['life', 'work', 'music']
const CAT_LABELS = { life: '🌿 Life', work: '💼 Work', music: '🎵 Music' }
const DAY_TYPES = ['weekday', 'saturday', 'sunday']
const DAY_LABELS = { weekday: 'Weekday', saturday: 'Saturday', sunday: 'Sunday' }

const TODAY = new Date().toISOString().slice(0, 10)

function getTodayType() {
  const d = new Date().getDay()
  if (d === 0) return 'sunday'
  if (d === 6) return 'saturday'
  return 'weekday'
}

function getDefaultPeriod() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 18) return 'evening'
  return 'night'
}

const DEFAULT_SCHEDULE = {
  weekday: {
    morning: {
      life: [{ id: 'wd-m-l-1', label: 'Take vitamin' }],
      work: [
        { id: 'wd-m-w-1', label: 'Daily LeetCode' },
        { id: 'wd-m-w-2', label: 'Trading book' },
        { id: 'wd-m-w-3', label: 'Work' },
      ],
      music: [],
    },
    evening: {
      life: [],
      work: [
        { id: 'wd-e-w-1', label: 'LeetCode ×2' },
        { id: 'wd-e-w-2', label: 'Work' },
      ],
      music: [],
    },
    night: {
      life: [
        { id: 'wd-n-l-1', label: 'Leg massage' },
        { id: 'wd-n-l-2', label: 'Face mask' },
        { id: 'wd-n-l-3', label: 'Apply ointment' },
      ],
      work: [
        { id: 'wd-n-w-1', label: 'Trading QA book' },
        { id: 'wd-n-w-2', label: 'One implementation' },
      ],
      music: [
        { id: 'wd-n-m-1', label: 'Triad' },
        { id: 'wd-n-m-2', label: 'Song' },
      ],
    },
  },
  saturday: {
    morning: {
      life: [{ id: 'sa-m-l-1', label: 'Weight training' }],
      work: [
        { id: 'sa-m-w-1', label: 'Concurrency' },
        { id: 'sa-m-w-2', label: 'Daily LeetCode' },
      ],
      music: [],
    },
    evening: {
      life: [],
      work: [
        { id: 'sa-e-w-1', label: 'LeetCode ×2' },
        { id: 'sa-e-w-2', label: 'Work' },
      ],
      music: [],
    },
    night: {
      life: [
        { id: 'sa-n-l-1', label: 'Leg massage' },
        { id: 'sa-n-l-2', label: 'Face mask' },
        { id: 'sa-n-l-3', label: 'Apply ointment' },
      ],
      work: [
        { id: 'sa-n-w-1', label: 'Trading QA book' },
        { id: 'sa-n-w-2', label: 'One implementation' },
      ],
      music: [
        { id: 'sa-n-m-1', label: 'Triad' },
        { id: 'sa-n-m-2', label: 'Song' },
      ],
    },
  },
  sunday: {
    morning: {
      life: [{ id: 'su-m-l-1', label: 'Weight training' }],
      work: [{ id: 'su-m-w-1', label: 'LeetCode contest' }],
      music: [],
    },
    evening: {
      life: [],
      work: [{ id: 'su-e-w-1', label: 'LeetCode study' }],
      music: [],
    },
    night: {
      life: [
        { id: 'su-n-l-1', label: 'Leg massage' },
        { id: 'su-n-l-2', label: 'Face mask' },
        { id: 'su-n-l-3', label: 'Apply ointment' },
      ],
      work: [
        { id: 'su-n-w-1', label: 'Trading QA book' },
        { id: 'su-n-w-2', label: 'One implementation' },
      ],
      music: [
        { id: 'su-n-m-1', label: 'Triad' },
        { id: 'su-n-m-2', label: 'Song' },
      ],
    },
  },
}

function CategoryBlock({ dayType, period, cat, items, checked, onToggle, onDelete, onAdd }) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const text = input.trim()
    if (!text) return
    onAdd(dayType, period, cat, text)
    setInput('')
  }

  if (items.length === 0 && cat === 'music') return null

  return (
    <div className="routine-cat-block">
      <div className="routine-cat-label">{CAT_LABELS[cat]}</div>
      {items.map(item => (
        <div key={item.id} className={`routine-item ${checked[item.id] ? 'checked' : ''}`}>
          <span className="check-box" onClick={() => onToggle(item.id)} />
          <span className="routine-label" onClick={() => onToggle(item.id)}>{item.label}</span>
          <button className="routine-del" onClick={() => onDelete(dayType, period, cat, item.id)}>×</button>
        </div>
      ))}
      <div className="routine-add-row">
        <input
          className="routine-add-input"
          placeholder={`Add ${cat} habit…`}
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
  const todayType                 = getTodayType()
  const [dayType, setDayType]     = useState(todayType)
  const [period, setPeriod]       = useState(getDefaultPeriod)
  const [schedule, setSchedule]   = useState(DEFAULT_SCHEDULE)
  const [checked, setChecked]     = useState({})

  useEffect(() => {
    getDoc(doc(db, 'routine_config', 'schedule')).then(snap => {
      if (snap.exists()) setSchedule(snap.data())
      else setDoc(doc(db, 'routine_config', 'schedule'), DEFAULT_SCHEDULE)
    })
    getDoc(doc(db, 'routine_checks', TODAY)).then(snap => {
      if (snap.exists()) setChecked(snap.data())
    })
  }, [])

  const saveSchedule = (next) => {
    setSchedule(next)
    setDoc(doc(db, 'routine_config', 'schedule'), next)
  }

  const toggle = (id) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] }
      setDoc(doc(db, 'routine_checks', TODAY), next)
      return next
    })
  }

  const deleteItem = (dt, p, cat, id) => {
    saveSchedule({
      ...schedule,
      [dt]: {
        ...schedule[dt],
        [p]: {
          ...schedule[dt][p],
          [cat]: schedule[dt][p][cat].filter(i => i.id !== id),
        },
      },
    })
  }

  const addItem = (dt, p, cat, label) => {
    const id = `${dt}-${p}-${cat}-${Date.now()}`
    saveSchedule({
      ...schedule,
      [dt]: {
        ...schedule[dt],
        [p]: {
          ...schedule[dt][p],
          [cat]: [...(schedule[dt][p][cat] || []), { id, label }],
        },
      },
    })
  }

  const periodData  = schedule[dayType]?.[period] ?? {}
  const allItems    = CATEGORIES.flatMap(c => periodData[c] || [])
  const doneCount   = allItems.filter(i => checked[i.id]).length
  const total       = allItems.length

  return (
    <div className="card routine-card">
      <div className="card-title"><span className="icon">✅</span> Routine</div>

      <div className="routine-day-tabs">
        {DAY_TYPES.map(dt => (
          <button
            key={dt}
            className={`day-tab-btn ${dayType === dt ? 'active' : ''} ${dt === todayType ? 'today' : ''}`}
            onClick={() => setDayType(dt)}
          >
            {DAY_LABELS[dt]}
            {dt === todayType && <span className="today-dot" />}
          </button>
        ))}
      </div>

      <div className="routine-tabs">
        {PERIODS.map(p => (
          <button
            key={p}
            className={`tab-btn ${period === p ? 'active' : ''}`}
            onClick={() => setPeriod(p)}
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
          dayType={dayType}
          period={period}
          cat={cat}
          items={periodData[cat] || []}
          checked={checked}
          onToggle={toggle}
          onDelete={deleteItem}
          onAdd={addItem}
        />
      ))}
    </div>
  )
}
