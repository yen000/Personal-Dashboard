import './CppArticle.css'

const FEATURED = {
  title: 'C++ Core Guidelines',
  description: 'Written by Bjarne Stroustrup & Herb Sutter. The definitive guide to writing safe, correct, and efficient modern C++.',
  url: 'https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines',
  tag: 'Reference',
}

const QUICK_LINKS = [
  { title: 'cppreference.com',    desc: 'Definitive C++ API reference',    url: 'https://en.cppreference.com/w/' },
  { title: 'Compiler Explorer',   desc: 'See assembly output in real-time', url: 'https://godbolt.org' },
  { title: 'Quick C++ Benchmark', desc: 'Measure C++ performance online',   url: 'https://quick-bench.com' },
  { title: 'C++ Insights',        desc: 'Visualize template instantiations', url: 'https://cppinsights.io' },
]

export default function CppArticle() {
  return (
    <div className="card cpp-card">
      <div className="card-title"><span className="icon">⚡</span> C++ Resources</div>
      <a href={FEATURED.url} target="_blank" rel="noopener noreferrer" className="cpp-featured">
        <div className="feat-header">
          <span className="feat-tag">{FEATURED.tag}</span>
        </div>
        <div className="feat-title">{FEATURED.title}</div>
        <div className="feat-desc">{FEATURED.description}</div>
        <div className="feat-url">{FEATURED.url.replace('https://', '')} →</div>
      </a>
      <div className="cpp-links-label">Quick Tools</div>
      <div className="cpp-links">
        {QUICK_LINKS.map(link => (
          <a
            key={link.title}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cpp-link-item"
          >
            <span className="cpp-link-title">{link.title}</span>
            <span className="cpp-link-desc">{link.desc}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
