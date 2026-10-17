const vatRate = 0.13;

// La factura boliviana trae el IVA incluido en el total: se separa por dentro y el total no cambia
export function splitInvoiceTotal(total, docType) {
  const totalAmount = parseFloat(total) || 0;
  if (docType !== 'F' || totalAmount <= 0) {
    return {subtotal: totalAmount, vat: 0, total: totalAmount};
  }
  const subtotal = parseFloat((totalAmount / (1 + vatRate)).toFixed(2));
  const vat = parseFloat((totalAmount - subtotal).toFixed(2));
  return {subtotal, vat, total: totalAmount};
}
