import buildTripCode from './tripCode';
import {getExpenseTaxValues} from './expenseTaxValues';
import {oracleDefaults, oracleTaxCodes, oracleTaxLines, oracleWithholdings, oraclePaymentTerms, oracleLists} from '../constants/oracleLists';

const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const maxDescription = 240;
const pendingFill = 'FFFFF2A8';
const headerFill = 'FFD9DEE8';
const pendingNote = 'Completar antes de subir a Oracle';

export const invoiceColumns = [
  {key: 'tipo', header: 'Tipo', width: 12, list: 'invoiceTypes'},
  {key: 'justificante', header: 'Nº Justificante', width: 14},
  {key: 'proveedor', header: 'Proveedor', width: 34},
  {key: 'numeroProveedor', header: 'Nº Proveedor', width: 13},
  {key: 'direccion', header: 'Dirección', width: 16},
  {key: 'fechaFactura', header: 'Fecha de la Factura', width: 12},
  {key: 'numeroFactura', header: 'Nº Factura', width: 14},
  {key: 'divisaFactura', header: 'Div. Factura', width: 9, list: 'currencies'},
  {key: 'importeFactura', header: 'Importe de Factura', width: 13, amount: true},
  {key: 'flexfield', header: '[ ]', width: 44},
  {key: 'fechaContable', header: 'Fecha Contable', width: 12},
  {key: 'codigoImpuesto', header: 'Código de Impuesto', width: 14, list: 'taxCodes'},
  {key: 'grupoRetencion', header: 'Grupo de Retención de Impuestos', width: 24, list: 'withholdingGroups'},
  {key: 'importeRetenido', header: 'Importe Retenido', width: 12, amount: true},
  {key: 'descripcion', header: 'Descripción', width: 60},
  {key: 'condiciones', header: 'Condiciones', width: 10, list: 'terms'},
  {key: 'grupoPago', header: 'Grupo de Pago', width: 18, list: 'paymentGroups'},
  {key: 'divisaPago', header: 'Div. Pago', width: 9, list: 'currencies'},
  {key: 'importeDescuento', header: 'Importe del Descuento', width: 13, amount: true},
  {key: 'cuentaPasivo', header: 'Cuenta de Pasivo', width: 34},
  {key: 'descripcionPasivo', header: 'Descripción de Pasivo', width: 44},
  {key: 'fechaTcPago', header: 'Fecha T. C. Pago', width: 12},
  {key: 'divisaFuncional', header: 'Divisa Funcional', width: 9, list: 'currencies'},
  {key: 'metodoPago', header: 'Método de Pago', width: 12, list: 'paymentMethods'},
  {key: 'nivelCalculo', header: 'Nivel de Cálculo de Impuestos', width: 12},
  {key: 'categoriaDocumento', header: 'Nombre de Categoría de Documento', width: 18},
  {key: 'secuenciaDocumento', header: 'Nombre Secuencia Documento', width: 14},
  {key: 'importeAprobado', header: 'Importe Aprobado', width: 13, amount: true},
  {key: 'fechaCambio', header: 'Fecha de Cambio', width: 12},
  {key: 'claseTipoCambio', header: 'Clase Tipo Cambio', width: 12},
  {key: 'juegoDistribucion', header: 'Juego Distribución', width: 12},
  {key: 'tipoCambio', header: 'Tipo de Cambio', width: 10},
  {key: 'fechaPlazo', header: 'Fecha Plazo', width: 12},
  {key: 'tipoAnticipo', header: 'Tipo de Anticipo', width: 10},
  {key: 'fechaLiquidacion', header: 'Fecha de Liquidación', width: 12},
  {key: 'importeImpuesto', header: 'Importe del Impuesto', width: 12, amount: true},
];

