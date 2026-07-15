import type { Phase } from '../types'
import { PHASE_COLORS } from '../types'

interface ControlsProps {
  isRunning: boolean
  phase: Phase
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export default function Controls({ isRunning, phase, onStart, onPause, onReset }: ControlsProps) {
  const accent = PHASE_COLORS[phase]

  const handleToggle = () => {
    if (isRunning) {
      onPause()
    } else {
      onStart()
    }
    // Play button click sound — must use chrome.runtime.getURL in extension context
    try {
      const audio = new Audio(chrome.runtime.getURL('button.mp3'))
      audio.play().catch(() => {/* ignore autoplay policy errors */})
    } catch { /* ignore */ }
  }

  return (
    <div className="controls">
      <button
        id="timer-toggle-btn"
        className="btn btn-primary"
        onClick={handleToggle}
        style={{ backgroundColor: accent }}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button
        id="timer-reset-btn"
        className="btn btn-secondary"
        onClick={onReset}
        style={{ backgroundColor: accent }}
        aria-label="Reset timer"
      >
        Reset
      </button>
    </div>
  )
}
