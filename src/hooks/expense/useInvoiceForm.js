import {useEffect} from 'react';

const maxSupplier = 50;
const maxInvoiceNumber = 50;
const maxTaxId = 10;
const maxAmount = 99999.99;
const vatPercentage = 0.13;

function useInvoiceForm(data, onChange, saved = false) {
  const amount = parseFloat(data.monto || 0);
  const vat = parseFloat(data.iva || 0);
  const totalAmount = amount + vat;
  let vatPercentageDisplay = 0;
  if (data.tipo_doc === 'F') {
    vatPercentageDisplay = 13;
  }
  useEffect(() => {
    if (saved) {
      return;
    }
    const isInvoice = data.tipo_doc === 'F';
    let calculatedVat = 0;
    if (isInvoice) {
      calculatedVat = parseFloat((amount * vatPercentage).toFixed(2));
    }
    const currentVat = parseFloat(data.iva || 0);
    if (Math.abs(calculatedVat - currentVat) > 0.001) {
      onChange('iva', calculatedVat.toFixed(2), true);
      onChange('monto_total', (amount + calculatedVat).toFixed(2), true);
    }
  }, [amount, data.tipo_doc, saved]);

  const validateDecimal = (value) => {
    const validDecimal = value.replace(',', '.').replace(/[^0-9.]/g, '');
    const parts = validDecimal.split('.');
    if (parts.length > 2) {
      return null;
    }
    if (parts.length === 2 && parts[1].length > 2) {
      return null;
    }
    return validDecimal;
  };

  const handleFieldChange = (field, value) => {
    if (field === 'monto') {
      const validatedValue = validateDecimal(value);
      if (validatedValue === null) {
        return;
      }
      if (validatedValue !== '' && parseFloat(validatedValue) > maxAmount) {
        return;
      }
      onChange(field, validatedValue);
      const newAmount = parseFloat(validatedValue || 0);
      const isInvoice = data.tipo_doc === 'F';
      let newVat = 0;
      if (isInvoice) {
        newVat = parseFloat((newAmount * vatPercentage).toFixed(2));
      }
      onChange('iva', newVat.toFixed(2), true);
      onChange('monto_total', (newAmount + newVat).toFixed(2), true);
      return;
    }

    if (field === 'nit') {
      const onlyNumbers = value.replace(/[^0-9]/g, '').slice(0, maxTaxId);
      onChange(field, onlyNumbers);
      return;
    }

    if (field === 'numero_factura') {
      // Recibos y boletos traen códigos con símbolos (@, $, #); solo se quitan los saltos de línea y tabulaciones
      const invoiceCode = value.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, maxInvoiceNumber);
      onChange(field, invoiceCode);
      return;
    }

    if (field === 'proveedor') {
      if (value.length > maxSupplier) {
        return;
      }
      onChange(field, value);
      return;
    }
    onChange(field, value);
  };

  // Al cambiar el tipo se conserva el total pagado: el recibo no lleva IVA y la factura lo separa del subtotal
  const handleDocTypeChange = (docType) => {
    if (docType === data.tipo_doc) {
      return;
    }
    onChange('tipo_doc', docType);
    if (!(totalAmount > 0)) {
      return;
    }
    let newAmount = totalAmount;
    let newVat = 0;
    if (docType === 'F') {
      newAmount = parseFloat((totalAmount / (1 + vatPercentage)).toFixed(2));
      newVat = parseFloat((newAmount * vatPercentage).toFixed(2));
    }
    onChange('monto', newAmount.toFixed(2), true);
    onChange('iva', newVat.toFixed(2), true);
    onChange('monto_total', (newAmount + newVat).toFixed(2), true);
  };

  return {
    totalAmount,
    vatPercentage: vatPercentageDisplay,
    handleFieldChange,
    handleDocTypeChange,
  };
}

export default useInvoiceForm;