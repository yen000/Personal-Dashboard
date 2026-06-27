import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import { PROBLEMS } from './neetcodeData'
import './LeetcodeTracker.css'

const DIFF_COLOR = { Easy: 'green', Medium: 'yellow', Hard: 'red' }
const TODAY = new Date().toISOString().slice(0, 10)

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function pickProblems(excludedIds) {
  const available = PROBLEMS.filter(p => !excludedIds.includes(p.id))
  const useEasyHard = Math.random() < 0.5

  if (useEasyHard) {
    const easy = available.filter(p => p.difficulty === 'Easy')
    const hard = available.filter(p => p.difficulty === 'Hard')
    if (easy.length > 0 && hard.length > 0) {
      const p1 = rand(easy)
      const pool = hard.filter(p => p.topic !== p1.topic)
      const p2 = rand(pool.length > 0 ? pool : hard)
      return [p1, p2]
    }
  }

  const mediums = available.filter(p => p.difficulty === 'Medium')
  if (mediums.length < 2) return null
  const p1 = rand(mediums)
  const pool = mediums.filter(p => p.topic !== p1.topic && p.id !== p1.id)
  const p2 = rand(pool.length > 0 ? pool : mediums.filter(p => p.id !== p1.id))
  return [p1, p2]
}

function toFirestoreProb(p, finished = false) {
  return { id: p.id, title: p.title, difficulty: p.difficulty, slug: p.slug, tags: [p.topic], finished }
}

const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.5 2.5A6.5 6.5 0 1 1 2 8"/>
    <polyline points="1 4 2 8 6 7"/>
  </svg>
)

function ProblemCard({ num, problem, initialFeedback, onSave, onClear, onFinish }) {
  const [text, setText]     = useState(initialFeedback)
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
    <div className={`lc-problem ${problem.finished ? 'lc-finished' : ''}`}>
      <div className="lc-top-row">
        <span className="lc-num">#{num}</span>
        <div className="lc-info">
          <div className="lc-title-row">
            <span className="lc-id">{problem.id}.</span>
            <a href={`https://leetcode.com/problems/${problem.slug}/`} target="_blank" rel="noopener noreferrer" className="lc-title">
              {problem.title}
            </a>
          </div>
          <div className="lc-tags">
            {(problem.tags || []).map(t => <span key={t} className="lc-tag">{t}</span>)}
          </div>
        </div>
        <span className={`lc-diff diff-${DIFF_COLOR[problem.difficulty]}`}>{problem.difficulty}</span>
        <button
          className={`lc-finish-btn ${problem.finished ? 'is-done' : ''}`}
          onClick={onFinish}
          title={problem.finished ? 'Mark as undone' : 'Mark as done'}
        >
          {problem.finished ? '✓' : '○'}
        </button>
      </div>

      {!problem.finished && (
        <>
          <textarea
            className="lc-feedback"
            placeholder="Notes / feedback... (save when done)"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="lc-actions">
            <button className={`lc-save-btn ${status === 'saved' ? 'saved' : ''}`} onClick={handleSave} disabled={!text.trim()}>
              {status === 'saved' ? 'Saved ✓' : 'Save'}
            </button>
            <button className="lc-clear-btn" onClick={handleClear}>Clear</button>
          </div>
        </>
      )}
    </div>
  )
}

export default function LeetcodeTracker() {
  const [problems, setProblems]     = useState(null)
  const [feedback, setFeedback]     = useState({})
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    getDoc(doc(db, 'leetcode_daily', TODAY)).then(snap => {
      if (snap.exists()) setProblems(snap.data())
    })
    getDoc(doc(db, 'leetcode', TODAY)).then(snap => {
      if (snap.exists()) setFeedback(snap.data())
    })
  }, [])

  const saveProblems = (next) => {
    setProblems(next)
    setDoc(doc(db, 'leetcode_daily', TODAY), next)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - 14)
      const cutoffStr = cutoff.toISOString().slice(0, 10)

      const snap = await getDocs(collection(db, 'leetcode_daily'))
      const excludedIds = []
      snap.forEach(d => {
        if (d.id >= cutoffStr) {
          const data = d.data()
          if (data.q1?.finished) excludedIds.push(data.q1.id)
          if (data.q2?.finished) excludedIds.push(data.q2.id)
        }
      })

      const picked = pickProblems(excludedIds)
      if (!picked) { setRefreshing(false); return }

      const next = {
        q1: toFirestoreProb(picked[0]),
        q2: toFirestoreProb(picked[1]),
      }
      saveProblems(next)
      setFeedback({})
    } finally {
      setRefreshing(false)
    }
  }

  const handleFinish = (key) => {
    if (!problems) return
    const next = {
      ...problems,
      [key]: { ...problems[key], finished: !problems[key].finished },
    }
    saveProblems(next)
  }

  const saveFeedback = (key, text) => {
    if (!problems) return
    const next = {
      ...feedback,
      [key]: { feedback: text, problem: { id: problems[key].id, title: problems[key].title, tags: problems[key].tags, difficulty: problems[key].difficulty } },
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
        <button className={`lc-refresh-btn ${refreshing ? 'spinning' : ''}`} onClick={handleRefresh} disabled={refreshing} title="Pick random problems">
          <IconRefresh />
        </button>
      </div>

      {!problems ? (
        <div className="lc-empty">No problems for today — hit refresh to pick some.</div>
      ) : (
        <div className="lc-list">
          {['q1', 'q2'].map((key, i) => (
            <ProblemCard
              key={key}
              num={i + 1}
              problem={problems[key]}
              initialFeedback={feedback[key]?.feedback || ''}
              onSave={(text) => saveFeedback(key, text)}
              onClear={() => clearFeedback(key)}
              onFinish={() => handleFinish(key)}
            />
          ))}
        </div>
      )}

      <div className="lc-footer">
        <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="lc-open">
          Open LeetCode →
        </a>
      </div>
    </div>
  )
}
