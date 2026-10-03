import ListCount from './ListCount';

export default {
  title: 'UI/ListCount',
  component: ListCount,
  parameters: {
    docs: {
      description: {
        component: 'Contador de las listas paginadas: "Mostrando X de Y" con el sustantivo en singular o plural.',
      },
    },
  },
  args: {
    shown: 12,
    total: 40,
    singular: 'viaje',
    plural: 'viajes',
  },
};

export const Default = {};

export const Singular = {
  args: {shown: 1, total: 1},
};
