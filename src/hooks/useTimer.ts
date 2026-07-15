/**
 * useTimer.ts
 * Drift-free timer hook.
 * Calculates remaining time from targetEndTime - Date.now() every ~100ms.
 * Never relies on setInterval tick counting.
 */

import { useEffect, useRef, useState } from 'react'
import type { Phase, Settings, TimerState } from '../types'
import { calcTimeLeft } from '../lib/timerEngine'

interface UseTimerReturn {
  timeLeftMs: number
  isRunning: boolean
  phase: Phase
  pomodoroCount: number
  start: () => void
  pause: () => void
  reset: () => void
  changePhase: (phase: Phase) => void
}

export function useTimer(timerState: TimerState, _settings: Settings): UseTimerReturn {
  const [timeLeftMs, setTimeLeftMs] = useState<number>(
    calcTimeLeft(timerState.targetEndTime, timerState.pausedTimeLeft, timerState.isRunning),
  )
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stateRef = useRef<TimerState>(timerState)
  stateRef.current = timerState

  // Re-compute displayed time whenever storage state changes
  useEffect(() => {
    setTimeLeftMs(
      calcTimeLeft(timerState.targetEndTime, timerState.pausedTimeLeft, timerState.isRunning),
    )
  }, [timerState])

  // Drift-correction loop — only for live display, NOT for actual timer logic
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    if (timerState.isRunning && timerState.targetEndTime) {
      intervalRef.current = setInterval(() => {
        const s = stateRef.current
        const left = calcTimeLeft(s.targetEndTime, s.pausedTimeLeft, s.isRunning)
        setTimeLeftMs(left)
      }, 100) // 100ms display refresh — smooth without heavy CPU
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [timerState.isRunning, timerState.targetEndTime])

  // ── Actions (delegate to service worker) ──────────────────────────────────

  const start = () => chrome.runtime.sendMessage({ type: 'START' })
  const pause = () => chrome.runtime.sendMessage({ type: 'PAUSE' })
  const reset = () => chrome.runtime.sendMessage({ type: 'RESET' })
  const changePhase = (phase: Phase) => chrome.runtime.sendMessage({ type: 'CHANGE_PHASE', phase })

  return {
    timeLeftMs,
    isRunning: timerState.isRunning,
    phase: timerState.phase,
    pomodoroCount: timerState.pomodoroCount,
    start,
    pause,
    reset,
    changePhase,
  }
}
