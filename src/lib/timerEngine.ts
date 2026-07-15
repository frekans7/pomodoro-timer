/**
 * timerEngine.ts
 * Pure computation — no side effects, no Chrome APIs.
 * Used by both the popup (UI) and service worker.
 */

import type { Phase, Settings } from '../types'
import { DEFAULT_SETTINGS } from '../types'

/** Convert user-facing minutes to milliseconds */
export function durationMs(settings: Settings, phase: Phase): number {
  switch (phase) {
    case 'pomodoro':    return settings.pomodoroDuration   * 60 * 1000
    case 'shortBreak':  return settings.shortBreakDuration * 60 * 1000
    case 'longBreak':   return settings.longBreakDuration  * 60 * 1000
  }
}

/**
 * Given the stored targetEndTime and current Date.now(),
 * return how many milliseconds remain (clamped to 0).
 */
export function calcTimeLeft(targetEndTime: number | null, pausedTimeLeft: number | null, isRunning: boolean): number {
  if (!isRunning) {
    return pausedTimeLeft ?? 0
  }
  if (targetEndTime === null) return 0
  return Math.max(0, targetEndTime - Date.now())
}

/**
 * Determine the next phase and update counters after a phase ends.
 * Returns the new phase + updated counters.
 */
export function nextPhase(
  currentPhase: Phase,
  pomodoroCount: number,
  shortBreakCount: number,
): { phase: Phase; pomodoroCount: number; shortBreakCount: number } {
  switch (currentPhase) {
    case 'pomodoro': {
      const newPomoCount = pomodoroCount + 1
      if (newPomoCount >= 4) {
        // After 4 pomodoros → long break, reset counters
        return { phase: 'longBreak', pomodoroCount: newPomoCount, shortBreakCount }
      } else {
        return { phase: 'shortBreak', pomodoroCount: newPomoCount, shortBreakCount }
      }
    }
    case 'shortBreak': {
      const newShortCount = shortBreakCount + 1
      return { phase: 'pomodoro', pomodoroCount, shortBreakCount: newShortCount }
    }
    case 'longBreak': {
      // Reset full cycle
      return { phase: 'pomodoro', pomodoroCount: 0, shortBreakCount: 0 }
    }
  }
}

export function defaultSettings(): Settings {
  return { ...DEFAULT_SETTINGS }
}
