import { DollarOutlined } from '@ant-design/icons'
import { Progress, Space, Typography, theme } from 'antd'
import { BUDGET_LIMIT } from '../constants/build'
import { formatCurrency } from '../utils/build'

const { Text } = Typography

type BudgetMeterProps = {
  budgetPercent: number
  remainingBudget: number
  totalCost: number
}

export function BudgetMeter({ budgetPercent, remainingBudget, totalCost }: BudgetMeterProps) {
  const { token } = theme.useToken()
  const isNearLimit = budgetPercent >= 95

  return (
    <section
      className="budget-meter"
      aria-label="Budget usage"
      style={{
        background: token.colorBgContainer,
        borderColor: token.colorBorderSecondary,
        boxShadow: token.boxShadowTertiary,
      }}
    >
      <div className="budget-header">
        <Space align="center">
          <DollarOutlined aria-hidden />
          <Text strong>{formatCurrency(totalCost)}</Text>
        </Space>
        <Text type="secondary">Limit {formatCurrency(BUDGET_LIMIT)}</Text>
      </div>

      <Progress
        percent={budgetPercent}
        status={isNearLimit ? 'exception' : 'active'}
        strokeColor={isNearLimit ? token.colorError : token.colorPrimary}
        aria-valuemin={0}
        aria-valuemax={BUDGET_LIMIT}
        aria-valuenow={totalCost}
      />

      <Text type={remainingBudget < 100 ? 'warning' : 'secondary'}>
        {formatCurrency(Math.max(0, remainingBudget))} remaining
      </Text>
    </section>
  )
}
