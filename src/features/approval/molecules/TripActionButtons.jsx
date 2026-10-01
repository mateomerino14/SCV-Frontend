import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Undo2} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

const styles = {
  row: "flex gap-2",
  btn: "flex-1 h-9 rounded-xl font-bold font-nunito text-xs cursor-pointer text-center tracking-wide flex items-center justify-center",
};

function TripActionButtons({detailRoute, originRoute, onTake, taking, onReturn, canReturn, detailLabel = 'Ver Detalle'}) {
  const navigate = useNavigate();
  const [confirmReturn, setConfirmReturn] = useState(false);
  const [returning, setReturning] = useState(false);
  // Devolver pide confirmacion y queda bloqueado mientras se procesa (evita el doble clic)
  const handleConfirmReturn = async () => {
    setReturning(true);
    await onReturn();
    setReturning(false);
    setConfirmReturn(false);
  };
  if (onTake) {
    return (
      <div className={styles.row}>
        <button className={styles.btn} style={{backgroundColor: 'transparent', border: `1.5px solid ${COLORS.title}`, color: COLORS.title}}
          onClick={() => navigate(detailRoute, {state: {from: originRoute}})}>Ver</button>
        <button className={styles.btn} style={{backgroundColor: COLORS.primary, color: COLORS.background, opacity: taking ? 0.7 : 1}}
          disabled={taking} onClick={onTake}>{taking ? 'Asignando...' : 'Asignarme'}</button>
      </div>
    );
  }
  if (canReturn) {
    return (
      <div className={styles.row}>
        <button className={styles.btn} style={{backgroundColor: COLORS.title, color: COLORS.background}}
          onClick={() => navigate(detailRoute, {state: {from: originRoute}})}>Revisar</button>
        <button className={styles.btn} style={{backgroundColor: 'transparent', border: `1.5px solid ${COLORS.secondary}`, color: COLORS.secondary, opacity: returning ? 0.6 : 1}}
          disabled={returning} onClick={() => setConfirmReturn(true)}>{returning ? 'Devolviendo...' : 'Devolver'}</button>
        <ConfirmDialog isOpen={confirmReturn} icon={Undo2} title="Devolver revisión"
          message="El viaje volverá a la lista sin asignar para que otra persona pueda revisarlo."
          confirmText="Devolver" onConfirm={handleConfirmReturn} onCancel={() => setConfirmReturn(false)} loading={returning} compact />
      </div>
    );
  }
  return (
    <div className={styles.row}>
      <button className={styles.btn} style={{backgroundColor: COLORS.title, color: COLORS.background}}
        onClick={() => navigate(detailRoute, {state: {from: originRoute}})}>{detailLabel}</button>
    </div>
  );
}

export default TripActionButtons;