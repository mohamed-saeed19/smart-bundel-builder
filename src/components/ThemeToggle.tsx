import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Space, Switch, Typography } from 'antd'
import { useThemeMode } from '../theme/ThemeProvider.tsx'

const { Text } = Typography

export function ThemeToggle() {
  const { isDark, setMode } = useThemeMode()

  return (
    <Space align="center" size="small">
      <SunOutlined aria-hidden />
      <Switch
        checked={isDark}
        onChange={(checked) => setMode(checked ? 'dark' : 'light')}
        checkedChildren={<MoonOutlined />}
        unCheckedChildren={<SunOutlined />}
        aria-label="Toggle dark mode"
      />
      <MoonOutlined aria-hidden />
      <Text type="secondary">{isDark ? 'Dark' : 'Light'}</Text>
    </Space>
  )
}
