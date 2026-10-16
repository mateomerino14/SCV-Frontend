import WithholdingFormulaNote from './WithholdingFormulaNote';

export default {
  title: 'Expense/Atoms/WithholdingFormulaNote',
  component: WithholdingFormulaNote,
  parameters: {
    docs: {
      description: {
        component: 'Nota bajo las retenciones de un gasto sin factura que explica la base incrementada: las alícuotas se aplican sobre la base imponible, no sobre el monto pagado.',
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
