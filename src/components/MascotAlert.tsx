import { useEffect, useState } from 'react'
import type { CategoryId } from '../types'
import { CATEGORIES, TOTAL_BUDGET } from '../constants'

interface Props {
  totalSpent: number
  spentByCategory: Partial<Record<CategoryId, number>>
  limits: Partial<Record<CategoryId, number>>
}

function getMascotState(pct: number): { emoji: string; message: string } {
  if (pct >= 90) return { emoji: '😠', message: 'Attention, budget presque épuisé !' }
  if (pct >= 75) return { emoji: '😰', message: 'Ça commence à chauffer...' }
  if (pct >= 50) return { emoji: '😅', message: 'On est à la moitié, doucement !' }
  return { emoji: '😊', message: 'Tout va bien, continue comme ça ! ✨' }
}

export function MascotAlert({ totalSpent, spentByCategory, limits }: Props) {
  const [shaking, setShaking] = useState(false)

  const pct = (totalSpent / TOTAL_BUDGET) * 100
  const mascot = getMascotState(pct)

  const overLimitCats = CATEGORIES.filter(cat => {
    const limit = limits[cat.id]
    return limit && (spentByCategory[cat.id] || 0) > limit
  })

  const hasAlerts = overLimitCats.length > 0

  useEffect(() => {
    if (hasAlerts || pct >= 75) {
      setShaking(true)
      const t = setTimeout(() => setShaking(false), 500)
      return () => clearTimeout(t)
    }
  }, [hasAlerts, overLimitCats.length, pct >= 75])

  return (
    <div className={`text-center py-3 ${shaking ? 'animate-shake' : ''}`}>
      <div className={`text-6xl mb-2 transition-all duration-500 ${pct >= 90 ? 'scale-110' : ''}`}>
        {hasAlerts ? '😠' : mascot.emoji}
      </div>

      {hasAlerts ? (
        <div className="space-y-1">
          {overLimitCats.map(cat => (
            <p
              key={cat.id}
              className="animate-bounce-in text-sm font-bold text-red-500 bg-red-50/80 rounded-xl px-3 py-1.5 inline-block mx-1"
            >
              Oups ! Tu as dépassé ton budget {cat.emoji} {cat.label} !
              <span className="block text-xs font-medium text-red-400">
                {(spentByCategory[cat.id] || 0).toFixed(2).replace('.', ',')} € / {limits[cat.id]} €
              </span>
            </p>
          ))}
        </div>
      ) : (
        <p className={`text-sm font-medium ${pct >= 75 ? 'text-orange-500' : pct >= 50 ? 'text-amber-500' : 'text-pink-deep/50'}`}>
          {mascot.message}
        </p>
      )}
    </div>
  )
}
