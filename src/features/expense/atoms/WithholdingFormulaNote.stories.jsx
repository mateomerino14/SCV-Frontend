import WithholdingFormulaNote from './WithholdingFormulaNote';

export default {
  title: 'Expense/Atoms/WithholdingFormulaNote',
  component: WithholdingFormulaNote,
  parameters: {
    docs: {
      description: {
        component: 'Nota bajo las retenciones de un gasto sin factura: la empresa asume los impuestos, así que las alícuotas se aplican sobre lo pagado ÷ 0.84 en servicios (÷ 0.92 en compras) y el importe costo es lo pagado más las retenciones.',
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
