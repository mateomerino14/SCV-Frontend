import {describe, it, expect} from 'vitest';
import ExcelJS from 'exceljs';
import {buildOracleInvoice, buildOracleRows, formatOracleDate, buildSupplierName, addOracleSheets} from './oracleExport';

const trip = {
  id_viaje: 40, numero_rendicion: 40, fecha_inicio: '2026-10-20', motivo: 'Viaje a SCZ por transporte de producto terminado',
  Usuario: {nombre: 'Jhimy Wilfredo', apellido_paterno: 'Terrazas', apellido_materno: null, Jefe: {codigo_dependencia: '421'}, codigo_dependencia: '530', Seccion: {codigo_seccion: '200'}},
  Recibo: [{numero: 46870, tipo: 'S', es_gasto_internacional: false, id_gasto: null}],
};
const fuelInvoice = {
  id_gasto: 1, tipo: 'F', monto_total: 144.98, fecha_gasto: '2026-10-21', es_gasto_internacional: false, tiene_alcohol: false,
  Categoria_Gasto: {nombre: '649300 TRANSPORTE PERSONAL'},
  Factura: {numero_factura: '1159798', fecha_emision: '2026-10-21', cuf: 'DD5F2336313F'},
};
const lodging = {
  id_gasto: 2, tipo: 'S', monto_total: 180, fecha_gasto: '2026-10-20', es_gasto_internacional: false, tiene_alcohol: false,
  Categoria_Gasto: {nombre: '626030 HOTELES'},
};

