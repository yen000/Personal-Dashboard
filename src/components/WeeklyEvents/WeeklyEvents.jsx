import './WeeklyEvents.css'

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const PLACEHOLDER_EVENTS = [
  { day: 1, title: 'Team Standup',    color: 'blue' },
  { day: 1, title: 'C++ Study',       color: 'accent' },
  { day: 2, title: 'Piano Practice',  color: 'pink' },
  { day: 3, title: 'Team Standup',    color: 'blue' },
  { day: 3, title: 'Gym',             color: 'green' },
  { day: 4, title: 'C++ Study',       color: 'accent' },
  { day: 5, title: 'Team Standup',    color: 'blue' },
  { day: 5, title: 'Piano Practice',  color: 'pink' },
  { day: 6, title: 'Gym',             color: 'green' },
]

export default function WeeklyEvents() {
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  return (
    <div className="card weekly-events">
      <div className="card-title">
        <span className="icon">📅</span> Weekly Events
        <span className="we-badge">TimeTree — coming soon</span>
      </div>
      <div className="week-list">
        {weekDays.map((day, i) => {
          const isToday = day.toDateString() === today.toDateString()
          const dayEvents = PLACEHOLDER_EVENTS.filter(e => e.day === i)

          return (
            <div key={i} className={`week-row ${isToday ? 'today' : ''}`}>
              <span className="row-day-name">{DAYS_SHORT[i]}</span>
              <span className={`row-day-num ${isToday ? 'today-num' : ''}`}>
                {day.getDate()}
              </span>
              <div className="row-events">
                {dayEvents.length === 0
                  ? <span className="no-events">—</span>
                  : dayEvents.map((ev, j) => (
                      <span key={j} className={`event-chip chip-${ev.color}`}>{ev.title}</span>
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
