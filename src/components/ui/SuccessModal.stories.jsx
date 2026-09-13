import {useState} from 'react';
import SuccessModal from './SuccessModal';
import Button from './Button';

export default {
  title: 'UI/SuccessModal',
  component: SuccessModal,
  parameters: {
    docs: {
      description: {
        component: 'Modal de confirmación de éxito, mostrado tras completar una acción importante (crear usuario, aprobar solicitud, etc).',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button text="Simular acción exitosa" onClick={() => setIsOpen(true)} />
        <SuccessModal isOpen={isOpen} title="Usuario Creado" message="El usuario fue registrado correctamente." onAccept={() => setIsOpen(false)} />
      </div>
    );
  },
};
