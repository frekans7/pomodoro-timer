import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import PhaseBar from '../components/PhaseBar'
import Timer from '../components/Timer'
import Controls from '../components/Controls'
import SessionRing from '../components/SessionRing'
import SettingsPanel from '../components/Settings'
import { useTimerStorage, useSettings, useProductsStorage } from '../hooks/useStorage'
import { useTimer } from '../hooks/useTimer'
import { durationMs } from '../lib/timerEngine'
import type { Phase } from '../types'
import { PHASE_COLORS } from '../types'

export default function App() {
  const [timerState, _setTimerState] = useTimerStorage()
  const [settings, updateSettings] = useSettings()
  const [productsState, updateProductsState] = useProductsStorage()
  const [showSettings, setShowSettings] = useState(false)

  const { timeLeftMs, isRunning, phase, pomodoroCount, start, pause, reset, changePhase } =
    useTimer(timerState, settings)

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme)
  }, [settings.theme])

  // Update CSS accent variable
  useEffect(() => {
    document.documentElement.style.setProperty('--color-accent', PHASE_COLORS[phase])
  }, [phase])

  // Update document title with remaining time and phase icon
  useEffect(() => {
    const totalSeconds = Math.ceil(timeLeftMs / 1000)
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    const timeString = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

    let emoji = '🎯'
    if (phase === 'shortBreak') emoji = '☕'
    if (phase === 'longBreak') emoji = '🏖️'

    document.title = `${emoji} ${timeString} — Pomodoro Timer`
  }, [timeLeftMs, phase])

  // Play sounds when service worker signals a phase transition via pendingSound
  useEffect(() => {
    if (!timerState.pendingSound || !settings.soundEnabled) return

    const soundFile = timerState.pendingSound === 'bell' ? 'bell.mp3' : 'break.mp3'
    try {
      const audio = new Audio(chrome.runtime.getURL(soundFile))
      audio.play().catch(() => {/* ignore */})
    } catch { /* ignore */ }

    // Clear the signal so it doesn't replay on re-render
    chrome.storage.local.get('timerState', (result) => {
      const current = result['timerState']
      if (current?.pendingSound) {
        chrome.storage.local.set({ timerState: { ...current, pendingSound: null } })
      }
    })
  }, [timerState.pendingSound, settings.soundEnabled])

  const handleThemeToggle = () => {
    updateSettings({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' })
  }

  const totalMs = durationMs(settings, phase)

  const hasNewProduct = 
    productsState.latestProductStatus === 'live' && (
      productsState.latestProductId !== productsState.lastSeenProductId ||
      productsState.lastSeenProductStatus !== 'live'
    )

  return (
    <>
      <NavBar
        phase={phase}
        theme={settings.theme}
        onThemeToggle={handleThemeToggle}
        onSettingsOpen={() => setShowSettings(true)}
        hasNewProduct={hasNewProduct}
        onProductsClick={() => {
          updateProductsState({
            ...productsState,
            lastSeenProductId: productsState.latestProductId,
            lastSeenProductStatus: productsState.latestProductStatus,
          })
        }}
      />

      {/* Centred page content */}
      <div className="page-content">
        <PhaseBar
          currentPhase={phase}
          onChangePhase={(p: Phase) => changePhase(p)}
        />

        <div className="timer-section">
          <Timer
            timeLeftMs={timeLeftMs}
            totalMs={totalMs}
            phase={phase}
            isRunning={isRunning}
          />
          <Controls
            isRunning={isRunning}
            phase={phase}
            onStart={start}
            onPause={pause}
            onReset={reset}
          />
          <SessionRing pomodoroCount={pomodoroCount} phase={phase} />
        </div>
      </div>

      {showSettings && (
        <SettingsPanel
          settings={settings}
          currentPhase={phase}
          onSave={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  )
}
