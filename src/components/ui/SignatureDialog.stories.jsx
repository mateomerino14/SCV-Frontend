import {useState} from 'react';
import {CheckCircle} from 'lucide-react';
import SignatureDialog from './SignatureDialog';

export default {
  title: 'UI/SignatureDialog',
  component: SignatureDialog,
  parameters: {
    docs: {
      description: {
        component: 'Ventana de confirmación con firma: muestra la firma digital registrada en el perfil y pide la contraseña para firmar; si la persona aún no tiene firma, la dibuja ahí y queda guardada. Se usa al aprobar el viaje (memorándum), al enviar la rendición, al aprobarla y en la revisión final.',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [result, setResult] = useState('');
    return (
      <div>
        <button type="button" onClick={() => setOpen(true)}>Abrir</button>
        <p style={{fontSize: 12}}>{result}</p>
        <SignatureDialog isOpen={open} icon={CheckCircle} title="Aprobar Viaje" message="Firma para aprobar el viaje y emitir el memorándum."
          confirmText="Firmar y aprobar" onCancel={() => setOpen(false)} onConfirm={(signature) => {setResult(`Firma de ${signature.length} caracteres`); setOpen(false);}} />
      </div>
    );
  },
};
