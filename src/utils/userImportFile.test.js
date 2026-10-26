import {describe, it, expect} from 'vitest';
import ExcelJS from 'exceljs';
import {buildUserImportTemplate, readUserImportRows, importColumns} from './userImportFile';

const catalogs = {
  positions: [{nombre: 'Operador de planta', activo: true}, {nombre: 'Cargo viejo', activo: false}],
  sections: [{nombre: 'Producción', activo: true}],
};

describe('Excel para importar usuarios', () => {
  it('arma la plantilla con obligatorios marcados, ejemplo y listas', () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = buildUserImportTemplate(workbook, catalogs);
    expect(sheet.getCell('A1').value).toBe('Nombre *');
    expect(sheet.getCell('C1').value).toBe('Apellido materno');
    expect(sheet.getCell('G2').value).toBe('Operador de planta');
    expect(sheet.getCell('G3').dataValidation.formulae[0]).toBe('LISTAS!$A$1:$A$1');
    expect(workbook.getWorksheet('LISTAS').getCell('C5').value).toBe('ADMINISTRADOR');
    expect(workbook.getWorksheet('INSTRUCCIONES')).toBeTruthy();
  });

  it('lee las filas llenas, salta la de ejemplo y las vacías y limpia los valores', () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = buildUserImportTemplate(workbook, catalogs);
    sheet.getRow(3).values = ['Ana', 'Quispe', '', {text: 'ana.quispe@maxam.com', hyperlink: 'mailto:ana.quispe@maxam.com'}, 7654321, '', 'Operador de planta', 'Producción', 'SUPERVISOR', '', '421'];
    sheet.getRow(5).getCell(1).value = '  Luis ';
    const {rows} = readUserImportRows(sheet);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({fila: 3, nombre: 'Ana', email_corporativo: 'ana.quispe@maxam.com', carnet_identidad: '7654321', rol: 'SUPERVISOR', codigo_dependencia: '421'});
    expect(rows[1]).toMatchObject({fila: 5, nombre: 'Luis'});
  });

  it('avisa si faltan columnas obligatorias o no hay personas', () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('USUARIOS');
    sheet.getRow(1).values = ['Nombre', 'Correo corporativo'];
    expect(readUserImportRows(sheet).error).toContain('Apellido paterno, Cargo');
    const empty = workbook.addWorksheet('VACIA');
    empty.getRow(1).values = importColumns.map((column) => column.header);
    expect(readUserImportRows(empty).error).toBe('El archivo no tiene personas para importar');
  });
});
