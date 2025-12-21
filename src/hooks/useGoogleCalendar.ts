import { useState, useEffect } from 'react'
import { googleCalendarService } from '../services/googleCalendar'
import { useAppStore } from '../store/useAppStore'
import { Event } from '../types'

export const useGoogleCalendar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { setEvents } = useAppStore()

  const syncCalendarEvents = async () => {
    if (!googleCalendarService.isAuthenticated()) return
    
    try {
      setIsLoading(true)
      const calendars = await googleCalendarService.getCalendars()
      const selectedCalendars = calendars.filter(cal => cal.selected !== false)
      
      const now = new Date()
      const timeMin = new Date(now.getTime() - 24 * 60 * 60 * 1000) // 24 hours ago
      const timeMax = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days ahead
      
      const allEvents: Event[] = []
      
      for (const calendar of selectedCalendars) {
        try {
          const events = await googleCalendarService.getEvents(
            calendar.id,
            timeMin,
            timeMax
          )
          
          // Convert to app events
          events.forEach(gEvent => {
            const event = googleCalendarService.convertToEvent(
              gEvent,
              calendar.summary.toLowerCase().includes('work') ? 'work' :
              calendar.summary.toLowerCase().includes('personal') ? 'personal' : 'work'
            )
            allEvents.push(event)
          })
        } catch (error) {
          console.error(`Error loading events for ${calendar.summary}:`, error)
        }
      }
      
      setEvents(allEvents)
    } catch (error) {
      console.error('Error syncing calendar:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      if (!clientId) {
        // Silently fail if no client ID - app works without Google Calendar
        return
      }

      try {
        // Wait a bit for gapi to load
        if (typeof window !== 'undefined' && window.gapi) {
          await googleCalendarService.initialize(clientId)
          const authenticated = googleCalendarService.isAuthenticated()
          setIsAuthenticated(authenticated)
          
          if (authenticated) {
            await syncCalendarEvents()
          }
        }
      } catch (error) {
        // Silently fail - app works without Google Calendar
      }
    }
    
    // Delay initialization to ensure gapi is loaded
    const timer = setTimeout(() => {
      checkAuth()
    }, 500)
    
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      if (!clientId) {
        alert('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file.')
        return false
      }
      
      await googleCalendarService.initialize(clientId)
      const success = await googleCalendarService.signIn()
      
      if (success) {
        setIsAuthenticated(true)
        await syncCalendarEvents()
        return true
      }
      return false
    } catch (error) {
      console.error('Sign in error:', error)
      alert('Failed to sign in to Google Calendar. Please check your credentials.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await googleCalendarService.signOut()
      setIsAuthenticated(false)
      setEvents([]) // Clear synced events
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return {
    isAuthenticated,
    isLoading,
    handleSignIn,
    handleSignOut,
    syncCalendarEvents,
  }
}

