import ExportButton from './ExportButton';

export default {
  title: 'UI/ExportButton',
  component: ExportButton,
  parameters: {
    docs: {
      description: {
        component: 'Botón para exportar a Excel lo que se ve en pantalla; muestra "Exportando..." mientras arma el archivo.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 320}}><Story /></div>],
  args: {
    label: 'Exportar a Excel',
    exporting: false,
    disabled: false,
  },
};

export const Default = {};

export const Exporting = {
  args: {exporting: true},
};

export const Disabled = {
  args: {disabled: true},
};
