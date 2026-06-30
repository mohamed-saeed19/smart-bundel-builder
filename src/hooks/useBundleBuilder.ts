import { useCallback, useEffect, useMemo, useState } from 'react'
import { BUDGET_LIMIT, CATEGORY_ORDER } from '../constants/build'
import { fetchParts, getDraft, saveBuild, saveDraft } from '../services/api'
import type { BuildSelections, Part } from '../types'
import {
  getGroupedParts,
  getPartDisabledState,
  getSelectedParts,
  type DisabledState,
} from '../utils/build'

type BuildHistory = {
  past: BuildSelections[]
  present: BuildSelections
  future: BuildSelections[]
}

type Notify = (type: 'success' | 'info' | 'warning' | 'error', message: string) => void

const emptyHistory: BuildHistory = {
  past: [],
  present: {},
  future: [],
}

export function useBundleBuilder(notify: Notify) {
  const [parts, setParts] = useState<Part[]>([])
  const [history, setHistory] = useState<BuildHistory>(emptyHistory)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadInitialData() {
      try {
        const loadedParts = await fetchParts()
        if (!mounted) return
        setParts(loadedParts)

        try {
          const draft = await getDraft()
          if (draft?.selections && mounted) {
            setHistory({ past: [], present: draft.selections, future: [] })
            notify('success', 'Draft restored from the mock API.')
          }
        } catch {
          notify('info', 'Parts loaded. Start json-server to enable draft save and load.')
        }
      } catch {
        try {
          const fallback = await fetch('/db.json')
          const data = (await fallback.json()) as { parts: Part[] }
          if (!mounted) return
          setParts(data.parts)
          notify('info', 'Parts loaded from local db.json fallback.')
        } catch {
          if (mounted) {
            notify('error', 'Unable to load the parts catalog. Please start the mock API.')
          }
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadInitialData()

    return () => {
      mounted = false
    }
  }, [notify])

  const partsById = useMemo(() => new Map(parts.map((part) => [part.id, part])), [parts])
  const selectedParts = useMemo(
    () => getSelectedParts(partsById, history.present),
    [history.present, partsById],
  )
  const groupedParts = useMemo(() => getGroupedParts(parts), [parts])
  const totalCost = selectedParts.reduce((sum, part) => sum + part.price, 0)
  const remainingBudget = BUDGET_LIMIT - totalCost
  const budgetPercent = Math.min(100, Math.round((totalCost / BUDGET_LIMIT) * 100))
  const missingCategories = CATEGORY_ORDER.filter((category) => !history.present[category])
  const isComplete = missingCategories.length === 0

  const getDisabledState = useCallback(
    (part: Part): DisabledState =>
      getPartDisabledState({
        part,
        partsById,
        selectedParts,
        selections: history.present,
        totalCost,
      }),
    [history.present, partsById, selectedParts, totalCost],
  )

  const commitSelection = useCallback(
    (nextSelection: BuildSelections, notice?: string) => {
      setHistory((current) => ({
        past: [...current.past, current.present],
        present: nextSelection,
        future: [],
      }))
      if (notice) notify('success', notice)
    },
    [notify],
  )

  const selectPart = useCallback(
    (part: Part) => {
      const disabledState = getDisabledState(part)
      if (disabledState.disabled) {
        notify('warning', disabledState.reason ?? 'This component cannot be selected right now.')
        return
      }

      const isSelected = history.present[part.category] === part.id
      const nextSelection = { ...history.present }

      if (isSelected) {
        delete nextSelection[part.category]
        commitSelection(nextSelection, `${part.name} removed from your build.`)
        return
      }

      nextSelection[part.category] = part.id
      commitSelection(nextSelection, `${part.name} added to your build.`)
    },
    [commitSelection, getDisabledState, history.present, notify],
  )

  const undo = useCallback(() => {
    setHistory((current) => {
      const previous = current.past.at(-1)
      if (!previous) return current
      return {
        past: current.past.slice(0, -1),
        present: previous,
        future: [current.present, ...current.future],
      }
    })
    notify('info', 'Undo applied.')
  }, [notify])

  const redo = useCallback(() => {
    setHistory((current) => {
      const next = current.future[0]
      if (!next) return current
      return {
        past: [...current.past, current.present],
        present: next,
        future: current.future.slice(1),
      }
    })
    notify('info', 'Redo applied.')
  }, [notify])

  const clearBuild = useCallback(() => {
    if (selectedParts.length === 0) return
    commitSelection({}, 'Build cleared.')
  }, [commitSelection, selectedParts.length])

  const persistDraft = useCallback(async () => {
    try {
      await saveDraft({ selections: history.present, totalCost })
      notify('success', 'Draft saved to the mock API.')
    } catch {
      notify('error', 'Could not save the draft. Run the mock API on http://localhost:3001.')
    }
  }, [history.present, notify, totalCost])

  const restoreDraft = useCallback(async () => {
    try {
      const draft = await getDraft()
      if (!draft) {
        notify('warning', 'No saved draft was found.')
        return
      }
      commitSelection(draft.selections, 'Saved draft loaded.')
    } catch {
      notify('error', 'Could not load the draft. Run the mock API on http://localhost:3001.')
    }
  }, [commitSelection, notify])

  const finalizeBuild = useCallback(async () => {
    if (!isComplete) {
      notify('warning', `Select ${missingCategories.join(', ')} before finalizing.`)
      return
    }

    try {
      await saveBuild({
        name: `Smart Build - ${new Date().toLocaleDateString('en-US')}`,
        selections: history.present,
        totalCost,
      })
      notify('success', 'Build finalized and saved.')
    } catch {
      notify('error', 'Could not finalize the build. Run the mock API on http://localhost:3001.')
    }
  }, [history.present, isComplete, missingCategories, notify, totalCost])

  return {
    budgetPercent,
    canRedo: history.future.length > 0,
    canUndo: history.past.length > 0,
    clearBuild,
    getDisabledState,
    groupedParts,
    finalizeBuild,
    isComplete,
    loading,
    missingCategories,
    persistDraft,
    remainingBudget,
    restoreDraft,
    redo,
    selectPart,
    selectedParts,
    selections: history.present,
    totalCost,
    undo,
  }
}
