import buildTripCode from './tripCode';
import {getExpenseTaxValues} from './expenseTaxValues';
import {oracleDefaults, oracleTaxCodes, oracleTaxLines, oracleWithholdings, oraclePaymentTerms, oracleLists} from '../constants/oracleLists';

const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const maxDescription = 240;
const kindStyles = {
  system: {header: 'FFE2EFDA', note: 'Lo llena el sistema con los datos del gasto'},
  fixed: {header: 'FFD9D9D9', cell: 'FFEDEDED', note: 'Valor por defecto: siempre es el mismo'},
  oracle: {header: 'FFBDD7EE', cell: 'FFDDEBF7', note: 'Lo llena Oracle al subir la factura: dejar en blanco, no tocar'},
  reference: {header: 'FFE4DFEC', cell: 'FFF2EFF7', note: 'Referencia del sistema: no es una columna de Oracle'},
};
const pendingFill = 'FFFFE699';
const pendingNote = 'Completar antes de subir a Oracle';
const autoLineNote = 'Oracle crea esta línea al validar la factura: es solo de referencia, no se carga';

export const invoiceColumns = [
  {key: 'tipo', kind: 'fixed', header: 'Tipo', width: 12, list: 'invoiceTypes'},
  {key: 'justificante', kind: 'oracle', header: 'Nº Justificante', width: 14},
  {key: 'proveedor', kind: 'system', header: 'Proveedor', width: 34},
  {key: 'numeroProveedor', kind: 'oracle', header: 'Nº Proveedor', width: 13},
  {key: 'direccion', kind: 'oracle', header: 'Dirección', width: 16},
  {key: 'fechaFactura', kind: 'system', header: 'Fecha de la Factura', width: 12},
  {key: 'numeroFactura', kind: 'system', header: 'Nº Factura', width: 14},
  {key: 'divisaFactura', kind: 'system', header: 'Div. Factura', width: 9, list: 'currencies'},
  {key: 'importeFactura', kind: 'system', header: 'Importe de Factura', width: 13, amount: true},
  {key: 'flexfield', kind: 'system', header: '[ ]', width: 44},
  {key: 'fechaContable', kind: 'oracle', header: 'Fecha Contable', width: 12},
  {key: 'codigoImpuesto', kind: 'system', header: 'Código de Impuesto', width: 14, list: 'taxCodes'},
  {key: 'grupoRetencion', kind: 'system', header: 'Grupo de Retención de Impuestos', width: 24, list: 'withholdingGroups'},
  {key: 'importeRetenido', kind: 'oracle', header: 'Importe Retenido', width: 12, amount: true},
  {key: 'descripcion', kind: 'system', header: 'Descripción', width: 60},
  {key: 'condiciones', kind: 'system', header: 'Condiciones', width: 10, list: 'terms'},
  {key: 'grupoPago', kind: 'system', header: 'Grupo de Pago', width: 18, list: 'paymentGroups'},
  {key: 'divisaPago', kind: 'system', header: 'Div. Pago', width: 9, list: 'currencies'},
  {key: 'importeDescuento', kind: 'oracle', header: 'Importe del Descuento', width: 13, amount: true},
  {key: 'cuentaPasivo', kind: 'fixed', header: 'Cuenta de Pasivo', width: 34},
  {key: 'descripcionPasivo', kind: 'oracle', header: 'Descripción de Pasivo', width: 44},
  {key: 'fechaTcPago', kind: 'oracle', header: 'Fecha T. C. Pago', width: 12},
  {key: 'divisaFuncional', kind: 'fixed', header: 'Divisa Funcional', width: 9, list: 'currencies'},
  {key: 'metodoPago', kind: 'fixed', header: 'Método de Pago', width: 12, list: 'paymentMethods'},
  {key: 'nivelCalculo', kind: 'fixed', header: 'Nivel de Cálculo de Impuestos', width: 12},
  {key: 'categoriaDocumento', kind: 'fixed', header: 'Nombre de Categoría de Documento', width: 18},
  {key: 'secuenciaDocumento', kind: 'fixed', header: 'Nombre Secuencia Documento', width: 14},
  {key: 'importeAprobado', kind: 'oracle', header: 'Importe Aprobado', width: 13, amount: true},
  {key: 'fechaCambio', kind: 'oracle', header: 'Fecha de Cambio', width: 12},
  {key: 'claseTipoCambio', kind: 'oracle', header: 'Clase Tipo Cambio', width: 12},
  {key: 'juegoDistribucion', kind: 'oracle', header: 'Juego Distribución', width: 12},
  {key: 'tipoCambio', kind: 'oracle', header: 'Tipo de Cambio', width: 10},
  {key: 'fechaPlazo', kind: 'oracle', header: 'Fecha Plazo', width: 12},
  {key: 'tipoAnticipo', kind: 'oracle', header: 'Tipo de Anticipo', width: 10},
  {key: 'fechaLiquidacion', kind: 'oracle', header: 'Fecha de Liquidación', width: 12},
  {key: 'importeImpuesto', kind: 'oracle', header: 'Importe del Impuesto', width: 12, amount: true},
];

