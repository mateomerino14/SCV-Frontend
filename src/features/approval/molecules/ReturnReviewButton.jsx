import {useState} from 'react';
import {Undo2} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

const styles = {
  button: 'w-full py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center border mb-4',
};

// "Devolver Revisión" de las pantallas de detalle: pide confirmacion y queda bloqueado
// mientras se procesa, igual que el boton Devolver de las listas
function ReturnReviewButton({onReturn}) {
  const [confirming, setConfirming] = useState(false);
  const [returning, setReturning] = useState(false);
  const handleConfirm = async () => {
    setReturning(true);
    await onReturn();
    setReturning(false);
    setConfirming(false);
  };
  return (
    <>
      <button className={styles.button} style={{borderColor: COLORS.secondary, color: COLORS.secondary, opacity: returning ? 0.6 : 1}}
        disabled={returning} onClick={() => setConfirming(true)}>
        {returning ? 'Devolviendo...' : 'Devolver Revisión'}
      </button>
      <ConfirmDialog isOpen={confirming} icon={Undo2} title="Devolver Revisión"
        message="El viaje volverá a la lista sin asignar para que otra persona pueda revisarlo."
        confirmText="Devolver" onConfirm={handleConfirm} onCancel={() => setConfirming(false)} loading={returning} compact />
    </>
  );
}

export default ReturnReviewButton;
