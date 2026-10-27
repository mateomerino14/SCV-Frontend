import WithholdingSummary from './WithholdingSummary';
import {calculateWithholdings} from '../../../utils/withholdings';

export default {
  title: 'Expense/Molecules/WithholdingSummary',
  component: WithholdingSummary,
  parameters: {
    docs: {
      description: {
        component: 'Resumen de retenciones de un gasto sin factura al registrarlo o editarlo: monto pagado, RC-IVA o IUE, IT e importe costo (base incrementada), con la nota que explica el cálculo.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 340}}><Story /></div>],
};

export const Service = {
  args: {title: 'Retenciones — Servicio sin Factura', type: 'S', paid: 40, withholdings: calculateWithholdings(40, 'S', false)},
};

export const Purchase = {
  args: {title: 'Retenciones — Compra sin Factura', type: 'C', paid: 92, withholdings: calculateWithholdings(92, 'C', false)},
};
