import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import './LeetcodeTracker.css'

const DIFF_COLOR = { Easy: 'green', Medium: 'yellow', Hard: 'red' }
const TODAY = new Date().toISOString().slice(0, 10)

const DEFAULT_PROBLEMS = {
  q1: { id: 206, title: 'Reverse Linked List',  difficulty: 'Easy',   tags: ['Linked List', 'Recursion'], slug: 'reverse-linked-list' },
  q2: { id: 322, title: 'Coin Change',           difficulty: 'Medium', tags: ['DP', 'BFS'],                slug: 'coin-change' },
}

function ProblemCard({ num, problem, initialFeedback, onSave, onClear }) {
  const [text, setText]   = useState(initialFeedback)
  const [status, setStatus] = useState('')

  const handleSave = () => {
    if (!text.trim()) return
    onSave(text)
    setStatus('saved')
    setTimeout(() => setStatus(''), 2000)
  }

  const handleClear = () => {
    setText('')
    onClear()
    setStatus('')
  }

  return (
    <div className="lc-problem">
      <div className="lc-top-row">
        <span className="lc-num">#{num}</span>
        <div className="lc-info">
          <div className="lc-title-row">
            <span className="lc-id">{problem.id}.</span>
            <a
              href={`https://leetcode.com/problems/${problem.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="lc-title"
            >
              {problem.title}
            </a>
          </div>
          <div className="lc-tags">
            {problem.tags.map(t => <span key={t} className="lc-tag">{t}</span>)}
          </div>
        </div>
        <span className={`lc-diff diff-${DIFF_COLOR[problem.difficulty]}`}>{problem.difficulty}</span>
      </div>

      <textarea
        className="lc-feedback"
        placeholder="Notes / feedback... (save when done)"
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <div className="lc-actions">
        <button
          className={`lc-save-btn ${status === 'saved' ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={!text.trim()}
        >
          {status === 'saved' ? 'Saved ✓' : 'Save'}
        </button>
        <button className="lc-clear-btn" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  )
}

export default function LeetcodeTracker() {
  const [problems, setProblems] = useState(DEFAULT_PROBLEMS)
  const [feedback, setFeedback] = useState({})

  useEffect(() => {
    getDoc(doc(db, 'leetcode_daily', TODAY)).then(snap => {
      if (snap.exists()) setProblems(snap.data())
    })
    getDoc(doc(db, 'leetcode', TODAY)).then(snap => {
      if (snap.exists()) setFeedback(snap.data())
    })
  }, [])

  const saveFeedback = (key, text) => {
    const next = {
      ...feedback,
      [key]: {
        feedback: text,
        problem: {
          id:         problems[key].id,
          title:      problems[key].title,
          tags:       problems[key].tags,
          difficulty: problems[key].difficulty,
        },
      },
    }
    setFeedback(next)
    setDoc(doc(db, 'leetcode', TODAY), next, { merge: true })
  }

  const clearFeedback = (key) => {
    const next = { ...feedback, [key]: null }
    setFeedback(next)
    setDoc(doc(db, 'leetcode', TODAY), next, { merge: true })
  }

  return (
    <div className="card lc-card">
      <div className="card-title">
        <span className="icon">💻</span> LeetCode Daily
        <span className="lc-meta">2 problems · refreshes daily</span>
      </div>
      <div className="lc-list">
        {['q1', 'q2'].map((key, i) => (
          <ProblemCard
            key={key}
            num={i + 1}
            problem={problems[key]}
            initialFeedback={feedback[key]?.feedback || ''}
            onSave={(text) => saveFeedback(key, text)}
            onClear={() => clearFeedback(key)}
          />
        ))}
      </div>
      <div className="lc-footer">
        <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="lc-open">
          Open LeetCode →
        </a>
      </div>
    </div>
  )
}
