import type { CategoryId } from '../types'
import type { RecurringExpense } from '../hooks/useRecurring'
import { CATEGORIES } from '../constants'
import { useState } from 'react'

interface Props {
  recurring: RecurringExpense[]
  onAddRecurring: (amount: number, category: CategoryId, description: string) => void
  onRemoveRecurring: (id: string) => void
  onApply: (amount: number, category: CategoryId, description: string) => void
}

export function RecurringExpenses({ recurring, onAddRecurring, onRemoveRecurring, onApply }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<CategoryId>('abonnements')
  const [description, setDescription] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(amount.replace(',', '.'))
    if (!val || val <= 0 || !description.trim()) return
    onAddRecurring(val, category, description.trim())
    setAmount('')
    setDescription('')
    setShowForm(false)
  }

  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-sm p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-pink-hot">Récurrents 🔄</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs font-bold text-pink-candy hover:text-pink-hot transition-colors"
        >
          {showForm ? 'Annuler' : '+ Ajouter'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-3 space-y-2 rounded-2xl bg-pink-pastel/30 p-3">
          <input
            type="text"
            placeholder="Description (ex: Netflix)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full rounded-xl border border-pink-light/50 bg-white/80 px-3 py-2 text-sm text-pink-deep placeholder:text-pink-light/60 focus:outline-none focus:border-pink-candy"
            required
          />
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="€"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="flex-1 rounded-xl border border-pink-light/50 bg-white/80 px-3 py-2 text-sm text-pink-deep placeholder:text-pink-light/60 focus:outline-none focus:border-pink-candy text-right"
              required
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value as CategoryId)}
              className="flex-1 rounded-xl border border-pink-light/50 bg-white/80 px-2 py-2 text-sm text-pink-deep focus:outline-none focus:border-pink-candy"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-pink-candy text-white py-2 text-sm font-bold hover:bg-pink-hot transition-colors"
          >
            Sauvegarder
          </button>
        </form>
      )}

      {recurring.length === 0 && !showForm ? (
        <p className="text-sm text-pink-deep/40 text-center">
          Ajoute tes abonnements récurrents pour les pré-remplir chaque mois
        </p>
      ) : (
        <div className="space-y-2">
          {recurring.map(r => {
            const cat = CATEGORIES.find(c => c.id === r.category)
            return (
              <div key={r.id} className="flex items-center gap-2 rounded-2xl bg-white/60 px-3 py-2 group">
                <span className="text-lg shrink-0">{cat?.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-pink-deep truncate">{r.description}</p>
                  <p className="text-xs text-pink-deep/40">{r.amount.toFixed(2).replace('.', ',')} € / mois</p>
                </div>
                <button
                  onClick={() => onApply(r.amount, r.category, r.description)}
                  className="shrink-0 text-xs font-bold text-pink-candy hover:text-pink-hot bg-pink-pastel/50 rounded-lg px-2 py-1 transition-colors"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => onRemoveRecurring(r.id)}
                  className="opacity-0 group-hover:opacity-100 shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-400 text-xs font-bold hover:bg-red-200 transition-all flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
