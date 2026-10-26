import {saveAs} from 'file-saver';
import {toDateText} from './periodRange';
import {moveListsToEnd} from './excelLists';

const headerFill = 'FF870002';
const headerFont = 'FFFFFFFF';
const stripeFill = 'FFF3F6FF';
const totalsFill = 'FFF2DCDB';
const borderColor = 'FFD0D0D0';
const headerHeight = 24;
const rowHeight = 18;
const thinLine = {style: 'thin', color: {argb: borderColor}};
const cellBorder = {top: thinLine, bottom: thinLine, left: thinLine, right: thinLine};

export const amountFormat = '#,##0.00';

export const todayFileSuffix = () => toDateText(new Date());

const solidFill = (argb) => ({type: 'pattern', pattern: 'solid', fgColor: {argb}});

const columnAlignment = (column) => {
  if (column.numFmt) {
    return {horizontal: 'right', vertical: 'middle'};
  }
  return {horizontal: 'left', vertical: 'middle', wrapText: true};
};

const styleRow = (row, columns, fill) => {
  row.height = rowHeight;
  columns.forEach((column, index) => {
    const cell = row.getCell(index + 1);
    cell.border = cellBorder;
    cell.alignment = columnAlignment(column);
    if (fill) {
      cell.fill = solidFill(fill);
    }
  });
};

const addTotalsRow = (sheet, columns, rows) => {
  const totals = {};
  columns.forEach((column) => {
    if (column.total) {
      totals[column.key] = rows.reduce((sum, row) => sum + (parseFloat(row[column.key]) || 0), 0);
    }
  });
  totals[columns[0].key] = 'TOTAL';
  const row = sheet.addRow(totals);
  styleRow(row, columns, totalsFill);
  row.font = {bold: true};
};

export const addTableSheet = (workbook, name, columns, rows) => {
  const sheet = workbook.addWorksheet(name, {properties: {tabColor: {argb: headerFill}}});
  sheet.columns = columns.map((column) => ({header: column.header, key: column.key, width: column.width || 18}));
  const header = sheet.getRow(1);
  header.font = {bold: true, color: {argb: headerFont}};
  header.height = headerHeight;
  columns.forEach((column, index) => {
    const cell = header.getCell(index + 1);
    cell.fill = solidFill(headerFill);
    cell.border = cellBorder;
    cell.alignment = {horizontal: 'center', vertical: 'middle', wrapText: true};
  });
  rows.forEach((row, index) => {
    let fill = null;
    if (index % 2 === 1) {
      fill = stripeFill;
    }
    styleRow(sheet.addRow(row), columns, fill);
  });
  if (rows.length > 0 && columns.some((column) => column.total)) {
    addTotalsRow(sheet, columns, rows);
  }
  columns.forEach((column, index) => {
    if (column.numFmt) {
      sheet.getColumn(index + 1).numFmt = column.numFmt;
    }
  });
  if (rows.length > 0) {
    sheet.autoFilter = {from: {row: 1, column: 1}, to: {row: 1, column: columns.length}};
  }
  sheet.views = [{state: 'frozen', ySplit: 1}];
  sheet.pageSetup = {orientation: 'landscape', paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0, printTitlesRow: '1:1'};
  return sheet;
};

export const saveWorkbook = async (workbook, fileName) => {
  moveListsToEnd(workbook);
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer], {type: 'application/octet-stream'}), fileName);
};
