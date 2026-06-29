import { theme, type ThemeConfig } from 'antd'

export type ThemeMode = 'light' | 'dark'

export const brandTokens = {
  colorPrimary: '#6366f1',
  colorSuccess: '#22c55e',
  colorWarning: '#f59e0b',
  colorError: '#ef4444',
  colorInfo: '#3b82f6',
  borderRadius: 8,
  borderRadiusLG: 12,
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  fontSize: 14,
  controlHeight: 40,
} as const

const componentTokens = {
  Button: {
    controlHeight: 40,
    fontWeight: 500,
  },
  Card: {
    borderRadiusLG: 12,
  },
  Switch: {
    colorPrimary: brandTokens.colorPrimary,
  },
} as const

export function createThemeConfig(mode: ThemeMode): ThemeConfig {
  return {
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: brandTokens,
    components: componentTokens,
  }
}
