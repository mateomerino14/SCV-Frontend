import {saveWorkbook, todayFileSuffix} from './excelExport';

const headerFill = 'FF870002';
const headerFont = 'FFFFFFFF';
const requiredFill = 'FFD20F12';
const exampleFont = 'FF7F7F7F';
const borderColor = 'FFD0D0D0';
const sheetName = 'USUARIOS';
const listsSheetName = 'Listas';
const templateRows = 500;
const firstColumnCode = 'A'.charCodeAt(0);
const thinLine = {style: 'thin', color: {argb: borderColor}};
const cellBorder = {top: thinLine, bottom: thinLine, left: thinLine, right: thinLine};

const roleNames = ['EMPLEADO', 'SUPERVISOR', 'APROBADOR', 'REVISOR', 'ADMINISTRADOR'];

export const importColumns = [
  {key: 'nombre', header: 'Nombre', required: true, width: 20, example: 'Juan Carlos'},
  {key: 'apellido_paterno', header: 'Apellido paterno', required: true, width: 20, example: 'Pérez'},
  {key: 'apellido_materno', header: 'Apellido materno', width: 20, example: 'Rojas'},
  {key: 'email_corporativo', header: 'Correo corporativo', required: true, width: 32, example: 'juan.perez@maxam.com'},
  {key: 'carnet_identidad', header: 'CI', width: 14, example: '1234567'},
  {key: 'telefono', header: 'Teléfono', width: 12, example: '71234567'},
  {key: 'cargo', header: 'Cargo', required: true, width: 34, list: 'positions'},
  {key: 'seccion', header: 'Sección', width: 24, list: 'sections'},
  {key: 'rol', header: 'Rol', width: 16, list: 'roles', example: 'EMPLEADO'},
  {key: 'correo_jefe', header: 'Correo del jefe directo', width: 32, example: 'jefe.area@maxam.com'},
  {key: 'codigo_dependencia', header: 'Dependencia Oracle', width: 14, example: '421'},
];

const instructions = [
  ['Cómo llenar la plantilla'],
  ['1. Una fila por persona, desde la fila 3 de la hoja USUARIOS. La fila 2 es un ejemplo: bórrala o reemplázala.'],
  ['2. Las columnas en rojo son obligatorias (Nombre, Apellido paterno, Correo corporativo y Cargo).'],
  ['3. Cargo, Sección y Rol se eligen de la lista. Si el Rol queda vacío, la persona entra como EMPLEADO.'],
  ['4. El jefe directo se indica con su correo: puede ser alguien que ya está en el sistema o alguien de este mismo archivo.'],
  ['5. Dependencia Oracle: 3 dígitos (por ejemplo 421). Va en el jefe; quien no tiene jefe, como el gerente general, lleva la suya.'],
  ['6. Antes de crear nada, el sistema muestra cada fila con sus errores: correos o CI repetidos en el archivo o que ya existen, cargos que no existen, jefes que no se encuentran, etc. Solo se crean las filas correctas.'],
  ['7. Cada usuario nuevo recibe por correo una contraseña temporal y la cambia al ingresar por primera vez.'],
];

const solidFill = (argb) => ({type: 'pattern', pattern: 'solid', fgColor: {argb}});

const addListsSheet = (workbook, lists) => {
  const sheet = workbook.addWorksheet(listsSheetName, {state: 'veryHidden'});
  const ranges = {};
  Object.entries(lists).forEach(([name, values], index) => {
    const column = index + 1;
    const letter = String.fromCharCode(firstColumnCode + index);
    values.forEach((value, row) => {
      sheet.getCell(row + 1, column).value = value;
    });
    ranges[name] = `${listsSheetName}!$${letter}$1:$${letter}$${Math.max(values.length, 1)}`;
  });
  return ranges;
};

