import {describe, it, expect} from 'vitest';
import ExcelJS from 'exceljs';
import {addTableSheet} from './excelExport';

describe('addTableSheet', () => {
  it('crea la hoja con encabezado, filas y formato de montos', () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = addTableSheet(workbook, 'Cargos', [
      {header: 'Cargo', key: 'nombre'},
      {header: 'Tarifa', key: 'tarifa', numFmt: '#,##0.00'},
    ], [{nombre: 'Analista', tarifa: 300}, {nombre: 'Jefe', tarifa: 450}]);
    expect(sheet.name).toBe('Cargos');
    expect(sheet.getRow(1).getCell(1).value).toBe('Cargo');
    expect(sheet.getRow(3).getCell(2).value).toBe(450);
    expect(sheet.getColumn(2).numFmt).toBe('#,##0.00');
    expect(sheet.getRow(1).font.bold).toBe(true);
  });

  it('agrega la fila de totales en las columnas marcadas', () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = addTableSheet(workbook, 'Resumen', [
      {header: 'Código', key: 'codigo'},
      {header: 'Gastado Bs', key: 'gastado', numFmt: '#,##0.00', total: true},
    ], [{codigo: 'VIA-1', gastado: 100.5}, {codigo: 'VIA-2', gastado: 50}]);
    expect(sheet.getRow(4).getCell(1).value).toBe('TOTAL');
    expect(sheet.getRow(4).getCell(2).value).toBe(150.5);
    expect(sheet.getRow(4).font.bold).toBe(true);
  });
});
