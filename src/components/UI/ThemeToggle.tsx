import { useThemeStore } from '../../store/useThemeStore'
import './ThemeToggle.css'

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}

export default ThemeToggle

