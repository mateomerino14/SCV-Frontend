export function calculateWithholdings(amount, type, isInternational) {
  const paid = parseFloat(amount) || 0;
  const none = {base: paid, rcIva: 0, iue: 0, it: 0, cost: paid, toPay: paid};
  if (isInternational || !['C', 'S'].includes(type) || paid <= 0) {
    return none;
  }
  let mainRate = 0.13;
  if (type === 'C') {
    mainRate = 0.05;
  }
  const base = parseFloat((paid / (1 - mainRate - 0.03)).toFixed(2));
  const mainWithholding = parseFloat((base * mainRate).toFixed(2));
  // El IT cierra la cuenta para que pagado + retenciones sea exactamente la base
  const it = parseFloat((base - paid - mainWithholding).toFixed(2));
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
