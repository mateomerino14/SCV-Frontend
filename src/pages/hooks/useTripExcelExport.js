import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import {extractOracleAccount} from '../../utils/oracleAccount';
import {toOracleExpenseType} from '../../utils/expenseTypeCode';
import {MAXAM_LOGO} from '../../constants';

const vatRate = 0.13;
const headerFill = 'FF4A90D9';
const headerFont = 'FFFFFFFF';
const infoFill = 'FFEAF3FB';
const infoLabelColor = 'FF1A5276';
const nationalRowFill = 'FFF4F9FD';
const internationalRowFill = 'FFFDEEEE';
const totalsFill = 'FFBFE0F5';
const thinBorderColor = 'FFB0C4D4';
const thickBorderColor = 'FF1B4F91';

const thinBorder = {
  top: {style: 'thin', color: {argb: thinBorderColor}},
  bottom: {style: 'thin', color: {argb: thinBorderColor}},
  left: {style: 'thin', color: {argb: thinBorderColor}},
  right: {style: 'thin', color: {argb: thinBorderColor}},
};

const oracleAccounts = [
  '626000 BILLETES (VIAJE)',
  '626010 TAXIS (VIAJE)',
  '626020 COCHE PROPIO-KMS (VIAJE)',
  '626030 HOTELES (VIAJE)',
  '626040 MANUTENCION (VIAJE)',
  '626050 VEHICULOS DE ALQUILER (VIAJE)',
  '626060 PEAJE AUTOPISTAS (VIAJE)',
  '626070 APARCAMIENTO Y OTROS GASTOS (VIAJE)',
  '626100 REUN.SINDIC.MANUTENCION/AT.TERCEROS (VIAJE)',
  'OTROS',
];


const symbologyRows = [
  ['F', 'Compra Bien/Servicio c/factura'],
  ['C', 'Compra de Bien sin factura'],
  ['A', 'Servicio, Alquiler sin factura'],
  ['R', 'Docto. sin IVA, sin Retencion'],
];

function getExpenseTaxValues(expense) {
  const isInternational = !!expense.es_gasto_internacional;
  const amount = parseFloat(expense.monto_total) || 0;
  const hasInvoice = !!expense.Factura;
  if (isInternational) {
    return {vat: 0, rcIva: 0, iue: 0, it: 0, cost: amount};
  }
  if (hasInvoice) {
    const partial = parseFloat(expense.Factura?.monto_parcial || 0);
    const vat = parseFloat((partial * vatRate).toFixed(2));
    return {vat, rcIva: 0, iue: 0, it: 0, cost: amount};
  }
  return {
    vat: 0,
    rcIva: parseFloat(expense.retencion_rc_iva || 0),
    iue: parseFloat(expense.retencion_iue || 0),
    it: parseFloat(expense.retencion_it || 0),
    cost: parseFloat(expense.importe_costo || amount),
  };
}

function getExpenseDescription(expense) {
  const hasInvoice = !!expense.Factura;
  if (hasInvoice) {
    const products = (expense.Factura?.Detalle_Factura || [])
      .map((detail) => `${detail.nombre_producto}${detail.cantidad ? ` x${detail.cantidad}` : ''}`)
      .join(', ');
    return (products || expense.descripcion || `Factura N° ${expense.Factura?.numero_factura || ''}`).toUpperCase();
  }
  const subitems = expense.Gasto_Subitem || [];
  if (subitems.length > 0) {
    return subitems.map((subitem) => `${subitem.descripcion}: ${parseFloat(subitem.monto).toFixed(2)}`).join(', ').toUpperCase();
  }
  return (expense.descripcion || expense.Categoria_Gasto?.nombre || '').toUpperCase();
}

