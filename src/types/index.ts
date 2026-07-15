// Timer phases
export type Phase = 'pomodoro' | 'shortBreak' | 'longBreak'

// Theme
export type Theme = 'light' | 'dark'

// Colour accent per phase (matches original palette)
export const PHASE_COLORS: Record<Phase, string> = {
  pomodoro: '#f05b56',
  shortBreak: '#4da6a9',
  longBreak: '#498fc1',
}

// Default durations in milliseconds
export const DEFAULT_DURATIONS: Record<Phase, number> = {
  pomodoro: 25 * 60 * 1000,
  shortBreak: 5 * 60 * 1000,
  longBreak: 15 * 60 * 1000,
}

// User-configurable settings (stored in chrome.storage.sync)
export interface Settings {
  pomodoroDuration: number   // minutes
  shortBreakDuration: number // minutes
  longBreakDuration: number  // minutes
  autoTransition: boolean
  soundEnabled: boolean
  theme: Theme
}

export const DEFAULT_SETTINGS: Settings = {
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoTransition: true,
  soundEnabled: true,
  theme: 'light',
}

// Timer state (stored in chrome.storage.local for low-latency access)
export interface TimerState {
  phase: Phase
  targetEndTime: number | null  // unix ms timestamp when timer ends
  pausedTimeLeft: number | null // ms remaining when paused
  isRunning: boolean
  pomodoroCount: number         // how many pomodoros completed this cycle (0-3)
  shortBreakCount: number
  pendingSound: 'bell' | 'break' | null // set by SW on phase end, cleared by UI after playing
}

export const DEFAULT_TIMER_STATE: TimerState = {
  phase: 'pomodoro',
  targetEndTime: null,
  pausedTimeLeft: null,
  isRunning: false,
  pomodoroCount: 0,
  shortBreakCount: 0,
  pendingSound: null,
}

// Products notification state (stored in chrome.storage.sync to survive reinstalls)
export interface ProductsState {
  latestProductId: string
  latestProductStatus: string
  lastSeenProductId: string
  lastSeenProductStatus: string
}

export const DEFAULT_PRODUCTS_STATE: ProductsState = {
  latestProductId: '',
  latestProductStatus: '',
  lastSeenProductId: '',
  lastSeenProductStatus: '',
}

// Messages between popup ↔ service worker
export type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'CHANGE_PHASE'; phase: Phase }
  | { type: 'SETTINGS_UPDATED'; settings: Settings }
  | { type: 'CHECK_PRODUCTS_NOW' }
  | { type: 'SIMULATE_NEW_ID' }
  | { type: 'SIMULATE_LIVE_STATUS' }
