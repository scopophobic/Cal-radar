import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import GoogleConnect from './GoogleConnect'
import './Navbar.css'

const Navbar: React.FC = () => {
  const [now, setNow] = useState(new Date())
  const location = useLocation()

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          CalRadar
        </Link>
      </div>
      <div className="navbar-right">
        <p className="navbar-time">{now.toLocaleTimeString()}</p>
        <GoogleConnect />
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Navbar

