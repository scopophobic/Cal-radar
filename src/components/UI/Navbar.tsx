import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import './Navbar.css'

const Navbar: React.FC = () => {
  const [now, setNow] = useState(new Date())

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
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Navbar


