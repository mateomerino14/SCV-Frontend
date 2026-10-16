// Retenciones sobre el total del documento; al proveedor se le cancela el total menos las retenciones
export function calculateWithholdings(amount, type, isInternational) {
  const amountNum = parseFloat(amount) || 0;
  const none = {base: amountNum, rcIva: 0, iue: 0, it: 0, cost: amountNum, toPay: amountNum};
  if (isInternational || !['C', 'S'].includes(type) || amountNum <= 0) {
    return none;
  }
  const it = parseFloat((amountNum * 0.03).toFixed(2));
  let rcIva = 0;
  let iue = 0;
  if (type === 'C') {
    iue = parseFloat((amountNum * 0.05).toFixed(2));
  }
  else {
    rcIva = parseFloat((amountNum * 0.13).toFixed(2));
  }
  const toPay = parseFloat((amountNum - rcIva - iue - it).toFixed(2));
  return {...none, rcIva, iue, it, toPay};
}