export const lineColumns = [
  {key: 'numero', header: 'Nº', width: 5},
  {key: 'tipo', header: 'Tipo', width: 20, list: 'lineTypes'},
  {key: 'importe', header: 'Importe', width: 12, amount: true},
  {key: 'codigoImpuesto', header: 'Cód. Impuesto', width: 14, list: 'lineTaxCodes'},
  {key: 'fechaContable', header: 'Fecha Contable', width: 12},
  {key: 'cuenta', header: 'Cuenta', width: 34},
  {key: 'incluyeImpuestos', header: 'Incluye Impuestos', width: 10},
  {key: 'activoFijo', header: 'Activo Fijo', width: 10},
  {key: 'grupoRetencion', header: 'Grupo Retención Impuestos', width: 24, list: 'withholdingGroups'},
  {key: 'descripcion', header: 'Descripción', width: 60},
  {key: 'tipoCreacion', header: 'Tipo Creación Retención Impuestos', width: 14},
  {key: 'claseRenta', header: 'Clase Impuesto Renta', width: 10},
  {key: 'regionFiscal', header: 'Región Fiscal', width: 10},
  {key: 'confrontacionFinal', header: 'Confrontación Final', width: 10},
  {key: 'cantidadConfrontada', header: 'Cantidad Confrontada', width: 10},
  {key: 'precio', header: 'Precio', width: 10},
  {key: 'pedido', header: 'Nº Pedido', width: 10},
  {key: 'unidadMedida', header: 'Unidad de Medida', width: 10},
  {key: 'cantidadEstadistica', header: 'Cantidad Estadística', width: 10},
  {key: 'estado', header: 'Estado', width: 12},
  {key: 'contabilizada', header: 'Contabilizada', width: 10},
  {key: 'codigoTransaccion', header: 'Cód. Transacción', width: 10},
  {key: 'flexfield', header: '[ ]', width: 12},
  {key: 'filaFactura', header: 'Fila en FACTURAS', width: 10},
  {key: 'viaje', header: 'Viaje', width: 14},
];

const listValues = {...oracleLists, lineTaxCodes: [...oracleLists.taxCodes, ...oracleLists.withholdingGroups]};

const roundAmount = (value) => parseFloat((parseFloat(value) || 0).toFixed(2));

export function formatOracleDate(value) {
  const [year, month, day] = String(value || '').slice(0, 10).split('-');
  if (!year || !month || !day) {
    return '';
  }
  return `${day}-${monthNames[parseInt(month, 10) - 1]}-${year.slice(2)}`;
}

export function todayOracleDate(now = new Date()) {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return formatOracleDate(`${now.getFullYear()}-${month}-${day}`);
}

export function buildOracleAccount(account) {
  if (!account) {
    return '';
  }
  const {company, businessUnit, dependency, subaccount, section, product, complement} = oracleDefaults;
  return [company, businessUnit, dependency, account, subaccount, section, product, complement].join('.');
}

export function buildSupplierName(user) {
  const surnames = [user?.apellido_paterno, user?.apellido_materno].filter(Boolean).join(' ');
  return `${surnames}, ${user?.nombre || ''} ${oracleDefaults.supplierSuffix}`.toUpperCase();
}

const categoryCode = (expense) => (expense.Categoria_Gasto?.nombre || '').match(/^(\d{6})\b/)?.[1] || '';

const categoryConcept = (expense) => {
  const concept = (expense.Categoria_Gasto?.nombre || '').replace(/^\d{6}\s+/, '').trim();
  if (concept) {
    return concept;
  }
  return expense.descripcion || '';
};

export function buildOracleDescription(trip, expense) {
  const user = trip.Usuario || {};
  const fullName = `${user.nombre || ''} ${user.apellido_paterno || ''}`.trim();
  return `RC ${buildTripCode(trip)}  ${fullName} , ${trip.motivo || ''} , ${categoryConcept(expense)}`.toUpperCase().slice(0, maxDescription);
}

const getWithholdingType = (expense) => {
  if (expense.Factura || expense.es_gasto_internacional || expense.tiene_alcohol) {
    return null;
  }
  if (['S', 'C'].includes(expense.tipo)) {
    return expense.tipo;
  }
  return null;
};

const findReceiptNumber = (trip, expense) => {
  const own = (expense.Recibo || [])[0];
  if (own) {
    return String(own.numero);
  }
  const grouped = (trip.Recibo || []).find((receipt) => !receipt.id_gasto && receipt.tipo === expense.tipo && !!receipt.es_gasto_internacional === !!expense.es_gasto_internacional);
  if (grouped) {
    return String(grouped.numero);
  }
  return '';
};

