import type { Category } from './types'

export const TOTAL_BUDGET = 1508

export const CATEGORIES: Category[] = [
  { id: 'restau', label: 'Restau', emoji: '🍽️' },
  { id: 'sport', label: 'Sport', emoji: '💪' },
  { id: 'sante', label: 'Santé', emoji: '🏥' },
  { id: 'vetements', label: 'Vêtements', emoji: '👗' },
  { id: 'loisirs', label: 'Loisirs', emoji: '🎉' },
  { id: 'abonnements', label: 'Abonnements', emoji: '📱' },
  { id: 'logement', label: 'Logement/Factures', emoji: '🏠' },
  { id: 'beaute', label: 'Beauté/Cosmétiques', emoji: '💄' },
  { id: 'transport', label: 'Transport/Mobilité', emoji: '🚗' },
]
