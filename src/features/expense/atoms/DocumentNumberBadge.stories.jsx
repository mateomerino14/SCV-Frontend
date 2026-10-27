import DocumentNumberBadge from './DocumentNumberBadge';

export default {
  title: 'Expense/Atoms/DocumentNumberBadge',
  component: DocumentNumberBadge,
  parameters: {
    docs: {
      description: {
        component: 'N° de documento de un gasto: el de la factura o el del recibo original sin color, y en lila el número que asignó el sistema cuando el gasto no tiene recibo original.',
      },
    },
  },
};

export const Original = {args: {number: '0003431', source: 'original'}};

export const System = {args: {number: '000013', source: 'system'}};

export const Empty = {args: {number: '', source: 'none'}};
