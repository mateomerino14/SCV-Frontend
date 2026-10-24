import {describe, it, expect} from 'vitest';
import {buildOracleInvoice, buildOracleRows, formatOracleDate, buildSupplierName} from './oracleExport';

const trip = {
  id_viaje: 40, fecha_inicio: '2026-10-20', motivo: 'Viaje a SCZ por transporte de producto terminado',
  Usuario: {nombre: 'Jhimy Wilfredo', apellido_paterno: 'Terrazas', apellido_materno: null},
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
      flexfield: '900....Factura Estándar...DD5F2336313F.0..1..', cuentaPasivo: '76.8.900.466100.000000.000.000.000', fechaFactura: '21-oct-26',
    });
    expect(lines.map((line) => [line.values.tipo, line.values.importe])).toEqual([['Artículo', 126.13], ['Impuesto', 18.85]]);
    expect(missing).toEqual([]);
    expect(lines.map((line) => !!line.auto)).toEqual([false, true]);
  });

  it('arma el gasto sin factura con base incrementada y retenciones', () => {
    const {values, lines} = buildOracleInvoice(trip, lodging);
    expect(values).toMatchObject({
      numeroFactura: '46870', importeFactura: 214.29, codigoImpuesto: 'EMP-SIN-IVA', grupoRetencion: 'SERVICIOS Y ALQUILERES', importeRetenido: '',
      condiciones: 'Contado', grupoPago: 'TRANS-EMPLEADOS', flexfield: '900....Factura Estándar........',
    });
    expect(lines.map((line) => [line.values.tipo, line.values.importe, line.values.codigoImpuesto, line.values.cuenta])).toEqual([
      ['Artículo', 214.29, 'EMP-SIN-IVA', '76.8.900.626030.000000.000.000.000'],
      ['Impuesto', 0, 'EMP-SIN-IVA', '76.8.900.472000.000000.000.000.000'],
      ['Retención de Impuestos', -27.86, '13 RCIVA RET', '76.8.900.475196.000000.000.000.000'],
      ['Retención de Impuestos', -6.43, '3 IT RET', '76.8.900.475195.000000.000.000.000'],
    ]);
    expect(values.descripcion).toBe('RC VIA-40/2026  JHIMY WILFREDO TERRAZAS , VIAJE A SCZ POR TRANSPORTE DE PRODUCTO TERMINADO , HOTELES');
  });

  it('marca para completar la cuenta del IUE y el tipo de cambio del gasto internacional', () => {
    const purchase = buildOracleInvoice(trip, {...lodging, tipo: 'C'});
    expect(purchase.values.grupoRetencion).toBe('RETENCIONES COMPRAS');
    expect(purchase.lines[2].missing).toEqual(['cuenta']);
    const international = buildOracleInvoice(trip, {...lodging, es_gasto_internacional: true, monto_total: 50});
    expect(international.values).toMatchObject({divisaFactura: 'USD', importeFactura: 50, grupoRetencion: ''});
    expect(international.missing).toEqual(['numeroFactura', 'claseTipoCambio', 'tipoCambio']);
    expect(international.overrides).toEqual(['fechaCambio']);
    expect(international.lines).toHaveLength(2);
  });

  it('relaciona cada línea con su fila de factura', () => {
    const {invoices, lines} = buildOracleRows([{trip, expenses: [fuelInvoice, lodging]}]);
    expect(invoices).toHaveLength(2);
    expect(lines.map((line) => line.values.filaFactura)).toEqual([2, 2, 3, 3, 3, 3]);
  });
});
