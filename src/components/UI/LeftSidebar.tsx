import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import './LeftSidebar.css'

const LeftSidebar: React.FC = () => {
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="left-sidebar">
      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          <span className="nav-icon">◉</span>
          <span className="nav-label">Radar</span>
        </Link>
        <Link
          to="/calendar"
          className={`nav-item ${location.pathname === '/calendar' ? 'active' : ''}`}
        >
          <span className="nav-icon">◐</span>
          <span className="nav-label">Calendar</span>
        </Link>
        <Link
          to="/todos"
          className={`nav-item ${location.pathname === '/todos' ? 'active' : ''}`}
        >
          <span className="nav-icon">○</span>
          <span className="nav-label">To-Dos</span>
        </Link>
        
        <div className="sidebar-divider"></div>
        
        <Link
          to={isAuthenticated ? '/profile' : '/login'}
          className={`nav-item ${location.pathname === '/profile' || location.pathname === '/login' ? 'active' : ''}`}
        >
          <span className="nav-icon">●</span>
          <span className="nav-label">Profile</span>
        </Link>
      </nav>
    </div>
  )
}

export default LeftSidebar


