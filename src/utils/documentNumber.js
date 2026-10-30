const receiptNumberDigits = 6;
const noValue = 'No Especificado';

export const documentSources = {invoice: 'invoice', original: 'original', system: 'system', none: 'none'};

export const systemReceiptNote = 'Número de recibo del sistema: el gasto no tiene recibo original';

export const formatReceiptNumber = (number, period) => {
  const digits = String(number).padStart(receiptNumberDigits, '0');
  if (!period) {
    return digits;
  }
  const [year, month] = String(period).split('-');
  return `${digits}/${month}-${year}`;
};

const systemReceiptOf = (expense, tripReceipts) => {
  const own = (expense.Recibo || [])[0];
  if (own) {
    return formatReceiptNumber(own.numero, own.periodo);
  }
  const grouped = (tripReceipts || []).find((receipt) => !receipt.id_gasto && receipt.tipo === expense.tipo && !!receipt.es_gasto_internacional === !!expense.es_gasto_internacional);
  if (grouped) {
    return formatReceiptNumber(grouped.numero, grouped.periodo);
  }
  return '';
};

export const resolveDocumentNumber = (expense, tripReceipts = []) => {
  if (expense.Factura) {
    const invoiceNumber = expense.Factura.numero_factura;
    if (!invoiceNumber || invoiceNumber === noValue) {
      return {number: '', source: documentSources.none};
    }
    return {number: invoiceNumber, source: documentSources.invoice};
  }
  const original = String(expense.numero_recibo || '').trim();
  if (original) {
    return {number: original, source: documentSources.original};
  }
  const system = systemReceiptOf(expense, tripReceipts);
  if (system) {
    return {number: system, source: documentSources.system};
  }
  return {number: '', source: documentSources.none};
};
