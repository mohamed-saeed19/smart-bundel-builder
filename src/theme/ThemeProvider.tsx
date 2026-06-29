import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ConfigProvider } from 'antd'
import { createThemeConfig, type ThemeMode } from './designSystem.ts'

const STORAGE_KEY = 'theme-mode'

type ThemeContextValue = {
  mode: ThemeMode
  isDark: boolean
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getInitialMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isDark: mode === 'dark',
      setMode,
      toggleMode: () => setMode((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [mode],
  )

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={createThemeConfig(mode)}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  )
}

export function useThemeMode() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider')
  }
  return context
}
