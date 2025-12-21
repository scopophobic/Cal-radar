import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useThemeStore } from '../store/useThemeStore'
import { useGoogleCalendar } from '../hooks/useGoogleCalendar'
import Navbar from '../components/UI/Navbar'
import LeftSidebar from '../components/UI/LeftSidebar'
import './ProfilePage.css'

function ProfilePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, signOut } = useAuthStore()
  const { theme } = useThemeStore()
  const { isAuthenticated: googleConnected, handleSignIn, handleSignOut } = useGoogleCalendar()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated || !user) {
    return null
  }

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <div className="profile-page" data-theme={theme}>
      <Navbar />
      <LeftSidebar />
      <div className="profile-content">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="profile-info">
              <h1>{user.name}</h1>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="profile-sections">
            <div className="profile-section">
              <h2>Account Settings</h2>
              <div className="settings-list">
                <div className="setting-item">
                  <span className="setting-label">Email</span>
                  <span className="setting-value">{user.email}</span>
                </div>
                <div className="setting-item">
                  <span className="setting-label">Name</span>
                  <span className="setting-value">{user.name}</span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2>Integrations</h2>
              <div className="integration-item">
                <div className="integration-info">
                  <span className="integration-name">Google Calendar</span>
                  <span className={`integration-status ${googleConnected ? 'connected' : 'disconnected'}`}>
                    {googleConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                {googleConnected ? (
                  <button className="integration-btn" onClick={handleSignOut}>
                    Disconnect
                  </button>
                ) : (
                  <button className="integration-btn" onClick={handleSignIn}>
                    Connect
                  </button>
                )}
              </div>
            </div>

            <div className="profile-section">
              <h2>Actions</h2>
              <button className="logout-btn" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