const styleTemplateHeader = (sheet) => {
  const header = sheet.getRow(1);
  header.height = 30;
  importColumns.forEach((column, index) => {
    const cell = header.getCell(index + 1);
    cell.value = column.header;
    if (column.required) {
      cell.value = `${column.header} *`;
    }
    cell.font = {bold: true, color: {argb: headerFont}};
    cell.fill = solidFill(headerFill);
    if (column.required) {
      cell.fill = solidFill(requiredFill);
    }
    cell.alignment = {horizontal: 'center', vertical: 'middle', wrapText: true};
    cell.border = cellBorder;
  });
};

const addExampleRow = (sheet, lists) => {
  const example = sheet.getRow(2);
  importColumns.forEach((column, index) => {
    const cell = example.getCell(index + 1);
    cell.value = column.example || lists[column.list]?.[0] || '';
    cell.font = {italic: true, color: {argb: exampleFont}};
  });
};

const addValidations = (sheet, ranges) => {
  for (let rowNumber = 2; rowNumber <= templateRows + 1; rowNumber++) {
    const row = sheet.getRow(rowNumber);
    importColumns.forEach((column, index) => {
      const cell = row.getCell(index + 1);
      cell.border = cellBorder;
      cell.numFmt = '@';
      if (column.list) {
        cell.dataValidation = {type: 'list', allowBlank: true, formulae: [ranges[column.list]], showErrorMessage: true, errorTitle: column.header, error: 'Elige un valor de la lista'};
      }
    });
  }
};

const addInstructionsSheet = (workbook) => {
  const sheet = workbook.addWorksheet('INSTRUCCIONES');
  sheet.columns = [{width: 130}];
  instructions.forEach(([text], index) => {
    const cell = sheet.getCell(index + 1, 1);
    cell.value = text;
    cell.alignment = {wrapText: true, vertical: 'middle'};
    if (index === 0) {
      cell.font = {bold: true, size: 14};
    }
  });
};

export const buildUserImportTemplate = (workbook, {positions = [], sections = []}) => {
  const lists = {
    positions: positions.filter((position) => position.activo).map((position) => position.nombre).sort(),
    sections: sections.filter((section) => section.activo).map((section) => section.nombre).sort(),
    roles: roleNames,
  };
  const sheet = workbook.addWorksheet(sheetName, {properties: {tabColor: {argb: headerFill}}, views: [{state: 'frozen', ySplit: 1}]});
  sheet.columns = importColumns.map((column) => ({key: column.key, width: column.width}));
  styleTemplateHeader(sheet);
  addExampleRow(sheet, lists);
  addValidations(sheet, addListsSheet(workbook, lists));
  addInstructionsSheet(workbook);
  return sheet;
};

export const downloadUserImportTemplate = async (catalogs) => {
  const ExcelJS = (await import('exceljs')).default;
  const workbook = new ExcelJS.Workbook();
  buildUserImportTemplate(workbook, catalogs);
  await saveWorkbook(workbook, `PLANTILLA_USUARIOS_${todayFileSuffix()}.xlsx`);
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

const isExampleRow = (row) => importColumns.every((column) => !column.example || row[column.key] === column.example);

export const readUserImportRows = (sheet) => {
  const headerKeys = {};
  sheet.getRow(1).eachCell((cell, columnNumber) => {
    const column = importColumns.find((item) => normalizeHeader(item.header) === normalizeHeader(cellText(cell.value)));
    if (column) {
      headerKeys[columnNumber] = column.key;
    }
  });
  const missing = importColumns.filter((column) => column.required && !Object.values(headerKeys).includes(column.key));
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
    const hasData = importColumns.some((column) => values[column.key]);
    if (hasData && !isExampleRow(values)) {
      rows.push(values);
    }
  });
  if (rows.length === 0) {
    return {error: 'El archivo no tiene personas para importar'};
  }
  return {rows};
};

export const parseUserImportFile = async (file) => {
  try {
    const ExcelJS = (await import('exceljs')).default;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const sheet = workbook.getWorksheet(sheetName) || workbook.worksheets.find((item) => item.state === 'visible');
    if (!sheet) {
      return {error: 'El archivo no tiene hojas'};
    }
    return readUserImportRows(sheet);
  }
  catch {
    return {error: 'No se pudo leer el archivo: usa un Excel (.xlsx) creado con la plantilla'};
  }
};
