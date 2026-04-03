export interface Expense {
  id: string
  amount: number
  category: CategoryId
  description: string
  date: string // ISO string
}

export type CategoryId =
  | 'courses'
  | 'restau'
  | 'sport'
  | 'sante'
  | 'vetements'
  | 'loisirs'
  | 'abonnements'
  | 'logement'
  | 'beaute'
  | 'transport'

export interface Category {
  id: CategoryId
  label: string
  emoji: string
}
