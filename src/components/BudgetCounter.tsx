import { TOTAL_BUDGET } from '../constants'

interface Props {
  totalSpent: number
}

export function BudgetCounter({ totalSpent }: Props) {
  const remaining = TOTAL_BUDGET - totalSpent
  const percentage = Math.min((totalSpent / TOTAL_BUDGET) * 100, 100)
  const isLow = remaining < TOTAL_BUDGET * 0.2
  const isNegative = remaining < 0

  return (
    <div className="animate-pulse-glow rounded-3xl bg-white/70 backdrop-blur-sm p-6 text-center shadow-lg">
      <p className="text-sm font-semibold text-pink-candy uppercase tracking-wider mb-1">
        Solde restant
      </p>
      <p
        className={`text-5xl font-black tabular-nums transition-colors duration-300 ${
          isNegative ? 'text-red-500' : isLow ? 'text-orange-500' : 'text-pink-hot'
        }`}
      >
        {remaining.toFixed(2).replace('.', ',')} €
      </p>
      <div className="mt-4 h-3 rounded-full bg-pink-pastel overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isNegative ? 'bg-red-400' : isLow ? 'bg-orange-400' : 'bg-pink-candy'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-pink-deep/60 font-medium">
        {totalSpent.toFixed(2).replace('.', ',')} € dépensés sur {TOTAL_BUDGET} €
      </p>
    </div>
  )
}
