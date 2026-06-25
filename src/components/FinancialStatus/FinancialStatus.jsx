import './FinancialStatus.css'

const DATA = {
  total: 24850,
  dailyChange: 180,
  dailyPct: 0.73,
  monthlyChange: 1850,
  monthlyPct: 8.2,
  ytdPct: 24.5,
}

const fmt = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function FinancialStatus() {
  return (
    <div className="card fin-card">
      <div className="card-title">
        <span className="icon">📈</span> Investment
        <span className="placeholder-badge">placeholder</span>
      </div>

      <div className="fin-total">${fmt(DATA.total)}</div>
      <div className="fin-ytd">▲ {DATA.ytdPct}% year to date</div>

      <svg className="fin-sparkline" viewBox="0 0 220 64" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          fill="url(#sparkGrad)"
          points="0,64 0,52 28,48 55,42 78,44 100,33 122,26 148,21 168,16 195,11 220,7 220,64"
        />
        <polyline
          fill="none"
          stroke="#34d399"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="0,52 28,48 55,42 78,44 100,33 122,26 148,21 168,16 195,11 220,7"
        />
      </svg>

      <div className="fin-metrics">
        <div className="fin-metric">
          <div className="fin-metric-label">Today</div>
          <div className="fin-metric-val">+${DATA.dailyChange} <span className="pct">(+{DATA.dailyPct}%)</span></div>
        </div>
        <div className="fin-divider" />
        <div className="fin-metric">
          <div className="fin-metric-label">This Month</div>
          <div className="fin-metric-val">+${fmt(DATA.monthlyChange)} <span className="pct">(+{DATA.monthlyPct}%)</span></div>
        </div>
      </div>
    </div>
  )
}
