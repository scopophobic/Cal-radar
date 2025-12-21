import { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Circle, Line, Group, Text } from 'react-konva'
import { RINGS } from '../../constants/rings'
import { SECTORS } from '../../constants/sectors'
import Blip from '../Blips/Blip'
import ZoomControls from './ZoomControls'
import { useAppStore } from '../../store/useAppStore'
import { useThemeStore } from '../../store/useThemeStore'
import { polarToCartesian } from '../../utils/polarMath'
import { Event, Todo } from '../../types'
import Konva from 'konva'

interface RadarCanvasProps {
  now: Date
}

const RadarCanvas: React.FC<RadarCanvasProps> = ({ now }) => {
  const { events, todos, selectedBlip, setHoveredBlip, setSelectedBlip } = useAppStore()
  const { theme } = useThemeStore()
  const [sweepAngle, setSweepAngle] = useState(0)
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 })
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)

  const strokeColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
  const textColor = theme === 'dark' ? '#ffffff' : '#000000'

  // Calculate canvas dimensions - use full viewport space
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        // Use full viewport dimensions, accounting for navbar (60px)
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight - 60 // Account for navbar
        // Use 98% to ensure it fits with minimal padding
        const size = Math.min(viewportWidth, viewportHeight) * 0.98
        setDimensions({ width: size, height: size })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Radar sweep animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngle((prev) => (prev + 0.5) % 360)
    }, 16) // ~60fps
    return () => clearInterval(interval)
  }, [])

  // Ensure minimum dimensions
  const canvasWidth = Math.max(dimensions.width, 400)
  const canvasHeight = Math.max(dimensions.height, 400)
  const centerX = canvasWidth / 2
  const centerY = canvasHeight / 2
  const maxRadius = Math.min(centerX, centerY) * 0.85 * scale

  // Handle zoom
  const handleZoom = (delta: number) => {
    setScale((prev) => Math.max(0.5, Math.min(3, prev + delta)))
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  // Handle wheel zoom
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()
    const stage = e.target.getStage()
    if (!stage) return

    const oldScale = scale
    const pointer = stage.getPointerPosition()
    if (!pointer) return

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    const newScale = e.evt.deltaY > 0 ? oldScale * 0.95 : oldScale * 1.05
    const clampedScale = Math.max(0.5, Math.min(3, newScale))

    setScale(clampedScale)
    setPosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    })
  }

  // Filter out completed todos
  const allBlips = [...events, ...todos].filter(
    (item) => !('isComplete' in item) || !item.isComplete
  )

  // Render rings
  const renderRings = () => {
    return RINGS.map((ring) => (
      <Circle
        key={ring.id}
        x={centerX}
        y={centerY}
        radius={ring.radius * maxRadius}
        stroke={strokeColor}
        strokeWidth={1}
        listening={false}
        dash={ring.id === 5 ? [4, 4] : undefined}
        opacity={ring.id === 5 ? 0.5 : 1}
      />
    ))
  }

  // Render sectors with simple doodle indicators
  const renderSectors = () => {
    return SECTORS.map((sector) => {
      const startRad = (sector.startAngle * Math.PI) / 180
      const endRad = (sector.endAngle * Math.PI) / 180
      const start = polarToCartesian(
        sector.startAngle,
        maxRadius,
        centerX,
        centerY,
        maxRadius
      )
      const midAngle = (startRad + endRad) / 2
      const labelRadius = maxRadius * 0.7

      // Simple doodle indicators
      const doodles: Record<string, string> = {
        work: '◉',
        personal: '○',
        health: '◐',
      }

      return (
        <Group key={sector.category}>
          <Line
            points={[centerX, centerY, start.x, start.y]}
            stroke={strokeColor}
            strokeWidth={1}
            listening={false}
          />
          <Text
            x={centerX + Math.cos(midAngle) * labelRadius - 15}
            y={centerY + Math.sin(midAngle) * labelRadius - 8}
            text={doodles[sector.category] || '○'}
            fontSize={16}
            fill={textColor}
            opacity={0.6}
            listening={false}
          />
          <Text
            x={centerX + Math.cos(midAngle) * labelRadius - 20}
            y={centerY + Math.sin(midAngle) * labelRadius + 8}
            text={sector.label}
            fontSize={11}
            fill={textColor}
            opacity={0.5}
            listening={false}
            fontStyle="normal"
          />
        </Group>
      )
    })
  }

  // Render sweep line
  const renderSweep = () => {
    const sweepRad = (sweepAngle * Math.PI) / 180
    const endX = centerX + Math.cos(sweepRad) * maxRadius
    const endY = centerY + Math.sin(sweepRad) * maxRadius

    return (
      <Line
        points={[centerX, centerY, endX, endY]}
        stroke={textColor}
        strokeWidth={1}
        opacity={0.3}
        listening={false}
        dash={[2, 4]}
      />
    )
  }

  return (
    <div ref={containerRef} className="radar-container">
      <Stage
        ref={stageRef}
        width={canvasWidth}
        height={canvasHeight}
        onWheel={handleWheel}
        draggable
        onDragEnd={(e) => {
          setPosition({ x: e.target.x(), y: e.target.y() })
        }}
        x={position.x}
        y={position.y}
        scaleX={scale}
        scaleY={scale}
      >
        <Layer>
          {/* Center point */}
          <Circle
            x={centerX}
            y={centerY}
            radius={2}
            fill={textColor}
            listening={false}
            opacity={0.8}
          />

          {/* Rings */}
          {renderRings()}

          {/* Sectors */}
          {renderSectors()}

          {/* Sweep line */}
          {renderSweep()}

          {/* Blips */}
          {allBlips.map((blip) => (
            <Blip
              key={blip.id}
              event={blip}
              now={now}
              centerX={centerX}
              centerY={centerY}
              maxRadius={maxRadius}
              onHover={() => setHoveredBlip(blip.id)}
              onLeave={() => setHoveredBlip(null)}
              onClick={() => setSelectedBlip(blip.id)}
            />
          ))}
        </Layer>
      </Stage>
      <ZoomControls onZoom={handleZoom} onReset={handleReset} scale={scale} />
    </div>
  )
}

export default RadarCanvas
