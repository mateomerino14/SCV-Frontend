import {useState} from 'react';
import CategorySelector from './CategorySelector';
import {oracleAccounts} from '../../../constants/oracleAccounts';

const sampleNotes = {
  '626010 TAXIS (VIAJE)': 'Transporte para movilización cuando el personal está de viaje',
  '626040 MANUTENCION (VIAJE)': 'Alimentación cuando el personal está de viaje',
  '629060 TAXIS GESTION OFICINA (BOLIVIA)': 'Transporte de movilización para trámites operativos o propios de la planta (no de viaje)',
};

const categories = oracleAccounts.map((nombre, index) => ({id_categoria: index + 1, nombre, descripcion: sampleNotes[nombre] || null}));
const manutencionId = categories.find((category) => category.nombre.startsWith('626040')).id_categoria;

export default {
  title: 'Expense/Molecules/CategorySelector',
  component: CategorySelector,
  parameters: {
    docs: {
      description: {
        component: 'Selector de la categoría de un gasto: el plan de cuentas contables de la empresa, con buscador por número de cuenta, nombre o nota de uso. Las cuentas con nota (de la planilla de Castro) la muestran en la lista y debajo de la categoría elegida.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 360, minHeight: 360}}><Story /></div>],
};

export const Interactive = {
  render: () => {
    const [categoryId, setCategoryId] = useState(null);
    return <CategorySelector categories={categories} categoryId={categoryId} onChange={setCategoryId} />;
  },
};

export const SelectedWithNote = {
  render: () => {
    const [categoryId, setCategoryId] = useState(manutencionId);
    return <CategorySelector categories={categories} categoryId={categoryId} onChange={setCategoryId} />;
  },
};

export const WithError = {
  args: {categories, categoryId: null, onChange: () => {}, error: 'La categoría es requerida'},
};

export const Disabled = {
  args: {categories, categoryId: manutencionId, onChange: () => {}, disabled: true},
};
