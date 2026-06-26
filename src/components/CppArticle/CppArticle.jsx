import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import './CppArticle.css'

const SOURCES = [
  { title: 'TJSW on Medium', desc: 'C++ deep-dives and practical guides', url: 'https://tjsw.medium.com' },
  { title: 'C++ Stories',    desc: 'Modern C++ tips and best practices',  url: 'https://www.cppstories.com' },
]

export default function CppArticle() {
  const [tab, setTab]       = useState('daily')
  const [saved, setSaved]   = useState([])
  const [article, setArticle] = useState(null)

  useEffect(() => {
    getDoc(doc(db, 'cpp_saved', 'links')).then(snap => {
      if (snap.exists()) setSaved(snap.data().list || [])
    })
    getDoc(doc(db, 'cpp_article', 'daily')).then(snap => {
      if (snap.exists()) setArticle(snap.data())
    })
  }, [])

  const persist = (list) => {
    setSaved(list)
    setDoc(doc(db, 'cpp_saved', 'links'), { list })
  }

  const saveLink = (title, url) => {
    if (saved.some(l => l.url === url)) return
    persist([...saved, { id: Date.now(), title, url, savedAt: new Date().toLocaleDateString() }])
  }

  const removeLink = (id) => persist(saved.filter(l => l.id !== id))
  const isSaved = (url) => saved.some(l => l.url === url)

  return (
    <div className="card cpp-card">
      <div className="card-title"><span className="icon">⚡</span> C++ Daily</div>

      <div className="cpp-tabs">
        <button className={`cpp-tab ${tab === 'daily'   ? 'active' : ''}`} onClick={() => setTab('daily')}>Daily</button>
        <button className={`cpp-tab ${tab === 'sources' ? 'active' : ''}`} onClick={() => setTab('sources')}>Sources</button>
        <button className={`cpp-tab ${tab === 'saved'   ? 'active' : ''}`} onClick={() => setTab('saved')}>
          Saved {saved.length > 0 && <span className="cpp-saved-badge">{saved.length}</span>}
        </button>
      </div>

      {tab === 'daily' && (
        <>
          {!article ? (
            <div className="cpp-loading">Loading today's article…</div>
          ) : (
            <div className="cpp-feat-wrap">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="cpp-featured">
                <div className="feat-header">
                  <span className="feat-tag">{article.tag}</span>
                  <span className="feat-source">{article.source}</span>
                  <span className="feat-date">{article.date}</span>
                </div>
                <div className="feat-title">{article.title}</div>
                <ul className="feat-points">
                  {(article.keyPoints || []).map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
                <div className="feat-url">{article.url.replace('https://', '')} →</div>
              </a>
              <button
                className={`cpp-save-btn ${isSaved(article.url) ? 'is-saved' : ''}`}
                onClick={() => saveLink(article.title, article.url)}
              >
                {isSaved(article.url) ? '✓ Saved' : '+ Save'}
              </button>
            </div>
          )}
        </>
      )}

      {tab === 'sources' && (
        <div className="cpp-sources">
          {SOURCES.map(link => (
            <div key={link.title} className="cpp-link-row">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="cpp-link-item">
                <span className="cpp-link-title">{link.title}</span>
                <span className="cpp-link-desc">{link.desc}</span>
              </a>
              <button
                className={`cpp-save-sm ${isSaved(link.url) ? 'is-saved' : ''}`}
                onClick={() => saveLink(link.title, link.url)}
                title={isSaved(link.url) ? 'Already saved' : 'Save link'}
              >
                {isSaved(link.url) ? '✓' : '+'}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'saved' && (
        <div className="saved-list">
          {saved.length === 0 ? (
            <div className="saved-empty">
              No saved links yet.<br />Hit <strong>+ Save</strong> on any article.
            </div>
          ) : (
            saved.map(link => (
              <div key={link.id} className="saved-item">
                <div className="saved-item-info">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="saved-item-title">
                    {link.title}
                  </a>
                  <span className="saved-item-url">{link.url.replace('https://', '')}</span>
                  <span className="saved-item-date">{link.savedAt}</span>
                </div>
                <button className="saved-remove" onClick={() => removeLink(link.id)}>×</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
