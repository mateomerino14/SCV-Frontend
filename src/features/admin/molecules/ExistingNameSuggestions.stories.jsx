import ExistingNameSuggestions from './ExistingNameSuggestions';

export default {
  title: 'Admin/Molecules/ExistingNameSuggestions',
  component: ExistingNameSuggestions,
  parameters: {
    docs: {
      description: {
        component: 'Lista de nombres ya registrados que coinciden con lo escrito, para no crear duplicados (máximo 4).',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 320}}><Story /></div>],
  args: {
    suggestions: [{id: 1, nombre: 'Ventas'}, {id: 2, nombre: 'Ventas Regionales'}],
    onSelect: () => {},
  },
};

export const Default = {};
