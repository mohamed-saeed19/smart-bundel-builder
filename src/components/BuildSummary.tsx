import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClearOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  ExclamationCircleOutlined,
  PrinterOutlined,
} from '@ant-design/icons'
import { Button, Col, Collapse, Empty, Row, Space, Tag, Tooltip, Typography, theme } from 'antd'
import type { Part, PartCategory } from '../types'
import { formatCurrency } from '../utils/build'

const { Title, Text } = Typography

type BuildSummaryProps = {
  canRedo: boolean
  canUndo: boolean
  onClear: () => void
  onExport: () => void
  onFinalize: () => void
  onLoadDraft: () => void
  onRedo: () => void
  onSaveDraft: () => void
  onUndo: () => void
  selectedParts: Part[]
  totalCost: number
  missingCategories: PartCategory[]
}

export function BuildSummary({
  canRedo,
  canUndo,
  onClear,
  onExport,
  onFinalize,
  onLoadDraft,
  onRedo,
  onSaveDraft,
  onUndo,
  selectedParts,
  totalCost,
  missingCategories,
}: BuildSummaryProps) {
  const { token } = theme.useToken()
  const hasSelections = selectedParts.length > 0
  const isComplete = missingCategories.length === 0
  const selectedPartItems = selectedParts.map((part) => ({
    key: part.id,
    label: (
      <div className="summary-collapse-label">
        <div>
          <Text strong>{part.category}</Text>
          <Text type="secondary">{part.name}</Text>
        </div>
        <Text strong>{formatCurrency(part.price)}</Text>
      </div>
    ),
    children: (
      <div className="summary-collapse-body">
        <Text type="secondary">{part.description}</Text>
      </div>
    ),
  }))
  const selectedPartsContent = hasSelections ? (
    <Collapse
      accordion
      bordered={false}
      className="summary-accordion"
      defaultActiveKey={selectedParts[0]?.id}
      items={selectedPartItems}
      size="small"
    />
  ) : (
    <Empty description="No components selected yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
  )
  const summaryActions = (
    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
      <Space.Compact block>
        <Tooltip title="Undo">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo last build change"
          />
        </Tooltip>
        <Tooltip title="Redo">
          <Button
            icon={<ArrowRightOutlined />}
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo last build change"
          />
        </Tooltip>
        <Tooltip title="Clear">
          <Button
            icon={<ClearOutlined />}
            onClick={onClear}
            disabled={!hasSelections}
            aria-label="Clear build"
          />
        </Tooltip>
      </Space.Compact>

      <Row gutter={[8, 8]}>
        <Col span={12}>
          <Button block icon={<CloudUploadOutlined />} onClick={onSaveDraft}>
            Save
          </Button>
        </Col>
        <Col span={12}>
          <Button block icon={<CloudDownloadOutlined />} onClick={onLoadDraft}>
            Load
          </Button>
        </Col>
        <Col span={24}>
          <Tooltip title={isComplete ? undefined : `Missing: ${missingCategories.join(', ')}`}>
            <Button
              block
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={onFinalize}
              disabled={!isComplete}
            >
              Finalize Build
            </Button>
          </Tooltip>
        </Col>
        <Col span={24}>
          <Button block icon={<PrinterOutlined />} onClick={onExport} disabled={!hasSelections}>
            Export PDF
          </Button>
        </Col>
      </Row>
    </Space>
  )
  const summaryMenuItems = [
    {
      key: 'components',
      label: (
        <div className="summary-menu-label">
          <Text strong>Selected Components</Text>
          <Text type="secondary">{selectedParts.length} items</Text>
        </div>
      ),
      children: <div className="summary-list">{selectedPartsContent}</div>,
    },
  ]

  return (
    <section
      className="summary-panel"
      aria-label="Build summary"
      style={{
        background: token.colorBgContainer,
        borderColor: token.colorBorderSecondary,
        boxShadow: token.boxShadowTertiary,
      }}
    >
      <div className="summary-print">
        <div className="section-heading">
          <Title level={2}>Build Summary</Title>
          <Text type="secondary">{selectedParts.length} selected</Text>
        </div>

        <Tag
          className="completion-tag"
          color={isComplete ? 'success' : 'warning'}
          icon={isComplete ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
        >
          {isComplete ? 'Ready to finalize' : `${missingCategories.length} categories remaining`}
        </Tag>

        <Collapse
          bordered={false}
          className="summary-menu"
          defaultActiveKey={['components', 'actions']}
          items={summaryMenuItems}
        />

        <div className="summary-total">
          <Text>Total</Text>
          <Title level={2}>{formatCurrency(totalCost)}</Title>
        </div>
      </div>

      {summaryActions}
    </section>
  )
}
