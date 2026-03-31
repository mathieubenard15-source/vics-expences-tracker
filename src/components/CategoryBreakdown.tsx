import { useState } from 'react'
import type { CategoryId } from '../types'
import { CATEGORIES } from '../constants'

interface Props {
  spentByCategory: Partial<Record<CategoryId, number>>
  limits: Partial<Record<CategoryId, number>>
  onSetLimit: (categoryId: CategoryId, value: number | null) => void
}

export function CategoryBreakdown({ spentByCategory, limits, onSetLimit }: Props) {
  const [editingId, setEditingId] = useState<CategoryId | null>(null)
  const [editValue, setEditValue] = useState('')

  const allCats = CATEGORIES.map(cat => ({
    ...cat,
    spent: spentByCategory[cat.id] || 0,
    limit: limits[cat.id],
  }))

  const catsWithData = allCats.filter(c => c.spent > 0 || c.limit)

  if (catsWithData.length === 0) return null

  const startEdit = (catId: CategoryId, currentLimit?: number) => {
    setEditingId(catId)
    setEditValue(currentLimit ? String(currentLimit) : '')
  }

  const saveEdit = (catId: CategoryId) => {
    const val = parseFloat(editValue.replace(',', '.'))
    onSetLimit(catId, val > 0 ? val : null)
    setEditingId(null)
  }

  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-sm p-5 shadow-lg">
      <h2 className="text-lg font-bold text-pink-hot mb-3">Par catégorie</h2>
      <div className="space-y-2.5">
        {catsWithData.map(cat => {
          const isOver = cat.limit && cat.spent > cat.limit
          const pct = cat.limit ? Math.min((cat.spent / cat.limit) * 100, 100) : 0
          const isEditing = editingId === cat.id

          return (
            <div key={cat.id} className="flex items-center gap-3">
              <span className="text-xl w-8 text-center shrink-0">{cat.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-sm font-semibold text-pink-deep truncate">{cat.label}</span>
                  <span className={`text-sm font-bold tabular-nums ${isOver ? 'text-red-500' : 'text-pink-hot'}`}>
                    {cat.spent.toFixed(2).replace('.', ',')} €
                  </span>
                </div>

                {/* Limite + barre */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    {cat.limit ? (
                      <div className="h-1.5 rounded-full bg-pink-pastel overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${isOver ? 'bg-red-400' : 'bg-pink-candy'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    ) : (
                      <div className="h-1.5 rounded-full bg-pink-pastel/50" />
                    )}
                  </div>

                  {/* Bouton/input limite */}
                  {isEditing ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        inputMode="decimal"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && saveEdit(cat.id)}
                        placeholder="Max €"
                        className="w-16 text-xs rounded-lg border border-pink-light px-1.5 py-0.5 text-pink-deep focus:outline-none focus:border-pink-candy text-right"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(cat.id)}
                        className="text-xs text-green-500 font-bold"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs text-pink-deep/40 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(cat.id, cat.limit)}
                      className="shrink-0 text-xs text-pink-deep/40 hover:text-pink-candy transition-colors"
                      title="Définir une limite"
                    >
                      {cat.limit ? `${cat.limit} €` : '+ limite'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
