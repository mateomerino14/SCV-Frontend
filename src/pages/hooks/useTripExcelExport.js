import ExcelJS from 'exceljs';
import {extractOracleAccount} from '../../utils/oracleAccount';
import {toOracleExpenseType} from '../../utils/expenseTypeCode';
import buildTripCode from '../../utils/tripCode';
import {formatQuantity} from '../../utils/formatQuantity';
import {oracleAccounts} from '../../constants/oracleAccounts';
import {MAXAM_LOGO} from '../../constants';
import {getExpenseTaxValues} from '../../utils/expenseTaxValues';
import {addOracleSheets} from '../../utils/oracleExport';
import {resolveDocumentNumber, documentSources, systemReceiptNote} from '../../utils/documentNumber';
import {addListRange} from '../../utils/excelLists';
import {saveWorkbook} from '../../utils/excelExport';
import {amountInBsOf, originalAmountLinesOf, summarizeStatement, hasOriginCurrencyLines} from '../../utils/expenseCurrency';

const headerFill = 'FF4A90D9';
const headerFont = 'FFFFFFFF';
const infoFill = 'FFEAF3FB';

const infoLabelColor = 'FF1A5276';
const nationalRowFill = 'FFF4F9FD';
const internationalRowFill = 'FFFDEEEE';
const totalsFill = 'FFBFE0F5';
const thinBorderColor = 'FFB0C4D4';
const thickBorderColor = 'FF1B4F91';
const totalsLabelEndCol = 3;
const reimburseFont = 'FF9C0006';
const originalLineHeight = 14;
const systemReceiptFill = 'FFE4DFEC';
const systemReceiptLegend = 'N° DOCUMENTO en lila: número de recibo que asignó el sistema, porque el gasto no tiene recibo original. Sin color: número de la factura o del recibo original.';
const footerText = '&L&8Sistema de Control de Viáticos&R&8Página &P de &N';

const thinBorder = {
  top: {style: 'thin', color: {argb: thinBorderColor}},
  bottom: {style: 'thin', color: {argb: thinBorderColor}},
  left: {style: 'thin', color: {argb: thinBorderColor}},
  right: {style: 'thin', color: {argb: thinBorderColor}},
};

function cleanValue(value) {
  if (value === 'No Especificado') {
    return '';
  }
  return value || '';
}

function quantityText(quantity) {
  if (!quantity) {
    return '';
  }
  return ` x${formatQuantity(quantity)}`;
}

const symbologyRows = [
  ['F', 'Compra Bien/Servicio c/factura'],
  ['C', 'Compra de Bien sin factura'],
  ['A', 'Servicio, Alquiler sin factura'],
  ['R', 'Docto. sin IVA, sin Retencion'],
];

function getExpenseDescription(expense) {
  const hasInvoice = !!expense.Factura;
  if (hasInvoice) {
    const products = (expense.Factura?.Detalle_Factura || [])
      .map((detail) => `${cleanValue(detail.nombre_producto)}${quantityText(detail.cantidad)}`)
      .join(', ');
    return (products || expense.descripcion || `Factura N° ${cleanValue(expense.Factura?.numero_factura)}`).toUpperCase();
  }
  const subitems = expense.Gasto_Subitem || [];
  if (subitems.length > 0) {
    let lineCurrency = '';
    if (hasOriginCurrencyLines(expense)) {
      lineCurrency = ` ${expense.moneda}`;
    }
    return subitems.map((subitem) => `${subitem.descripcion}: ${parseFloat(subitem.monto).toFixed(2)}${lineCurrency}`).join(', ').toUpperCase();
  }
  return (expense.descripcion || expense.Categoria_Gasto?.nombre || '').toUpperCase();
}

function buildOracleAccountOptions(expenses) {
  const names = new Set(oracleAccounts);
  expenses.forEach((expense) => {
    if (expense.Categoria_Gasto?.nombre) {
      names.add(expense.Categoria_Gasto.nombre);
    }
  });
  return Array.from(names).sort();
}

function originalRowHeight(expense) {
  return originalAmountLinesOf(expense).length * originalLineHeight;
}

