import {ArrowLeft, Pencil, Send} from 'lucide-react';
import {COLORS} from '../../../constants';
import {editTripPath} from '../../../constants/routes';
import TripInfoCard from '../molecules/TripInfoCard';
import SubmitTripConfirmModal from './SubmitTripConfirmModal';
import useSubmitDraftTrip from '../hooks/useSubmitDraftTrip';

const styles = {
  backBtn: 'flex items-center gap-1 cursor-pointer mb-4 w-fit',
  alertBox: 'rounded-xl px-4 py-3 mb-4 text-center border',
  errorMsg: 'text-xs font-inter italic text-center py-2 px-3 rounded-xl mt-2 mb-2',
  actionRow: 'flex gap-3 mb-2',
  actionBtn: 'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer border transition-colors',
};

function TripDraftView({trip, tripId, isInternational, originRoute, navigate}) {
  const {showModal, setShowModal, submitting, error, handleConfirm} = useSubmitDraftTrip(tripId, () => navigate(originRoute));

  return (
    <>
      <button className={styles.backBtn} onClick={() => navigate(originRoute)}>
        <ArrowLeft size={25} style={{color: COLORS.title}} />
      </button>
      <TripInfoCard trip={trip} isInternational={isInternational} />
      <div className={styles.alertBox} style={{backgroundColor: COLORS.backgroundHeader, borderColor: COLORS.dataFields}}>
        <p style={{color: COLORS.text_enviroment_types, fontFamily: 'Inter', fontSize: 13, fontWeight: 600}}>
          Este viaje aún no ha sido enviado a revisión. Complétalo y envíalo cuando esté listo.
        </p>
      </div>
      {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
      <div className={styles.actionRow}>
        <button className={styles.actionBtn} style={{borderColor: COLORS.primary, color: COLORS.primary}}
          onClick={() => navigate(editTripPath(tripId), {state: {from: originRoute}})}>
          <Pencil size={16} />
          Editar
        </button>
        <button className={styles.actionBtn} style={{backgroundColor: COLORS.secondary, borderColor: COLORS.secondary, color: COLORS.background}}
          onClick={() => setShowModal(true)}>
          <Send size={16} />
          Enviar a Revisión
        </button>
      </div>
      <SubmitTripConfirmModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={handleConfirm} loading={submitting} />
    </>
  );
}

export default TripDraftView;