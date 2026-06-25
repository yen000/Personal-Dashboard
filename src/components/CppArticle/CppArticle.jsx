import { useState } from 'react'
import './CppArticle.css'
import { DAILY_ARTICLE } from './cppArticleData'

const GOOD_RESOURCES = [
  { title: 'TJSW on Medium', desc: 'C++ deep-dives and practical guides', url: 'https://tjsw.medium.com' },
  { title: 'C++ Stories',    desc: 'Modern C++ tips and best practices',  url: 'https://www.cppstories.com' },
]

function loadSaved() {
  try { return JSON.parse(localStorage.getItem('cpp_saved_links')) || [] }
  catch { return [] }
}

export default function CppArticle() {
  const [tab, setTab]     = useState('daily')
  const [saved, setSaved] = useState(loadSaved)

  const persist = (list) => {
    setSaved(list)
    localStorage.setItem('cpp_saved_links', JSON.stringify(list))
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

      {/* ── Tabs ── */}
      <div className="cpp-tabs">
        <button className={`cpp-tab ${tab === 'daily' ? 'active' : ''}`} onClick={() => setTab('daily')}>
          Daily
        </button>
        <button className={`cpp-tab ${tab === 'saved' ? 'active' : ''}`} onClick={() => setTab('saved')}>
          Saved {saved.length > 0 && <span className="cpp-saved-badge">{saved.length}</span>}
        </button>
      </div>

      {tab === 'daily' ? (
        <>
          {/* Featured article */}
          <div className="cpp-feat-wrap">
            <a href={DAILY_ARTICLE.url} target="_blank" rel="noopener noreferrer" className="cpp-featured">
              <div className="feat-header">
                <span className="feat-tag">{DAILY_ARTICLE.tag}</span>
                <span className="feat-source">{DAILY_ARTICLE.source}</span>
                <span className="feat-date">{DAILY_ARTICLE.date}</span>
              </div>
              <div className="feat-title">{DAILY_ARTICLE.title}</div>
              <ul className="feat-points">
                {DAILY_ARTICLE.keyPoints.map((pt, i) => <li key={i}>{pt}</li>)}
              </ul>
              <div className="feat-url">{DAILY_ARTICLE.url.replace('https://', '')} →</div>
            </a>
            <button
              className={`cpp-save-btn ${isSaved(DAILY_ARTICLE.url) ? 'is-saved' : ''}`}
              onClick={() => saveLink(DAILY_ARTICLE.title, DAILY_ARTICLE.url)}
            >
              {isSaved(DAILY_ARTICLE.url) ? '✓ Saved' : '+ Save'}
            </button>
          </div>

          {/* Good Resources */}
          <div className="cpp-links-label">Good Resources</div>
          <div className="cpp-links">
            {GOOD_RESOURCES.map(link => (
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
        </>
      ) : (
        /* ── Saved links view ── */
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
