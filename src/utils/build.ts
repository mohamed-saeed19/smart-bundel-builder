
import { BUDGET_LIMIT, CATEGORY_ORDER } from '../constants/build'
import type { BuildSelections, Part, PartCategory } from '../types'

export type DisabledState = {
  disabled: boolean
  kind?: 'budget' | 'incompatible'
  reason?: string
}

export type CategoryGroup = {
  category: PartCategory
  parts: Part[]
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function getGroupedParts(parts: Part[]): CategoryGroup[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    parts: parts.filter((part) => part.category === category),
  })).filter((group) => group.parts.length > 0)
}

export function getSelectedParts(partsById: Map<string, Part>, selections: BuildSelections) {
  return CATEGORY_ORDER.map((category) => {
    const id = selections[category]
    return id ? partsById.get(id) : undefined
  }).filter(Boolean) as Part[]
}

export function areIncompatible(part: Part, selected: Part) {
  return part.incompatibleWith.includes(selected.id) || selected.incompatibleWith.includes(part.id)
}

export function getPartDisabledState({
  part,
  partsById,
  selectedParts,
  selections,
  totalCost,
}: {
  part: Part
  partsById: Map<string, Part>
  selectedParts: Part[]
  selections: BuildSelections
  totalCost: number
}): DisabledState {
  const currentSelectionId = selections[part.category]
  if (currentSelectionId === part.id) return { disabled: false }

  const incompatiblePart = selectedParts
    .filter((selected) => selected.category !== part.category)
    .find((selected) => areIncompatible(part, selected))

  if (incompatiblePart) {
    return {
      disabled: true,
      kind: 'incompatible',
      reason: `Incompatible with ${incompatiblePart.name}`,
    }
  }

  const categoryCurrentPrice = currentSelectionId ? partsById.get(currentSelectionId)?.price ?? 0 : 0
  const nextTotal = totalCost - categoryCurrentPrice + part.price

  if (nextTotal > BUDGET_LIMIT) {
    return {
      disabled: true,
      kind: 'budget',
      reason: `Would exceed the ${formatCurrency(BUDGET_LIMIT)} budget`,
    }
  }

  return { disabled: false }
}
