import { useState, useCallback, useMemo } from 'react'
import type { Expense, CategoryId } from '../types'

function getStorageKey(year: number, month: number): string {
  return `vics-expenses-${year}-${String(month).padStart(2, '0')}`
}

function getCurrentMonth(): { year: number; month: number } {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
}

function loadExpenses(year: number, month: number): Expense[] {
  try {
    const data = localStorage.getItem(getStorageKey(year, month))
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveExpenses(expenses: Expense[], year: number, month: number): void {
  localStorage.setItem(getStorageKey(year, month), JSON.stringify(expenses))
}

export function getAvailableMonths(): { year: number; month: number }[] {
  const months: { year: number; month: number }[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith('vics-expenses-')) continue
    const match = key.match(/^vics-expenses-(\d{4})-(\d{2})$/)
    if (match) {
      months.push({ year: parseInt(match[1]), month: parseInt(match[2]) })
    }
  }
  const current = getCurrentMonth()
  if (!months.some(m => m.year === current.year && m.month === current.month)) {
    months.push(current)
  }
  return months.sort((a, b) => b.year - a.year || b.month - a.month)
}

export function useExpenses(selectedYear?: number, selectedMonth?: number) {
  const current = getCurrentMonth()
  const year = selectedYear ?? current.year
  const month = selectedMonth ?? current.month
  const isCurrentMonth = year === current.year && month === current.month

  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses(year, month))

  // Reload when month changes
  const [loadedKey, setLoadedKey] = useState(`${year}-${month}`)
  const currentKey = `${year}-${month}`
  if (currentKey !== loadedKey) {
    setExpenses(loadExpenses(year, month))
    setLoadedKey(currentKey)
  }

  const addExpense = useCallback((amount: number, category: CategoryId, description: string) => {
    const expense: Expense = {
      id: crypto.randomUUID(),
      amount,
      category,
      description,
      date: new Date().toISOString(),
    }
    setExpenses(prev => {
      const next = [expense, ...prev]
      saveExpenses(next, year, month)
      return next
    })
  }, [year, month])

  const removeExpense = useCallback((id: string) => {
    setExpenses(prev => {
      const next = prev.filter(e => e.id !== id)
      saveExpenses(next, year, month)
      return next
    })
  }, [year, month])

  const resetMonth = useCallback(() => {
    localStorage.removeItem(getStorageKey(year, month))
    setExpenses([])
  }, [year, month])

  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses])

  const spentByCategory = useMemo(() => {
    const map: Partial<Record<CategoryId, number>> = {}
    for (const e of expenses) {
      map[e.category] = (map[e.category] || 0) + e.amount
    }
    return map
  }, [expenses])

  return { expenses, addExpense, removeExpense, resetMonth, totalSpent, spentByCategory, isCurrentMonth }
}
