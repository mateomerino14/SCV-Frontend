import {describe, it, expect} from 'vitest';
import {filterValidSubitems, amountWithSubitems, validateSubitems, buildSubitemsPayload} from './expenseSubitems';

describe('Subgastos de un gasto', () => {
  const subitems = [{id: 's1', description: 'Taxi', amount: '80.10'}, {id: 's2', description: ' ', amount: '5'}, {id: 's3', description: 'Peaje', amount: '9.90'}];

  it('suma solo los subgastos completos y, sin ellos, usa el monto escrito', () => {
    const valid = filterValidSubitems(subitems);
    expect(valid.map((subitem) => subitem.id)).toEqual(['s1', 's3']);
    expect(amountWithSubitems('12', true, valid)).toBe(90);
    expect(amountWithSubitems('12', false, valid)).toBe(12);
    expect(amountWithSubitems('12', true, [])).toBe(12);
  });

  it('marca los subgastos incompletos y arma los datos que se envían', () => {
    expect(validateSubitems(subitems)).toEqual({s2: {description: 'La descripción es requerida'}});
    expect(buildSubitemsPayload([{description: ' Taxi ', amount: '80.10'}])).toEqual([{descripcion: 'Taxi', monto: 80.1}]);
  });
});