export const lineColumns = [
  {key: 'numero', kind: 'system', header: 'Nº', width: 5},
  {key: 'tipo', kind: 'system', header: 'Tipo', width: 20, list: 'lineTypes'},
  {key: 'importe', kind: 'system', header: 'Importe', width: 12, amount: true},
  {key: 'codigoImpuesto', kind: 'system', header: 'Cód. Impuesto', width: 14, list: 'lineTaxCodes'},
  {key: 'fechaContable', kind: 'oracle', header: 'Fecha Contable', width: 12},
  {key: 'cuenta', kind: 'system', header: 'Cuenta', width: 34},
  {key: 'incluyeImpuestos', kind: 'oracle', header: 'Incluye Impuestos', width: 10},
  {key: 'activoFijo', kind: 'oracle', header: 'Activo Fijo', width: 10},
  {key: 'grupoRetencion', kind: 'system', header: 'Grupo Retención Impuestos', width: 24, list: 'withholdingGroups'},
  {key: 'descripcion', kind: 'system', header: 'Descripción', width: 60},
  {key: 'tipoCreacion', kind: 'oracle', header: 'Tipo Creación Retención Impuestos', width: 14},
  {key: 'claseRenta', kind: 'oracle', header: 'Clase Impuesto Renta', width: 10},
  {key: 'regionFiscal', kind: 'oracle', header: 'Región Fiscal', width: 10},
  {key: 'confrontacionFinal', kind: 'fixed', header: 'Confrontación Final', width: 10},
  {key: 'cantidadConfrontada', kind: 'oracle', header: 'Cantidad Confrontada', width: 10},
  {key: 'precio', kind: 'oracle', header: 'Precio', width: 10},
  {key: 'pedido', kind: 'oracle', header: 'Nº Pedido', width: 10},
  {key: 'unidadMedida', kind: 'oracle', header: 'Unidad de Medida', width: 10},
  {key: 'cantidadEstadistica', kind: 'oracle', header: 'Cantidad Estadística', width: 10},
  {key: 'estado', kind: 'oracle', header: 'Estado', width: 12},
  {key: 'contabilizada', kind: 'oracle', header: 'Contabilizada', width: 10},
  {key: 'codigoTransaccion', kind: 'oracle', header: 'Cód. Transacción', width: 10},
  {key: 'flexfield', kind: 'fixed', header: '[ ]', width: 12},
  {key: 'filaFactura', kind: 'reference', header: 'Fila en FACTURAS', width: 10},
  {key: 'viaje', kind: 'reference', header: 'Viaje', width: 14},
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

const buildLines = ({trip, expense, description, taxCode, articleAmount, vat, withholding, tax}) => {
  const base = {...emptyRow(lineColumns), flexfield: '..........', viaje: buildTripCode(trip)};
  const article = {
    ...base, tipo: 'Artículo', importe: articleAmount, codigoImpuesto: taxCode, cuenta: buildOracleAccount(categoryCode(expense)),
    grupoRetencion: withholding?.group || '', descripcion: description, confrontacionFinal: 'No',
  };
  const taxLine = oracleTaxLines[taxCode];
  const lines = [
    {values: article, missing: missingIfEmpty(article.cuenta, 'cuenta')},
    {values: {...base, tipo: 'Impuesto', importe: vat, codigoImpuesto: taxCode, cuenta: buildOracleAccount(taxLine.account), descripcion: taxLine.description}, missing: [], auto: true},
  ];
  if (withholding) {
    const mainAmount = roundAmount(tax.rcIva + tax.iue);
    const mainAccount = buildOracleAccount(withholding.mainAccount);
    lines.push({
      values: {...base, tipo: 'Retención de Impuestos', importe: -mainAmount, codigoImpuesto: withholding.mainCode, cuenta: mainAccount, descripcion: description},
      missing: missingIfEmpty(mainAccount, 'cuenta'),
      auto: true,
    });
    lines.push({
      values: {...base, tipo: 'Retención de Impuestos', importe: -roundAmount(tax.it), codigoImpuesto: oracleWithholdings.it.code, cuenta: buildOracleAccount(oracleWithholdings.it.account), descripcion: description},
      missing: [],
      auto: true,
    });
  }
  return lines.map((line, index) => ({...line, values: {...line.values, numero: index + 1}}));
};

export function buildOracleInvoice(trip, expense) {
  const tax = getExpenseTaxValues(expense);
  const isInternational = !!expense.es_gasto_internacional;
  const paid = roundAmount(expense.monto_total);
  const vat = roundAmount(tax.vat);
  const isVatInvoice = vat > 0;
  const withholdingType = getWithholdingType(expense);
  const withholding = oracleWithholdings[withholdingType] || null;
  let invoiceAmount = paid;
  if (withholding) {
    invoiceAmount = roundAmount(tax.cost);
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
    codigoImpuesto: taxCode,
    grupoRetencion: withholding?.group || '',
    descripcion: description,
    condiciones: payment.terms,
    grupoPago: payment.paymentGroup,
    divisaPago: currency,
    cuentaPasivo: buildOracleAccount(oracleDefaults.liabilityAccount),
    divisaFuncional: oracleDefaults.functionalCurrency,
    metodoPago: oracleDefaults.paymentMethod,
    nivelCalculo: oracleDefaults.calculationLevel,
    categoriaDocumento: oracleDefaults.documentCategory,
    secuenciaDocumento: oracleDefaults.documentSequence,
  };
  const missing = [];
  const overrides = [];
  if (!documentNumber) {
    missing.push('numeroFactura');
  }
  if (isVatInvoice && !expense.Factura?.cuf) {
    missing.push('flexfield');
  }
  if (isInternational) {
    values.fechaCambio = invoiceDate;
    overrides.push('fechaCambio');
    missing.push('claseTipoCambio', 'tipoCambio');
  }
  const lines = buildLines({trip, expense, description, taxCode, articleAmount: roundAmount(invoiceAmount - vat), vat, withholding, tax});
  return {values, missing, overrides, lines};
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

const solidFill = (argb) => ({type: 'pattern', pattern: 'solid', fgColor: {argb}});

const styleHeader = (sheet, columns) => {
  const header = sheet.getRow(1);
  header.font = {bold: true};
  header.alignment = {vertical: 'middle', wrapText: true};
  header.height = 32;
  columns.forEach((column, index) => {
    const cell = header.getCell(index + 1);
    cell.fill = solidFill(kindStyles[column.kind].header);
    cell.note = kindStyles[column.kind].note;
  });
};

const styleCell = (cell, column, row) => {
  if (row.missing.includes(column.key)) {
    cell.fill = solidFill(pendingFill);
    cell.note = pendingNote;
    return;
  }
  if ((row.overrides || []).includes(column.key)) {
    return;
  }
  const fill = kindStyles[column.kind].cell;
  if (row.auto && column.kind === 'system') {
    cell.fill = solidFill(kindStyles.oracle.cell);
    return;
  }
  if (fill) {
    cell.fill = solidFill(fill);
  }
  if (column.kind === 'oracle') {
    cell.value = null;
  }
};

const writeSheet = (workbook, name, columns, rows, ranges) => {
  const sheet = workbook.addWorksheet(name);
  sheet.columns = columns.map((column) => ({header: column.header, key: column.key, width: column.width}));
  styleHeader(sheet, columns);
  rows.forEach((rowData) => {
    const row = sheet.addRow(rowData.values);
    columns.forEach((column, index) => {
      const cell = row.getCell(index + 1);
      if (column.amount) {
        cell.numFmt = '0.00';
      }
      if (column.list && column.kind !== 'oracle') {
        cell.dataValidation = {type: 'list', allowBlank: true, formulae: [ranges[column.list]]};
      }
      styleCell(cell, column, rowData);
    });
    if (rowData.auto) {
      row.getCell(2).note = autoLineNote;
      row.font = {italic: true, color: {argb: 'FF595959'}};
    }
  });
  sheet.views = [{state: 'frozen', ySplit: 1}];
  return sheet;
};

const legendRows = [
  ['Encabezado verde, celda blanca', 'Lo llena el sistema con los datos de cada gasto. Se puede corregir si hace falta.', kindStyles.system.header, null],
  ['Gris', 'Valor por defecto que no cambia (tipo Estándar, cuenta de pasivo, Cheque, BOB, Línea, Facturas estándar, AP.F.BOL, etc.).', kindStyles.fixed.header, kindStyles.fixed.cell],
  ['Celeste, en blanco', 'Lo llena Oracle al subir la factura (Nº justificante, Nº proveedor, dirección, fechas, importes calculados, estado). No tocar.', kindStyles.oracle.header, kindStyles.oracle.cell],
  ['Fila celeste en cursiva (LINEAS)', 'Línea de impuesto o retención que Oracle crea solo al validar. Está para revisar los montos; no se carga.', kindStyles.oracle.header, kindStyles.oracle.cell],
  ['Amarillo', 'Falta un dato que el sistema no tiene (CUF, número de recibo, cuenta del IUE, tipo de cambio en USD). Completar antes de subir.', pendingFill, pendingFill],
  ['Lila', 'Columnas de referencia del sistema (fila de la factura y viaje). No son de Oracle.', kindStyles.reference.header, kindStyles.reference.cell],
];

const addLegendSheet = (workbook) => {
  const sheet = workbook.addWorksheet('LEYENDA ORACLE');
  sheet.columns = [{header: 'Color', key: 'color', width: 32}, {header: 'Significado', key: 'meaning', width: 110}];
  sheet.getRow(1).font = {bold: true};
  legendRows.forEach(([label, meaning, colorFill, cellFill]) => {
    const row = sheet.addRow({color: label, meaning});
    row.getCell(1).fill = solidFill(colorFill);
    if (cellFill) {
      row.getCell(2).fill = solidFill(cellFill);
    }
    row.alignment = {vertical: 'middle', wrapText: true};
    row.height = 30;
  });
};

export function buildOracleRows(statements) {
  const invoices = [];
  const lines = [];
  statements.forEach(({trip, expenses}) => {
    expenses.forEach((expense) => {
      const invoice = buildOracleInvoice(trip, expense);
      invoices.push({values: invoice.values, missing: invoice.missing, overrides: invoice.overrides});
      const invoiceRow = invoices.length + 1;
      invoice.lines.forEach((line) => lines.push({...line, values: {...line.values, filaFactura: invoiceRow}}));
    });
  });
  return {invoices, lines};
}

export function addOracleSheets(workbook, statements) {
  const {invoices, lines} = buildOracleRows(statements);
  const ranges = addListsSheet(workbook);
  writeSheet(workbook, 'FACTURAS', invoiceColumns, invoices, ranges);
  writeSheet(workbook, 'LINEAS', lineColumns, lines, ranges);
  addLegendSheet(workbook);
}
