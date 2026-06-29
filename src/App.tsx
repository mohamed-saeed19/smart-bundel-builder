import { BulbOutlined } from '@ant-design/icons'
import { Button, Card, Col, Layout, Row, Space, Tag, Typography, theme } from 'antd'
import { ThemeToggle } from './components/ThemeToggle.tsx'
import { useThemeMode } from './theme/ThemeProvider.tsx'

const { Header, Content } = Layout
const { Title, Paragraph, Text } = Typography

export default function App() {
  const { token } = theme.useToken()
  const { mode } = useThemeMode()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingInline: 24,
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div className="flex items-center gap-2">
          <BulbOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
          <Title level={4} style={{ margin: 0 }}>
            Smart Bundle Builder
          </Title>
        </div>
        <ThemeToggle />
      </Header>

      <Content style={{ padding: 24, maxWidth: 960, margin: '0 auto', width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card>
            <Title level={3}>Design System</Title>
            <Paragraph type="secondary">
              Ant Design tokens are centralized in <Text code>src/theme/designSystem.ts</Text> and
              applied globally through <Text code>ConfigProvider</Text>. Current mode:{' '}
              <Tag color={mode === 'dark' ? 'purple' : 'blue'}>{mode}</Tag>
            </Paragraph>
          </Card>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card title="Actions" size="small">
                <Space wrap>
                  <Button type="primary">Primary</Button>
                  <Button>Default</Button>
                  <Button type="dashed">Dashed</Button>
                  <Button type="link">Link</Button>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card title="Status" size="small">
                <Space wrap>
                  <Tag color="success">Success</Tag>
                  <Tag color="warning">Warning</Tag>
                  <Tag color="error">Error</Tag>
                  <Tag color="processing">Info</Tag>
                </Space>
              </Card>
            </Col>
          </Row>
        </Space>
      </Content>
    </Layout>
  )
}
