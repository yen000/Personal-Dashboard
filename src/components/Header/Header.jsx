import { useState, useEffect } from 'react'
import './Header.css'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

const INVESTMENT = {
  total: 24850,
  changePercent: 8.2,
  label: 'Portfolio',
}

const fmt = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Header() {
  const [now, setNow] = useState(new Date())
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const hours = now.getHours()
  const greeting = hours < 12 ? 'morning' : hours < 17 ? 'afternoon' : 'evening'
  const timeStr = `${hours.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  const dateStr = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`

  return (
    <header className="header-card">
      <div className="header-profile">
        {imgError ? (
          <div className="avatar-fallback">🐸</div>
        ) : (
          <img
            src="/avatar.png"
            className="avatar-img"
            onError={() => setImgError(true)}
            alt="Yen"
          />
        )}
        <div className="header-name-block">
          <span className="greeting">Good {greeting}</span>
          <span className="name">Yen</span>
        </div>
      </div>

      <div className="header-divider" />

      <div className="header-investment">
        <div className="inv-label">Portfolio</div>
        <div className="inv-value">${fmt(INVESTMENT.total)}</div>
        <div className="inv-change">
          <span className="inv-arrow">▲</span>
          {INVESTMENT.changePercent}% this month
        </div>
      </div>

      <div className="header-divider" />

      <div className="header-right">
        <div className="header-time">{timeStr}</div>
        <div className="header-date">{dateStr}</div>
      </div>
    </header>
  )
}
