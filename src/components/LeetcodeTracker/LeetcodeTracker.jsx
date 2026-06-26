import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import './LeetcodeTracker.css'

const POOL = [
  { id: 1,   title: 'Two Sum',                                        difficulty: 'Easy',   tags: ['Array', 'Hash Table'],             slug: 'two-sum' },
  { id: 70,  title: 'Climbing Stairs',                                difficulty: 'Easy',   tags: ['DP', 'Math'],                      slug: 'climbing-stairs' },
  { id: 121, title: 'Best Time to Buy and Sell Stock',                difficulty: 'Easy',   tags: ['Array', 'DP'],                     slug: 'best-time-to-buy-and-sell-stock' },
  { id: 206, title: 'Reverse Linked List',                            difficulty: 'Easy',   tags: ['Linked List', 'Recursion'],        slug: 'reverse-linked-list' },
  { id: 104, title: 'Maximum Depth of Binary Tree',                   difficulty: 'Easy',   tags: ['Tree', 'DFS'],                     slug: 'maximum-depth-of-binary-tree' },
  { id: 3,   title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', tags: ['Sliding Window', 'Hash Table'],    slug: 'longest-substring-without-repeating-characters' },
  { id: 198, title: 'House Robber',                                   difficulty: 'Medium', tags: ['DP', 'Array'],                     slug: 'house-robber' },
  { id: 238, title: 'Product of Array Except Self',                   difficulty: 'Medium', tags: ['Array', 'Prefix Sum'],             slug: 'product-of-array-except-self' },
  { id: 200, title: 'Number of Islands',                              difficulty: 'Medium', tags: ['DFS', 'BFS', 'Graph'],             slug: 'number-of-islands' },
  { id: 146, title: 'LRU Cache',                                      difficulty: 'Medium', tags: ['Design', 'Linked List'],           slug: 'lru-cache' },
  { id: 322, title: 'Coin Change',                                    difficulty: 'Medium', tags: ['DP', 'BFS'],                       slug: 'coin-change' },
  { id: 300, title: 'Longest Increasing Subsequence',                 difficulty: 'Medium', tags: ['DP', 'Binary Search'],             slug: 'longest-increasing-subsequence' },
  { id: 42,  title: 'Trapping Rain Water',                            difficulty: 'Hard',   tags: ['Array', 'Two Pointers', 'Stack'],  slug: 'trapping-rain-water' },
  { id: 4,   title: 'Median of Two Sorted Arrays',                    difficulty: 'Hard',   tags: ['Array', 'Binary Search'],          slug: 'median-of-two-sorted-arrays' },
  { id: 23,  title: 'Merge k Sorted Lists',                           difficulty: 'Hard',   tags: ['Linked List', 'Heap'],             slug: 'merge-k-sorted-lists' },
  { id: 76,  title: 'Minimum Window Substring',                       difficulty: 'Hard',   tags: ['Sliding Window', 'Hash Table'],    slug: 'minimum-window-substring' },
  { id: 124, title: 'Binary Tree Maximum Path Sum',                   difficulty: 'Hard',   tags: ['Tree', 'DFS'],                     slug: 'binary-tree-maximum-path-sum' },
  { id: 51,  title: 'N-Queens',                                       difficulty: 'Hard',   tags: ['Backtracking'],                    slug: 'n-queens' },
]

const DIFF_COLOR = { Easy: 'green', Medium: 'yellow', Hard: 'red' }
const TODAY = new Date().toISOString().slice(0, 10)

function getDailyProblems() {
  const d = new Date()
  let seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  const indices = new Set()
  while (indices.size < 2) {
    seed = (seed * 1664525 + 1013904223) >>> 0
    indices.add(seed % POOL.length)
  }
  return [...indices].map(i => POOL[i])
}

export default function LeetcodeTracker() {
  const problems = getDailyProblems()
  const [data, setData] = useState({})

  useEffect(() => {
    getDoc(doc(db, 'leetcode', TODAY)).then(snap => {
      if (snap.exists()) setData(snap.data())
    })
  }, [])

  const persist = (next) => {
    setData(next)
    setDoc(doc(db, 'leetcode', TODAY), next, { merge: true })
  }

  const toggleDone = (key) => {
    persist({ ...data, [`${key}_done`]: !data[`${key}_done`] })
  }

  const saveFeedback = (key, value) => {
    persist({ ...data, [`${key}_feedback`]: value })
  }

  return (
    <div className="card lc-card">
      <div className="card-title">
        <span className="icon">💻</span> LeetCode Daily
        <span className="lc-meta">2 problems · refreshes daily</span>
      </div>
      <div className="lc-list">
        {problems.map((p, i) => {
          const key = `q${i + 1}`
          const done = !!data[`${key}_done`]
          const feedback = data[`${key}_feedback`] || ''
          return (
            <div key={p.id} className={`lc-problem ${done ? 'done' : ''}`}>
              <div className="lc-top-row">
                <button
                  className={`lc-done-btn ${done ? 'checked' : ''}`}
                  onClick={() => toggleDone(key)}
                  title="Mark as done"
                >
                  {done ? '✓' : '○'}
                </button>
                <div className="lc-info">
                  <div className="lc-title-row">
                    <span className="lc-id">{p.id}.</span>
                    <a
                      href={`https://leetcode.com/problems/${p.slug}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lc-title"
                    >
                      {p.title}
                    </a>
                  </div>
                  <div className="lc-tags">
                    {p.tags.map(t => <span key={t} className="lc-tag">{t}</span>)}
                  </div>
                </div>
                <span className={`lc-diff diff-${DIFF_COLOR[p.difficulty]}`}>{p.difficulty}</span>
              </div>
              <textarea
                className="lc-feedback"
                placeholder="Notes / feedback..."
                value={feedback}
                onChange={e => saveFeedback(key, e.target.value)}
              />
            </div>
          )
        })}
      </div>
      <div className="lc-footer">
        <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="lc-open">
          Open LeetCode →
        </a>
      </div>
    </div>
  )
}
