import Button from './Button';

export default {
  title: 'UI/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Botón de acción base. Variante "primary" para acciones destructivas o de mayor peso (fondo rojo secundario), "secondary" para acciones neutras sobre ventanas de color (fondo blanco) y "outline" para acciones neutras sobre fondo blanco (borde granate).',
      },
    },
  },
  argTypes: {
    variant: {control: 'select', options: ['primary', 'secondary', 'outline']},
    disabled: {control: 'boolean'},
  },
  args: {
    text: 'Guardar Cambios',
    variant: 'primary',
    disabled: false,
  },
};

export const Primary = {
  args: {variant: 'primary'},
};

export const Secondary = {
  args: {variant: 'secondary', text: 'Cancelar'},
};

export const Outline = {
  args: {variant: 'outline', text: 'Cancelar'},
};

export const Disabled = {
  args: {disabled: true, text: 'Guardando...'},
};
