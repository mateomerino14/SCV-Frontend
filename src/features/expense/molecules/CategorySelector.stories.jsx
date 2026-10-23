import {useState} from 'react';
import CategorySelector from './CategorySelector';
import {oracleAccounts} from '../../../constants/oracleAccounts';

const categories = oracleAccounts.map((nombre, index) => ({id_categoria: index + 1, nombre}));

export default {
  title: 'Expense/Molecules/CategorySelector',
  component: CategorySelector,
  parameters: {
    docs: {
      description: {
        component: 'Selector de la categoría de un gasto: el plan de cuentas contables de la empresa (más de cien cuentas), con buscador por número de cuenta o nombre.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 360, minHeight: 320}}><Story /></div>],
};

export const Interactive = {
  render: () => {
    const [categoryId, setCategoryId] = useState(null);
    return <CategorySelector categories={categories} categoryId={categoryId} onChange={setCategoryId} />;
  },
};

export const WithError = {
  args: {categories, categoryId: null, onChange: () => {}, error: 'La categoría es requerida'},
};

export const Disabled = {
  args: {categories, categoryId: 58, onChange: () => {}, disabled: true},
};
