import type { Expense } from '../types'
import { CATEGORIES } from '../constants'

interface Props {
  expenses: Expense[]
  monthLabel: string
}

export function ExportCSV({ expenses, monthLabel }: Props) {
  if (expenses.length === 0) return null

  const handleExport = () => {
    const header = 'Date,Catégorie,Description,Montant (€)'
    const rows = expenses.map(e => {
      const cat = CATEGORIES.find(c => c.id === e.category)
      const date = new Date(e.date).toLocaleDateString('fr-FR')
      const desc = e.description.replace(/"/g, '""')
      return `${date},"${cat?.label || e.category}","${desc}",${e.amount.toFixed(2)}`
    })
    const csv = '\uFEFF' + [header, ...rows].join('\n') // BOM for Excel UTF-8
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vics-expenses-${monthLabel.replace(/\s/g, '-')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="w-full rounded-2xl py-2.5 text-sm font-bold text-pink-candy bg-pink-pastel/50 hover:bg-pink-pastel transition-colors"
    >
      📊 Exporter en CSV
    </button>
  )
}
