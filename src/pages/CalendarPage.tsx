import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import LeftSidebar from '../components/UI/LeftSidebar'
import Navbar from '../components/UI/Navbar'
import Sidebar from '../components/Calendar/Sidebar'
import CalendarView from '../components/Calendar/CalendarView'
import { useThemeStore } from '../store/useThemeStore'
import { useCalendarStore } from '../store/useCalendarStore'
import { googleCalendarService } from '../services/googleCalendar'
import './CalendarPage.css'

function CalendarPage() {
  const { theme } = useThemeStore()
  const { calendars, selectedCalendars, events, setCalendars, setSelectedCalendars, setEvents, setLoading, setError } = useCalendarStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated && selectedCalendars.length > 0) {
      loadEvents()
    }
  }, [isAuthenticated, selectedCalendars, currentDate])

  const checkAuth = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      setError('Google Client ID not configured')
      return
    }

    try {
      await googleCalendarService.initialize(clientId)
      setIsAuthenticated(googleCalendarService.isAuthenticated())
      if (googleCalendarService.isAuthenticated()) {
        await loadCalendars()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setError('Failed to initialize Google Calendar')
    }
  }

  const handleSignIn = async () => {
    try {
      const success = await googleCalendarService.signIn()
      if (success) {
        setIsAuthenticated(true)
        await loadCalendars()
      }
    } catch (error) {
      setError('Failed to sign in')
    }
  }

  const handleSignOut = async () => {
    await googleCalendarService.signOut()
    setIsAuthenticated(false)
    setCalendars([])
    setEvents([])
  }

  const loadCalendars = async () => {
    try {
      setLoading(true)
      const calList = await googleCalendarService.getCalendars()
      setCalendars(calList)
      // Select all calendars by default
      const allCalendarIds = calList.map(cal => cal.id)
      setSelectedCalendars(allCalendarIds)
    } catch (error) {
      setError('Failed to load calendars')
    } finally {
      setLoading(false)
    }
  }

  const loadEvents = async () => {
    if (!isAuthenticated || selectedCalendars.length === 0) return

    try {
      setLoading(true)
      const startOfView = startOfMonth(currentDate)
      const endOfView = endOfMonth(currentDate)
      
      const allEvents: any[] = []
      for (const calendarId of selectedCalendars) {
        try {
          const calendarEvents = await googleCalendarService.getEvents(
            calendarId,
            startOfView,
            endOfView
          )
          allEvents.push(...calendarEvents)
        } catch (error) {
          console.error(`Error loading events for calendar ${calendarId}:`, error)
        }
      }
      setEvents(allEvents)
    } catch (error) {
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="calendar-page" data-theme={theme}>
      <LeftSidebar />
      <Navbar />
      <div className="calendar-content">
        <Sidebar
          isAuthenticated={isAuthenticated}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          calendars={calendars}
          selectedCalendars={selectedCalendars}
        />
        <div className="calendar-main">
          <div className="calendar-toolbar">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              ←
            </button>
            <h2>{format(currentDate, 'MMMM yyyy')}</h2>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              →
            </button>
            <button onClick={() => setCurrentDate(new Date())}>Today</button>
            <div className="view-toggle">
              <button
                className={view === 'month' ? 'active' : ''}
                onClick={() => setView('month')}
              >
                Month
              </button>
              <button
                className={view === 'week' ? 'active' : ''}
                onClick={() => setView('week')}
              >
                Week
              </button>
              <button
                className={view === 'day' ? 'active' : ''}
                onClick={() => setView('day')}
              >
                Day
              </button>
            </div>
          </div>
          <CalendarView
            currentDate={currentDate}
            view={view}
            events={events}
            selectedCalendars={selectedCalendars}
            calendars={calendars}
          />
        </div>
      </div>
    </div>
  )
}

export default CalendarPage

