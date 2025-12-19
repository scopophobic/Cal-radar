import { useState, useEffect } from 'react'
import { googleCalendarService } from '../../services/googleCalendar'
import './GoogleConnect.css'

const GoogleConnect: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) return

    try {
      await googleCalendarService.initialize(clientId)
      setIsAuthenticated(googleCalendarService.isAuthenticated())
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      if (!clientId) {
        alert('Google Client ID not configured')
        return
      }
      await googleCalendarService.initialize(clientId)
      const success = await googleCalendarService.signIn()
      if (success) {
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      alert('Failed to sign in to Google Calendar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await googleCalendarService.signOut()
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return null
  }

  return (
    <div className="google-connect">
      {!isAuthenticated ? (
        <button
          className="google-connect-btn"
          onClick={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Connect Google'}
        </button>
      ) : (
        <button className="google-connect-btn connected" onClick={handleSignOut}>
          Google ✓
        </button>
      )}
    </div>
  )
}

export default GoogleConnect

