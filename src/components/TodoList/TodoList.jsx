import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import './TodoList.css'

const IconMemo = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="1" width="10" height="13" rx="1.5"/>
    <path d="M5 5h6M5 8h6M5 11h3"/>
    <path d="M10 12l2 2 2-2v-3h-4v3z"/>
  </svg>
)

const PRIORITY_ORDER  = ['high', 'medium', 'low']
const PRIORITY_SYMBOL = { high: '!!!', medium: '!!', low: '!' }
const PRIORITY_COLOR  = { high: 'red', medium: 'yellow', low: 'green' }

const DEFAULT_TODOS = [
  { id: 1, text: 'Review C++ notes from last week', priority: 'high' },
  { id: 2, text: 'Schedule dentist appointment',    priority: 'medium' },
  { id: 3, text: 'Buy groceries',                  priority: 'low' },
]

export default function TodoList() {
  const [todos, setTodos]     = useState([])
  const [input, setInput]     = useState('')
  const [priority, setPriority] = useState('medium')
  const [loaded, setLoaded]   = useState(false)
  const [memos, setMemos]     = useState([])
  const [memoInput, setMemoInput] = useState('')

  useEffect(() => {
    getDoc(doc(db, 'todos', 'emergency')).then(snap => {
      setTodos(snap.exists() ? snap.data().list : DEFAULT_TODOS)
      setLoaded(true)
    })

    const unsub = onSnapshot(doc(db, 'memos', 'notes'), snap => {
      setMemos(snap.exists() ? (snap.data().lines || []) : [])
    })
    return unsub
  }, [])

  const persist = (list) => {
    setTodos(list)
    setDoc(doc(db, 'todos', 'emergency'), { list })
  }

  const add = () => {
    if (!input.trim()) return
    persist([...todos, { id: Date.now(), text: input.trim(), priority }])
    setInput('')
  }

  const remove = (id) => persist(todos.filter(t => t.id !== id))

  const addMemo = () => {
    if (!memoInput.trim()) return
    const next = [...memos, { id: Date.now(), text: memoInput.trim() }]
    setDoc(doc(db, 'memos', 'notes'), { lines: next })
    setMemoInput('')
  }

  const removeMemo = (id) => {
    const next = memos.filter(m => m.id !== id)
    setDoc(doc(db, 'memos', 'notes'), { lines: next })
  }

  const clearMemos = () => setDoc(doc(db, 'memos', 'notes'), { lines: [] })

  const sorted = [...todos].sort(
    (a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority)
  )

  return (
    <div className="card todo-card">
      <div className="card-title"><span className="icon">🚨</span> Emergency To-Do</div>
      <div className="todo-add">
        <input
          className="todo-input"
          placeholder="Add urgent task..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <select className="priority-select" value={priority} onChange={e => setPriority(e.target.value)}>
          {PRIORITY_ORDER.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <button className="todo-add-btn" onClick={add}>+</button>
      </div>
      <div className="todo-list">
        {loaded && sorted.length === 0 && <div className="todo-empty">All clear — no urgent tasks.</div>}
        {sorted.map(todo => (
          <div key={todo.id} className={`todo-item priority-${PRIORITY_COLOR[todo.priority]}`}>
            <span className={`priority-badge pb-${PRIORITY_COLOR[todo.priority]}`}>
              {PRIORITY_SYMBOL[todo.priority]}
            </span>
            <span className="todo-text">{todo.text}</span>
            <button className="todo-remove" onClick={() => remove(todo.id)}>×</button>
          </div>
        ))}
      </div>

      <div className="memo-divider">
        <span className="memo-divider-label"><IconMemo /> Memo</span>
        {memos.length > 0 && (
          <button className="memo-clear" onClick={clearMemos}>clear all</button>
        )}
      </div>
      <div className="memo-lines">
        {memos.length === 0
          ? <div className="memo-empty">No memos — send <code>@ message</code> from Telegram</div>
          : memos.map(m => (
              <div key={m.id} className="memo-line">
                <span className="memo-text">{m.text}</span>
                <button className="memo-remove" onClick={() => removeMemo(m.id)}>×</button>
              </div>
            ))
        }
      </div>
      <div className="memo-add-row">
        <input
          className="memo-add-input"
          placeholder="Add memo..."
          value={memoInput}
          onChange={e => setMemoInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addMemo()}
        />
        <button className="memo-add-btn" onClick={addMemo}>+</button>
      </div>
    </div>
  )
}
