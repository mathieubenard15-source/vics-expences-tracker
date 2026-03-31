import { useState, useCallback } from 'react'
import type { CategoryId } from '../types'

const STORAGE_KEY = 'vics-category-limits'

type Limits = Partial<Record<CategoryId, number>>

function loadLimits(): Limits {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : { sport: 250 }
  } catch {
    return { sport: 250 }
  }
}

function saveLimits(limits: Limits): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(limits))
}

export function useCategoryLimits() {
  const [limits, setLimits] = useState<Limits>(loadLimits)

  const setLimit = useCallback((categoryId: CategoryId, value: number | null) => {
    setLimits(prev => {
      const next = { ...prev }
      if (value === null || value <= 0) {
        delete next[categoryId]
      } else {
        next[categoryId] = value
      }
      saveLimits(next)
      return next
    })
  }, [])

  return { limits, setLimit }
}