const getDocumentNumber = (trip, expense) => {
  const invoiceNumber = expense.Factura?.numero_factura;
  if (expense.Factura) {
    if (!invoiceNumber || invoiceNumber === 'No Especificado') {
      return '';
    }
    return invoiceNumber;
  }
  return findReceiptNumber(trip, expense);
};

const buildFlexfield = (isVatInvoice, cuf) => {
  const {invoiceBatch, context, controlCode, bolInvoiceType} = oracleDefaults;
  if (isVatInvoice) {
    return [invoiceBatch, '', '', '', context, '', '', cuf || '', controlCode, '', bolInvoiceType, '', ''].join('.');
  }
  return [invoiceBatch, '', '', '', context, '', '', '', '', '', '', '', ''].join('.');
};

const missingIfEmpty = (value, key) => {
  if (value) {
    return [];
  }
  return [key];
};

const emptyRow = (columns) => Object.fromEntries(columns.map((column) => [column.key, '']));

const buildLines = ({trip, expense, accountingDate, description, taxCode, articleAmount, vat, withholding, tax}) => {
  const base = {...emptyRow(lineColumns), fechaContable: accountingDate, estado: oracleDefaults.lineStatus, contabilizada: 'No', flexfield: '..........', viaje: buildTripCode(trip)};
  const article = {
    ...base, tipo: 'Artículo', importe: articleAmount, codigoImpuesto: taxCode, cuenta: buildOracleAccount(categoryCode(expense)),
    grupoRetencion: withholding?.group || '', descripcion: description, confrontacionFinal: 'No',
  };
  const taxLine = oracleTaxLines[taxCode];
  const lines = [
    {values: article, missing: missingIfEmpty(article.cuenta, 'cuenta')},
    {values: {...base, tipo: 'Impuesto', importe: vat, codigoImpuesto: taxCode, cuenta: buildOracleAccount(taxLine.account), descripcion: taxLine.description}, missing: []},
  ];
  if (withholding) {
    const mainAmount = roundAmount(tax.rcIva + tax.iue);
    const mainAccount = buildOracleAccount(withholding.mainAccount);
    lines.push({
      values: {...base, tipo: 'Retención de Impuestos', importe: -mainAmount, codigoImpuesto: withholding.mainCode, cuenta: mainAccount, descripcion: description, tipoCreacion: 'Automática'},
      missing: missingIfEmpty(mainAccount, 'cuenta'),
    });
    lines.push({
      values: {...base, tipo: 'Retención de Impuestos', importe: -roundAmount(tax.it), codigoImpuesto: oracleWithholdings.it.code, cuenta: buildOracleAccount(oracleWithholdings.it.account), descripcion: description, tipoCreacion: 'Automática'},
      missing: [],
    });
  }
  return lines.map((line, index) => ({...line, values: {...line.values, numero: index + 1}}));
};