function buildTramosText(expense) {
  const installments = expense.Gasto_Tramo_Moneda || [];
  if (installments.length === 0) {
    return '';
  }
  return installments.map((installment) => `${parseFloat(installment.monto_origen).toFixed(2)} ${installment.moneda} → ${parseFloat(installment.monto_usd).toFixed(2)} USD`).join(' | ');
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

function useTripExcelExport() {
  const exportToExcel = async (trip, expenses, justificationText) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('RENDICION');
    const totalCols = 15;
    sheet.columns = [
      {width: 5}, {width: 12}, {width: 10}, {width: 26}, {width: 30},
      {width: 14}, {width: 13}, {width: 15}, {width: 24},
      {width: 14}, {width: 9}, {width: 9}, {width: 9}, {width: 9}, {width: 16},
    ];
    const logoStartCol = 0;
    const infoStartCol = 4;
    const infoEndCol = 10;
    const symbologyStartCol = 11;
    const logoBase64 = await fetchImageAsBase64(MAXAM_LOGO);
    if (logoBase64) {
      const extensionMatch = logoBase64.match(/data:image\/(png|jpeg);/);
      const extension = extensionMatch ? extensionMatch[1] : 'png';
      const imageId = workbook.addImage({base64: logoBase64, extension: extension === 'jpeg' ? 'jpeg' : 'png'});
      sheet.addImage(imageId, {tl: {col: logoStartCol, row: 0}, br: {col: infoStartCol - 1, row: 5}, editAsOneCell: true});
    }
    sheet.mergeCells(1, infoStartCol, 1, infoEndCol);
    const titleCell = sheet.getCell(1, infoStartCol);
    titleCell.value = 'PLANILLA DE RENDICION DE CUENTAS';
    titleCell.font = {bold: true, size: 13, color: {argb: headerFont}};
    titleCell.alignment = {horizontal: 'center', vertical: 'middle'};
    titleCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: headerFill}};
    sheet.mergeCells(1, symbologyStartCol, 1, totalCols);
    const symbologyHeaderCell = sheet.getCell(1, symbologyStartCol);
    symbologyHeaderCell.value = 'SIMBOLOGIA';
    symbologyHeaderCell.font = {bold: true, size: 10, color: {argb: headerFont}};
    symbologyHeaderCell.alignment = {horizontal: 'center', vertical: 'middle'};
    symbologyHeaderCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: headerFill}};
    sheet.getRow(1).height = 24;
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
    sheet.mergeCells(2, infoStartCol, 2, infoStartCol + 2);
    const nationalLegendCell = sheet.getCell(2, infoStartCol);
    nationalLegendCell.value = 'Gasto Nacional (Bs)';
    nationalLegendCell.font = {size: 8};
    nationalLegendCell.alignment = {horizontal: 'center', vertical: 'middle'};
    nationalLegendCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: nationalRowFill}};
    nationalLegendCell.border = thinBorder;
    sheet.mergeCells(2, infoStartCol + 3, 2, infoEndCol);
    const internationalLegendCell = sheet.getCell(2, infoStartCol + 3);
    internationalLegendCell.value = 'Gasto Internacional (USD) — T/C al registrar';
    internationalLegendCell.font = {size: 8};
    internationalLegendCell.alignment = {horizontal: 'center', vertical: 'middle'};
    internationalLegendCell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: internationalRowFill}};
    internationalLegendCell.border = thinBorder;
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
    styleInfoValue(sheet.getCell(4, infoStartCol + 2), `V-${trip.id_viaje}`);
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
    styleInfoValue(sheet.getCell(5, infoStartCol + 5), `${trip.Usuario?.numero_dependencia || ''} / ${trip.Usuario?.numero_seccion || ''}`);
    sheet.getRow(5).height = 22;
    applyOuterBorder(sheet, 3, 5, infoStartCol, infoEndCol);
    const headers = ['N°', 'FECHA', 'CUENTA/ORACLE', 'D E T A L L E', 'TIPO GASTO', 'N° DOCUMENTO', 'NIT', 'IMPORTE FACT./REC.', 'TRAMOS DE CAMBIO', 'IMPORTE Bs./USD', 'I.V.A.', 'RC-IVA', 'IUE', 'IT', 'IMPORTE COSTO/ GASTO'];
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
    const listSheet = workbook.addWorksheet('Listas', {state: 'veryHidden'});
    oracleOptions.forEach((option, i) => {
      listSheet.getCell(i + 1, 1).value = option;
    });
    const oracleFormula = `Listas!$A$1:$A$${oracleOptions.length}`;
    let currentRow = 8;
    let totalImporteFactura = 0;
    let totalImporteBs = 0;
    let totalImporteUsd = 0;
    let totalVat = 0;
    let totalRcIva = 0;
    let totalIue = 0;
    let totalIt = 0;
    let totalCostBs = 0;
    let totalCostUsd = 0;
    expenses.forEach((expense, index) => {
      const oracleType = toOracleExpenseType(expense.tipo);
      const amount = parseFloat(expense.monto_total) || 0;
      const isInternational = !!expense.es_gasto_internacional;
      const hasInvoice = !!expense.Factura;
      const {vat, rcIva, iue, it, cost} = getExpenseTaxValues(expense);
      const rowFill = isInternational ? internationalRowFill : nationalRowFill;
      const currencySuffix = isInternational ? '" USD"' : '" Bs"';
      const row = sheet.getRow(currentRow);
      row.getCell(1).value = index + 1;
      row.getCell(2).value = new Date(expense.Factura?.fecha_emision || expense.fecha_gasto);
      row.getCell(2).numFmt = 'dd/mm/yyyy';
      const oracleValue = extractOracleAccount(expense.Categoria_Gasto?.nombre);
      const oracleCell = row.getCell(3);
      oracleCell.value = oracleValue;
      oracleCell.dataValidation = {type: 'list', allowBlank: true, formulae: [oracleFormula]};
      oracleCell.alignment = {wrapText: true, vertical: 'middle', horizontal: 'center'};
      const detailText = getExpenseDescription(expense);
      row.getCell(4).value = detailText;
      row.getCell(4).alignment = {wrapText: true, vertical: 'middle', horizontal: 'left'};
      row.getCell(5).value = oracleType;
      row.getCell(6).value = expense.Factura?.numero_factura || '';
      row.getCell(7).value = expense.Proveedor?.numero_doc_fiscal || '';
      if (hasInvoice) {
        row.getCell(8).value = amount;
        row.getCell(8).numFmt = '#,##0.00';
        totalImporteFactura += amount;
      }
      const tramosText = buildTramosText(expense);
      row.getCell(9).value = tramosText;
      row.getCell(9).alignment = {wrapText: true, vertical: 'middle', horizontal: 'center'};
      row.getCell(10).value = amount;
      row.getCell(10).numFmt = `#,##0.00${currencySuffix}`;
      row.getCell(11).value = vat;
      row.getCell(11).numFmt = '#,##0.00';
      row.getCell(12).value = rcIva;
      row.getCell(12).numFmt = '#,##0.00';
      row.getCell(13).value = iue;
      row.getCell(13).numFmt = '#,##0.00';
      row.getCell(14).value = it;
      row.getCell(14).numFmt = '#,##0.00';
      row.getCell(15).value = cost;
      row.getCell(15).numFmt = '#,##0.00';
      for (let col = 1; col <= totalCols; col++) {
        const cell = row.getCell(col);
        cell.border = thinBorder;
        cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: rowFill}};
        cell.font = {...(cell.font || {}), size: 9};
        if (col !== 4 && col !== 9) {
          cell.alignment = {...(cell.alignment || {}), horizontal: 'center', vertical: 'middle'};
        }
      }
      row.height = estimateRowHeight([
        [oracleValue, sheet.getColumn(3).width],
        [detailText, sheet.getColumn(4).width],
        [tramosText, sheet.getColumn(9).width],
      ]);
      if (isInternational) {
        totalImporteUsd += amount;
        totalCostUsd += cost;
      }
      else {
        totalImporteBs += amount;
        totalCostBs += cost;
      }
      totalVat += vat;
      totalRcIva += rcIva;
      totalIue += iue;
      totalIt += it;
      currentRow += 1;
    });

    const totalsRowNumber = currentRow;
    const totalsRow = sheet.getRow(totalsRowNumber);
    totalsRow.getCell(1).value = 'Sumas Totales (Bs)';
    totalsRow.getCell(1).font = {bold: true, size: 9};
    totalsRow.getCell(8).value = totalImporteFactura;
    totalsRow.getCell(10).value = totalImporteBs;
    totalsRow.getCell(11).value = totalVat;
    totalsRow.getCell(12).value = totalRcIva;
    totalsRow.getCell(13).value = totalIue;
    totalsRow.getCell(14).value = totalIt;
    totalsRow.getCell(15).value = totalCostBs;
    for (let col = 1; col <= totalCols; col++) {
      const cell = totalsRow.getCell(col);
      cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: totalsFill}};
      cell.border = thinBorder;
      cell.font = {bold: true, size: 9};
      cell.alignment = {horizontal: col === 1 ? 'left' : 'center', vertical: 'middle'};
      if (col === 8 || col === 10 || col >= 11) {
        cell.numFmt = '#,##0.00';
      }
    }
    totalsRow.height = 20;
    currentRow += 1;
    const totalsUsdRowNumber = currentRow;
    const totalsUsdRow = sheet.getRow(totalsUsdRowNumber);
    totalsUsdRow.getCell(1).value = 'Sumas Totales (USD)';
    totalsUsdRow.getCell(1).font = {bold: true, size: 9};
    totalsUsdRow.getCell(10).value = totalImporteUsd;
    totalsUsdRow.getCell(15).value = totalCostUsd;
    for (let col = 1; col <= totalCols; col++) {
      const cell = totalsUsdRow.getCell(col);
      cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: internationalRowFill}};
      cell.border = thinBorder;
      cell.font = {bold: true, size: 9};
      cell.alignment = {horizontal: col === 1 ? 'left' : 'center', vertical: 'middle'};
      if (col === 10 || col === 15) {
        cell.numFmt = '#,##0.00';
      }
    }
    totalsUsdRow.height = 20;
    currentRow += 1;
    applyOuterBorder(sheet, headerRowNumber, totalsUsdRowNumber, 1, totalCols);
    currentRow += 1;
    const assignedAmount = parseFloat(trip.monto_asignado) || 0;
    const assignedAmountUsd = parseFloat(trip.monto_asignado_usd || 0);
    const remaining = assignedAmount - totalImporteBs;
    const remainingUsd = assignedAmountUsd - totalImporteUsd;
    const balanceHeaderRow = currentRow;
    sheet.getCell(balanceHeaderRow, 1).value = 'CONC.';
    sheet.getCell(balanceHeaderRow, 6).value = 'Bs';
    sheet.getCell(balanceHeaderRow, 10).value = 'USD';
    [1, 6, 10].forEach((col) => {
      const cell = sheet.getCell(balanceHeaderRow, col);
      cell.font = {bold: true, size: 9, color: {argb: headerFont}};
      cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: headerFill}};
      cell.alignment = {horizontal: col === 1 ? 'left' : 'center'};
      cell.border = thinBorder;
    });
    currentRow += 1;
    const balanceRows = [
      ['Fondo Recibido', assignedAmount, assignedAmountUsd],
      ['Saldo en mi poder', remaining, remainingUsd],
      ['Importe a Devolver', remaining > 0 ? remaining : 0, remainingUsd > 0 ? remainingUsd : 0],
      ['Importe a Reembolsar', remaining < 0 ? Math.abs(remaining) : 0, remainingUsd < 0 ? Math.abs(remainingUsd) : 0],
    ];
    balanceRows.forEach(([label, bsValue, usdValue]) => {
      const labelCell = sheet.getCell(currentRow, 1);
      labelCell.value = label;
      labelCell.font = {bold: true, size: 9};
      labelCell.alignment = {horizontal: 'left'};
      labelCell.border = thinBorder;
      const bsCell = sheet.getCell(currentRow, 6);
      bsCell.value = bsValue;
      bsCell.numFmt = '#,##0.00';
      bsCell.alignment = {horizontal: 'center'};
      bsCell.border = thinBorder;
      const usdCell = sheet.getCell(currentRow, 10);
      usdCell.value = usdValue;
      usdCell.numFmt = '#,##0.00';
      usdCell.alignment = {horizontal: 'center'};
      usdCell.border = thinBorder;
      currentRow += 1;
    });
    applyOuterBorder(sheet, balanceHeaderRow, currentRow - 1, 1, 10);
    currentRow += 1;
    sheet.getCell(currentRow, 1).value = 'OBSERVACIONES:';
    sheet.getCell(currentRow, 1).font = {bold: true};
    currentRow += 1;
    if (justificationText) {
      sheet.mergeCells(currentRow, 1, currentRow, totalCols);
      const observationsCell = sheet.getCell(currentRow, 1);
      observationsCell.value = justificationText;
      observationsCell.font = {size: 9};
      observationsCell.alignment = {horizontal: 'left', vertical: 'top', wrapText: true};
      observationsCell.border = thinBorder;
      sheet.getRow(currentRow).height = estimateRowHeight([[justificationText, totalCols * 10]]);
      currentRow += 1;
    }
    const signatureBlocks = [
      {startCol: 1, endCol: 3, label: 'Preparado por', role: 'Responsable'},
      {startCol: 4, endCol: 6, label: 'Vo/ Bo', role: 'Jefe de Area'},
      {startCol: 7, endCol: 9, label: 'Vo/ Bo', role: 'Gerente de Area'},
      {startCol: 10, endCol: 11, label: 'Verificado por', role: 'Contabilidad'},
      {startCol: 12, endCol: 15, label: 'Aprobado por', role: 'Gerencia Administrativa'},
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
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {type: 'application/octet-stream'});
    saveAs(blob, `RENDICION_${trip.id_viaje}_${(trip.motivo || 'viaje').replace(/\s+/g, '_')}.xlsx`);
  };
  return {exportToExcel};
}

export default useTripExcelExport;