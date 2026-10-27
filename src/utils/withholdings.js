const itRate = 0.03;
const centsFactor = 100;

export const roundCents = (value) => Math.round((value + Number.EPSILON) * centsFactor) / centsFactor;

const mainRateOf = (type) => {
  if (type === 'C') {
    return 0.05;
  }
  return 0.13;
};

const withholdingsOfLine = (paid, mainRate) => {
  const grossBase = paid / (1 - mainRate - itRate);
  return {main: roundCents(grossBase * mainRate), it: roundCents(grossBase * itRate)};
};

const resolveLines = (paid, lineAmounts) => {
  const lines = (lineAmounts || []).map((value) => roundCents(parseFloat(value) || 0)).filter((value) => value > 0);
  const linesTotal = roundCents(lines.reduce((sum, value) => sum + value, 0));
  if (lines.length === 0 || linesTotal !== paid) {
    return [paid];
  }
  return lines;
};

export function calculateWithholdings(amount, type, isInternational, lineAmounts = []) {
  const paid = roundCents(parseFloat(amount) || 0);
  const none = {base: paid, rcIva: 0, iue: 0, it: 0, cost: paid, toPay: paid};
  if (isInternational || !['C', 'S'].includes(type) || paid <= 0) {
    return none;
  }
  const lines = resolveLines(paid, lineAmounts).map((line) => withholdingsOfLine(line, mainRateOf(type)));
  const mainWithholding = roundCents(lines.reduce((sum, line) => sum + line.main, 0));
  const it = roundCents(lines.reduce((sum, line) => sum + line.it, 0));
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
  const lineAmounts = (expense?.Gasto_Subitem || []).map((item) => item.monto);
  return calculateWithholdings(expense?.monto_total, expense?.tipo, !!expense?.es_gasto_internacional, lineAmounts);
}
