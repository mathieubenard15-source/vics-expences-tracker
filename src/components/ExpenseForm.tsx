import { useState } from 'react'
import type { CategoryId } from '../types'
import { CATEGORIES } from '../constants'

interface Props {
  onAdd: (amount: number, category: CategoryId, description: string) => void
}

export function ExpenseForm({ onAdd }: Props) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<CategoryId>('restau')
  const [description, setDescription] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = parseFloat(amount.replace(',', '.'))
    if (!value || value <= 0) return

    onAdd(value, category, description.trim())
    setAmount('')
    setDescription('')

    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 800)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white/70 backdrop-blur-sm p-5 shadow-lg">
      <h2 className="text-lg font-bold text-pink-hot mb-4">Ajouter une dépense</h2>

      {/* Montant */}
      <div className="mb-3">
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="Montant (€)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full rounded-2xl border-2 border-pink-light/50 bg-white/80 px-4 py-3.5 text-2xl font-bold text-pink-hot placeholder:text-pink-light/60 focus:border-pink-candy focus:outline-none focus:ring-2 focus:ring-pink-candy/30 transition-all text-center"
          required
        />
      </div>

      {/* Catégorie */}
      <div className="mb-3">
        <select
          value={category}
          onChange={e => setCategory(e.target.value as CategoryId)}
          className="w-full rounded-2xl border-2 border-pink-light/50 bg-white/80 px-4 py-3 text-base font-semibold text-pink-deep focus:border-pink-candy focus:outline-none focus:ring-2 focus:ring-pink-candy/30 transition-all appearance-none cursor-pointer"
        >
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.emoji} {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Description (optionnel)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full rounded-2xl border-2 border-pink-light/50 bg-white/80 px-4 py-2.5 text-sm text-pink-deep placeholder:text-pink-light/60 focus:border-pink-candy focus:outline-none focus:ring-2 focus:ring-pink-candy/30 transition-all"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className={`w-full rounded-2xl py-3.5 text-lg font-bold text-white transition-all duration-200 active:scale-95 ${
          showSuccess
            ? 'bg-green-400 scale-95'
            : 'bg-gradient-to-r from-pink-candy to-pink-hot hover:shadow-lg hover:shadow-pink-candy/30'
        }`}
      >
        {showSuccess ? '✓ Ajouté !' : 'Ajouter 💸'}
      </button>
    </form>
  )
}
