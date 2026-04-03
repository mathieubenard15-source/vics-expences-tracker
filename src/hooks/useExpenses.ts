import { useState, useCallback, useMemo, useEffect } from 'react'
import type { Expense, CategoryId } from '../types'
import { supabase } from '../lib/supabase'

function getCurrentMonth(): { year: number; month: number } {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
}

function toMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`
}

export function useExpenses(selectedYear?: number, selectedMonth?: number) {
  const current = getCurrentMonth()
  const year = selectedYear ?? current.year
  const month = selectedMonth ?? current.month
  const isCurrentMonth = year === current.year && month === current.month
  const monthKey = toMonthKey(year, month)

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  // Load expenses from Supabase
  useEffect(() => {
    setLoading(true)
    supabase
      .from('expenses')
      .select('*')
      .eq('month_key', monthKey)
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error loading expenses:', error)
          setExpenses([])
        } else {
          setExpenses(data || [])
        }
        setLoading(false)
      })
  }, [monthKey])

  const addExpense = useCallback(async (amount: number, category: CategoryId, description: string) => {
    const expense: Expense = {
      id: crypto.randomUUID(),
      amount,
      category,
      description,
      date: new Date().toISOString(),
    }

    // Optimistic update
    setExpenses(prev => [{ ...expense, month_key: monthKey } as Expense, ...prev])

    const { error } = await supabase.from('expenses').insert({
      id: expense.id,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
      month_key: monthKey,
    })

    if (error) {
      console.error('Error adding expense:', error)
      // Rollback
      setExpenses(prev => prev.filter(e => e.id !== expense.id))
    }
  }, [monthKey])

  const removeExpense = useCallback(async (id: string) => {
    const prev = expenses
    // Optimistic update
    setExpenses(p => p.filter(e => e.id !== id))

    const { error } = await supabase.from('expenses').delete().eq('id', id)

    if (error) {
      console.error('Error removing expense:', error)
      setExpenses(prev)
    }
  }, [expenses])

  const resetMonth = useCallback(async () => {
    setExpenses([])

    const { error } = await supabase.from('expenses').delete().eq('month_key', monthKey)

    if (error) {
      console.error('Error resetting month:', error)
    }
  }, [monthKey])

  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses])

  const spentByCategory = useMemo(() => {
    const map: Partial<Record<CategoryId, number>> = {}
    for (const e of expenses) {
      map[e.category] = (map[e.category] || 0) + e.amount
    }
    return map
  }, [expenses])

  return { expenses, addExpense, removeExpense, resetMonth, totalSpent, spentByCategory, isCurrentMonth, loading }
}
