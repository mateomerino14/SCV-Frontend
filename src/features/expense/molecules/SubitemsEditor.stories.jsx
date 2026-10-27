import SubitemsEditor from './SubitemsEditor';

export default {
  title: 'Expense/Molecules/SubitemsEditor',
  component: SubitemsEditor,
  parameters: {
    docs: {
      description: {
        component: 'Filas editables de subgastos con su monto, el botón de basurero para quitar una fila y el total.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 380}}><Story /></div>],
};

const handlers = {onAdd: () => {}, onRemove: () => {}, onDescriptionChange: () => {}, onAmountChange: () => {}};

export const TwoLines = {
  args: {...handlers, currency: 'PEN', total: 170, errors: {}, subitems: [{id: 's1', description: 'Taxi al hotel', amount: '80.00'}, {id: 's2', description: 'Taxi a la feria', amount: '90.00'}]},
};

export const WithErrors = {
  args: {...handlers, currency: 'Bs', total: 0, errors: {s1: {description: 'La descripción es requerida', amount: 'El monto es requerido'}}, subitems: [{id: 's1', description: '', amount: ''}]},
};
