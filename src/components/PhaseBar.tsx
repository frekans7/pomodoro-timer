import type { Phase } from '../types'
import { PHASE_COLORS } from '../types'

interface PhaseBarProps {
  currentPhase: Phase
  onChangePhase: (phase: Phase) => void
}

const PHASES: { id: Phase; label: string }[] = [
  { id: 'pomodoro',   label: 'Pomodoro'    },
  { id: 'shortBreak', label: 'Short Break' },
  { id: 'longBreak',  label: 'Long Break'  },
]

export default function PhaseBar({ currentPhase, onChangePhase }: PhaseBarProps) {
  const accentColor = PHASE_COLORS[currentPhase]

  return (
    <div className="phase-bar">
      <div
        className="phase-btn-group"
        style={{ borderColor: accentColor }}
        role="group"
        aria-label="Timer mode"
      >
        {PHASES.map((p, i) => (
          <button
            key={p.id}
            className={`phase-btn${currentPhase === p.id ? ' active' : ''}`}
            style={{
              borderRightColor: accentColor,
              ...(currentPhase === p.id
                ? { backgroundColor: accentColor, color: '#fff' }
                : { color: accentColor }),
            }}
            onClick={() => onChangePhase(p.id)}
            aria-pressed={currentPhase === p.id}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
