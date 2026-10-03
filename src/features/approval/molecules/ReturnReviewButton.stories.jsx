import ReturnReviewButton from './ReturnReviewButton';

export default {
  title: 'Approval/Molecules/ReturnReviewButton',
  component: ReturnReviewButton,
  parameters: {
    docs: {
      description: {
        component: 'Botón "Devolver Revisión" de las pantallas de detalle: pide confirmación y se bloquea mientras se procesa.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 320}}><Story /></div>],
  args: {
    onReturn: () => new Promise((resolve) => setTimeout(resolve, 1000)),
  },
};

export const Default = {};
