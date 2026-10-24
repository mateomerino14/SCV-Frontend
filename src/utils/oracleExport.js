import buildTripCode from './tripCode';
import {toOracleExpenseType} from './expenseTypeCode';
import {getExpenseTaxValues} from './expenseTaxValues';
import {oracleDefaults, oracleTaxCodes, oracleTaxLines, oracleWithholdings, oraclePaymentTerms, oracleLists} from '../constants/oracleLists';

const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const maxDescription = 240;
const plainHeader = 'FFD9D9D9';
const kindStyles = {
  system: {header: plainHeader, note: 'Lo llena el sistema con los datos del gasto'},
  fixed: {header: plainHeader, note: 'Valor por defecto: siempre es el mismo'},
  oracle: {header: 'FFBDD7EE', cell: 'FFDDEBF7', note: 'Lo llena Oracle al subir la factura: dejar en blanco, no tocar'},
  reference: {header: plainHeader, note: 'Referencia del sistema: no es una columna de Oracle'},
};
const pendingFill = 'FFFFE699';
const pendingNote = 'Completar antes de subir a Oracle';
const monthNumberPlaceholder = '___';
const pendingNotes = {
  descripcion: 'Reemplazar ___ por el número de rendición del mes que lleva contabilidad',
};
const autoLineNote = 'Oracle crea esta línea al validar la factura: es solo de referencia, no se carga';

export const invoiceColumns = [
  {key: 'tipo', kind: 'fixed', header: 'Tipo', list: 'invoiceTypes'},
  {key: 'justificante', kind: 'oracle', header: 'Nº Justificante'},
  {key: 'proveedor', kind: 'system', header: 'Proveedor'},
  {key: 'numeroProveedor', kind: 'oracle', header: 'Nº Proveedor'},
  {key: 'direccion', kind: 'oracle', header: 'Dirección'},
  {key: 'fechaFactura', kind: 'system', header: 'Fecha de la Factura'},
  {key: 'numeroFactura', kind: 'system', header: 'Nº Factura'},
  {key: 'divisaFactura', kind: 'system', header: 'Div. Factura', list: 'currencies'},
  {key: 'importeFactura', kind: 'system', header: 'Importe de Factura', amount: true},
  {key: 'flexfield', kind: 'system', header: '[ ]'},
  {key: 'fechaContable', kind: 'oracle', header: 'Fecha Contable'},
  {key: 'codigoImpuesto', kind: 'system', header: 'Código de Impuesto', list: 'taxCodes'},
  {key: 'grupoRetencion', kind: 'system', header: 'Grupo de Retención de Impuestos', list: 'withholdingGroups'},
  {key: 'importeRetenido', kind: 'oracle', header: 'Importe Retenido', amount: true},
  {key: 'descripcion', kind: 'system', header: 'Descripción'},
  {key: 'condiciones', kind: 'system', header: 'Condiciones', list: 'terms'},
  {key: 'grupoPago', kind: 'system', header: 'Grupo de Pago', list: 'paymentGroups'},
  {key: 'divisaPago', kind: 'system', header: 'Div. Pago', list: 'currencies'},
  {key: 'importeDescuento', kind: 'oracle', header: 'Importe del Descuento', amount: true},
  {key: 'cuentaPasivo', kind: 'fixed', header: 'Cuenta de Pasivo'},
  {key: 'descripcionPasivo', kind: 'oracle', header: 'Descripción de Pasivo'},
  {key: 'fechaTcPago', kind: 'oracle', header: 'Fecha T. C. Pago'},
  {key: 'divisaFuncional', kind: 'fixed', header: 'Divisa Funcional', list: 'currencies'},
  {key: 'metodoPago', kind: 'fixed', header: 'Método de Pago', list: 'paymentMethods'},
  {key: 'nivelCalculo', kind: 'fixed', header: 'Nivel de Cálculo de Impuestos'},
  {key: 'categoriaDocumento', kind: 'fixed', header: 'Nombre de Categoría de Documento'},
  {key: 'secuenciaDocumento', kind: 'fixed', header: 'Nombre Secuencia Documento'},
  {key: 'importeAprobado', kind: 'oracle', header: 'Importe Aprobado', amount: true},
  {key: 'fechaCambio', kind: 'oracle', header: 'Fecha de Cambio'},
  {key: 'claseTipoCambio', kind: 'oracle', header: 'Clase Tipo Cambio'},
  {key: 'juegoDistribucion', kind: 'oracle', header: 'Juego Distribución'},
  {key: 'tipoCambio', kind: 'oracle', header: 'Tipo de Cambio'},
  {key: 'fechaPlazo', kind: 'oracle', header: 'Fecha Plazo'},
  {key: 'tipoAnticipo', kind: 'oracle', header: 'Tipo de Anticipo'},
  {key: 'fechaLiquidacion', kind: 'oracle', header: 'Fecha de Liquidación'},
  {key: 'importeImpuesto', kind: 'oracle', header: 'Importe del Impuesto', amount: true},
];

