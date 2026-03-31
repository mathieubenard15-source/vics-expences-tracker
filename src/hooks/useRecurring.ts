import { useState, useCallback } from 'react'
import type { CategoryId } from '../types'

export interface RecurringExpense {
  id: string
  amount: number
  category: CategoryId
  description: string
}

const STORAGE_KEY = 'vics-recurring-expenses'

function load(): RecurringExpense[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function save(items: RecurringExpense[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useRecurring() {
  const [recurring, setRecurring] = useState<RecurringExpense[]>(load)

  const addRecurring = useCallback((amount: number, category: CategoryId, description: string) => {
    const item: RecurringExpense = {
      id: crypto.randomUUID(),
      amount,
      category,
      description,
    }
    setRecurring(prev => {
      const next = [...prev, item]
      save(next)
      return next
    })
  }, [])

  const removeRecurring = useCallback((id: string) => {
    setRecurring(prev => {
      const next = prev.filter(r => r.id !== id)
      save(next)
      return next
    })
  }, [])

  return { recurring, addRecurring, removeRecurring }
}
