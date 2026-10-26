const listsSheetName = 'LISTAS';
const firstColumnCode = 'A'.charCodeAt(0);
const lettersInAlphabet = 26;

export const columnLetter = (index) => {
  let letter = '';
  let current = index;
  while (current > 0) {
    const remainder = (current - 1) % lettersInAlphabet;
    letter = String.fromCharCode(firstColumnCode + remainder) + letter;
    current = Math.floor((current - 1) / lettersInAlphabet);
  }
  return letter;
};

const getListsSheet = (workbook) => {
  const existing = workbook.getWorksheet(listsSheetName);
  if (existing) {
    return existing;
  }
  return workbook.addWorksheet(listsSheetName, {state: 'veryHidden'});
};

export const addListRange = (workbook, values) => {
  const sheet = getListsSheet(workbook);
  const column = sheet.columnCount + 1;
  values.forEach((value, row) => {
    sheet.getCell(row + 1, column).value = value;
  });
  const letter = columnLetter(column);
  return `${listsSheetName}!$${letter}$1:$${letter}$${Math.max(values.length, 1)}`;
};

export const addListRanges = (workbook, lists) => Object.fromEntries(Object.entries(lists).map(([name, values]) => [name, addListRange(workbook, values)]));

export const moveListsToEnd = (workbook) => {
  const sheet = workbook.getWorksheet(listsSheetName);
  if (!sheet) {
    return;
  }
  const lastOrder = Math.max(...workbook.worksheets.map((worksheet) => worksheet.orderNo));
  sheet.orderNo = lastOrder + 1;
};
