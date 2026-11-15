import {describe, it, expect} from 'vitest';
import ExcelJS from 'exceljs';
import {buildSectionImportTemplate, buildPositionImportTemplate, readSectionImportRows, readPositionImportRows} from './catalogImportFiles';

describe('Excel para importar secciones y cargos', () => {
  it('arma la plantilla de secciones con obligatorios, ejemplo y lista de estados', () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = buildSectionImportTemplate(workbook);
    expect(sheet.getCell('A1').value).toBe('Sección Oracle *');
    expect(sheet.getCell('B1').value).toBe('Sección *');
    expect(sheet.getCell('C1').value).toBe('Estado');
    expect(sheet.getCell('C3').dataValidation.formulae[0]).toBe('LISTAS!$A$1:$A$2');
    expect(workbook.getWorksheet('INSTRUCCIONES')).toBeTruthy();
  });

  it('lee el Excel que exporta la pantalla de secciones aunque traiga columnas de más', () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Secciones');
    sheet.addRow(['Sección', 'Sección Oracle', 'Usuarios', 'Estado']);
    sheet.addRow(['EXPORT SALES', '220', 4, 'Activo']);
    sheet.addRow(['LEGAL', 111, 0, 'Suspendido']);
    const {rows} = readSectionImportRows(sheet);
    expect(rows).toEqual([
      {fila: 2, nombre: 'EXPORT SALES', codigo_seccion: '220', estado: 'Activo'},
      {fila: 3, nombre: 'LEGAL', codigo_seccion: '111', estado: 'Suspendido'},
    ]);
  });

  it('lee los cargos con su tipo y salta la fila de ejemplo', () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = buildPositionImportTemplate(workbook);
    expect(workbook.getWorksheet('LISTAS').getCell('B3').value).toBe('C');
    sheet.getRow(3).values = ['Jefe de Planta', 'B', ''];
    const {rows} = readPositionImportRows(sheet);
    expect(rows).toEqual([{fila: 3, nombre: 'Jefe de Planta', tipo_viatico: 'B', estado: ''}]);
  });

  it('avisa si falta la columna del tipo de viático', () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('CARGOS');
    sheet.addRow(['Cargo']);
    sheet.addRow(['Analista']);
    expect(readPositionImportRows(sheet).error).toContain('Tipo de viático');
  });
});
