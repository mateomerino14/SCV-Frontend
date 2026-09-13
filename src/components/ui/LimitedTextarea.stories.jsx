import {useState} from 'react';
import LimitedTextarea from './LimitedTextarea';
import {COLORS} from '../../constants';

const decorators = [(Story) => <div style={{backgroundColor: COLORS.primary, padding: 16, borderRadius: 16, width: 320}}><Story /></div>];

export default {
  title: 'UI/LimitedTextarea',
  component: LimitedTextarea,
  parameters: {
    docs: {
      description: {
        component: 'Textarea con límite de caracteres, usado para escribir observaciones y justificaciones. Se usa sobre un fondo de color (por eso el texto de error es blanco).',
      },
    },
  },
  decorators,
};

export const Interactive = {
  render: () => {
    const [value, setValue] = useState('');
    const maxLength = 300;
    return (
      <LimitedTextarea value={value} onChange={(event) => setValue(event.target.value)} placeholder="Escribe tu observación..."
        maxLength={maxLength} exceedsLimit={value.length >= maxLength} />
    );
  },
};

export const ExceedsLimit = {
  args: {value: 'a'.repeat(300), maxLength: 300, exceedsLimit: true},
};
