import { useState } from 'react'
import type { Settings, Phase } from '../types'
import { PHASE_COLORS, DEFAULT_SETTINGS } from '../types'

interface SettingsProps {
  settings: Settings
  currentPhase: Phase
  onSave: (s: Settings) => void
  onClose: () => void
}

export default function Settings({ settings, currentPhase, onSave, onClose }: SettingsProps) {
  const [draft, setDraft] = useState<Settings>({ ...settings })
  const accent = PHASE_COLORS[currentPhase]

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

  const setDuration = (key: keyof Pick<Settings, 'pomodoroDuration' | 'shortBreakDuration' | 'longBreakDuration'>, delta: number) => {
    setDraft(prev => ({ ...prev, [key]: clamp(prev[key] + delta, 1, 99) }))
  }

  const handleResetToDefaults = () => {
    setDraft({ ...DEFAULT_SETTINGS })
  }

  const handleSave = () => {
    onSave(draft)
    onClose()
  }

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="settings-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Settings">
      <div className="settings-panel">
        <div className="settings-header">
          <h2 className="settings-title">Settings</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close settings">
            <svg viewBox="0 0 24 24" style={{ fill: 'var(--text-primary)', width: 24, height: 24 }}>
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Durations */}
        <p className="settings-section-title">Timer Durations</p>

        <DurationRow
          label="Pomodoro"
          value={draft.pomodoroDuration}
          onDecrement={() => setDuration('pomodoroDuration', -1)}
          onIncrement={() => setDuration('pomodoroDuration', +1)}
          accent={accent}
        />
        <div className="settings-divider" />

        <DurationRow
          label="Short Break"
          value={draft.shortBreakDuration}
          onDecrement={() => setDuration('shortBreakDuration', -1)}
          onIncrement={() => setDuration('shortBreakDuration', +1)}
          accent={accent}
        />
        <div className="settings-divider" />

        <DurationRow
          label="Long Break"
          value={draft.longBreakDuration}
          onDecrement={() => setDuration('longBreakDuration', -1)}
          onIncrement={() => setDuration('longBreakDuration', +1)}
          accent={accent}
        />

        {/* Behaviour */}
        <p className="settings-section-title" style={{ marginTop: 24 }}>Behaviour</p>

        <div className="settings-row">
          <div>
            <div className="settings-row-label">Auto Start Next Phase</div>
            <div className="settings-row-sub">Automatically start the next timer</div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={draft.autoTransition}
              onChange={e => setDraft(prev => ({ ...prev, autoTransition: e.target.checked }))}
            />
            <span className="toggle-slider" style={draft.autoTransition ? { backgroundColor: accent } : {}} />
          </label>
        </div>

        <div className="settings-divider" />

        <div className="settings-row">
          <div>
            <div className="settings-row-label">Sound Effects</div>
            <div className="settings-row-sub">Play sounds on timer events</div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={draft.soundEnabled}
              onChange={e => setDraft(prev => ({ ...prev, soundEnabled: e.target.checked }))}
            />
            <span className="toggle-slider" style={draft.soundEnabled ? { backgroundColor: accent } : {}} />
          </label>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
          <button
            className="btn"
            style={{ 
              flex: 1, 
              backgroundColor: 'transparent', 
              border: '1px solid var(--divider-color)', 
              color: 'var(--text-primary)',
              boxShadow: 'none',
              padding: '12px'
            }}
            onClick={handleResetToDefaults}
            type="button"
          >
            Reset Defaults
          </button>
          <button
            className="btn btn-primary"
            style={{ 
              flex: 1, 
              backgroundColor: accent, 
              width: 'auto', 
              marginTop: 0,
              padding: '12px'
            }}
            onClick={handleSave}
            id="settings-save-btn"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-component ────────────────────────────────────────────────────────────

interface DurationRowProps {
  label: string
  value: number
  onDecrement: () => void
  onIncrement: () => void
  accent: string
}

function DurationRow({ label, value, onDecrement, onIncrement, accent }: DurationRowProps) {
  return (
    <div className="settings-row">
      <div className="settings-row-label">{label}</div>
      <div className="num-input-wrapper">
        <button className="num-input-btn" onClick={onDecrement} aria-label={`Decrease ${label}`}>−</button>
        <span className="num-input-val" style={{ color: accent }}>{value}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>min</span>
        <button className="num-input-btn" onClick={onIncrement} aria-label={`Increase ${label}`}>+</button>
      </div>
    </div>
  )
}
