/**
 * useStorage.ts
 * Typed wrappers around chrome.storage for TimerState and Settings.
 */

import { useCallback, useEffect, useState } from 'react'
import type { TimerState, Settings } from '../types'
import { DEFAULT_TIMER_STATE, DEFAULT_SETTINGS } from '../types'

const STORAGE_TIMER    = 'timerState'
const STORAGE_SETTINGS = 'settings'

// ─── Timer State ──────────────────────────────────────────────────────────────

export function useTimerStorage(): [TimerState, (s: TimerState) => void] {
  const [timerState, setTimerState] = useState<TimerState>({ ...DEFAULT_TIMER_STATE })

  useEffect(() => {
    // Initial load
    chrome.storage.local.get(STORAGE_TIMER, (result) => {
      if (result[STORAGE_TIMER]) {
        setTimerState(result[STORAGE_TIMER] as TimerState)
      }
    })

    // Live updates when service worker modifies storage
    const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes[STORAGE_TIMER]) {
        setTimerState(changes[STORAGE_TIMER].newValue as TimerState)
      }
    }
    chrome.storage.local.onChanged.addListener(listener)
    return () => chrome.storage.local.onChanged.removeListener(listener)
  }, [])

  const update = useCallback((state: TimerState) => {
    chrome.storage.local.set({ [STORAGE_TIMER]: state })
    setTimerState(state)
  }, [])

  return [timerState, update]
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function useSettings(): [Settings, (s: Settings) => void] {
  const [settings, setSettings] = useState<Settings>({ ...DEFAULT_SETTINGS })

  useEffect(() => {
    chrome.storage.sync.get(STORAGE_SETTINGS, (result) => {
      if (result[STORAGE_SETTINGS]) {
        setSettings(result[STORAGE_SETTINGS] as Settings)
      }
    })

    const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes[STORAGE_SETTINGS]) {
        setSettings(changes[STORAGE_SETTINGS].newValue as Settings)
      }
    }
    chrome.storage.sync.onChanged.addListener(listener)
    return () => chrome.storage.sync.onChanged.removeListener(listener)
  }, [])

  const update = useCallback((s: Settings) => {
    chrome.storage.sync.set({ [STORAGE_SETTINGS]: s })
    setSettings(s)
    // Notify service worker
    chrome.runtime.sendMessage({ type: 'SETTINGS_UPDATED', settings: s })
  }, [])

  return [settings, update]
}

// ─── Products State ────────────────────────────────────────────────────────────

import type { ProductsState } from '../types'
import { DEFAULT_PRODUCTS_STATE } from '../types'

const STORAGE_PRODUCTS = 'productsState'

export function useProductsStorage(): [ProductsState, (s: ProductsState) => void] {
  const [productsState, setProductsState] = useState<ProductsState>({ ...DEFAULT_PRODUCTS_STATE })

  useEffect(() => {
    chrome.storage.sync.get(STORAGE_PRODUCTS, (result) => {
      if (result[STORAGE_PRODUCTS]) {
        setProductsState(result[STORAGE_PRODUCTS] as ProductsState)
      }
    })

    const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes[STORAGE_PRODUCTS]) {
        setProductsState(changes[STORAGE_PRODUCTS].newValue as ProductsState)
      }
    }
    chrome.storage.sync.onChanged.addListener(listener)
    return () => chrome.storage.sync.onChanged.removeListener(listener)
  }, [])

  const update = useCallback((state: ProductsState) => {
    chrome.storage.sync.set({ [STORAGE_PRODUCTS]: state })
    setProductsState(state)
  }, [])

  return [productsState, update]
}
