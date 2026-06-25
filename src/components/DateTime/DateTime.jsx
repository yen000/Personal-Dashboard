import { useState, useEffect } from 'react'
import './DateTime.css'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function DateTime() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hh  = now.getHours().toString().padStart(2, '0')
  const mm  = now.getMinutes().toString().padStart(2, '0')
  const ss  = now.getSeconds().toString().padStart(2, '0')

  return (
    <div className="card datetime-card">
      <div className="dt-time">
        {hh}:{mm}
        <span className="dt-sec">{ss}</span>
      </div>
      <div className="dt-day">{DAYS[now.getDay()]}</div>
      <div className="dt-date">{MONTHS[now.getMonth()]} {now.getDate()}, {now.getFullYear()}</div>
    </div>
  )
}
