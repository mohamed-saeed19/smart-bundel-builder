import { ThunderboltOutlined } from '@ant-design/icons'
import { Layout, Typography, theme } from 'antd'
import { ThemeToggle } from './ThemeToggle'

const { Header } = Layout
const { Title } = Typography

export function AppHeader() {
  const { token } = theme.useToken()

  return (
    <Header
      className="app-header"
      style={{
        background: token.colorBgContainer,
        borderBottomColor: token.colorBorderSecondary,
        color: token.colorText,
      }}
    >
      <div className="brand-lockup">
        <ThunderboltOutlined style={{ color: token.colorPrimary }} aria-hidden />
        <Title level={4} style={{ margin: 0 }}>
          Smart Bundle Builder
        </Title>
      </div>
      <ThemeToggle />
    </Header>
  )
}
