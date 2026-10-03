import InlineAlert from './InlineAlert';

export default {
  title: 'UI/InlineAlert',
  component: InlineAlert,
  parameters: {
    docs: {
      description: {
        component: 'Mensaje de retroalimentación en línea, para errores de formulario o confirmaciones de éxito.',
      },
    },
  },
};

export const ErrorMessage = {
  args: {type: 'error', children: 'El correo o la contraseña son incorrectos'},
};

export const SuccessMessage = {
  args: {type: 'success', children: 'Cambios guardados correctamente'},
};
