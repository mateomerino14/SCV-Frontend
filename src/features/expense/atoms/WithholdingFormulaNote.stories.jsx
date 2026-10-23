import WithholdingFormulaNote from './WithholdingFormulaNote';

export default {
  title: 'Expense/Atoms/WithholdingFormulaNote',
  component: WithholdingFormulaNote,
  parameters: {
    docs: {
      description: {
        component: 'Nota bajo las retenciones de un gasto sin factura: la empresa asume los impuestos, así que lo pagado se incrementa (÷ 0.84 en servicios, ÷ 0.92 en compras) y las alícuotas se aplican sobre ese importe costo.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 320}}><Story /></div>],
};

export const Service = {
  args: {type: 'S'},
};

export const Purchase = {
  args: {type: 'C'},
};
