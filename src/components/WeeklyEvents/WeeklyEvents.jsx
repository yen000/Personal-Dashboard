import { useState, useEffect } from 'react'
import './WeeklyEvents.css'

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const COLOR_MAP = {
  1: 'accent', 2: 'green',  3: 'accent', 4: 'pink',
  5: 'accent', 6: 'pink',   7: 'blue',   8: 'blue',
  9: 'green', 10: 'pink',  11: 'pink',
}
const CHIP_COLORS = ['blue', 'accent', 'pink', 'green']

function getChipColor(event, index) {
  if (event.colorId) return COLOR_MAP[event.colorId] ?? 'blue'
  return CHIP_COLORS[index % CHIP_COLORS.length]
}

function getCalToken() {
  const token = localStorage.getItem('cal_token')
  const exp = parseInt(localStorage.getItem('cal_token_exp') || '0', 10)
  if (token && Date.now() < exp) return token
  return null
}

export default function WeeklyEvents() {
  const [events, setEvents] = useState(null)
  const [error, setError] = useState(null)

  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  useEffect(() => {
    const token = getCalToken()
    if (!token) {
      setError('no_token')
      return
    }

    const params = new URLSearchParams({
      timeMin: weekStart.toISOString(),
      timeMax: weekEnd.toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '100',
    })

    fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json().then(data => ({ ok: r.ok, status: r.status, data })))
      .then(({ ok, status, data }) => {
        if (!ok) {
          console.error('Calendar API error', status, data)
          setError(`${status}: ${data?.error?.message ?? 'unknown'}`)
          return
        }
        setEvents(data.items ?? [])
      })
      .catch(err => {
        console.error('Calendar fetch failed', err)
        setError('fetch_failed')
      })
  }, [])

  const badge = error === 'no_token'
    ? 'Sign in to load'
    : error
    ? error
    : events === null
    ? 'Loading…'
    : null

  function getEventsForDay(date) {
    if (!events) return []
    return events.filter(ev => {
      const start = ev.start?.dateTime ?? ev.start?.date
      if (!start) return false
      const evDate = new Date(start)
      return evDate.toDateString() === date.toDateString()
    })
  }

  return (
    <div className="card weekly-events">
      <div className="card-title">
        <span className="icon">📅</span> Weekly Events
        {badge && <span className="we-badge">{badge}</span>}
      </div>
      <div className="week-list">
        {weekDays.map((day, i) => {
          const isToday = day.toDateString() === today.toDateString()
          const dayEvents = getEventsForDay(day)

          return (
            <div key={i} className={`week-row ${isToday ? 'today' : ''}`}>
              <span className="row-day-name">{DAYS_SHORT[i]}</span>
              <span className={`row-day-num ${isToday ? 'today-num' : ''}`}>
                {day.getDate()}
              </span>
              <div className="row-events">
                {events === null && !error
                  ? <span className="no-events">—</span>
                  : dayEvents.length === 0
                  ? <span className="no-events">—</span>
                  : dayEvents.map((ev, j) => (
                      <span key={j} className={`event-chip chip-${getChipColor(ev, j)}`}>
                        {ev.summary ?? 'Untitled'}
                      </span>
                    ))
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
