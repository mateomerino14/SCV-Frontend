import {saveAs} from 'file-saver';
import {toDateText} from './periodRange';

const headerFill = 'FF870002';
const headerFont = 'FFFFFFFF';
const stripeFill = 'FFF3F6FF';

export const todayFileSuffix = () => toDateText(new Date());

export const addTableSheet = (workbook, name, columns, rows) => {
  const sheet = workbook.addWorksheet(name);
  sheet.columns = columns.map((column) => ({header: column.header, key: column.key, width: column.width || 18}));
  const header = sheet.getRow(1);
  header.font = {bold: true, color: {argb: headerFont}};
  header.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: headerFill}};
  header.alignment = {vertical: 'middle', wrapText: true};
  header.height = 22;
  rows.forEach((row, index) => {
    const added = sheet.addRow(row);
    if (index % 2 === 1) {
      added.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: stripeFill}};
    }
  });
  columns.forEach((column, index) => {
    if (column.numFmt) {
      sheet.getColumn(index + 1).numFmt = column.numFmt;
    }
  });
  if (rows.length > 0) {
    sheet.autoFilter = {from: {row: 1, column: 1}, to: {row: 1, column: columns.length}};
  }
  sheet.views = [{state: 'frozen', ySplit: 1}];
  return sheet;
};

export const saveWorkbook = async (workbook, fileName) => {
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer], {type: 'application/octet-stream'}), fileName);
};

export const amountFormat = '#,##0.00';
