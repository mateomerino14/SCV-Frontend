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
      const onlyAlphanumeric = value.replace(/[^a-zA-Z0-9\-\/]/g, '').slice(0, maxInvoiceNumber);
      onChange(field, onlyAlphanumeric);
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

  const handleDocTypeChange = (docType) => {
    onChange('tipo_doc', docType);
    const isInvoice = docType === 'F';
    let newVat = 0;
    if (isInvoice) {
      newVat = parseFloat((amount * vatPercentage).toFixed(2));
    }
    onChange('iva', newVat.toFixed(2), true);
    onChange('monto_total', (amount + newVat).toFixed(2), true);
  };

  return {
    totalAmount,
    vatPercentage: vatPercentageDisplay,
    handleFieldChange,
    handleDocTypeChange,
  };
}

export default useInvoiceForm;