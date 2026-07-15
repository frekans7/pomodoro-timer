import type { Phase } from '../types'
import { PHASE_COLORS } from '../types'

interface SessionRingProps {
  pomodoroCount: number
  phase: Phase
}

export default function SessionRing({ pomodoroCount, phase }: SessionRingProps) {
  const accent = PHASE_COLORS[phase]
  // Cycle resets after 4 pomodoros (long break resets count)
  const displayCount = pomodoroCount % 4

  return (
    <div className="session-rings" role="status" aria-label={`${displayCount} of 4 pomodoros completed`}>
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={`session-ring${i < displayCount ? ' filled' : ''}`}
          style={{
            borderColor: accent,
            backgroundColor: i < displayCount ? accent : 'transparent',
          }}
          aria-hidden="true"
        />
      ))}
      <span className="session-label">
        {displayCount}/4 Pomodoros
      </span>
    </div>
  )
}