export const lineColumns = [
  {key: 'numero', kind: 'system', header: 'Nº'},
  {key: 'tipo', kind: 'system', header: 'Tipo', list: 'lineTypes'},
  {key: 'importe', kind: 'system', header: 'Importe', amount: true},
  {key: 'codigoImpuesto', kind: 'system', header: 'Cód. Impuesto', list: 'lineTaxCodes'},
  {key: 'fechaContable', kind: 'oracle', header: 'Fecha Contable'},
  {key: 'cuenta', kind: 'system', header: 'Cuenta'},
  {key: 'incluyeImpuestos', kind: 'oracle', header: 'Incluye Impuestos'},
  {key: 'activoFijo', kind: 'oracle', header: 'Activo Fijo'},
  {key: 'grupoRetencion', kind: 'system', header: 'Grupo Retención Impuestos', list: 'withholdingGroups'},
  {key: 'descripcion', kind: 'system', header: 'Descripción'},
  {key: 'tipoCreacion', kind: 'oracle', header: 'Tipo Creación Retención Impuestos'},
  {key: 'claseRenta', kind: 'oracle', header: 'Clase Impuesto Renta'},
  {key: 'regionFiscal', kind: 'oracle', header: 'Región Fiscal'},
  {key: 'confrontacionFinal', kind: 'fixed', header: 'Confrontación Final'},
  {key: 'cantidadConfrontada', kind: 'oracle', header: 'Cantidad Confrontada'},
  {key: 'precio', kind: 'oracle', header: 'Precio'},
  {key: 'pedido', kind: 'oracle', header: 'Nº Pedido'},
  {key: 'unidadMedida', kind: 'oracle', header: 'Unidad de Medida'},
  {key: 'cantidadEstadistica', kind: 'oracle', header: 'Cantidad Estadística'},
  {key: 'estado', kind: 'oracle', header: 'Estado'},
  {key: 'contabilizada', kind: 'oracle', header: 'Contabilizada'},
  {key: 'codigoTransaccion', kind: 'oracle', header: 'Cód. Transacción'},
  {key: 'flexfield', kind: 'fixed', header: '[ ]'},
  {key: 'filaFactura', kind: 'reference', header: 'Fila en FACTURAS'},
  {key: 'viaje', kind: 'reference', header: 'Viaje'},
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

const documentDate = (expense) => String(expense.Factura?.fecha_emision || expense.fecha_gasto || '').slice(0, 10);

export function documentMonth(expense) {
  return parseInt(documentDate(expense).slice(5, 7), 10) || '';
}

export function buildOracleDescription(trip, expense) {
  const user = trip.Usuario || {};
  const fullName = `${user.nombre || ''} ${user.apellido_paterno || ''}`.trim();
  const code = `${toOracleExpenseType(expense.tipo)} ${documentMonth(expense)}-${trip.numero_rendicion || monthNumberPlaceholder}`;
  return `${code}  ${fullName} , ${trip.motivo || ''} , ${categoryConcept(expense)}`.toUpperCase().slice(0, maxDescription);
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
  if (expense.numero_recibo) {
    return expense.numero_recibo;
  }
  return findReceiptNumber(trip, expense);
};

const buildFlexfield = (isVatInvoice, cuf) => {
  const {invoiceBatch, context, controlCode, bolInvoiceType} = oracleDefaults;
  if (isVatInvoice) {
    return [`Lote de Facturas: ${invoiceBatch}`, `CUF: ${cuf || ''}`, `Código Control: ${controlCode}`, `Tipo Factura: ${bolInvoiceType}`].join('\n');
  }
  return [`Lote de Facturas: ${invoiceBatch}`, `Contexto: ${context}`].join('\n');
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
    {values: article, missing: [...missingIfEmpty(article.cuenta, 'cuenta'), ...missingIfEmpty(trip.numero_rendicion, 'descripcion')]},
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
  if (expense.Factura && expense.tipo === 'F') {
    payment = oraclePaymentTerms.invoice;
  }
  let currency = oracleDefaults.functionalCurrency;
  if (isInternational) {
    currency = 'USD';
  }
  const invoiceDate = formatOracleDate(documentDate(expense));
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
  const missing = missingIfEmpty(trip.numero_rendicion, 'descripcion');
  if (!documentNumber) {
    missing.push('numeroFactura');
  }
  if (isVatInvoice && !expense.Factura?.cuf) {
    missing.push('flexfield');
  }
  const lines = buildLines({trip, expense, description, taxCode, articleAmount: roundAmount(invoiceAmount - vat), vat, withholding, tax});
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

const solidFill = (argb) => ({type: 'pattern', pattern: 'solid', fgColor: {argb}});
const thinLine = {style: 'thin', color: {argb: 'FF8C8C8C'}};
const cellBorder = {top: thinLine, bottom: thinLine, left: thinLine, right: thinLine};

const styleHeader = (sheet, columns) => {
  const header = sheet.getRow(1);
  header.font = {bold: true};
  header.alignment = {horizontal: 'center', vertical: 'middle', wrapText: true};
  header.height = 32;
  columns.forEach((column, index) => {
    const cell = header.getCell(index + 1);
    cell.fill = solidFill(kindStyles[column.kind].header);
    cell.note = kindStyles[column.kind].note;
    cell.border = cellBorder;
  });
};

const styleCell = (cell, column, row) => {
  if (row.missing.includes(column.key)) {
    cell.fill = solidFill(pendingFill);
    cell.note = pendingNotes[column.key] || pendingNote;
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

const minColumnWidth = 6;
const maxColumnWidth = 110;

const textWidth = (value, column) => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  if (column.amount) {
    return (parseFloat(value) || 0).toFixed(2).length;
  }
  return Math.max(...String(value).split('\n').map((line) => line.length));
};

const fitColumnWidths = (sheet, columns, rows) => {
  columns.forEach((column, index) => {
    const headerWidth = Math.max(...column.header.split(' ').map((word) => word.length));
    const contentWidth = Math.max(0, ...rows.map((row) => {
      if (column.kind === 'oracle') {
        return 0;
      }
      return textWidth(row.values[column.key], column);
    }));
    sheet.getColumn(index + 1).width = Math.min(maxColumnWidth, Math.max(minColumnWidth, headerWidth, contentWidth) + 2);
  });
};

const writeSheet = (workbook, name, columns, rows, ranges) => {
  const sheet = workbook.addWorksheet(name);
  sheet.columns = columns.map((column) => ({header: column.header, key: column.key}));
  styleHeader(sheet, columns);
  rows.forEach((rowData) => {
    const row = sheet.addRow(rowData.values);
    columns.forEach((column, index) => {
      const cell = row.getCell(index + 1);
      cell.border = cellBorder;
      if (column.amount) {
        cell.numFmt = '0.00';
      }
      if (column.key === 'flexfield') {
        cell.alignment = {wrapText: true, vertical: 'top'};
      }
      if (column.list && column.kind !== 'oracle') {
        cell.dataValidation = {type: 'list', allowBlank: true, formulae: [ranges[column.list]]};
      }
      styleCell(cell, column, rowData);
    });
    const flexLines = String(rowData.values.flexfield || '').split('\n').length;
    if (flexLines > 1) {
      row.height = flexLines * 15;
    }
    if (rowData.auto) {
      row.getCell(2).note = autoLineNote;
      row.font = {italic: true, color: {argb: 'FF595959'}};
    }
  });
  fitColumnWidths(sheet, columns, rows);
  sheet.views = [{state: 'frozen', ySplit: 1}];
  return sheet;
};

const legendRows = [
  ['Blanco', 'Datos listos para Oracle: los pone el sistema o son valores fijos. La nota de cada encabezado dice cuál.', plainHeader, null],
  ['Celeste', 'Lo llena Oracle al subir la factura, así que va en blanco y no se toca. En LINEAS, las filas celestes en cursiva son las líneas de impuesto y retención que Oracle crea al validar: están solo para revisar los montos.', kindStyles.oracle.header, kindStyles.oracle.cell],
  ['Amarillo', 'Falta un dato que el sistema no tiene (CUF, número de recibo, cuenta del IUE, número de rendición). Completar antes de subir.', pendingFill, pendingFill],
];

const addLegendSheet = (workbook) => {
  const sheet = workbook.addWorksheet('LEYENDA ORACLE');
  sheet.columns = [{header: 'Color', key: 'color', width: 32}, {header: 'Significado', key: 'meaning', width: 110}];
  sheet.getRow(1).font = {bold: true};
  sheet.getRow(1).alignment = {horizontal: 'center', vertical: 'middle'};
  sheet.getRow(1).eachCell((cell) => {
    cell.border = cellBorder;
  });
  legendRows.forEach(([label, meaning, colorFill, cellFill]) => {
    const row = sheet.addRow({color: label, meaning});
    row.getCell(1).border = cellBorder;
    row.getCell(2).border = cellBorder;
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
      invoices.push({values: invoice.values, missing: invoice.missing});
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
