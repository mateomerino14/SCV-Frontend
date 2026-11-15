import {saveWorkbook, todayFileSuffix} from './excelExport';
import {addListRanges} from './excelLists';
import {thinBorder, applyOuterBorder, frameTable} from './excelBorders';

const headerFill = 'FF870002';
const headerFont = 'FFFFFFFF';
const requiredFill = 'FFD20F12';
const exampleFont = 'FF7F7F7F';
const templateRows = 500;

const solidFill = (argb) => ({type: 'pattern', pattern: 'solid', fgColor: {argb}});

const styleTemplateHeader = (sheet, columns) => {
  const header = sheet.getRow(1);
  header.height = 30;
  columns.forEach((column, index) => {
    const cell = header.getCell(index + 1);
    cell.value = column.header;
    cell.fill = solidFill(headerFill);
    if (column.required) {
      cell.value = `${column.header} *`;
      cell.fill = solidFill(requiredFill);
    }
    cell.font = {bold: true, color: {argb: headerFont}};
    cell.alignment = {horizontal: 'center', vertical: 'middle', wrapText: true};
    cell.border = thinBorder;
  });
};

const addExampleRow = (sheet, columns, lists) => {
  const example = sheet.getRow(2);
  columns.forEach((column, index) => {
    const cell = example.getCell(index + 1);
    cell.value = column.example || lists[column.list]?.[0] || '';
    cell.font = {italic: true, color: {argb: exampleFont}};
  });
};

const addValidations = (sheet, columns, ranges) => {
  for (let rowNumber = 2; rowNumber <= templateRows + 1; rowNumber++) {
    const row = sheet.getRow(rowNumber);
    columns.forEach((column, index) => {
      const cell = row.getCell(index + 1);
      cell.border = thinBorder;
      cell.numFmt = '@';
      if (column.list) {
        cell.dataValidation = {type: 'list', allowBlank: true, formulae: [ranges[column.list]], showErrorMessage: true, errorTitle: column.header, error: 'Elige un valor de la lista'};
      }
    });
  }
};

const addInstructionsSheet = (workbook, instructions) => {
  const sheet = workbook.addWorksheet('INSTRUCCIONES');
  sheet.columns = [{width: 130}];
  instructions.forEach((text, index) => {
    const cell = sheet.getCell(index + 1, 1);
    cell.value = text;
    cell.alignment = {wrapText: true, vertical: 'middle'};
    if (index === 0) {
      cell.font = {bold: true, size: 14};
    }
  });
  frameTable(sheet, 1, instructions.length, 1, 1);
};

export const buildImportTemplate = (workbook, config, lists = {}) => {
  const sheet = workbook.addWorksheet(config.sheetName, {properties: {tabColor: {argb: headerFill}}, views: [{state: 'frozen', ySplit: 1}]});
  sheet.columns = config.columns.map((column) => ({key: column.key, width: column.width}));
  styleTemplateHeader(sheet, config.columns);
  addExampleRow(sheet, config.columns, lists);
  addValidations(sheet, config.columns, addListRanges(workbook, lists));
  applyOuterBorder(sheet, 1, templateRows + 1, 1, config.columns.length);
  addInstructionsSheet(workbook, config.instructions);
  return sheet;
};

export const downloadImportTemplate = async (config, lists) => {
  const ExcelJS = (await import('exceljs')).default;
  const workbook = new ExcelJS.Workbook();
  buildImportTemplate(workbook, config, lists);
  await saveWorkbook(workbook, `${config.fileName}_${todayFileSuffix()}.xlsx`);
};

const normalizeHeader = (text) => String(text || '').replace('*', '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const cellText = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    if (value.text !== undefined) {
      return cellText(value.text);
    }
    if (value.richText) {
      return value.richText.map((part) => part.text).join('');
    }
    if (value.result !== undefined) {
      return cellText(value.result);
    }
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }
    return '';
  }
  return String(value).trim();
};

const columnOfHeader = (columns, text) => {
  const header = normalizeHeader(text);
  return columns.find((column) => [column.header, ...(column.aliases || [])].some((name) => normalizeHeader(name) === header));
};

const isExampleRow = (columns, row) => columns.some((column) => column.example) && columns.every((column) => !column.example || row[column.key] === column.example);

export const readImportRows = (sheet, config) => {
  const headerKeys = {};
  sheet.getRow(1).eachCell((cell, columnNumber) => {
    const column = columnOfHeader(config.columns, cellText(cell.value));
    if (column) {
      headerKeys[columnNumber] = column.key;
    }
  });
  const missing = config.columns.filter((column) => column.required && !Object.values(headerKeys).includes(column.key));
  if (missing.length > 0) {
    return {error: `Al archivo le faltan las columnas: ${missing.map((column) => column.header).join(', ')}. Usa la plantilla.`};
  }
  const rows = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }
    const values = {fila: rowNumber};
    Object.entries(headerKeys).forEach(([columnNumber, key]) => {
      values[key] = cellText(row.getCell(parseInt(columnNumber, 10)).value);
    });
    const hasData = config.columns.some((column) => values[column.key]);
    if (hasData && !isExampleRow(config.columns, values)) {
      rows.push(values);
    }
  });
  if (rows.length === 0) {
    return {error: config.emptyMessage};
  }
  return {rows};
};

export const parseImportFile = async (file, config) => {
  try {
    const ExcelJS = (await import('exceljs')).default;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const sheet = workbook.getWorksheet(config.sheetName) || workbook.worksheets.find((item) => item.state === 'visible');
    if (!sheet) {
      return {error: 'El archivo no tiene hojas'};
    }
    return readImportRows(sheet, config);
  }
  catch {
    return {error: 'No se pudo leer el archivo: usa un Excel (.xlsx) creado con la plantilla'};
  }
};
