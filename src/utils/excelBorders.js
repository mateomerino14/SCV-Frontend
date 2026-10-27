const thinBorderColor = 'FFB0C4D4';
const outlineBorderColor = 'FF1B4F91';
const thinLine = {style: 'thin', color: {argb: thinBorderColor}};
const outlineLine = {style: 'medium', color: {argb: outlineBorderColor}};

export const thinBorder = {top: thinLine, bottom: thinLine, left: thinLine, right: thinLine};

export const borderRange = (sheet, startRow, endRow, startCol, endCol) => {
  for (let row = startRow; row <= endRow; row++) {
    for (let column = startCol; column <= endCol; column++) {
      const cell = sheet.getCell(row, column);
      cell.border = {...thinBorder, ...cell.border};
    }
  }
};

export const applyOuterBorder = (sheet, startRow, endRow, startCol, endCol) => {
  for (let row = startRow; row <= endRow; row++) {
    for (let column = startCol; column <= endCol; column++) {
      const cell = sheet.getCell(row, column);
      const border = {...cell.border};
      if (row === startRow) {
        border.top = outlineLine;
      }
      if (row === endRow) {
        border.bottom = outlineLine;
      }
      if (column === startCol) {
        border.left = outlineLine;
      }
      if (column === endCol) {
        border.right = outlineLine;
      }
      cell.border = border;
    }
  }
};

export const frameTable = (sheet, startRow, endRow, startCol, endCol) => {
  borderRange(sheet, startRow, endRow, startCol, endCol);
  applyOuterBorder(sheet, startRow, endRow, startCol, endCol);
};
