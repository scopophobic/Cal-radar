import { useMemo } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { formatDistanceToNow, format } from 'date-fns'
import './SidePanel.css'

interface SidePanelProps {
  blipId: string
  now: Date
}

const SidePanel: React.FC<SidePanelProps> = ({ blipId, now }) => {
  const { events, todos, setSelectedBlip, updateTodo, deleteTodo } =
    useAppStore()

  const blip = useMemo(() => {
    return [...events, ...todos].find((item) => item.id === blipId)
  }, [blipId, events, todos])

  if (!blip) return null

  const isTodo = 'isComplete' in blip
  const priority = blip.priority || 'medium'

  const priorityDoodles: Record<string, string> = {
    low: '·',
    medium: '○',
    high: '◉',
    critical: '●',
  }

  const categoryDoodles: Record<string, string> = {
    work: '◉',
    personal: '○',
    health: '◐',
  }

  const handleComplete = () => {
    if (isTodo) {
      updateTodo(blipId, { isComplete: true })
      setSelectedBlip(null)
    }
  }

  const handleDelete = () => {
    if (isTodo) {
      deleteTodo(blipId)
      setSelectedBlip(null)
    }
  }

  return (
    <div className="side-panel">
      <div className="side-panel-header">
        <h2>{blip.title}</h2>
        <button
          className="close-button"
          onClick={() => setSelectedBlip(null)}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="side-panel-content">
        <div className="side-panel-section">
          <div className="side-panel-label">Priority</div>
          <div className="side-panel-priority">
            {priorityDoodles[priority]} {priority}
          </div>
        </div>

        <div className="side-panel-section">
          <div className="side-panel-label">Category</div>
          <div className="side-panel-category">
            {categoryDoodles[blip.category]} {blip.category}
          </div>
        </div>

        <div className="side-panel-section">
          <div className="side-panel-label">Time</div>
          <div className="side-panel-time">
            {format(blip.startTime, 'MMM d, yyyy h:mm a')}
          </div>
          <div className="side-panel-countdown">
            {formatDistanceToNow(blip.startTime, { addSuffix: true })}
          </div>
        </div>

        {blip.description && (
          <div className="side-panel-section">
            <div className="side-panel-label">Description</div>
            <div className="side-panel-description">{blip.description}</div>
          </div>
        )}

        {isTodo && 'checklist' in blip && blip.checklist && (
          <div className="side-panel-section">
            <div className="side-panel-label">Checklist</div>
            <ul className="side-panel-checklist">
              {blip.checklist.map((item, index) => (
                <li key={index}>○ {item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isTodo && (
        <div className="side-panel-actions">
          <button className="complete-button" onClick={handleComplete}>
            ✓ Complete
          </button>
          <button className="delete-button" onClick={handleDelete}>
            × Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default SidePanel
