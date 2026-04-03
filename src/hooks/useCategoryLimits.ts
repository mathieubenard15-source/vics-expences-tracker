import { useState, useCallback, useEffect } from 'react'
import type { CategoryId } from '../types'
import { supabase } from '../lib/supabase'

type Limits = Partial<Record<CategoryId, number>>

export function useCategoryLimits() {
  const [limits, setLimits] = useState<Limits>({})

  useEffect(() => {
    supabase
      .from('category_limits')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error loading limits:', error)
          return
        }
        const map: Limits = {}
        for (const row of data || []) {
          map[row.category as CategoryId] = row.amount
        }
        setLimits(map)
      })
  }, [])

  const setLimit = useCallback(async (categoryId: CategoryId, value: number | null) => {
    // Optimistic update
    setLimits(prev => {
      const next = { ...prev }
      if (value === null || value <= 0) {
        delete next[categoryId]
      } else {
        next[categoryId] = value
      }
      return next
    })

    if (value === null || value <= 0) {
      await supabase.from('category_limits').delete().eq('category', categoryId)
    } else {
      await supabase.from('category_limits').upsert({ category: categoryId, amount: value })
    }
  }, [])

  return { limits, setLimit }
}
