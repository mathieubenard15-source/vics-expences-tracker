import { useState, useCallback, useEffect } from 'react'
import type { CategoryId } from '../types'
import { supabase } from '../lib/supabase'

export interface RecurringExpense {
  id: string
  amount: number
  category: CategoryId
  description: string
}

export function useRecurring() {
  const [recurring, setRecurring] = useState<RecurringExpense[]>([])

  useEffect(() => {
    supabase
      .from('recurring_expenses')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error loading recurring:', error)
          return
        }
        setRecurring(data || [])
      })
  }, [])

  const addRecurring = useCallback(async (amount: number, category: CategoryId, description: string) => {
    const item: RecurringExpense = {
      id: crypto.randomUUID(),
      amount,
      category,
      description,
    }

    setRecurring(prev => [...prev, item])

    const { error } = await supabase.from('recurring_expenses').insert(item)
    if (error) {
      console.error('Error adding recurring:', error)
      setRecurring(prev => prev.filter(r => r.id !== item.id))
    }
  }, [])

  const removeRecurring = useCallback(async (id: string) => {
    setRecurring(prev => prev.filter(r => r.id !== id))

    const { error } = await supabase.from('recurring_expenses').delete().eq('id', id)
    if (error) {
      console.error('Error removing recurring:', error)
    }
  }, [])

  return { recurring, addRecurring, removeRecurring }
}
