import { useCallback, useEffect, useMemo, useState } from 'react'

import { SettingsContext } from '@/contexts/settings-context'
import {
  DEFAULT_SETTINGS,
  getAccentOption,
  SETTINGS_STORAGE_KEY,
} from '@/utils/settingsOptions'

function readStoredSettings() {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS

  try {
    const storedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!storedSettings) return DEFAULT_SETTINGS

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(storedSettings),
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(readStoredSettings)
  const setSetting = useCallback((key, value) => {
    setSettings((current) => ({ ...current, [key]: value }))
  }, [])

  const resetSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), [])

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    const accent = getAccentOption(settings.accent)
    const root = document.documentElement

    root.style.setProperty('--primary', accent.primary)
    root.style.setProperty('--ring', accent.ring)
    root.dataset.grid = settings.showGridBackground ? 'on' : 'off'
    root.dataset.solid = settings.reduceTransparency ? 'on' : 'off'
  }, [settings])

  const value = useMemo(
    () => ({
      settings,
      setSetting,
      resetSettings,
    }),
    [resetSettings, setSetting, settings],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
