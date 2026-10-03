import {useState} from 'react';
import DropdownListItem from './DropdownListItem';

export default {
  title: 'UI/DropdownListItem',
  component: DropdownListItem,
  parameters: {
    docs: {
      description: {
        component: 'Ítem individual dentro de una lista desplegable (usado por InlineDropdown y EmployeeDropdown). Muestra un check cuando está seleccionado.',
      },
    },
  },
};

export const Unselected = {
  args: {label: 'Terrestre', selected: false},
};

export const Selected = {
  args: {label: 'Aéreo', selected: true},
};

export const Interactive = {
  render: () => {
    const [selected, setSelected] = useState('Nacional');
    const options = ['Nacional', 'Internacional'];
    return (
      <div style={{width: 220, border: '1px solid #DEE2F0', borderRadius: 12, overflow: 'hidden'}}>
        {options.map((option) => (
          <DropdownListItem key={option} label={option} selected={selected === option} onClick={() => setSelected(option)} />
        ))}
      </div>
    );
  },
};
