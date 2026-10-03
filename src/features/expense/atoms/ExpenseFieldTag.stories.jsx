import {Calendar} from 'lucide-react';
import ExpenseFieldTag from './ExpenseFieldTag';
import {COLORS} from '../../../constants';

export default {
  title: 'Expense/Atoms/ExpenseFieldTag',
  component: ExpenseFieldTag,
  parameters: {
    docs: {
      description: {
        component: 'Dato breve con ícono que acompaña a cada gasto en las listas.',
      },
    },
  },
  args: {
    icon: Calendar,
    text: '15/09/2026',
    color: COLORS.primary,
  },
};

export const Default = {};
