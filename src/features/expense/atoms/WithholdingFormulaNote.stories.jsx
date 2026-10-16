import WithholdingFormulaNote from './WithholdingFormulaNote';

export default {
  title: 'Expense/Atoms/WithholdingFormulaNote',
  component: WithholdingFormulaNote,
  parameters: {
    docs: {
      description: {
        component: 'Nota bajo las retenciones de un gasto sin factura: las alícuotas se aplican sobre el total del documento y el importe a cancelar es el total menos las retenciones.',
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
