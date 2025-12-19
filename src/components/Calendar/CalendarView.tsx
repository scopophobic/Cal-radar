import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addDays, startOfDay, addWeeks, subWeeks } from 'date-fns'
import { GoogleCalendarEvent, GoogleCalendar } from '../../services/googleCalendar'
import './CalendarView.css'

interface CalendarViewProps {
  currentDate: Date
  view: 'month' | 'week' | 'day'
  events: GoogleCalendarEvent[]
  selectedCalendars: string[]
  calendars: GoogleCalendar[]
}

const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  view,
  events,
  selectedCalendars,
  calendars,
}) => {
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventStart = event.start.dateTime
        ? new Date(event.start.dateTime)
        : new Date(event.start.date!)
      const eventEnd = event.end.dateTime
        ? new Date(event.end.dateTime)
        : new Date(event.end.date!)

      return (
        isSameDay(eventStart, date) ||
        (eventStart <= date && eventEnd >= date)
      )
    })
  }

  const getCalendarColor = (calendarId: string) => {
    const calendar = calendars.find((cal) => cal.id === calendarId)
    return calendar?.backgroundColor || '#000000'
  }

  if (view === 'month') {
    const monthStart = startOfWeek(startOfDay(currentDate))
    const monthEnd = endOfWeek(addDays(monthStart, 41))
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
      <div className="calendar-month-view">
        <div className="calendar-weekdays">
          {weekDays.map((day) => (
            <div key={day} className="weekday-header">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {days.map((day, idx) => {
            const dayEvents = getEventsForDate(day)
            const isCurrentMonth = day.getMonth() === currentDate.getMonth()

            return (
              <div
                key={idx}
                className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isSameDay(day, new Date()) ? 'today' : ''}`}
              >
                <div className="day-number">{format(day, 'd')}</div>
                <div className="day-events">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="event-item"
                      style={{
                        borderLeft: `3px solid ${getCalendarColor(event.calendarId)}`,
                      }}
                      title={event.summary}
                    >
                      {format(new Date(event.start.dateTime || event.start.date!), 'HH:mm')} {event.summary}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="more-events">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (view === 'week') {
    const weekStart = startOfWeek(currentDate)
    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: addDays(weekStart, 6),
    })

    return (
      <div className="calendar-week-view">
        <div className="week-header">
          {weekDays.map((day) => (
            <div key={day.toString()} className="week-day-column">
              <div className="week-day-header">
                <div className="week-day-name">{format(day, 'EEE')}</div>
                <div className={`week-day-number ${isSameDay(day, new Date()) ? 'today' : ''}`}>
                  {format(day, 'd')}
                </div>
              </div>
              <div className="week-day-events">
                {getEventsForDate(day).map((event) => (
                  <div
                    key={event.id}
                    className="week-event-item"
                    style={{
                      borderLeft: `3px solid ${getCalendarColor(event.calendarId)}`,
                    }}
                  >
                    <div className="event-time">
                      {format(new Date(event.start.dateTime || event.start.date!), 'HH:mm')}
                    </div>
                    <div className="event-title">{event.summary}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Day view
  const dayEvents = getEventsForDate(currentDate)
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="calendar-day-view">
      <div className="day-header">
        <div className="day-date">{format(currentDate, 'EEEE, MMMM d, yyyy')}</div>
      </div>
      <div className="day-timeline">
        {hours.map((hour) => {
          const hourEvents = dayEvents.filter((event) => {
            const eventStart = new Date(event.start.dateTime || event.start.date!)
            return eventStart.getHours() === hour
          })

          return (
            <div key={hour} className="timeline-hour">
              <div className="hour-label">{format(new Date(2000, 0, 1, hour), 'HH:mm')}</div>
              <div className="hour-content">
                {hourEvents.map((event) => (
                  <div
                    key={event.id}
                    className="day-event-item"
                    style={{
                      borderLeft: `3px solid ${getCalendarColor(event.calendarId)}`,
                    }}
                  >
                    <div className="event-time">
                      {format(new Date(event.start.dateTime || event.start.date!), 'HH:mm')}
                    </div>
                    <div className="event-title">{event.summary}</div>
                    {event.description && (
                      <div className="event-description">{event.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarView

