import ReadingTip from './ReadingTip';

export default {
  title: 'Expense/Atoms/ReadingTip',
  component: ReadingTip,
  parameters: {
    docs: {
      description: {
        component: 'Consejo que se muestra antes de escanear una factura física.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 360}}><Story /></div>],
};

export const Default = {};
