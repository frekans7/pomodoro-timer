/**
 * service-worker.ts
 * MV3 Service Worker — manages chrome.alarms for drift-free timing.
 * All timer logic runs here so the timer continues even when popup is closed.
 */

import type { TimerState, Settings, Phase, ProductsState } from '../types'
import { DEFAULT_TIMER_STATE, DEFAULT_SETTINGS, DEFAULT_PRODUCTS_STATE } from '../types'
import { durationMs, nextPhase } from '../lib/timerEngine'

const POPUP_URL    = 'index.html'
const ALARM_TIMER_END = 'timerEnd'
const ALARM_CHECK_PRODUCTS = 'checkProducts'
const STORAGE_TIMER  = 'timerState'
const STORAGE_SETTINGS = 'settings'
const STORAGE_PRODUCTS = 'productsState'

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getProductsState(): Promise<ProductsState> {
  const result = await chrome.storage.sync.get(STORAGE_PRODUCTS)
  return (result[STORAGE_PRODUCTS] as ProductsState) ?? { ...DEFAULT_PRODUCTS_STATE }
}

async function setProductsState(state: ProductsState): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_PRODUCTS]: state })
}

async function checkProducts(): Promise<void> {
  try {
    const res = await fetch('https://frekans7.com/products.json')
    if (!res.ok) throw new Error('Fetch failed')
    const products = await res.json()
    if (!Array.isArray(products) || products.length === 0) return

    // Get the very first (newest) product in the array
    const latestProduct = products[0]
    if (!latestProduct || !latestProduct.id) return

    const state = await getProductsState()
    const newState: ProductsState = {
      ...state,
      latestProductId: latestProduct.id,
      latestProductStatus: latestProduct.status,
    }
    await setProductsState(newState)
    console.log('[SW] Products check complete. Latest product:', latestProduct.id, 'Status:', latestProduct.status)
  } catch (err) {
    console.error('[SW] Failed to fetch products:', err)
  }
}

async function simulateNewId(): Promise<void> {
  const state = await getProductsState()
  const newState: ProductsState = {
    ...state,
    latestProductId: 'simulated-id-' + Date.now(),
    latestProductStatus: 'live',
  }
  await setProductsState(newState)
  console.log('[SW] Simulated new product ID successfully')
}

async function simulateLiveStatus(): Promise<void> {
  const state = await getProductsState()
  const targetId = state.lastSeenProductId || 'f7cms'
  const newState: ProductsState = {
    latestProductId: targetId,
    latestProductStatus: 'live',
    lastSeenProductId: targetId,
    lastSeenProductStatus: 'coming-soon',
  }
  await setProductsState(newState)
  console.log('[SW] Simulated live status successfully')
}

async function getTimerState(): Promise<TimerState> {
  const result = await chrome.storage.local.get(STORAGE_TIMER)
  return (result[STORAGE_TIMER] as TimerState) ?? { ...DEFAULT_TIMER_STATE }
}

async function setTimerState(state: TimerState): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_TIMER]: state })
}

async function getSettings(): Promise<Settings> {
  const result = await chrome.storage.sync.get(STORAGE_SETTINGS)
  return (result[STORAGE_SETTINGS] as Settings) ?? { ...DEFAULT_SETTINGS }
}

function notificationTitle(phase: Phase): string {
  switch (phase) {
    case 'pomodoro':   return '🍅 Time to Focus!'
    case 'shortBreak': return '☕ Time for a Short Break!'
    case 'longBreak':  return '🏖️ Time for a Long Break!'
  }
}

async function sendNotification(phase: Phase): Promise<void> {
  const notifId = `pomodoro-${Date.now()}`
  chrome.notifications.create(notifId, {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('pomodoro.png'),
    title: 'Pomodoro Timer',
    message: notificationTitle(phase),
    priority: 2,
    requireInteraction: false,
  })
}

// ─── Core timer control ───────────────────────────────────────────────────────

async function startTimer(state: TimerState, settings: Settings): Promise<TimerState> {
  const timeLeft = state.pausedTimeLeft ?? durationMs(settings, state.phase)
  const targetEndTime = Date.now() + timeLeft

  // Schedule alarm at exact end time (chrome.alarms is not throttled)
  chrome.alarms.create(ALARM_TIMER_END, { when: targetEndTime })

  return {
    ...state,
    isRunning: true,
    targetEndTime,
    pausedTimeLeft: null,
  }
}

async function pauseTimer(state: TimerState): Promise<TimerState> {
  chrome.alarms.clear(ALARM_TIMER_END)
  const pausedTimeLeft = state.targetEndTime
    ? Math.max(0, state.targetEndTime - Date.now())
    : state.pausedTimeLeft ?? 0

  return {
    ...state,
    isRunning: false,
    targetEndTime: null,
    pausedTimeLeft,
  }
}

async function resetTimer(state: TimerState, settings: Settings): Promise<TimerState> {
  chrome.alarms.clear(ALARM_TIMER_END)
  return {
    ...state,
    isRunning: false,
    targetEndTime: null,
    pausedTimeLeft: durationMs(settings, state.phase),
  }
}

async function changePhase(state: TimerState, phase: Phase, settings: Settings): Promise<TimerState> {
  chrome.alarms.clear(ALARM_TIMER_END)
  return {
    ...DEFAULT_TIMER_STATE,
    phase,
    pausedTimeLeft: durationMs(settings, phase),
    pomodoroCount: state.pomodoroCount,
    shortBreakCount: state.shortBreakCount,
  }
}

// ─── Alarm handler (timer end) ────────────────────────────────────────────────

