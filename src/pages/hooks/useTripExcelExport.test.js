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
    expect(findRow(sheet, 'Gastos internacionales').getCell(8).value).toBe(0);
    expect(sheet.getCell(14, 7).value).toMatch(/^N° DOCUMENTO en lila/);
    expect(findRow(sheet, 'Total Gastado').getCell(6).value).toBe(362.99);
    expect(findRow(sheet, 'Saldo en mi poder').getCell(6).value).toBe(637.01);
  });

  it('el gasto internacional que el empleado rinde en USD sale en USD y fuera de las sumas en Bs', async () => {
    const workbook = new ExcelJS.Workbook();
    await addStatementSheet(workbook, trip, [expenses[0], {...expenses[1], moneda_rendicion: 'USD'}]);
    const sheet = workbook.getWorksheet('RENDICION');
    expect(sheet.getCell(11, 8).value).toBe(44.97);
    expect(sheet.getCell(11, 8).numFmt).toBe('#,##0.00" USD"');
    expect(findRow(sheet, 'Sumas Totales').getCell(8).value).toBe(50);
    expect(findRow(sheet, 'Gastos internacionales').getCell(8).value).toBe(44.97);
    expect(findRow(sheet, 'Total Gastado').getCell(6).value).toBe(50);
  });

  it('pone el trazo y los datos de quien firmó en los casilleros de firma', async () => {
    const workbook = new ExcelJS.Workbook();
    const firma = (nombre, cargo) => ({imagen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAoCAYAAAA16j4lAAAB1klEQVR4Xu2Zy3HCQBiDITVQDuWnHHpIZg+eccw+9L83g75LDplgRVrJYG43QgghhBBCCCGZPB7Pn3a94yfJ5R55uV6or9d36DXJX76iDNmxsZ+4JiFtWoVb0eJPXRP3Bq/CrWCkaUetCBLdrg2eteT6u6wWI2ZkabGi8dC9wWfOxl1NRIy3gs5yhhYrPY2IbreANacrklm4vcYiZlXQdI3+F2R5XAJGzalo8cH12ruHPAq2gQR7YA4YncER6OGQgK7JriGPPGl6JeE2TAFrwpUKlCI9MDuFbJ3jHup30Zpwz6Atk2DRZPlbK7NDaS2EqsGVZkimXmJOVZM959ilwZ7herU4UpP0TQ3KLFj0NRBEL+Zp5IE15AxNniFHznEPeKIjjLQSpSlqrqPnWD3RUUZaWhytqeF1jaw5NjX4jOTNi4bZjHkav8LaZK+HFRaWE229RyJIDoxXq1C0IVfMsbjBqyZ5on2MKTkcWiQhRzyssDBscHZTEDLWZMQq5B3muEf3Y1JluKMQKzWdkaxaxrqseAt4ByMREyvNW+mr1HblbaKRr9WqqTZwdv1qbcuAG4fIKrH/wcCrR5qv8jIQParMZIdbBQnmCHl1zyOEEEIIIYQQP34BCsyK1WG1RtkAAAAASUVORK5CYII=', automatica: false, nombre, cargo, fecha: '29/10/2026, 20:07'});
    await addStatementSheet(workbook, trip, expenses, [], 'RENDICION', {preparado: firma('Ana Rojas', 'Comercial'), jefe: firma('Ricardo Salinas', 'Gerente General'), gerente: null, gerenteNoRequerido: true});
    const sheet = workbook.getWorksheet('RENDICION');
    expect(sheet.getImages()).toHaveLength(2);
    let texts = [];
    sheet.eachRow((row) => row.eachCell((cell) => texts.push(String(cell.value))));
    texts = texts.join('|');
    expect(texts).toContain('Ana Rojas\nComercial\nFirmado electrónicamente el 29/10/2026, 20:07');
    expect(texts).toContain('Gerente de Area');
    expect(texts).toContain('No requiere Vo/ Bo de gerencia');
  });
});
