import {useState} from 'react';
import SignaturePad from './SignaturePad';

export default {
  title: 'UI/SignaturePad',
  component: SignaturePad,
  parameters: {
    docs: {
      description: {
        component: 'Recuadro para firmar con el dedo o el mouse en el momento de aprobar. No se suben fotos: el trazo se dibuja cada vez y se guarda con el nombre, la fecha y la hora. Devuelve la firma como PNG o null si se borra.',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [signature, setSignature] = useState(null);
    return (
      <div style={{width: 320}}>
        <SignaturePad onChange={setSignature} />
        <p style={{fontSize: 12, marginTop: 8}}>{signature ? 'Firma lista' : 'Sin firma'}</p>
      </div>
    );
  },
};
