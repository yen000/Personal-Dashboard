import { useState } from 'react'
import './SystemDesign.css'
import { DAILY_VIDEO } from './systemDesignData'

const SOURCES = [
  { title: 'System Design Primer',  desc: 'GitHub — most comprehensive free SD resource', url: 'https://github.com/donnemartin/system-design-primer' },
  { title: 'High Scalability',      desc: 'Real-world architecture case studies',          url: 'http://highscalability.com' },
  { title: 'Mechanical Sympathy',   desc: 'Martin Thompson\'s blog on hardware-aware code', url: 'https://mechanical-sympathy.blogspot.com' },
  { title: 'Awesome HFT Resources', desc: 'Curated list of HFT papers, talks, and tools',  url: 'https://github.com/iamquang95/awesome-hft' },
]

export default function SystemDesign() {
  const [tab, setTab] = useState('daily')

  return (
    <div className="card sd-card">
      <div className="card-title"><span className="icon">🏗️</span> System Design</div>

      <div className="sd-tabs">
        <button className={`sd-tab ${tab === 'daily' ? 'active' : ''}`} onClick={() => setTab('daily')}>
          Daily
        </button>
        <button className={`sd-tab ${tab === 'sources' ? 'active' : ''}`} onClick={() => setTab('sources')}>
          Sources
        </button>
      </div>

      {tab === 'daily' ? (
        <>
          <a href={DAILY_VIDEO.url} target="_blank" rel="noopener noreferrer" className="sd-featured">
            <div className="sd-feat-header">
              <span className="sd-tag">{DAILY_VIDEO.tag}</span>
              <span className="sd-channel">{DAILY_VIDEO.channel}</span>
              <span className="sd-date">{DAILY_VIDEO.date}</span>
            </div>
            <div className="sd-title">{DAILY_VIDEO.title}</div>
            <div className="sd-source">{DAILY_VIDEO.source}</div>
            <div className="sd-desc">{DAILY_VIDEO.description}</div>
            <div className="sd-topics">
              {DAILY_VIDEO.topics.map(t => (
                <span key={t} className="sd-topic-chip">{t}</span>
              ))}
            </div>
            <div className="sd-url">{DAILY_VIDEO.url.replace('https://', '')} →</div>
          </a>
        </>
      ) : (
        <div className="sd-resources">
          <div className="sd-resources-label">Curated Resources</div>
          {SOURCES.map(r => (
            <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer" className="sd-resource">
              <span className="sd-res-title">{r.title}</span>
              <span className="sd-res-desc">{r.desc}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
