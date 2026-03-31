import type { Expense } from '../types'
import { CATEGORIES } from '../constants'

interface Props {
  expenses: Expense[]
  onRemove: (id: string) => void
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function ExpenseList({ expenses, onRemove }: Props) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-3xl bg-white/70 backdrop-blur-sm p-5 shadow-lg text-center">
        <p className="text-pink-deep/40 text-sm font-medium">Aucune dépense pour le moment 🌸</p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-sm p-5 shadow-lg">
      <h2 className="text-lg font-bold text-pink-hot mb-3">Historique</h2>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {expenses.map(exp => {
          const cat = CATEGORIES.find(c => c.id === exp.category)
          return (
            <div
              key={exp.id}
              className="animate-pop-in flex items-center gap-3 rounded-2xl bg-white/60 px-3 py-2.5 group"
            >
              <span className="text-xl shrink-0">{cat?.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-pink-deep truncate">
                    {exp.description || cat?.label}
                  </span>
                  <span className="text-sm font-bold text-pink-hot tabular-nums shrink-0 ml-2">
                    -{exp.amount.toFixed(2).replace('.', ',')} €
                  </span>
                </div>
                <p className="text-xs text-pink-deep/40">{formatDate(exp.date)}</p>
              </div>
              <button
                onClick={() => onRemove(exp.id)}
                className="opacity-0 group-hover:opacity-100 shrink-0 w-7 h-7 rounded-full bg-red-100 text-red-400 text-xs font-bold hover:bg-red-200 transition-all flex items-center justify-center"
                aria-label="Supprimer"
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
