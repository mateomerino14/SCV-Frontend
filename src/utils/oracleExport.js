import buildTripCode from './tripCode';
import {addListRanges, columnLetter} from './excelLists';
import {toOracleExpenseType} from './expenseTypeCode';
import {getExpenseTaxValues} from './expenseTaxValues';
import {resolveDocumentNumber, documentSources, systemReceiptNote} from './documentNumber';
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
const pendingFill = 'FFFFC7CE';
const systemReceiptFill = 'FFE4DFEC';
const pendingFont = 'FF9C0006';
const missingCode = 'XXX';
const pendingNote = 'Completar antes de subir a Oracle';
const monthNumberPlaceholder = missingCode;
const pendingNotes = {
  descripcion: 'Reemplazar XXX por el número de rendición del mes que lleva contabilidad',
  cuenta: 'Revisar la cuenta: falta el código de Oracle de la dependencia o de la sección del empleado',
  numeroFactura: 'Falta el número de la factura o del recibo',
  flexfield: 'Falta el CUF de la factura',
};
const autoLineNote = 'Oracle crea esta línea al validar la factura: es solo de referencia, no se carga';

const invoiceColumns = [
  {key: 'tipo', kind: 'fixed', header: 'Tipo', list: 'invoiceTypes'},
  {key: 'justificante', kind: 'oracle', header: 'Nº Justificante'},
  {key: 'proveedor', kind: 'system', header: 'Proveedor'},
  {key: 'numeroProveedor', kind: 'oracle', header: 'Nº Proveedor'},
  {key: 'direccion', kind: 'oracle', header: 'Dirección'},
  {key: 'fechaFactura', kind: 'system', header: 'Fecha de la Factura'},
  {key: 'numeroFactura', kind: 'system', header: 'Nº Factura'},
  {key: 'divisaFactura', kind: 'system', header: 'Div. Factura', list: 'currencies'},
  {key: 'importeFactura', kind: 'system', header: 'Importe de Factura', amount: true, centered: true},
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
  {key: 'cuentaPasivo', kind: 'oracle', header: 'Cuenta de Pasivo'},
  {key: 'descripcionPasivo', kind: 'oracle', header: 'Descripción de Pasivo'},
  {key: 'fechaTcPago', kind: 'oracle', header: 'Fecha T. C. Pago'},
  {key: 'divisaFuncional', kind: 'oracle', header: 'Divisa Funcional', list: 'currencies'},
  {key: 'metodoPago', kind: 'fixed', header: 'Método de Pago', list: 'paymentMethods', centered: true},
  {key: 'nivelCalculo', kind: 'fixed', header: 'Nivel de Cálculo de Impuestos', centered: true},
  {key: 'categoriaDocumento', kind: 'fixed', header: 'Nombre de Categoría de Documento', centered: true},
  {key: 'secuenciaDocumento', kind: 'fixed', header: 'Nombre Secuencia Documento', centered: true},
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

const lineColumns = [
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

const fixedSegments = {dependency: oracleDefaults.dependency, section: oracleDefaults.section};

function buildOracleAccount(account, segments = fixedSegments) {
  if (!account) {
    return '';
  }
  const {company, businessUnit, subaccount, product, complement} = oracleDefaults;
  const dependency = segments.dependency || missingCode;
  const section = segments.section || missingCode;
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

function documentMonth(expense) {
  return parseInt(documentDate(expense).slice(5, 7), 10) || '';
}

const isInvoiceWithVat = (expense) => !!expense.Factura && expense.tipo === 'F' && !expense.tiene_alcohol;

const documentSymbol = (expense) => {
  if (expense.Factura && expense.tiene_alcohol) {
    return 'R';
  }
  return toOracleExpenseType(expense.tipo);
};

function buildOracleDescription(trip, expense) {
  const user = trip.Usuario || {};
  const fullName = `${user.nombre || ''} ${user.apellido_paterno || ''}`.trim();
  const code = `${documentSymbol(expense)} ${documentMonth(expense)}-${trip.numero_rendicion || monthNumberPlaceholder}`;
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

const employeeDependency = (user) => {
  if (user?.Jefe) {
    return user.Jefe.codigo_dependencia;
  }
  return user?.codigo_dependencia;
};

const buildLines = ({trip, expense, description, taxCode, articleAmount, vat, withholding, tax}) => {
  const base = {...emptyRow(lineColumns), flexfield: '..........', viaje: buildTripCode(trip)};
  const accountSegments = {dependency: employeeDependency(trip.Usuario), section: trip.Usuario?.Seccion?.codigo_seccion};
  const article = {
    ...base, tipo: 'Artículo', importe: articleAmount, codigoImpuesto: taxCode, cuenta: buildOracleAccount(categoryCode(expense), accountSegments),
    grupoRetencion: withholding?.group || '', descripcion: description, confrontacionFinal: 'No',
  };
  const taxLine = oracleTaxLines[taxCode];
  const lines = [
    {values: article, missing: [...missingIfEmpty(article.cuenta && accountSegments.dependency && accountSegments.section, 'cuenta'), ...missingIfEmpty(trip.numero_rendicion, 'descripcion')]},
    {values: {...base, tipo: 'Impuesto', importe: vat, codigoImpuesto: taxCode, cuenta: buildOracleAccount(taxLine.account), descripcion: taxLine.description}, missing: [], auto: true},
  ];
  if (withholding) {
    const mainAmount = roundAmount(tax.rcIva + tax.iue);
    const mainAccount = buildOracleAccount(withholding.mainAccount);
    lines.push({
      values: {...base, tipo: 'Retención de Impuestos', importe: -mainAmount, codigoImpuesto: withholding.mainCode, cuenta: mainAccount, descripcion: description},
      missing: [],
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
  if (isInvoiceWithVat(expense)) {
    payment = oraclePaymentTerms.invoice;
  }
  let currency = oracleDefaults.functionalCurrency;
  if (isInternational) {
    currency = 'USD';
  }
  const invoiceDate = formatOracleDate(documentDate(expense));
  const description = buildOracleDescription(trip, expense);
  const documentInfo = resolveDocumentNumber(expense, trip.Recibo);
  const documentNumber = documentInfo.number;
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
  const marked = [];
  if (documentInfo.source === documentSources.system) {
    marked.push('numeroFactura');
  }
  const lines = buildLines({trip, expense, description, taxCode, articleAmount: roundAmount(invoiceAmount - vat), vat, withholding, tax});
  return {values, missing, marked, lines};
}

const solidFill = (argb) => ({type: 'pattern', pattern: 'solid', fgColor: {argb}});
const baseFont = {name: 'Calibri', size: 10};
const headerFont = {...baseFont, bold: true, color: {argb: 'FF262626'}};
const autoFont = {...baseFont, italic: true, color: {argb: 'FF595959'}};
const thinLine = {style: 'thin', color: {argb: 'FFBFBFBF'}};
const groupLine = {style: 'medium', color: {argb: 'FF7F7F7F'}};
const cellBorder = {top: thinLine, bottom: thinLine, left: thinLine, right: thinLine};
const oracleTabColor = 'FF2F5597';
const legendTabColor = 'FF7F7F7F';
const headerHeight = 42;
const rowHeight = 18;
const textLineHeight = 14;
const amountFormat = '0.00';
const frozenColumns = 3;
const centeredKeys = ['numero', 'fechaFactura', 'numeroFactura', 'filaFactura', 'viaje', 'confrontacionFinal'];
const minColumnWidth = 8;
const maxColumnWidth = 110;

const cellAlignment = (column) => {
  if (column.centered) {
    return {horizontal: 'center', vertical: 'middle'};
  }
  if (column.amount) {
    return {horizontal: 'right', vertical: 'middle'};
  }
  if (column.key === 'flexfield') {
    return {horizontal: 'left', vertical: 'top', wrapText: true};
  }
  if (column.list || centeredKeys.includes(column.key)) {
    return {horizontal: 'center', vertical: 'middle'};
  }
  return {horizontal: 'left', vertical: 'middle'};
};

const styleHeader = (sheet, columns) => {
  const header = sheet.getRow(1);
  header.height = headerHeight;
  columns.forEach((column, index) => {
    const cell = header.getCell(index + 1);
    cell.font = headerFont;
    cell.alignment = {horizontal: 'center', vertical: 'middle', wrapText: true};
    cell.fill = solidFill(kindStyles[column.kind].header);
    cell.note = kindStyles[column.kind].note;
    cell.border = cellBorder;
  });
};

const styleCell = (cell, column, row) => {
  cell.font = baseFont;
  if (row.auto) {
    cell.font = autoFont;
  }
  if (row.missing.includes(column.key)) {
    cell.fill = solidFill(pendingFill);
    cell.font = {...baseFont, bold: true, color: {argb: pendingFont}};
    cell.note = pendingNotes[column.key] || pendingNote;
    return;
  }
  if ((row.marked || []).includes(column.key)) {
    cell.fill = solidFill(systemReceiptFill);
    cell.note = systemReceiptNote;
    return;
  }
  if (row.auto && column.kind === 'system') {
    cell.fill = solidFill(kindStyles.oracle.cell);
    return;
  }
  const fill = kindStyles[column.kind].cell;
  if (fill) {
    cell.fill = solidFill(fill);
  }
  if (column.kind === 'oracle') {
    cell.value = null;
  }
};

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

const pendingEntry = (name, column, index, rowNumber) => ({
  sheet: name,
  cell: `${columnLetter(index + 1)}${rowNumber}`,
  column: column.header,
  note: pendingNotes[column.key] || pendingNote,
});

const writeSheet = (workbook, name, columns, rows, ranges) => {
  const sheet = workbook.addWorksheet(name, {
    properties: {tabColor: {argb: oracleTabColor}},
    views: [{state: 'frozen', xSplit: frozenColumns, ySplit: 1}],
    pageSetup: {orientation: 'landscape', paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0, printTitlesRow: '1:1'},
  });
  sheet.columns = columns.map((column) => ({header: column.header, key: column.key}));
  styleHeader(sheet, columns);
  const pending = [];
  rows.forEach((rowData, rowIndex) => {
    const row = sheet.addRow(rowData.values);
    const startsGroup = rowIndex > 0 && rowData.values.numero === 1;
    columns.forEach((column, index) => {
      const cell = row.getCell(index + 1);
      cell.border = cellBorder;
      if (startsGroup) {
        cell.border = {...cellBorder, top: groupLine};
      }
      cell.alignment = cellAlignment(column);
      if (column.amount) {
        cell.numFmt = amountFormat;
      }
      if (column.list && column.kind !== 'oracle') {
        cell.dataValidation = {type: 'list', allowBlank: true, formulae: [ranges[column.list]]};
      }
      styleCell(cell, column, rowData);
      if (rowData.missing.includes(column.key)) {
        pending.push(pendingEntry(name, column, index, row.number));
      }
    });
    const textLines = String(rowData.values.flexfield || '').split('\n').length;
    row.height = Math.max(rowHeight, textLines * textLineHeight);
    if (rowData.auto) {
      row.getCell(2).note = autoLineNote;
    }
  });
  fitColumnWidths(sheet, columns, rows);
  sheet.autoFilter = {from: {row: 1, column: 1}, to: {row: 1, column: columns.length}};
  return pending;
};

const legendRows = [
  ['Blanco', 'Datos listos para Oracle: los pone el sistema o son valores fijos. La nota de cada encabezado dice cuál.', null],
  ['Celeste', 'Lo llena Oracle al subir la factura (por ejemplo, la cuenta de pasivo), así que va en blanco y no se toca. En LINEAS, las filas celestes en cursiva son las líneas de impuesto y retención que Oracle crea al validar: están solo para revisar los montos.', kindStyles.oracle.cell],
  ['Lila', 'Nº de recibo que asignó el sistema, porque el gasto sin factura no tiene recibo original. Si lo tiene, va el número original, sin color.', systemReceiptFill],
  ['Rojo', 'Falta un dato que el sistema no tiene; lo que falta aparece como XXX o vacío (CUF, número de recibo, códigos de Oracle de la cuenta, número de rendición). Completar antes de subir.', pendingFill],
];

const legendColumns = [{key: 'a', width: 16}, {key: 'b', width: 14}, {key: 'c', width: 28}, {key: 'd', width: 84}];
const legendTitleSize = 14;

const todayText = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${now.getFullYear()}`;
};

const styleLegendCell = (cell, extra = {}) => {
  cell.font = {...baseFont, ...extra.font};
  cell.alignment = {vertical: 'middle', wrapText: true, ...extra.alignment};
  cell.border = cellBorder;
  if (extra.fill) {
    cell.fill = solidFill(extra.fill);
  }
};

const addLegendTitle = (sheet, rowNumber, text) => {
  sheet.mergeCells(rowNumber, 1, rowNumber, legendColumns.length);
  const cell = sheet.getCell(rowNumber, 1);
  cell.value = text;
  styleLegendCell(cell, {font: {bold: true}, fill: plainHeader});
  sheet.getRow(rowNumber).height = rowHeight + 4;
};

const addPendingRows = (sheet, startRow, pending) => {
  let rowNumber = startRow;
  if (pending.length === 0) {
    sheet.mergeCells(rowNumber, 1, rowNumber, legendColumns.length);
    const cell = sheet.getCell(rowNumber, 1);
    cell.value = 'No falta ningún dato: las hojas están listas para subir a Oracle.';
    styleLegendCell(cell, {font: {italic: true}});
    return;
  }
  ['Hoja', 'Celda', 'Columna', 'Qué falta'].forEach((text, index) => {
    styleLegendCell(sheet.getCell(rowNumber, index + 1), {font: {bold: true}, alignment: {horizontal: 'center'}});
    sheet.getCell(rowNumber, index + 1).value = text;
  });
  pending.forEach((entry) => {
    rowNumber += 1;
    const row = sheet.getRow(rowNumber);
    row.getCell(1).value = entry.sheet;
    row.getCell(2).value = {text: entry.cell, hyperlink: `#'${entry.sheet}'!${entry.cell}`};
    row.getCell(3).value = entry.column;
    row.getCell(4).value = entry.note;
    [1, 2, 3, 4].forEach((column) => styleLegendCell(row.getCell(column), {fill: pendingFill}));
    row.getCell(2).font = {...baseFont, underline: true, color: {argb: pendingFont}};
    row.getCell(2).alignment = {horizontal: 'center', vertical: 'middle'};
  });
};

const addLegendSheet = (workbook, {invoices, lines, pending}) => {
  const sheet = workbook.addWorksheet('LEYENDA ORACLE', {properties: {tabColor: {argb: legendTabColor}}});
  sheet.columns = legendColumns;
  sheet.mergeCells(1, 1, 1, legendColumns.length);
  const title = sheet.getCell(1, 1);
  title.value = 'Hojas para Oracle: FACTURAS y LINEAS';
  title.font = {...baseFont, size: legendTitleSize, bold: true};
  title.alignment = {vertical: 'middle'};
  sheet.getRow(1).height = 26;
  sheet.mergeCells(2, 1, 2, legendColumns.length);
  const summary = sheet.getCell(2, 1);
  summary.value = `Generado el ${todayText()}  ·  ${invoices} facturas  ·  ${lines} líneas  ·  ${pending.length} datos por completar`;
  summary.font = {...baseFont, color: {argb: 'FF595959'}};
  addLegendTitle(sheet, 4, 'Qué significa cada color');
  legendRows.forEach(([label, meaning, fill], index) => {
    const rowNumber = 5 + index;
    sheet.mergeCells(rowNumber, 2, rowNumber, legendColumns.length);
    sheet.getCell(rowNumber, 1).value = label;
    sheet.getCell(rowNumber, 2).value = meaning;
    styleLegendCell(sheet.getCell(rowNumber, 1), {font: {bold: true}, alignment: {horizontal: 'center'}, fill});
    styleLegendCell(sheet.getCell(rowNumber, 2), {fill});
    sheet.getRow(rowNumber).height = 30;
  });
  const pendingTitleRow = 5 + legendRows.length + 1;
  addLegendTitle(sheet, pendingTitleRow, 'Datos por completar antes de subir a Oracle (clic en la celda para ir)');
  addPendingRows(sheet, pendingTitleRow + 1, pending);
};

export function buildOracleRows(statements) {
  const invoices = [];
  const lines = [];
  statements.forEach(({trip, expenses}) => {
    expenses.forEach((expense) => {
      const invoice = buildOracleInvoice(trip, expense);
      invoices.push({values: invoice.values, missing: invoice.missing, marked: invoice.marked});
      const invoiceRow = invoices.length + 1;
      invoice.lines.forEach((line) => lines.push({...line, values: {...line.values, filaFactura: invoiceRow}}));
    });
  });
  return {invoices, lines};
}

export function addOracleSheets(workbook, statements) {
  const {invoices, lines} = buildOracleRows(statements);
  const ranges = addListRanges(workbook, listValues);
  const invoicePending = writeSheet(workbook, 'FACTURAS', invoiceColumns, invoices, ranges);
  const linePending = writeSheet(workbook, 'LINEAS', lineColumns, lines, ranges);
  addLegendSheet(workbook, {invoices: invoices.length, lines: lines.length, pending: [...invoicePending, ...linePending]});
}