function estimateRowHeight(entries) {
  let maxLines = 1;
  entries.forEach(([text, width]) => {
    if (!text) {
      return;
    }
    const charsPerLine = Math.max(width * 1.7, 10);
    const lines = Math.ceil(text.length / charsPerLine);
    if (lines > maxLines) {
      maxLines = lines;
    }
  });
  return Math.max(20, maxLines * 14);
}

function formatJustificationDate(value) {
  const [year, month, day] = String(value).split('-');
  if (!year || !month || !day) {
    return value;
  }
  return `${day}/${month}/${year}`;
}

async function fetchImageAsBase64(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  catch {
    return null;
  }
}

function applyOuterBorder(sheet, startRow, endRow, startCol, endCol) {
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      const cell = sheet.getCell(r, c);
      const border = {...cell.border};
      if (r === startRow) {
        border.top = {style: 'medium', color: {argb: thickBorderColor}};
      }
      if (r === endRow) {
        border.bottom = {style: 'medium', color: {argb: thickBorderColor}};
      }
      if (c === startCol) {
        border.left = {style: 'medium', color: {argb: thickBorderColor}};
      }
      if (c === endCol) {
        border.right = {style: 'medium', color: {argb: thickBorderColor}};
      }
      cell.border = border;
    }
  }
}

function styleInfoLabel(cell, value) {
  cell.value = value;
  cell.font = {bold: true, size: 9, color: {argb: infoLabelColor}};
  cell.alignment = {horizontal: 'left', vertical: 'middle', wrapText: true};
  cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: infoFill}};
  cell.border = thinBorder;
}

function styleInfoValue(cell, value) {
  cell.value = value;
  cell.font = {size: 9};
  cell.alignment = {horizontal: 'left', vertical: 'middle', wrapText: true};
  cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: infoFill}};
  cell.border = thinBorder;
}

let logoPromise = null;

function getLogoBase64() {
  if (!logoPromise) {
    logoPromise = fetchImageAsBase64(MAXAM_LOGO);
  }
  return logoPromise;
}

