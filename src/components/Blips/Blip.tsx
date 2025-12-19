import { useEffect, useRef, useState } from 'react'
import { Circle, Group, Text } from 'react-konva'
import { Event, Todo, Priority } from '../../types'
import { timeToPolar, polarToCartesian } from '../../utils/polarMath'
import { useThemeStore } from '../../store/useThemeStore'
import Konva from 'konva'

interface BlipProps {
  event: Event | Todo
  now: Date
  centerX: number
  centerY: number
  maxRadius: number
  onHover: () => void
  onLeave: () => void
  onClick: () => void
}

// Priority-based sizing
const PRIORITY_SIZES: Record<Priority, number> = {
  low: 3,
  medium: 5,
  high: 7,
  critical: 10,
}

// Simple doodle indicators for different scenarios
const PRIORITY_DOODLES: Record<Priority, string> = {
  low: '·',
  medium: '○',
  high: '◉',
  critical: '●',
}

const Blip: React.FC<BlipProps> = ({
  event,
  now,
  centerX,
  centerY,
  maxRadius,
  onHover,
  onLeave,
  onClick,
}) => {
  const { theme } = useThemeStore()
  const [isHovered, setIsHovered] = useState(false)
  const [pulseScale, setPulseScale] = useState(1)
  const groupRef = useRef<Konva.Group>(null)

  const polar = timeToPolar(event.startTime, now, event.category, event.isFixed)
  const { x, y } = polarToCartesian(
    polar.angle,
    polar.radius,
    centerX,
    centerY,
    maxRadius
  )

  const isFixed = event.isFixed
  const priority: Priority = event.priority || 'medium'
  const baseRadius = PRIORITY_SIZES[priority]
  const fillColor = theme === 'dark' ? '#ffffff' : '#000000'
  const strokeColor = theme === 'dark' ? '#ffffff' : '#000000'

  // Subtle pulse animation
  useEffect(() => {
    if (!groupRef.current) return

    const pulseAnim = new Konva.Animation(() => {
      setPulseScale((prev) => {
        const newScale = 1 + Math.sin(Date.now() / 1000) * 0.1
        return newScale
      })
    }, groupRef.current.getLayer()!)

    pulseAnim.start()
    return () => pulseAnim.stop()
  }, [])

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHover()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onLeave()
  }

  const radius = isHovered ? baseRadius * 1.3 : baseRadius * pulseScale
  const strokeWidth = isFixed ? 0 : priority === 'critical' ? 2.5 : priority === 'high' ? 2 : 1.5

  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onTap={onClick}
    >
      {/* Main blip */}
      <Circle
        radius={radius}
        fill={isFixed ? fillColor : 'transparent'}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        opacity={isHovered ? 1 : 0.8}
      />

      {/* Priority doodle indicator for todos */}
      {!isFixed && (
        <Text
          x={-4}
          y={-6}
          text={PRIORITY_DOODLES[priority]}
          fontSize={priority === 'critical' ? 10 : priority === 'high' ? 8 : 6}
          fill={fillColor}
          opacity={0.7}
          listening={false}
          fontStyle="normal"
        />
      )}

      {/* Simple indicator for fixed events */}
      {isFixed && priority === 'critical' && (
        <Circle
          radius={radius * 0.4}
          fill={fillColor}
          listening={false}
          opacity={0.5}
        />
      )}
    </Group>
  )
}

export default Blip
