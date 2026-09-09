import {ArrowLeft} from 'lucide-react';
import {COLORS} from '../../../constants';
import {editTripPath} from '../../../constants/routes';
import TripInfoCard from '../molecules/TripInfoCard';
import TripObservationsList from '../molecules/TripObservationsList';

const styles = {
  backBtn: 'flex items-center gap-1 cursor-pointer mb-4 w-fit',
  card: 'rounded-2xl p-5 shadow-md mb-4 border',
  alertBox: 'rounded-xl px-4 py-3 mb-4 text-center',
  errorMsg: 'text-xs font-inter italic text-center py-2 px-3 rounded-xl mt-2 mb-2',
  submitBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer mt-3',
};

function TripRejectedPreviousView({trip, tripId, isInternational, originRoute, navigate, observations, error}) {
  const generalObservations = observations.filter((observation) => !observation.id_gasto);
  const showObservations = generalObservations.length > 0;

  return (
    <>
      <button className={styles.backBtn} onClick={() => navigate(originRoute)}>
        <ArrowLeft size={25} style={{color: COLORS.title}} />
      </button>
      <TripInfoCard trip={trip} isInternational={isInternational} />
      {showObservations && (
        <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
          <TripObservationsList observations={generalObservations} />
        </div>
      )}
      <div className={styles.alertBox} style={{backgroundColor: '#ffa7a8aa'}}>
        <p style={{color: '#500203', fontFamily: 'Inter', fontSize: 13, fontWeight: 600}}>
          Tu viaje fue rechazado en la fase de aprobación previa. Revisa las observaciones y corrige los datos.
        </p>
      </div>
      {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
      <button className={styles.submitBtn} style={{backgroundColor: COLORS.primary}}
        onClick={() => navigate(editTripPath(tripId), {state: {from: originRoute}})}>
        Editar y Reenviar Viaje
      </button>
    </>
  );
}

export default TripRejectedPreviousView;