import { EXPENSE_CATEGORIES } from '../constants.js';

export function defaultExpenses() {
  return Object.fromEntries(EXPENSE_CATEGORIES.map(c => [c.id, c.default]));
}

export function totalExpenses(expenses) {
  return Object.values(expenses).reduce((s, v) => s + v, 0);
}

export function adjustExpense(expenses, categoryId, newValue) {
  const cat = EXPENSE_CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return expenses;

  const clamped = Math.max(cat.min ?? 0, newValue);
  const updated = { ...expenses, [categoryId]: clamped };

  if (cat.linked) {
    const linkedCat = EXPENSE_CATEGORIES.find(c => c.id === cat.linked);
    const thisCat = cat;
    const combinedDefault = thisCat.default + (linkedCat?.default ?? 0);
    const myDelta = clamped - thisCat.default;
    const linkedNew = Math.max(linkedCat?.min ?? 0, (linkedCat?.default ?? 0) - myDelta);
    updated[cat.linked] = linkedNew;
  }

  return updated;
}

export function getExpenseRisks(expenses) {
  const risks = {};
  for (const cat of EXPENSE_CATEGORIES) {
    if (cat.riskOnDecrease && expenses[cat.id] < cat.default) {
      const reduction = (cat.default - expenses[cat.id]) / cat.default;
      risks[cat.riskOnDecrease] = Math.min(0.8, reduction * 1.5);
    }
  }
  return risks;
}

export function applyInflation(expenses, pct) {
  return Object.fromEntries(
    Object.entries(expenses).map(([k, v]) => [k, Math.round(v * (1 + pct))])
  );
}
