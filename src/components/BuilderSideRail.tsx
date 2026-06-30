import { BudgetMeter } from './BudgetMeter'
import { BuildSummary } from './BuildSummary'
import type { Part, PartCategory } from '../types'

type BuilderSideRailProps = {
  budgetPercent: number
  canRedo: boolean
  canUndo: boolean
  onClear: () => void
  onExport: () => void
  onFinalize: () => void
  onLoadDraft: () => void
  onRedo: () => void
  onSaveDraft: () => void
  onUndo: () => void
  remainingBudget: number
  selectedParts: Part[]
  totalCost: number
  missingCategories: PartCategory[]
}

export function BuilderSideRail({
  budgetPercent,
  canRedo,
  canUndo,
  onClear,
  onExport,
  onFinalize,
  onLoadDraft,
  onRedo,
  onSaveDraft,
  onUndo,
  remainingBudget,
  selectedParts,
  totalCost,
  missingCategories,
}: BuilderSideRailProps) {
  return (
    <aside className="side-rail">
      <BudgetMeter
        budgetPercent={budgetPercent}
        remainingBudget={remainingBudget}
        totalCost={totalCost}
      />
      <BuildSummary
        canRedo={canRedo}
        canUndo={canUndo}
        missingCategories={missingCategories}
        onClear={onClear}
        onExport={onExport}
        onFinalize={onFinalize}
        onLoadDraft={onLoadDraft}
        onRedo={onRedo}
        onSaveDraft={onSaveDraft}
        onUndo={onUndo}
        selectedParts={selectedParts}
        totalCost={totalCost}
      />
    </aside>
  )
}
