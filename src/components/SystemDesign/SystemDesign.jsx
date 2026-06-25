import './SystemDesign.css'

const FEATURED_VIDEO = {
  title: 'System Design Interview — ByteByteGo',
  channel: 'ByteByteGo · Alex Xu',
  description: 'Clear visual walkthroughs of the most common system design questions. Great for interview prep and building architectural intuition.',
  url: 'https://www.youtube.com/@ByteByteGo',
  tag: 'YouTube',
}

const RESOURCES = [
  { title: 'System Design Primer', desc: 'GitHub — the most comprehensive free SD resource', url: 'https://github.com/donnemartin/system-design-primer' },
  { title: 'High Scalability',     desc: 'Real-world architecture case studies',             url: 'http://highscalability.com' },
]

export default function SystemDesign() {
  return (
    <div className="card sd-card">
      <div className="card-title"><span className="icon">🏗️</span> System Design</div>

      <a href={FEATURED_VIDEO.url} target="_blank" rel="noopener noreferrer" className="sd-featured">
        <div className="sd-feat-header">
          <span className="sd-tag">{FEATURED_VIDEO.tag}</span>
          <span className="sd-channel">{FEATURED_VIDEO.channel}</span>
        </div>
        <div className="sd-title">{FEATURED_VIDEO.title}</div>
        <div className="sd-desc">{FEATURED_VIDEO.description}</div>
        <div className="sd-url">{FEATURED_VIDEO.url.replace('https://', '')} →</div>
      </a>

      <div className="sd-resources-label">Also Worth Reading</div>
      <div className="sd-resources">
        {RESOURCES.map(r => (
          <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer" className="sd-resource">
            <span className="sd-res-title">{r.title}</span>
            <span className="sd-res-desc">{r.desc}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
