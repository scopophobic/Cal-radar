import { create } from 'zustand'
import { GoogleCalendar, GoogleCalendarEvent } from '../services/googleCalendar'

interface CalendarState {
  calendars: GoogleCalendar[]
  selectedCalendars: string[]
  events: GoogleCalendarEvent[]
  isLoading: boolean
  error: string | null

  setCalendars: (calendars: GoogleCalendar[]) => void
  toggleCalendar: (calendarId: string) => void
  setSelectedCalendars: (ids: string[]) => void
  setEvents: (events: GoogleCalendarEvent[]) => void
  addEvent: (event: GoogleCalendarEvent) => void
  updateEvent: (eventId: string, updates: Partial<GoogleCalendarEvent>) => void
  deleteEvent: (eventId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCalendarStore = create<CalendarState>((set) => ({
  calendars: [],
  selectedCalendars: [],
  events: [],
  isLoading: false,
  error: null,

  setCalendars: (calendars) => set({ calendars }),
  toggleCalendar: (calendarId) =>
    set((state) => ({
      selectedCalendars: state.selectedCalendars.includes(calendarId)
        ? state.selectedCalendars.filter((id) => id !== calendarId)
        : [...state.selectedCalendars, calendarId],
    })),
  setSelectedCalendars: (ids) => set({ selectedCalendars: ids }),
  setEvents: (events) => set({ events }),
  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),
  updateEvent: (eventId, updates) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === eventId ? { ...e, ...updates } : e
      ),
    })),
  deleteEvent: (eventId) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== eventId),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))


