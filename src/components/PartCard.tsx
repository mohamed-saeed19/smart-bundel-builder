import { CheckCircleFilled, ClearOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Button, Card, Image, Space, Tag, Tooltip, Typography } from 'antd'
import type { Part } from '../types'
import { formatCurrency, type DisabledState } from '../utils/build'

const { Title, Paragraph, Text } = Typography

type PartCardProps = {
  disabledState: DisabledState
  isSelected: boolean
  onSelect: (part: Part) => void
  part: Part
}

export function PartCard({ disabledState, isSelected, onSelect, part }: PartCardProps) {
  const disabledLabel = disabledState.kind === 'budget' ? 'Budget limit' : 'Incompatible'

  return (
    <Card
      className={`part-card ${isSelected ? 'is-selected' : ''} ${
        disabledState.kind ? `is-disabled-${disabledState.kind}` : ''
      }`}
      cover={
        <Image
          src={part.image}
          alt={part.name}
          height={150}
          preview={false}
          fallback="/favicon.svg"
        />
      }
      actions={[
        <Tooltip key="select" title={disabledState.disabled ? disabledState.reason : undefined}>
          <Button
            type={isSelected ? 'default' : 'primary'}
            icon={isSelected ? <ClearOutlined /> : <ShoppingCartOutlined />}
            disabled={disabledState.disabled}
            onClick={() => onSelect(part)}
            aria-pressed={isSelected}
            aria-disabled={disabledState.disabled}
            aria-describedby={disabledState.reason ? `${part.id}-reason` : undefined}
          >
            {isSelected ? 'Remove' : 'Select'}
          </Button>
        </Tooltip>,
      ]}
    >
      <Space orientation="vertical" size="small">
        <Space wrap>
          <Tag color={isSelected ? 'success' : 'processing'}>{formatCurrency(part.price)}</Tag>
          {isSelected ? (
            <Tag icon={<CheckCircleFilled />} color="success">
              Selected
            </Tag>
          ) : null}
          {disabledState.kind ? (
            <Tag color={disabledState.kind === 'budget' ? 'warning' : 'error'}>
              {disabledLabel}
            </Tag>
          ) : null}
        </Space>

        <Title level={3} className="part-title">
          {part.name}
        </Title>
        <Paragraph type="secondary" className="part-description">
          {part.description}
        </Paragraph>

        {disabledState.reason ? (
          <Text
            id={`${part.id}-reason`}
            type={disabledState.kind === 'budget' ? 'warning' : 'danger'}
            className="part-disabled-reason"
          >
            {disabledState.reason}
          </Text>
        ) : null}
      </Space>
    </Card>
  )
}
