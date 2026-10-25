const itRate = 0.03;
const centsFactor = 100;

export const roundCents = (value) => Math.round((value + Number.EPSILON) * centsFactor) / centsFactor;

export function calculateWithholdings(amount, type, isInternational) {
  const paid = roundCents(parseFloat(amount) || 0);
  const none = {base: paid, rcIva: 0, iue: 0, it: 0, cost: paid, toPay: paid};
  if (isInternational || !['C', 'S'].includes(type) || paid <= 0) {
    return none;
  }
  let mainRate = 0.13;
  if (type === 'C') {
    mainRate = 0.05;
  }
  const grossBase = paid / (1 - mainRate - itRate);
  const mainWithholding = roundCents(grossBase * mainRate);
  const it = roundCents(grossBase * itRate);
  const base = roundCents(paid + mainWithholding + it);
  let rcIva = mainWithholding;
  let iue = 0;
  if (type === 'C') {
    rcIva = 0;
    iue = mainWithholding;
  }
  return {base, rcIva, iue, it, cost: base, toPay: paid};
}

export function getExpenseWithholdings(expense) {
  if (expense?.tiene_alcohol) {
    return calculateWithholdings(expense.monto_total, 'R', false);
  }
  return calculateWithholdings(expense?.monto_total, expense?.tipo, !!expense?.es_gasto_internacional);
}
