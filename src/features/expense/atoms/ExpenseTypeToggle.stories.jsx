import {useState} from 'react';
import ExpenseTypeToggle from './ExpenseTypeToggle';

export default {
  title: 'Expense/Atoms/ExpenseTypeToggle',
  component: ExpenseTypeToggle,
  parameters: {
    docs: {
      description: {
        component: 'Selector del tipo de registro del recibo: Compra (C) o Servicio (S).',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [type, setType] = useState('C');
    return (
      <div style={{width: 320}}>
        <ExpenseTypeToggle type={type} onChange={setType} />
      </div>
    );
  },
};
