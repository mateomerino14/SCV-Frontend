import {useState} from 'react';
import {Phone} from 'lucide-react';
import ProfileField from './ProfileField';

export default {
  title: 'User/Molecules/ProfileField',
  component: ProfileField,
  parameters: {
    docs: {
      description: {
        component: 'Dato editable del perfil: muestra el valor y, al editar, un campo con botones de guardar y cancelar.',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [value, setValue] = useState('71234567');
    const [editValue, setEditValue] = useState(value);
    const [editing, setEditing] = useState(false);
    return (
      <div style={{width: 340}}>
        <ProfileField icon={Phone} label="Teléfono" value={value} editing={editing} editValue={editValue} inputMode="numeric"
          onEditValueChange={(event) => setEditValue(event.target.value)} onStartEdit={() => {setEditValue(value); setEditing(true);}}
          onSave={() => {setValue(editValue); setEditing(false);}} onCancel={() => setEditing(false)} />
      </div>
    );
  },
};
