import {calculateInvoiceVat} from './invoiceAmounts';
import {getExpenseWithholdings} from './withholdings';

export function getExpenseTaxValues(expense) {
  const isInternational = !!expense.es_gasto_internacional;
  const amount = parseFloat(expense.monto_total) || 0;
  const hasInvoice = !!expense.Factura;
  if (isInternational) {
    return {vat: 0, rcIva: 0, iue: 0, it: 0, cost: amount};
  }
  if (expense.tiene_alcohol) {
    return {vat: 0, rcIva: 0, iue: 0, it: 0, cost: amount};
  }
  if (hasInvoice) {
    if (expense.tipo !== 'F') {
      return {vat: 0, rcIva: 0, iue: 0, it: 0, cost: amount};
    }
    const vat = calculateInvoiceVat(amount);
    return {vat, rcIva: 0, iue: 0, it: 0, cost: parseFloat((amount - vat).toFixed(2))};
  }
  const withholdings = getExpenseWithholdings(expense);
  return {vat: 0, rcIva: withholdings.rcIva, iue: withholdings.iue, it: withholdings.it, cost: withholdings.cost};
}