describe('Excel para Oracle', () => {
  it('formatea fechas como Oracle', () => {
    expect(formatOracleDate('2026-10-21')).toBe('21-oct-26');
    expect(buildSupplierName(trip.Usuario)).toBe('TERRAZAS, JHIMY WILFREDO (BOL)');
  });

  it('arma la factura con IVA como en Oracle', () => {
    const {values, lines, missing} = buildOracleInvoice(trip, fuelInvoice);
    expect(values).toMatchObject({
      importeFactura: 144.98, codigoImpuesto: '13-IVA', condiciones: '0D', grupoPago: 'M-CENTRO', importeDescuento: '', numeroProveedor: '',
      flexfield: 'Lote de Facturas: 900\nCUF: DD5F2336313F\nCódigo Control: 0\nTipo Factura: 1', cuentaPasivo: '', fechaFactura: '21-oct-26',
    });
    expect(lines.map((line) => [line.values.tipo, line.values.importe])).toEqual([['Artículo', 126.13], ['Impuesto', 18.85]]);
    expect(missing).toEqual([]);
    expect(lines.map((line) => !!line.auto)).toEqual([false, true]);
  });

  it('arma el gasto sin factura con base incrementada y retenciones, sin la línea de impuesto en cero', () => {
    const {values, lines} = buildOracleInvoice(trip, lodging);
    expect(values).toMatchObject({
      numeroFactura: '046870', importeFactura: 214.29, codigoImpuesto: 'EMP-SIN-IVA', grupoRetencion: 'SERVICIOS Y ALQUILERES', importeRetenido: '',
      condiciones: 'Contado', grupoPago: 'TRANS-EMPLEADOS', flexfield: 'Lote de Facturas: 900\nContexto: Factura Estándar',
    });
    expect(lines.map((line) => [line.values.tipo, line.values.importe, line.values.codigoImpuesto, line.values.cuenta])).toEqual([
      ['Artículo', 214.29, 'EMP-SIN-IVA', '76.8.421.626030.000000.200.000.000'],
      ['Retención de Impuestos', -27.86, '13 RCIVA RET', '76.8.900.475196.000000.000.000.000'],
      ['Retención de Impuestos', -6.43, '3 IT RET', '76.8.900.475195.000000.000.000.000'],
    ]);
    expect(values.descripcion).toBe('A 10-40  JHIMY WILFREDO TERRAZAS , VIAJE A SCZ POR TRANSPORTE DE PRODUCTO TERMINADO , HOTELES');
  });

  it('deja sin marcar la cuenta del IUE de la línea que crea Oracle y el tipo de cambio del gasto internacional', () => {
    const purchase = buildOracleInvoice(trip, {...lodging, tipo: 'C'});
    expect(purchase.values.grupoRetencion).toBe('RETENCIONES COMPRAS');
    expect(purchase.lines[1].missing).toEqual([]);
    expect(purchase.lines[1].values.cuenta).toBe('');
    const alcohol = buildOracleInvoice(trip, {...fuelInvoice, tiene_alcohol: true}).values;
    expect(alcohol).toMatchObject({codigoImpuesto: 'EMP-SIN-IVA', condiciones: 'Contado', grupoPago: 'TRANS-EMPLEADOS', importeFactura: 144.98, flexfield: 'Lote de Facturas: 900\nContexto: Factura Estándar'});
    expect(alcohol.descripcion.startsWith('R 10-40')).toBe(true);
    expect(buildOracleInvoice(trip, {...fuelInvoice, tipo: 'R'}).values).toMatchObject({condiciones: 'Contado', grupoPago: 'TRANS-EMPLEADOS', codigoImpuesto: 'EMP-SIN-IVA'});
    const withOriginal = buildOracleInvoice(trip, {...lodging, numero_recibo: '0003431', Recibo: [{numero: 1857}]});
    expect(withOriginal.values.numeroFactura).toBe('0003431');
    expect(withOriginal.marked).toEqual([]);
    const systemOnly = buildOracleInvoice(trip, {...lodging, Recibo: [{numero: 1857}]});
    expect(systemOnly.values.numeroFactura).toBe('001857');
    expect(systemOnly.marked).toEqual(['numeroFactura']);
    const international = buildOracleInvoice(trip, {...lodging, es_gasto_internacional: true, monto_total: 50});
    expect(international.values).toMatchObject({divisaFactura: 'USD', importeFactura: 50, grupoRetencion: ''});
    expect(international.missing).toEqual(['numeroFactura']);
    expect(international.values).toMatchObject({fechaCambio: '', claseTipoCambio: '', tipoCambio: ''});
    expect(international.lines).toHaveLength(1);
    const inBs = buildOracleInvoice(trip, {...lodging, es_gasto_internacional: true, monto_total: 50, tipo_cambio_bs: 6.96, moneda_rendicion: 'BOB'});
    expect(inBs.values).toMatchObject({divisaFactura: 'BOB', importeFactura: 348});
  });

  it('relaciona cada línea con su fila de factura', () => {
    const {invoices, lines} = buildOracleRows([{trip, expenses: [fuelInvoice, lodging]}]);
    expect(invoices).toHaveLength(2);
    expect(lines.map((line) => line.values.filaFactura)).toEqual([2, 2, 3, 3, 3]);
    const topManager = buildOracleInvoice({...trip, Usuario: {...trip.Usuario, Jefe: null}}, lodging);
    expect(topManager.lines[0].values.cuenta).toBe('76.8.530.626030.000000.200.000.000');
    const noCodes = buildOracleInvoice({...trip, Usuario: {...trip.Usuario, Jefe: {codigo_dependencia: null}, Seccion: {}}}, lodging);
    expect(noCodes.lines[0].values.cuenta).toBe('76.8.XXX.626030.000000.XXX.000.000');
    expect(noCodes.lines[0].missing).toContain('cuenta');
    expect(invoices.map((invoice) => invoice.values.descripcion.slice(0, 7))).toEqual(['F 10-40', 'A 10-40']);
    const pending = buildOracleInvoice({...trip, numero_rendicion: null}, lodging);
    expect(pending.values.descripcion.startsWith('A 10-XXX')).toBe(true);
    expect(pending.missing).toContain('descripcion');
  });

  it('lista en la leyenda los datos por completar con enlace a su celda', () => {
    const workbook = new ExcelJS.Workbook();
    addOracleSheets(workbook, [{trip: {...trip, numero_rendicion: null}, expenses: [lodging]}]);
    const invoices = workbook.getWorksheet('FACTURAS');
    expect(invoices.autoFilter).toBeTruthy();
    expect(invoices.views[0]).toMatchObject({state: 'frozen', xSplit: 3, ySplit: 1});
    expect(invoices.getCell('O2').fill.fgColor.argb).toBe('FFFFC7CE');
    const legend = workbook.getWorksheet('LEYENDA ORACLE');
    expect(legend.getCell('A2').value).toContain('1 facturas');
    expect(legend.getCell('A2').value).toContain('2 datos por completar');
    expect(legend.getCell('B12').value).toEqual({text: 'O2', hyperlink: "#'FACTURAS'!O2"});
    expect(legend.getCell('D12').value).toContain('número de rendición');
  });

  it('avisa en la leyenda cuando no falta ningún dato', () => {
    const workbook = new ExcelJS.Workbook();
    addOracleSheets(workbook, [{trip, expenses: [fuelInvoice]}]);
    expect(workbook.getWorksheet('LEYENDA ORACLE').getCell('A11').value).toContain('No falta ningún dato');
  });

  it('centra el importe y los valores fijos de pago y deja en blanco la cuenta de pasivo para Oracle', () => {
    const workbook = new ExcelJS.Workbook();
    addOracleSheets(workbook, [{trip, expenses: [fuelInvoice]}]);
    const invoices = workbook.getWorksheet('FACTURAS');
    const headers = invoices.getRow(1).values;
    const cellOf = (header) => invoices.getRow(2).getCell(headers.indexOf(header));
    ['Importe de Factura', 'Método de Pago', 'Nivel de Cálculo de Impuestos', 'Nombre de Categoría de Documento', 'Nombre Secuencia Documento'].forEach((header) => {
      expect(cellOf(header).alignment.horizontal).toBe('center');
    });
    expect(cellOf('Importe de Factura').value).toBe(144.98);
    expect(cellOf('Método de Pago').value).toBe('Cheque');
    expect(cellOf('Cuenta de Pasivo').value).toBeNull();
    expect(cellOf('Cuenta de Pasivo').fill.fgColor.argb).toBe('FFDDEBF7');
  });
});