async function handleTimerEnd(): Promise<void> {
  // Clear the alarm immediately to prevent any duplicate fires
  await chrome.alarms.clear(ALARM_TIMER_END)

  const [state, settings] = await Promise.all([getTimerState(), getSettings()])

  // Safety check: If the timer is not running or doesn't have a target end time, ignore
  if (!state.isRunning || !state.targetEndTime) {
    return
  }

  // Safety check: If the targetEndTime is still in the future (allow 1s buffer), ignore
  if (state.targetEndTime > Date.now() + 1000) {
    return
  }

  const { phase: newPhase, pomodoroCount, shortBreakCount } = nextPhase(
    state.phase,
    state.pomodoroCount,
    state.shortBreakCount,
  )

  await sendNotification(newPhase)

  // Signal which sound the UI should play:
  // - bell.mp3  → going back to pomodoro (work time)
  // - break.mp3 → going to a break phase
  const pendingSound: TimerState['pendingSound'] =
    newPhase === 'pomodoro' ? 'bell' : 'break'

  let newState: TimerState = {
    ...DEFAULT_TIMER_STATE,
    phase: newPhase,
    pomodoroCount,
    shortBreakCount,
    pausedTimeLeft: durationMs(settings, newPhase),
    pendingSound,
  }

  if (settings.autoTransition) {
    newState = await startTimer(newState, settings)
  }

  await setTimerState(newState)
}

// ─── Message handler (from popup) ─────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'CHECK_PRODUCTS_NOW') {
    checkProducts().then(() => sendResponse({ ok: true }))
    return true
  }
  if (message.type === 'SIMULATE_NEW_ID') {
    simulateNewId().then(() => sendResponse({ ok: true }))
    return true
  }
  if (message.type === 'SIMULATE_LIVE_STATUS') {
    simulateLiveStatus().then(() => sendResponse({ ok: true }))
    return true
  }

  ;(async () => {
    const [state, settings] = await Promise.all([getTimerState(), getSettings()])
    let newState = state

    switch (message.type) {
      case 'START':
        newState = await startTimer(state, settings)
        break
      case 'PAUSE':
        newState = await pauseTimer(state)
        break
      case 'RESET':
        newState = await resetTimer(state, settings)
        break
      case 'CHANGE_PHASE':
        newState = await changePhase(state, message.phase as Phase, settings)
        break
      case 'SETTINGS_UPDATED':
        // If timer not running, update paused time to new duration
        if (!state.isRunning) {
          newState = {
            ...state,
            pausedTimeLeft: durationMs(message.settings as Settings, state.phase),
          }
        }
        break
    }

    await setTimerState(newState)
    sendResponse({ ok: true, state: newState })
  })()
  return true // keep message channel open for async response
})

// ─── Alarm listener ───────────────────────────────────────────────────────────

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_TIMER_END) {
    await handleTimerEnd()
  } else if (alarm.name === ALARM_CHECK_PRODUCTS) {
    await checkProducts()
  }
})

// ─── Extension icon click → open/focus timer tab ──────────────────────────────

chrome.action.onClicked.addListener(async () => {
  const timerUrl = chrome.runtime.getURL(POPUP_URL)

  // Check if a timer tab is already open
  const existing = await chrome.tabs.query({ url: timerUrl })
  if (existing.length > 0 && existing[0].id !== undefined) {
    // Focus the existing tab
    await chrome.tabs.update(existing[0].id, { active: true })
    if (existing[0].windowId !== undefined) {
      await chrome.windows.update(existing[0].windowId, { focused: true })
    }
  } else {
    // Open a new tab
    await chrome.tabs.create({ url: timerUrl })
  }
})

// ─── Init: restore state on SW startup ────────────────────────────────────────

chrome.runtime.onInstalled.addListener(async () => {
  const [existingState, existingSettings, existingProducts] = await Promise.all([
    chrome.storage.local.get(STORAGE_TIMER),
    chrome.storage.sync.get(STORAGE_SETTINGS),
    chrome.storage.sync.get(STORAGE_PRODUCTS),
  ])

  if (!existingState[STORAGE_TIMER]) {
    const settings = (existingSettings[STORAGE_SETTINGS] as Settings) ?? { ...DEFAULT_SETTINGS }
    await setTimerState({
      ...DEFAULT_TIMER_STATE,
      pausedTimeLeft: durationMs(settings, 'pomodoro'),
    })
  }

  if (!existingSettings[STORAGE_SETTINGS]) {
    await chrome.storage.sync.set({ [STORAGE_SETTINGS]: DEFAULT_SETTINGS })
  }

  if (!existingProducts[STORAGE_PRODUCTS]) {
    await setProductsState({ ...DEFAULT_PRODUCTS_STATE })
  }

  // Create products check alarm (once every 24 hours)
  chrome.alarms.create(ALARM_CHECK_PRODUCTS, { periodInMinutes: 24 * 60 })

  // Trigger initial check immediately on install/update
  await checkProducts()
})

// Keep service worker alive check (SW can be terminated by Chrome)
// Re-register alarm if timer was running but alarm got lost
chrome.runtime.onStartup.addListener(async () => {
  const [state, settings] = await Promise.all([getTimerState(), getSettings()])
  if (state.isRunning && state.targetEndTime) {
    if (state.targetEndTime <= Date.now()) {
      // Timer already ended while SW was dead
      await handleTimerEnd()
    } else {
      // Re-register alarm
      chrome.alarms.create(ALARM_TIMER_END, { when: state.targetEndTime })
    }
  }
})
