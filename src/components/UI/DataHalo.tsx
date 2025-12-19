import { useMemo, useEffect, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { formatDistanceToNow } from 'date-fns'
import './DataHalo.css'

interface DataHaloProps {
  blipId: string
  now: Date
}

const DataHalo: React.FC<DataHaloProps> = ({ blipId, now }) => {
  const { events, todos } = useAppStore()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const blip = useMemo(() => {
    return [...events, ...todos].find((item) => item.id === blipId)
  }, [blipId, events, todos])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!blip) return null

  const timeUntil = formatDistanceToNow(blip.startTime, { addSuffix: true })
  const priority = blip.priority || 'medium'

  // Simple doodle indicators
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

  return (
    <div
      className="data-halo"
      style={{
        left: `${mousePos.x}px`,
        top: `${mousePos.y}px`,
      } as React.CSSProperties}
    >
      <div className="data-halo-priority">{priorityDoodles[priority]} {priority}</div>
      <div className="data-halo-title">{blip.title}</div>
      <div className="data-halo-time">{timeUntil}</div>
      <div className="data-halo-category">{categoryDoodles[blip.category]} {blip.category}</div>
    </div>
  )
}

export default DataHalo
