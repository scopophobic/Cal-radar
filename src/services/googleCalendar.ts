import { Event } from '../types'

export interface GoogleCalendar {
  id: string
  summary: string
  description?: string
  backgroundColor?: string
  selected?: boolean
}

export interface GoogleCalendarEvent {
  id: string
  summary: string
  description?: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
  calendarId: string
}

class GoogleCalendarService {
  private gapi: any = null
  private isInitialized = false
  private isSignedIn = false

  async initialize(clientId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.gapi) {
        reject(new Error('Google API not loaded'))
        return
      }

      window.gapi.load('client:auth2', async () => {
        try {
          await window.gapi.client.init({
            clientId,
            scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          })

          this.gapi = window.gapi
          this.isInitialized = true
          this.isSignedIn = this.gapi.auth2.getAuthInstance().isSignedIn.get()
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  async signIn(): Promise<boolean> {
    if (!this.isInitialized || !this.gapi) {
      throw new Error('Google Calendar not initialized')
    }

    try {
      const authInstance = this.gapi.auth2.getAuthInstance()
      await authInstance.signIn()
      this.isSignedIn = true
      return true
    } catch (error) {
      console.error('Sign in error:', error)
      return false
    }
  }

  async signOut(): Promise<void> {
    if (!this.isInitialized || !this.gapi) {
      return
    }

    const authInstance = this.gapi.auth2.getAuthInstance()
    await authInstance.signOut()
    this.isSignedIn = false
  }

  isAuthenticated(): boolean {
    return this.isSignedIn && this.isInitialized
  }

  async getCalendars(): Promise<GoogleCalendar[]> {
    if (!this.isAuthenticated() || !this.gapi) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await this.gapi.client.calendar.calendarList.list()
      return response.result.items.map((cal: any) => ({
        id: cal.id,
        summary: cal.summary,
        description: cal.description,
        backgroundColor: cal.backgroundColor,
        selected: cal.selected !== false,
      }))
    } catch (error) {
      console.error('Error fetching calendars:', error)
      throw error
    }
  }

  async getEvents(calendarId: string, timeMin: Date, timeMax: Date): Promise<GoogleCalendarEvent[]> {
    if (!this.isAuthenticated() || !this.gapi) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await this.gapi.client.calendar.events.list({
        calendarId,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      })

      return response.result.items.map((event: any) => ({
        id: event.id,
        summary: event.summary || '(No title)',
        description: event.description,
        start: event.start,
        end: event.end,
        calendarId,
      }))
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    }
  }

  async createEvent(calendarId: string, event: Partial<GoogleCalendarEvent>): Promise<GoogleCalendarEvent> {
    if (!this.isAuthenticated() || !this.gapi) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await this.gapi.client.calendar.events.insert({
        calendarId,
        resource: {
          summary: event.summary,
          description: event.description,
          start: event.start,
          end: event.end,
        },
      })

      return {
        id: response.result.id,
        summary: response.result.summary || '',
        description: response.result.description,
        start: response.result.start,
        end: response.result.end,
        calendarId,
      }
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  }

  async updateEvent(calendarId: string, eventId: string, event: Partial<GoogleCalendarEvent>): Promise<GoogleCalendarEvent> {
    if (!this.isAuthenticated() || !this.gapi) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await this.gapi.client.calendar.events.update({
        calendarId,
        eventId,
        resource: {
          summary: event.summary,
          description: event.description,
          start: event.start,
          end: event.end,
        },
      })

      return {
        id: response.result.id,
        summary: response.result.summary || '',
        description: response.result.description,
        start: response.result.start,
        end: response.result.end,
        calendarId,
      }
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    if (!this.isAuthenticated() || !this.gapi) {
      throw new Error('Not authenticated')
    }

    try {
      await this.gapi.client.calendar.events.delete({
        calendarId,
        eventId,
      })
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  }

  // Convert Google Calendar event to our Event type
  convertToEvent(gEvent: GoogleCalendarEvent, category: 'work' | 'personal' | 'health' = 'work'): Event {
    const startTime = gEvent.start.dateTime
      ? new Date(gEvent.start.dateTime)
      : new Date(gEvent.start.date!)
    const endTime = gEvent.end.dateTime
      ? new Date(gEvent.end.dateTime)
      : new Date(gEvent.end.date!)

    return {
      id: `gc-${gEvent.calendarId}-${gEvent.id}`,
      title: gEvent.summary,
      startTime,
      endTime,
      category,
      description: gEvent.description,
      isFixed: true,
      priority: 'medium',
    }
  }
}

// Extend Window interface for gapi
declare global {
  interface Window {
    gapi: any
  }
}

export const googleCalendarService = new GoogleCalendarService()