async function addStatementSheet(workbook, trip, expenses, dayJustifications = [], sheetName = 'RENDICION') {
  const sheet = workbook.addWorksheet(sheetName);
  const isInternationalTrip = trip.tipo === 'Internacional';
  const col = {number: 1, date: 2, oracle: 3, detail: 4, type: 5, document: 6, nit: 7, invoiceAmount: 8, original: null, amount: 9};
  if (isInternationalTrip) {
    col.original = 9;
    col.amount = 10;
  }
  col.vat = col.amount + 1;
  col.rcIva = col.amount + 2;
  col.iue = col.amount + 3;
  col.it = col.amount + 4;
  col.cost = col.amount + 5;
  const totalCols = col.cost;
  const columnWidths = [5, 12, 22, 42, 9, 14, 13, 15];
  if (isInternationalTrip) {
    columnWidths.push(30);
  }
  columnWidths.push(14, 10, 10, 10, 10, 16);
  sheet.columns = columnWidths.map((width) => ({width}));
  sheet.properties.tabColor = {argb: headerFill};
  sheet.pageSetup = {orientation: 'landscape', paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0, horizontalCentered: true, margins: {left: 0.3, right: 0.3, top: 0.4, bottom: 0.5, header: 0.2, footer: 0.2}};
  sheet.headerFooter = {oddFooter: footerText};
  const logoStartCol = 0;
  const infoStartCol = 4;
  const infoEndCol = col.amount;
  const symbologyStartCol = col.amount + 1;
  const logoBase64 = await getLogoBase64();
  if (logoBase64) {
    let extension = 'png';
    if (/data:image\/jpeg;/.test(logoBase64)) {
      extension = 'jpeg';
    }
    const imageId = workbook.addImage({base64: logoBase64, extension});
    sheet.addImage(imageId, {tl: {col: logoStartCol, row: 0}, br: {col: infoStartCol - 1, row: 5}, editAsOneCell: true});
  }
  sheet.mergeCells(1, infoStartCol, 1, infoEndCol);
  const titleCell = sheet.getCell(1, infoStartCol);
  titleCell.value = 'PLANILLA DE RENDICION DE CUENTAS';
  titleCell.font = {bold: true, size: 14, color: {argb: headerFont}};
  titleCell.alignment = {horizontal: 'center', vertical: 'middle'};
  titleCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: headerFill}};
  sheet.mergeCells(1, symbologyStartCol, 1, totalCols);
  const symbologyHeaderCell = sheet.getCell(1, symbologyStartCol);
  symbologyHeaderCell.value = 'SIMBOLOGIA';
  symbologyHeaderCell.font = {bold: true, size: 10, color: {argb: headerFont}};
  symbologyHeaderCell.alignment = {horizontal: 'center', vertical: 'middle'};
  symbologyHeaderCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: headerFill}};
  sheet.getRow(1).height = 28;
  symbologyRows.forEach(([symbol, description], index) => {
    const row = 2 + index;
    const symbolCell = sheet.getCell(row, symbologyStartCol);
    symbolCell.value = symbol;
    symbolCell.font = {bold: true, size: 9};
    symbolCell.alignment = {horizontal: 'center', vertical: 'middle'};
    symbolCell.border = thinBorder;
    sheet.mergeCells(row, symbologyStartCol + 1, row, totalCols);
    const descCell = sheet.getCell(row, symbologyStartCol + 1);
    descCell.value = description;
    descCell.font = {size: 8};
    descCell.alignment = {horizontal: 'left', vertical: 'middle'};
    descCell.border = thinBorder;
  });
  applyOuterBorder(sheet, 1, 5, symbologyStartCol, totalCols);
  sheet.getRow(2).height = 18;
  let nationalLegendEnd = infoEndCol;
  if (isInternationalTrip) {
    nationalLegendEnd = infoStartCol + 2;
  }
  sheet.mergeCells(2, infoStartCol, 2, nationalLegendEnd);
  const nationalLegendCell = sheet.getCell(2, infoStartCol);
  nationalLegendCell.value = 'Gasto Nacional (Bs)';
  nationalLegendCell.font = {size: 8};
  nationalLegendCell.alignment = {horizontal: 'center', vertical: 'middle'};
  nationalLegendCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: nationalRowFill}};
  nationalLegendCell.border = thinBorder;
  if (isInternationalTrip) {
    sheet.mergeCells(2, infoStartCol + 3, 2, infoEndCol);
    const internationalLegendCell = sheet.getCell(2, infoStartCol + 3);
    internationalLegendCell.value = 'Gasto Internacional (en Bs con su T/C)';
    internationalLegendCell.font = {size: 8};
    internationalLegendCell.alignment = {horizontal: 'center', vertical: 'middle'};
    internationalLegendCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: internationalRowFill}};
    internationalLegendCell.border = thinBorder;
  }
  sheet.mergeCells(3, infoStartCol, 3, infoStartCol + 1);
  styleInfoLabel(sheet.getCell(3, infoStartCol), 'RESPONSABLE:');
  sheet.mergeCells(3, infoStartCol + 2, 3, infoStartCol + 3);
  styleInfoValue(sheet.getCell(3, infoStartCol + 2), `${trip.Usuario?.nombre || ''} ${trip.Usuario?.apellido_paterno || ''}`.trim().toUpperCase());
  sheet.mergeCells(3, infoStartCol + 4, 3, infoStartCol + 4);
  styleInfoLabel(sheet.getCell(3, infoStartCol + 4), 'CARGO:');
  sheet.mergeCells(3, infoStartCol + 5, 3, infoEndCol);
  styleInfoValue(sheet.getCell(3, infoStartCol + 5), trip.Usuario?.Cargo?.nombre?.toUpperCase() || '');
  sheet.getRow(3).height = 18;
  sheet.mergeCells(4, infoStartCol, 4, infoStartCol + 1);
  styleInfoLabel(sheet.getCell(4, infoStartCol), 'MEMORANDUM:');
  sheet.mergeCells(4, infoStartCol + 2, 4, infoStartCol + 3);
  styleInfoValue(sheet.getCell(4, infoStartCol + 2), buildTripCode(trip));
  sheet.mergeCells(4, infoStartCol + 4, 4, infoStartCol + 4);
  styleInfoLabel(sheet.getCell(4, infoStartCol + 4), 'FECHA:');
  sheet.mergeCells(4, infoStartCol + 5, 4, infoEndCol);
  const dateCell = sheet.getCell(4, infoStartCol + 5);
  dateCell.value = new Date(trip.fecha_inicio);
  dateCell.numFmt = 'dd/mm/yyyy';
  dateCell.font = {size: 9};
  dateCell.alignment = {horizontal: 'left', vertical: 'middle'};
  dateCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: infoFill}};
  dateCell.border = thinBorder;
  sheet.getRow(4).height = 18;
  sheet.mergeCells(5, infoStartCol, 5, infoStartCol + 1);
  styleInfoLabel(sheet.getCell(5, infoStartCol), 'MOTIVO:');
  sheet.mergeCells(5, infoStartCol + 2, 5, infoStartCol + 3);
  styleInfoValue(sheet.getCell(5, infoStartCol + 2), trip.motivo?.toUpperCase() || '');
  sheet.mergeCells(5, infoStartCol + 4, 5, infoStartCol + 4);
  styleInfoLabel(sheet.getCell(5, infoStartCol + 4), 'DEP./SECCIÓN:');
  sheet.mergeCells(5, infoStartCol + 5, 5, infoEndCol);
  styleInfoValue(sheet.getCell(5, infoStartCol + 5), trip.Usuario?.Seccion?.nombre || '');
  sheet.getRow(5).height = Math.max(22, Math.ceil((trip.motivo || '').length / 40) * 12);
  applyOuterBorder(sheet, 3, 5, infoStartCol, infoEndCol);
  const headers = ['N°', 'FECHA', 'CUENTA/ORACLE', 'D E T A L L E', 'TIPO GASTO', 'N° DOCUMENTO', 'NIT', 'IMPORTE FACT./REC.'];
  if (isInternationalTrip) {
    headers.push('MONTO ORIGINAL');
  }
  headers.push('IMPORTE Bs.');
  headers.push('I.V.A.', 'RC-IVA', 'IUE', 'IT', 'IMPORTE COSTO/ GASTO');
  const headerRowNumber = 7;
  const headerRow = sheet.getRow(headerRowNumber);
  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = header;
    cell.font = {bold: true, size: 9, color: {argb: headerFont}};
    cell.alignment = {horizontal: 'center', vertical: 'middle', wrapText: true};
    cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: headerFill}};
    cell.border = thinBorder;
  });
  headerRow.height = 32;
  const oracleOptions = buildOracleAccountOptions(expenses);
  const oracleFormula = addListRange(workbook, oracleOptions);
  let currentRow = 8;
  let totalImporteFactura = 0;
  let totalImporteBs = 0;
  let totalVat = 0;
  let totalRcIva = 0;
  let totalIue = 0;
  let totalIt = 0;
  let totalCostBs = 0;
  expenses.forEach((expense, index) => {
    const oracleType = toOracleExpenseType(expense.tipo);
    const amount = parseFloat(expense.monto_total) || 0;
    const isInternational = !!expense.es_gasto_internacional;
    const hasInvoice = !!expense.Factura;
    const {vat, rcIva, iue, it, cost} = getExpenseTaxValues(expense);
    const amountBs = amountInBsOf(expense);
    let rowFill = nationalRowFill;
    if (isInternational) {
      rowFill = internationalRowFill;
    }
    let shownAmount = amountBs;
    let shownCost = cost;
    let amountFormat = '#,##0.00';
    if (isInternational) {
      shownCost = amountBs;
    }
    if (amountBs === null) {
      shownAmount = amount;
      shownCost = amount;
      amountFormat = '#,##0.00" USD"';
    }
    const row = sheet.getRow(currentRow);
    row.getCell(col.number).value = index + 1;
    row.getCell(col.date).value = new Date(expense.Factura?.fecha_emision || expense.fecha_gasto);
    row.getCell(col.date).numFmt = 'dd/mm/yyyy';
    const oracleValue = extractOracleAccount(expense.Categoria_Gasto?.nombre);
    const oracleCell = row.getCell(col.oracle);
    oracleCell.value = oracleValue;
    oracleCell.dataValidation = {type: 'list', allowBlank: true, formulae: [oracleFormula]};
    oracleCell.alignment = {wrapText: true, vertical: 'middle', horizontal: 'center'};
    const detailText = getExpenseDescription(expense);
    row.getCell(col.detail).value = detailText;
    row.getCell(col.detail).alignment = {wrapText: true, vertical: 'middle', horizontal: 'left'};
    row.getCell(col.type).value = oracleType;
    const documentInfo = resolveDocumentNumber(expense, trip.Recibo);
    row.getCell(col.document).value = documentInfo.number;
    row.getCell(col.nit).value = cleanValue(expense.Proveedor?.numero_doc_fiscal);
    if (hasInvoice) {
      row.getCell(col.invoiceAmount).value = amount;
      row.getCell(col.invoiceAmount).numFmt = '#,##0.00';
      totalImporteFactura += amount;
    }
    const heightEntries = [
      [oracleValue, sheet.getColumn(col.oracle).width],
      [detailText, sheet.getColumn(col.detail).width],
    ];
    if (col.original) {
      const originalLines = originalAmountLinesOf(expense);
      row.getCell(col.original).value = originalLines.join('\n');
      row.getCell(col.original).alignment = {wrapText: true, vertical: 'middle', horizontal: 'center'};
      originalLines.forEach((line) => heightEntries.push([line, sheet.getColumn(col.original).width]));
    }
    [[col.amount, shownAmount], [col.vat, vat], [col.rcIva, rcIva], [col.iue, iue], [col.it, it], [col.cost, shownCost]].forEach(([column, value]) => {
      row.getCell(column).value = value;
      row.getCell(column).numFmt = '#,##0.00';
    });
    row.getCell(col.amount).numFmt = amountFormat;
    row.getCell(col.cost).numFmt = amountFormat;
    for (let column = 1; column <= totalCols; column++) {
      const cell = row.getCell(column);
      cell.border = thinBorder;
      cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: rowFill}};
      cell.font = {...(cell.font || {}), size: 9};
      if (column !== col.detail && column !== col.original) {
        cell.alignment = {...(cell.alignment || {}), horizontal: 'center', vertical: 'middle'};
      }
    }
    if (documentInfo.source === documentSources.system) {
      row.getCell(col.document).fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: systemReceiptFill}};
      row.getCell(col.document).note = systemReceiptNote;
    }
    row.height = Math.max(estimateRowHeight(heightEntries), originalRowHeight(expense));
    if (amountBs !== null) {
      totalImporteBs += shownAmount;
      totalCostBs += shownCost;
    }
    totalVat += vat;
    totalRcIva += rcIva;
    totalIue += iue;
    totalIt += it;
    currentRow += 1;
  });

  const totalsRowNumber = currentRow;
  const totalsRow = sheet.getRow(totalsRowNumber);
  sheet.mergeCells(totalsRowNumber, 1, totalsRowNumber, totalsLabelEndCol);
  totalsRow.getCell(1).value = 'Sumas Totales (Bs)';
  totalsRow.getCell(1).font = {bold: true, size: 9};
  totalsRow.getCell(col.invoiceAmount).value = totalImporteFactura;
  totalsRow.getCell(col.amount).value = totalImporteBs;
  totalsRow.getCell(col.vat).value = totalVat;
  totalsRow.getCell(col.rcIva).value = totalRcIva;
  totalsRow.getCell(col.iue).value = totalIue;
  totalsRow.getCell(col.it).value = totalIt;
  totalsRow.getCell(col.cost).value = totalCostBs;
  for (let column = 1; column <= totalCols; column++) {
    const cell = totalsRow.getCell(column);
    cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: totalsFill}};
    cell.border = thinBorder;
    cell.font = {bold: true, size: 9};
    cell.alignment = {horizontal: 'center', vertical: 'middle'};
    if (column === 1) {
      cell.alignment = {horizontal: 'left', vertical: 'middle'};
    }
    if (column === col.invoiceAmount || column >= col.amount) {
      cell.numFmt = '#,##0.00';
    }
  }
  totalsRow.height = 20;
  let lastTableRow = totalsRowNumber;
  currentRow += 1;
  const {internationalUsd, balanceRows} = summarizeStatement(trip, expenses);
  if (isInternationalTrip) {
    const totalsUsdRow = sheet.getRow(currentRow);
    sheet.mergeCells(currentRow, 1, currentRow, col.original);
    totalsUsdRow.getCell(1).value = 'Gastos internacionales en USD, para Oracle';
    totalsUsdRow.getCell(col.amount).value = internationalUsd;
    for (let column = 1; column <= totalCols; column++) {
      const cell = totalsUsdRow.getCell(column);
      cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: internationalRowFill}};
      cell.border = thinBorder;
      cell.font = {bold: true, size: 9};
      cell.alignment = {horizontal: 'center', vertical: 'middle'};
      if (column === 1) {
        cell.alignment = {horizontal: 'left', vertical: 'middle'};
      }
    }
    totalsUsdRow.getCell(col.amount).numFmt = '#,##0.00" USD"';
    totalsUsdRow.height = 20;
    lastTableRow = currentRow;
    currentRow += 1;
  }
  applyOuterBorder(sheet, headerRowNumber, lastTableRow, 1, totalCols);
  const legendCell = sheet.getCell(currentRow, col.document);
  legendCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: systemReceiptFill}};
  legendCell.border = thinBorder;
  sheet.mergeCells(currentRow, col.document + 1, currentRow, totalCols);
  const legendTextCell = sheet.getCell(currentRow, col.document + 1);
  legendTextCell.value = systemReceiptLegend;
  legendTextCell.font = {italic: true, size: 8};
  legendTextCell.alignment = {horizontal: 'left', vertical: 'middle', wrapText: true};
  sheet.getRow(currentRow).height = 24;
  currentRow += 2;
  const balanceHeaderRow = currentRow;
  const balanceBlocks = [{startCol: 1, endCol: 5, text: 'CONC.'}, {startCol: 6, endCol: 7, text: 'Bs'}];
  if (isInternationalTrip) {
    balanceBlocks.push({startCol: 8, endCol: 9, text: 'USD'});
  }
  const balanceEndCol = balanceBlocks[balanceBlocks.length - 1].endCol;
  balanceBlocks.forEach(({startCol, endCol, text}, index) => {
    sheet.mergeCells(balanceHeaderRow, startCol, balanceHeaderRow, endCol);
    const cell = sheet.getCell(balanceHeaderRow, startCol);
    cell.value = text;
    cell.font = {bold: true, size: 9, color: {argb: headerFont}};
    cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: headerFill}};
    cell.alignment = {horizontal: 'center', vertical: 'middle'};
    if (index === 0) {
      cell.alignment = {horizontal: 'left', vertical: 'middle'};
    }
    cell.border = thinBorder;
  });
  currentRow += 1;
  const reimburseLabel = balanceRows[balanceRows.length - 1][0];
  balanceRows.forEach(([label, bsValue, usdValue]) => {
    const values = [label, bsValue, usdValue];
    balanceBlocks.forEach(({startCol, endCol}, index) => {
      sheet.mergeCells(currentRow, startCol, currentRow, endCol);
      const cell = sheet.getCell(currentRow, startCol);
      cell.value = values[index];
      cell.font = {size: 9};
      cell.alignment = {horizontal: 'center', vertical: 'middle'};
      cell.border = thinBorder;
      if (index === 0) {
        cell.font = {bold: true, size: 9};
        cell.alignment = {horizontal: 'left', vertical: 'middle'};
      }
      else {
        cell.numFmt = '#,##0.00';
      }
      if (label === reimburseLabel && index > 0 && values[index] > 0) {
        cell.font = {bold: true, size: 9, color: {argb: reimburseFont}};
      }
    });
    sheet.getRow(currentRow).height = 18;
    currentRow += 1;
  });
  applyOuterBorder(sheet, balanceHeaderRow, currentRow - 1, 1, balanceEndCol);
  currentRow += 1;
  if (dayJustifications.length > 0) {
    const justificationDateEnd = 2;
    const justificationTextStart = 3;
    const justificationHeaderRow = currentRow;
    sheet.mergeCells(currentRow, 1, currentRow, totalCols);
    const sectionTitleCell = sheet.getCell(currentRow, 1);
    sectionTitleCell.value = 'JUSTIFICACIONES DE EXCESOS';
    sectionTitleCell.font = {bold: true, size: 10, color: {argb: headerFont}};
    sectionTitleCell.alignment = {horizontal: 'left', vertical: 'middle'};
    sectionTitleCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: headerFill}};
    sheet.getRow(currentRow).height = 20;
    currentRow += 1;
    sheet.mergeCells(currentRow, 1, currentRow, justificationDateEnd);
    sheet.mergeCells(currentRow, justificationTextStart, currentRow, totalCols);
    [[1, 'FECHA'], [justificationTextStart, 'JUSTIFICACIÓN']].forEach(([column, text]) => {
      const cell = sheet.getCell(currentRow, column);
      cell.value = text;
      cell.font = {bold: true, size: 9, color: {argb: infoLabelColor}};
      cell.alignment = {horizontal: 'left', vertical: 'middle'};
      if (column === 1) {
        cell.alignment = {horizontal: 'center', vertical: 'middle'};
      }
      cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: infoFill}};
      cell.border = thinBorder;
    });
    currentRow += 1;
    dayJustifications.forEach((item) => {
      sheet.mergeCells(currentRow, 1, currentRow, justificationDateEnd);
      sheet.mergeCells(currentRow, justificationTextStart, currentRow, totalCols);
      const dateCell = sheet.getCell(currentRow, 1);
      dateCell.value = 'Hoteles';
      if (item.fecha) {
        dateCell.value = formatJustificationDate(item.fecha);
      }
      dateCell.font = {bold: true, size: 9};
      dateCell.alignment = {horizontal: 'center', vertical: 'middle'};
      dateCell.border = thinBorder;
      const textCell = sheet.getCell(currentRow, justificationTextStart);
      textCell.value = item.descripcion;
      textCell.font = {size: 9};
      textCell.alignment = {horizontal: 'left', vertical: 'middle', wrapText: true};
      textCell.border = thinBorder;
      const textWidth = sheet.columns.slice(justificationTextStart - 1).reduce((sum, column) => sum + (column.width || 10), 0);
      sheet.getRow(currentRow).height = estimateRowHeight([[item.descripcion, textWidth]]);
      currentRow += 1;
    });
    applyOuterBorder(sheet, justificationHeaderRow, currentRow - 1, 1, totalCols);
  }
  const signatureBlocks = [
    {startCol: 1, endCol: 3, label: 'Preparado por', role: 'Responsable'},
    {startCol: 4, endCol: 6, label: 'Vo/ Bo', role: 'Jefe de Area'},
    {startCol: 7, endCol: 9, label: 'Vo/ Bo', role: 'Gerente de Area'},
    {startCol: 10, endCol: 11, label: 'Verificado por', role: 'Contabilidad'},
    {startCol: 12, endCol: totalCols, label: 'Aprobado por', role: 'Gerencia Administrativa'},
  ];
  currentRow += 6;
  const lineRow = currentRow;
  signatureBlocks.forEach(({startCol, endCol}) => {
    sheet.mergeCells(lineRow, startCol, lineRow, endCol);
    const cell = sheet.getCell(lineRow, startCol);
    cell.value = '……………………..……………..……..';
    cell.alignment = {horizontal: 'center', vertical: 'middle'};
  });
  currentRow += 1;
  const labelRow = currentRow;
  signatureBlocks.forEach(({startCol, endCol, label}) => {
    sheet.mergeCells(labelRow, startCol, labelRow, endCol);
    const cell = sheet.getCell(labelRow, startCol);
    cell.value = label;
    cell.font = {bold: true, size: 9};
    cell.alignment = {horizontal: 'center', vertical: 'middle'};
  });
  currentRow += 1;
  const roleRow = currentRow;
  signatureBlocks.forEach(({startCol, endCol, role}) => {
    sheet.mergeCells(roleRow, startCol, roleRow, endCol);
    const cell = sheet.getCell(roleRow, startCol);
    cell.value = role;
    cell.font = {size: 8};
    cell.alignment = {horizontal: 'center', vertical: 'middle'};
  });
}

const fileSafeText = (text) => String(text || 'viaje').replace(/\s+/g, '_').replace(/[^\w-]/g, '').slice(0, 60);

function useTripExcelExport() {
  const exportToExcel = async (trip, expenses, dayJustifications = []) => {
    const workbook = new ExcelJS.Workbook();
    await addStatementSheet(workbook, trip, expenses, dayJustifications);
    addOracleSheets(workbook, [{trip, expenses}]);
    await saveWorkbook(workbook, `RENDICION_${trip.id_viaje}_${fileSafeText(trip.motivo)}.xlsx`);
  };
  return {exportToExcel};
}

export {addStatementSheet};
export default useTripExcelExport;
