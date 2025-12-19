import { useState, useEffect } from 'react'
import RadarCanvas from '../components/Radar/RadarCanvas'
import DataHalo from '../components/UI/DataHalo'
import SidePanel from '../components/UI/SidePanel'
import LeftSidebar from '../components/UI/LeftSidebar'
import Navbar from '../components/UI/Navbar'
import { useAppStore } from '../store/useAppStore'
import { useThemeStore } from '../store/useThemeStore'
import { Event } from '../types'
import './RadarPage.css'

function RadarPage() {
  const { hoveredBlip, selectedBlip, setEvents } = useAppStore()
  const { theme } = useThemeStore()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Initialize with sample data
  useEffect(() => {
    const sampleEvents: Event[] = [
      {
        id: '1',
        title: 'Team Meeting',
        startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 3 * 60 * 60 * 1000),
        category: 'work',
        description: 'Weekly team sync',
        isFixed: true,
        priority: 'high',
      },
      {
        id: '2',
        title: 'Gym Session',
        startTime: new Date(now.getTime() + 6 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 7 * 60 * 60 * 1000),
        category: 'health',
        description: 'Cardio and weights',
        isFixed: true,
        priority: 'medium',
      },
      {
        id: '3',
        title: 'Dinner with Friends',
        startTime: new Date(now.getTime() + 12 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 14 * 60 * 60 * 1000),
        category: 'personal',
        description: 'Restaurant reservation at 7pm',
        isFixed: true,
        priority: 'low',
      },
      {
        id: '4',
        title: 'Project Deadline',
        startTime: new Date(now.getTime() + 1 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        category: 'work',
        description: 'Critical project submission',
        isFixed: true,
        priority: 'critical',
      },
    ]
    setEvents(sampleEvents)
  }, [setEvents, now])

  return (
    <div className="radar-page" data-theme={theme}>
      <LeftSidebar />
      <Navbar />
      <div className="app-content">
        <RadarCanvas now={now} />
      </div>
      {hoveredBlip && <DataHalo blipId={hoveredBlip} now={now} />}
      {selectedBlip && <SidePanel blipId={selectedBlip} now={now} />}
    </div>
  )
}

export default RadarPage

