import { useCalendarStore } from '../../store/useCalendarStore'
import './Sidebar.css'

interface SidebarProps {
  isAuthenticated: boolean
  onSignIn: () => void
  onSignOut: () => void
  calendars: any[]
  selectedCalendars: string[]
}

const Sidebar: React.FC<SidebarProps> = ({
  isAuthenticated,
  onSignIn,
  onSignOut,
  calendars,
  selectedCalendars,
}) => {
  const { toggleCalendar } = useCalendarStore()

  return (
    <div className="calendar-sidebar">
      <div className="sidebar-section">
        <h3>Google Calendar</h3>
        {!isAuthenticated ? (
          <button className="auth-button" onClick={onSignIn}>
            Sign In
          </button>
        ) : (
          <button className="auth-button" onClick={onSignOut}>
            Sign Out
          </button>
        )}
      </div>

      {isAuthenticated && (
        <div className="sidebar-section">
          <h4>Calendars</h4>
          <div className="calendar-list">
            {calendars.map((calendar) => (
              <label key={calendar.id} className="calendar-item">
                <input
                  type="checkbox"
                  checked={selectedCalendars.includes(calendar.id)}
                  onChange={() => toggleCalendar(calendar.id)}
                />
                <span className="calendar-color" style={{ backgroundColor: calendar.backgroundColor || '#4285f4' }} />
                <span className="calendar-name">{calendar.summary}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="sidebar-section">
        <h4>Options</h4>
        <div className="options-list">
          <label className="option-item">
            <input type="checkbox" defaultChecked />
            <span>Show weekends</span>
          </label>
          <label className="option-item">
            <input type="checkbox" defaultChecked />
            <span>Show all-day events</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

