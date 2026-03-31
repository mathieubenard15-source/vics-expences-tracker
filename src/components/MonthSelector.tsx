interface Props {
  year: number
  month: number
  onPrev: () => void
  onNext: () => void
  hasNext: boolean
}

function formatMonth(year: number, month: number): string {
  return new Date(year, month - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

export function MonthSelector({ year, month, onPrev, onNext, hasNext }: Props) {
  return (
    <div className="flex items-center justify-center gap-4 mb-2">
      <button
        onClick={onPrev}
        className="w-8 h-8 rounded-full bg-white/50 text-pink-hot font-bold hover:bg-white/80 transition-colors flex items-center justify-center"
      >
        ‹
      </button>
      <span className="text-sm font-bold text-pink-hot capitalize min-w-[140px] text-center">
        {formatMonth(year, month)}
      </span>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className={`w-8 h-8 rounded-full font-bold flex items-center justify-center transition-colors ${
          hasNext ? 'bg-white/50 text-pink-hot hover:bg-white/80' : 'bg-white/20 text-pink-light/40 cursor-not-allowed'
        }`}
      >
        ›
      </button>
    </div>
  )
}
