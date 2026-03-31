import { useState } from 'react'

interface Props {
  onReset: () => void
}

export function ResetButton({ onReset }: Props) {
  const [confirming, setConfirming] = useState(false)

  const handleClick = () => {
    if (confirming) {
      onReset()
      setConfirming(false)
    } else {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full rounded-2xl py-3 text-sm font-bold transition-all duration-200 ${
        confirming
          ? 'bg-red-500 text-white animate-shake'
          : 'bg-red-100/50 text-red-400 hover:bg-red-100'
      }`}
    >
      {confirming ? '⚠️ Confirmer la réinitialisation ?' : '🗑️ Réinitialiser le mois'}
    </button>
  )
}
