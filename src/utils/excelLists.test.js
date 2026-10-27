import {describe, it, expect} from 'vitest';
import ExcelJS from 'exceljs';
import {addListRange, addListRanges, columnLetter, moveListsToEnd} from './excelLists';

describe('listas ocultas del Excel', () => {
  it('guarda todas las listas en una sola hoja oculta al final del libro', async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet('VIA-1');
    expect(addListRange(workbook, ['649300 TRANSPORTE', '626030 HOTELES'])).toBe('LISTAS!$A$1:$A$2');
    workbook.addWorksheet('VIA-2');
    expect(addListRanges(workbook, {divisas: ['BOB', 'USD', 'EUR']})).toEqual({divisas: 'LISTAS!$B$1:$B$3'});
    workbook.addWorksheet('FACTURAS');
    moveListsToEnd(workbook);
    const loaded = new ExcelJS.Workbook();
    await loaded.xlsx.load(await workbook.xlsx.writeBuffer());
    expect(loaded.worksheets.map((sheet) => sheet.name)).toEqual(['VIA-1', 'VIA-2', 'FACTURAS', 'LISTAS']);
    expect(loaded.getWorksheet('LISTAS').state).toBe('veryHidden');
  });

  it('nombra las columnas como Excel', () => {
    expect([columnLetter(1), columnLetter(26), columnLetter(27), columnLetter(53)]).toEqual(['A', 'Z', 'AA', 'BA']);
  });
});
