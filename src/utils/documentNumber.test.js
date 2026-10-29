import {describe, it, expect} from 'vitest';
import {resolveDocumentNumber} from './documentNumber';

describe('N° de documento de un gasto', () => {
  it('usa la factura, luego el recibo original y, si no hay, el número del sistema', () => {
    expect(resolveDocumentNumber({Factura: {numero_factura: '123'}, numero_recibo: '9'})).toEqual({number: '123', source: 'invoice'});
    expect(resolveDocumentNumber({numero_recibo: ' 0003431 ', Recibo: [{numero: 13}]})).toEqual({number: '0003431', source: 'original'});
    expect(resolveDocumentNumber({Recibo: [{numero: 13}]})).toEqual({number: '000013', source: 'system'});
    expect(resolveDocumentNumber({tipo: 'S', Recibo: []}, [{id_gasto: null, tipo: 'S', numero: 7, es_gasto_internacional: false}])).toEqual({number: '000007', source: 'system'});
    expect(resolveDocumentNumber({Factura: {numero_factura: 'No Especificado'}})).toEqual({number: '', source: 'none'});
  });

  it('el número del sistema lleva su mes porque el correlativo vuelve a 1 cada mes', () => {
    expect(resolveDocumentNumber({Recibo: [{numero: 12, periodo: '2026-10'}]})).toEqual({number: '000012/10-2026', source: 'system'});
  });
});
