import {describe, it, expect, vi} from 'vitest';
import ExcelJS from 'exceljs';
import {addStatementSheet} from './useTripExcelExport';

vi.stubGlobal('fetch', () => Promise.reject(new Error('sin red')));

const trip = {tipo: 'Internacional', fecha_inicio: '2026-10-01', motivo: 'Feria en Lima', monto_asignado: '1000', monto_asignado_usd: '0', Usuario: {nombre: 'Ana', apellido_paterno: 'Rojas'}};
const expenses = [
  {tipo: 'S', monto_total: '50.00', fecha_gasto: '2026-10-01', descripcion: 'Taxi al aeropuerto', es_gasto_internacional: false, numero_recibo: '0003431', Recibo: [{numero: 12}]},
  {tipo: 'C', monto_total: '44.97', fecha_gasto: '2026-10-02', descripcion: 'Taxi en Lima', es_gasto_internacional: true, moneda: 'PEN', monto_moneda_origen: '170.00', tipo_cambio: '3.7800', tipo_cambio_bs: '6.9600', Recibo: [{numero: 13}]},
];

const findRow = (sheet, text) => {
  let found = null;
  sheet.eachRow((row) => {
    if (String(row.getCell(1).value).startsWith(text)) {
      found = row;
    }
  });
  return found;
};

describe('Planilla de rendición en Excel', () => {
  it('muestra todo en Bs con el monto original de los gastos internacionales', async () => {
    const workbook = new ExcelJS.Workbook();
    await addStatementSheet(workbook, trip, expenses);
    const sheet = workbook.getWorksheet('RENDICION');
    expect(sheet.getCell(7, 8).value).toBe('IMPORTE FACT./REC.');
    expect(sheet.getCell(7, 9).value).toBe('MONTO ORIGINAL');
    expect(sheet.getCell(7, 10).value).toBe('IMPORTE');
    expect(sheet.getCell(8, 4).value).toBe('SALDO ANTERIOR FONDO RECIBIDO (Bs)');
    expect(sheet.getCell(8, 10).value).toBe(1000);
    expect(sheet.getCell(9, 4).value).toBe('SALDO ANTERIOR FONDO RECIBIDO (USD)');
    expect(sheet.getCell(9, 10).numFmt).toBe('#,##0.00" USD"');
    expect(sheet.getCell(10, 6).value).toBe('0003431');
    expect(sheet.getCell(10, 6).note).toBeUndefined();
    expect(sheet.getCell(10, 8).value).toBe(50);
    expect(sheet.getCell(10, 10).value).toBeNull();
    expect(sheet.getCell(11, 9).value).toBe('170.00 PEN = 44.97 USD (T/C 3.7800)\nT/C 6.9600 Bs por USD');
    expect(sheet.getCell(11, 8).value).toBe(312.99);
    expect(sheet.getCell(11, 15).value).toBe(312.99);
    expect(sheet.getCell(11, 6).value).toBe('000013');
    expect(sheet.getCell(11, 6).fill.fgColor.argb).toBe('FFE4DFEC');
    expect(findRow(sheet, 'Sumas Totales').getCell(8).value).toBe(362.99);
    expect(findRow(sheet, 'Sumas Totales').getCell(10).value).toBe(1000);
    expect(findRow(sheet, 'Gastos internacionales').getCell(8).value).toBe(44.97);
    expect(sheet.getCell(14, 7).value).toMatch(/^N° DOCUMENTO en lila/);
    expect(findRow(sheet, 'Total Gastado').getCell(6).value).toBe(362.99);
    expect(findRow(sheet, 'Saldo en mi poder').getCell(6).value).toBe(637.01);
  });
});
