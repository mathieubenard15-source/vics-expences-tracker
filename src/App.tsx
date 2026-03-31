import { useState } from 'react'
import { useExpenses } from './hooks/useExpenses'
import { useCategoryLimits } from './hooks/useCategoryLimits'
import { useRecurring } from './hooks/useRecurring'
import { BudgetCounter } from './components/BudgetCounter'
import { ExpenseForm } from './components/ExpenseForm'
import { MascotAlert } from './components/MascotAlert'
import { CategoryBreakdown } from './components/CategoryBreakdown'
import { ExpenseList } from './components/ExpenseList'
import { Streaks } from './components/Streaks'
import { ResetButton } from './components/ResetButton'
import { MonthSelector } from './components/MonthSelector'
import { ExportCSV } from './components/ExportCSV'
import { RecurringExpenses } from './components/RecurringExpenses'

function getCurrentYearMonth() {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
}

function App() {
  const current = getCurrentYearMonth()
  const [viewYear, setViewYear] = useState(current.year)
  const [viewMonth, setViewMonth] = useState(current.month)

  const isCurrentMonth = viewYear === current.year && viewMonth === current.month
  const hasNext = !isCurrentMonth

  const { expenses, addExpense, removeExpense, resetMonth, totalSpent, spentByCategory } =
    useExpenses(viewYear, viewMonth)
  const { limits, setLimit } = useCategoryLimits()
  const { recurring, addRecurring, removeRecurring } = useRecurring()

  const goToPrev = () => {
    if (viewMonth === 1) {
      setViewYear(y => y - 1)
      setViewMonth(12)
    } else {
      setViewMonth(m => m - 1)
    }
  }

  const goToNext = () => {
    if (!hasNext) return
    if (viewMonth === 12) {
      setViewYear(y => y + 1)
      setViewMonth(1)
    } else {
      setViewMonth(m => m + 1)
    }
  }

  const monthLabel = new Date(viewYear, viewMonth - 1).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-dvh px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <header className="text-center mb-3">
        <h1 className="text-2xl font-black text-pink-hot">💖 Vic's Expenses</h1>
      </header>

      {/* Sélecteur de mois */}
      <MonthSelector
        year={viewYear}
        month={viewMonth}
        onPrev={goToPrev}
        onNext={goToNext}
        hasNext={hasNext}
      />

      {/* Mascotte avec paliers */}
      {isCurrentMonth && (
        <MascotAlert totalSpent={totalSpent} spentByCategory={spentByCategory} limits={limits} />
      )}

      {/* Compteur principal */}
      <div className="mb-5">
        <BudgetCounter totalSpent={totalSpent} />
      </div>

      {/* Formulaire de saisie (mois courant uniquement) */}
      {isCurrentMonth && (
        <div className="mb-5">
          <ExpenseForm onAdd={addExpense} />
        </div>
      )}

      {/* Dépenses récurrentes (mois courant uniquement) */}
      {isCurrentMonth && (
        <div className="mb-5">
          <RecurringExpenses
            recurring={recurring}
            onAddRecurring={addRecurring}
            onRemoveRecurring={removeRecurring}
            onApply={addExpense}
          />
        </div>
      )}

      {/* Streaks (mois courant uniquement) */}
      {isCurrentMonth && (
        <div className="mb-5">
          <Streaks expenses={expenses} />
        </div>
      )}

      {/* Répartition par catégorie avec limites configurables */}
      <div className="mb-5">
        <CategoryBreakdown spentByCategory={spentByCategory} limits={limits} onSetLimit={setLimit} />
      </div>

      {/* Historique */}
      <div className="mb-5">
        <ExpenseList expenses={expenses} onRemove={removeExpense} />
      </div>

      {/* Export CSV */}
      <div className="mb-3">
        <ExportCSV expenses={expenses} monthLabel={monthLabel} />
      </div>

      {/* Reset (mois courant uniquement) */}
      {isCurrentMonth && (
        <div className="mb-8">
          <ResetButton onReset={resetMonth} />
        </div>
      )}
    </div>
  )
}

export default App
