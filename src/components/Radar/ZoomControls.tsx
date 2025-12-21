import './ZoomControls.css'

interface ZoomControlsProps {
  onZoom: (delta: number) => void
  onReset: () => void
  scale: number
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoom, onReset, scale }) => {
  return (
    <div className="zoom-controls">
      <button className="zoom-btn" onClick={() => onZoom(0.1)} title="Zoom In">
        +
      </button>
      <button className="zoom-btn" onClick={() => onZoom(-0.1)} title="Zoom Out">
        −
      </button>
      <button className="zoom-reset" onClick={onReset} title="Reset View">
        ↻
      </button>
      <span className="zoom-level">{Math.round(scale * 100)}%</span>
    </div>
  )
}

export default ZoomControls


