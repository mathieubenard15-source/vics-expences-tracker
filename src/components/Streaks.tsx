import { useMemo } from 'react'
import type { Expense, CategoryId } from '../types'
import { CATEGORIES } from '../constants'

interface Props {
  expenses: Expense[]
}

function getDaysSinceLastExpense(expenses: Expense[], categoryId: CategoryId): number | null {
  const catExpenses = expenses.filter(e => e.category === categoryId)
  if (catExpenses.length === 0) return null

  const lastDate = new Date(catExpenses[0].date) // expenses are sorted newest first
  const now = new Date()
  const diffMs = now.getTime() - lastDate.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

export function Streaks({ expenses }: Props) {
  const streaks = useMemo(() => {
    return CATEGORIES
      .map(cat => ({
        ...cat,
        days: getDaysSinceLastExpense(expenses, cat.id),
      }))
      .filter(s => s.days !== null && s.days >= 2)
      .sort((a, b) => (b.days || 0) - (a.days || 0))
      .slice(0, 3)
  }, [expenses])

  if (streaks.length === 0) return null

  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-sm p-5 shadow-lg">
      <h2 className="text-lg font-bold text-pink-hot mb-3">Streaks 🔥</h2>
      <div className="space-y-2">
        {streaks.map(s => (
          <div
            key={s.id}
            className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-50/80 to-orange-50/80 px-3 py-2.5"
          >
            <span className="text-xl shrink-0">{s.emoji}</span>
            <p className="text-sm font-semibold text-amber-700 flex-1">
              {s.days} jour{s.days! > 1 ? 's' : ''} sans dépense {s.label} !
            </p>
            <span className="text-lg">
              {s.days! >= 7 ? '🏆' : s.days! >= 3 ? '⭐' : '✨'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
