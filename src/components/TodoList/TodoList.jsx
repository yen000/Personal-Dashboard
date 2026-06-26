import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import './TodoList.css'

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

  useEffect(() => {
    getDoc(doc(db, 'todos', 'emergency')).then(snap => {
      setTodos(snap.exists() ? snap.data().list : DEFAULT_TODOS)
      setLoaded(true)
    })
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
    </div>
  )
}
