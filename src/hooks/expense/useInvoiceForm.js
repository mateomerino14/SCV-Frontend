import {splitInvoiceTotal} from '../../utils/invoiceAmounts';
import {removeControlCharacters} from '../../utils/textCleaner';

const maxSupplier = 50;
const maxInvoiceNumber = 50;
const maxTaxId = 10;
const maxCuf = 100;
const maxAmount = 99999.99;

function useInvoiceForm(data, onChange) {
  const totalAmount = parseFloat(data.monto_total || 0);
  let vatPercentageDisplay = 0;
  if (data.tipo_doc === 'F') {
    vatPercentageDisplay = 13;
  }

  const applyTotal = (total, docType) => {
    const {subtotal, vat} = splitInvoiceTotal(total, docType);
    onChange('monto', subtotal.toFixed(2), true);
    onChange('iva', vat.toFixed(2), true);
  };

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
    if (field === 'monto_total') {
      const validatedValue = validateDecimal(value);
      if (validatedValue === null) {
        return;
      }
      if (validatedValue !== '' && parseFloat(validatedValue) > maxAmount) {
        return;
      }
      onChange(field, validatedValue);
      applyTotal(validatedValue, data.tipo_doc);
      return;
    }

    if (field === 'nit') {
      const onlyNumbers = value.replace(/[^0-9]/g, '').slice(0, maxTaxId);
      onChange(field, onlyNumbers);
      return;
    }

    if (field === 'cuf') {
      onChange(field, value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, maxCuf));
      return;
    }

    if (field === 'numero_factura') {
      // Recibos y boletos traen códigos con símbolos (@, $, #); solo se quitan los saltos de línea y tabulaciones
      const invoiceCode = removeControlCharacters(value).slice(0, maxInvoiceNumber);
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

  const handleDocTypeChange = (docType) => {
    if (docType === data.tipo_doc) {
      return;
    }
    onChange('tipo_doc', docType);
    applyTotal(totalAmount, docType);
  };

  return {
    totalAmount,
    vatPercentage: vatPercentageDisplay,
    handleFieldChange,
    handleDocTypeChange,
  };
}

export default useInvoiceForm;