export function buildOracleInvoice(trip, expense, accountingDate) {
  const tax = getExpenseTaxValues(expense);
  const isInternational = !!expense.es_gasto_internacional;
  const paid = roundAmount(expense.monto_total);
  const vat = roundAmount(tax.vat);
  const isVatInvoice = vat > 0;
  const withholdingType = getWithholdingType(expense);
  const withholding = oracleWithholdings[withholdingType] || null;
  let invoiceAmount = paid;
  let retained = 0;
  if (withholding) {
    invoiceAmount = roundAmount(tax.cost);
    retained = roundAmount(tax.rcIva + tax.iue + tax.it);
  }
  let taxCode = oracleTaxCodes.employeeNoVat;
  if (isVatInvoice) {
    taxCode = oracleTaxCodes.invoiceVat;
  }
  let payment = oraclePaymentTerms.noInvoice;
  if (expense.Factura) {
    payment = oraclePaymentTerms.invoice;
  }
  let currency = oracleDefaults.functionalCurrency;
  if (isInternational) {
    currency = 'USD';
  }
  const invoiceDate = formatOracleDate(expense.Factura?.fecha_emision || expense.fecha_gasto);
  const description = buildOracleDescription(trip, expense);
  const documentNumber = getDocumentNumber(trip, expense);
  const values = {
    ...emptyRow(invoiceColumns),
    tipo: oracleDefaults.invoiceType,
    proveedor: buildSupplierName(trip.Usuario),
    fechaFactura: invoiceDate,
    numeroFactura: documentNumber,
    divisaFactura: currency,
    importeFactura: invoiceAmount,
    flexfield: buildFlexfield(isVatInvoice, expense.Factura?.cuf),
    fechaContable: accountingDate,
    codigoImpuesto: taxCode,
    grupoRetencion: withholding?.group || '',
    descripcion: description,
    condiciones: payment.terms,
    grupoPago: payment.paymentGroup,
    divisaPago: currency,
    importeDescuento: roundAmount(invoiceAmount - vat - retained),
    cuentaPasivo: buildOracleAccount(oracleDefaults.liabilityAccount),
    descripcionPasivo: oracleDefaults.liabilityDescription,
    fechaTcPago: invoiceDate,
    divisaFuncional: oracleDefaults.functionalCurrency,
    metodoPago: oracleDefaults.paymentMethod,
    nivelCalculo: oracleDefaults.calculationLevel,
    categoriaDocumento: oracleDefaults.documentCategory,
    secuenciaDocumento: oracleDefaults.documentSequence,
    importeAprobado: invoiceAmount,
    fechaPlazo: invoiceDate,
  };
  if (retained > 0) {
    values.importeRetenido = retained;
  }
  const missing = ['numeroProveedor', 'direccion'];
  if (!documentNumber) {
    missing.push('numeroFactura');
  }
  if (isVatInvoice && !expense.Factura?.cuf) {
    missing.push('flexfield');
  }
  if (isInternational) {
    values.fechaCambio = invoiceDate;
    missing.push('claseTipoCambio', 'tipoCambio');
  }
  const lines = buildLines({trip, expense, accountingDate, description, taxCode, articleAmount: roundAmount(invoiceAmount - vat), vat, withholding, tax});
  return {values, missing, lines};
}

const columnLetter = (index) => {
  let letter = '';
  let current = index;
  while (current > 0) {
    const remainder = (current - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    current = Math.floor((current - 1) / 26);
  }
  return letter;
};

const addListsSheet = (workbook) => {
  const sheet = workbook.addWorksheet('ListasOracle', {state: 'veryHidden'});
  const ranges = {};
  Object.entries(listValues).forEach(([name, values], index) => {
    const column = index + 1;
    values.forEach((value, row) => {
      sheet.getCell(row + 1, column).value = value;
    });
    const letter = columnLetter(column);
    ranges[name] = `ListasOracle!$${letter}$1:$${letter}$${values.length}`;
  });
  return ranges;
};

const writeSheet = (workbook, name, columns, rows, ranges) => {
  const sheet = workbook.addWorksheet(name);
  sheet.columns = columns.map((column) => ({header: column.header, key: column.key, width: column.width}));
  const header = sheet.getRow(1);
  header.font = {bold: true};
  header.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: headerFill}};
  header.alignment = {vertical: 'middle', wrapText: true};
  rows.forEach(({values, missing}) => {
    const row = sheet.addRow(values);
    columns.forEach((column, index) => {
      const cell = row.getCell(index + 1);
      if (column.amount) {
        cell.numFmt = '0.00';
      }
      if (column.list) {
        cell.dataValidation = {type: 'list', allowBlank: true, formulae: [ranges[column.list]]};
      }
      if (missing.includes(column.key)) {
        cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: pendingFill}};
        cell.note = pendingNote;
      }
    });
  });
  sheet.views = [{state: 'frozen', ySplit: 1}];
  return sheet;
};

export function buildOracleRows(statements, accountingDate) {
  const invoices = [];
  const lines = [];
  statements.forEach(({trip, expenses}) => {
    expenses.forEach((expense) => {
      const invoice = buildOracleInvoice(trip, expense, accountingDate);
      invoices.push({values: invoice.values, missing: invoice.missing});
      const invoiceRow = invoices.length + 1;
      invoice.lines.forEach((line) => lines.push({values: {...line.values, filaFactura: invoiceRow}, missing: line.missing}));
    });
  });
  return {invoices, lines};
}

export function addOracleSheets(workbook, statements) {
  const {invoices, lines} = buildOracleRows(statements, todayOracleDate());
  const ranges = addListsSheet(workbook);
  writeSheet(workbook, 'FACTURAS', invoiceColumns, invoices, ranges);
  writeSheet(workbook, 'LINEAS', lineColumns, lines, ranges);
}
