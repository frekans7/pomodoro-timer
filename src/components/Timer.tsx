import type { Phase } from '../types'
import { PHASE_COLORS } from '../types'

interface TimerProps {
  timeLeftMs: number
  totalMs: number
  phase: Phase
  isRunning: boolean
}

const PHASE_LABELS: Record<Phase, string> = {
  pomodoro:   'Focus',
  shortBreak: 'Short Break',
  longBreak:  'Long Break',
}

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Timer({ timeLeftMs, totalMs, phase, isRunning }: TimerProps) {
  const accent = PHASE_COLORS[phase]

  // SVG circle geometry
  const radius = 110
  const circumference = 2 * Math.PI * radius
  const progress = totalMs > 0 ? (totalMs - timeLeftMs) / totalMs : 0
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="timer-ring-wrapper" role="timer" aria-live="polite">
      <svg
        className="timer-ring-svg"
        viewBox="0 0 260 260"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          className="timer-ring-bg"
          cx="130"
          cy="130"
          r={radius}
        />
        {/* Progress arc */}
        <circle
          className="timer-ring-progress"
          cx="130"
          cy="130"
          r={radius}
          stroke={accent}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      {/* Centred text overlay */}
      <div className="timer-display">
        <span
          className="timer-digits"
          aria-label={`${formatTime(timeLeftMs)} remaining`}
        >
          {formatTime(timeLeftMs)}
        </span>
        <span
          className="timer-phase-label"
          style={{ color: accent }}
        >
          {PHASE_LABELS[phase]}
        </span>
      </div>
    </div>
  )
}
