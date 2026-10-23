const vatRate = 0.13;

// En Bolivia el crédito fiscal es el 13% del total de la factura
export function calculateInvoiceVat(total) {
  const totalAmount = parseFloat(total) || 0;
  return parseFloat((totalAmount * vatRate).toFixed(2));
}

// El IVA se resta del total, igual que las retenciones: subtotal = total - IVA y el total no cambia
export function splitInvoiceTotal(total, docType) {
  const totalAmount = parseFloat(total) || 0;
  if (docType !== 'F' || totalAmount <= 0) {
    return {subtotal: totalAmount, vat: 0, total: totalAmount};
  }
  const vat = calculateInvoiceVat(totalAmount);
  const subtotal = parseFloat((totalAmount - vat).toFixed(2));
  return {subtotal, vat, total: totalAmount};
}

export function getExpenseInvoiceVat(expense) {
  if (expense?.tipo !== 'F') {
    return 0;
  }
  return calculateInvoiceVat(expense.monto_total);
}
