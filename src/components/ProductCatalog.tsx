import { Col, Empty, Row, Skeleton, Typography } from 'antd'
import type { BuildSelections, Part } from '../types'
import type { CategoryGroup, DisabledState } from '../utils/build'
import { PartCard } from './PartCard'

const { Title, Text } = Typography

type ProductCatalogProps = {
  getDisabledState: (part: Part) => DisabledState
  groupedParts: CategoryGroup[]
  loading: boolean
  onSelectPart: (part: Part) => void
  selections: BuildSelections
}

export function ProductCatalog({
  getDisabledState,
  groupedParts,
  loading,
  onSelectPart,
  selections,
}: ProductCatalogProps) {
  if (loading) {
    return (
      <main className="catalog" aria-label="Component catalog">
        <Skeleton active paragraph={{ rows: 10 }} />
      </main>
    )
  }

  if (groupedParts.length === 0) {
    return (
      <main className="catalog" aria-label="Component catalog">
        <Empty description="No parts are available yet" />
      </main>
    )
  }

  return (
    <main className="catalog" aria-label="Component catalog">
      {groupedParts.map((group) => (
        <section key={group.category} className="category-section">
          <div className="section-heading">
            <Title level={2}>{group.category}</Title>
            <Text type="secondary">Choose one</Text>
          </div>

          <Row gutter={[16, 16]} align="stretch">
            {group.parts.map((part) => (
              <Col xs={24} md={12} xl={8} key={part.id}>
                <PartCard
                  part={part}
                  isSelected={selections[part.category] === part.id}
                  disabledState={getDisabledState(part)}
                  onSelect={onSelectPart}
                />
              </Col>
            ))}
          </Row>
        </section>
      ))}
    </main>
  )
}
