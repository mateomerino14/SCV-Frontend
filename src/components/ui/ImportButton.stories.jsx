import ImportButton from './ImportButton';

export default {
  title: 'UI/ImportButton',
  component: ImportButton,
  parameters: {
    docs: {
      description: {
        component: 'Botón que abre la importación desde Excel; va junto al botón de exportar.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 320}}><Story /></div>],
  args: {
    label: 'Importar desde Excel',
    disabled: false,
  },
};

export const Default = {};

export const Disabled = {
  args: {disabled: true},
};
