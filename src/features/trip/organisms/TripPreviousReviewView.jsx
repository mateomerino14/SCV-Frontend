import {ArrowLeft} from 'lucide-react';
import {COLORS} from '../../../constants';
import {tripStatusConfig, tripStatusMessages} from '../hooks/useTripStatusConfig';
import TripInfoCard from '../molecules/TripInfoCard';

const styles = {
  backBtn: 'flex items-center gap-1 cursor-pointer mb-4 w-fit',
  alertBox: 'rounded-xl px-4 py-3 mb-4 text-center',
};

function TripPreviousReviewView({trip, isInternational, originRoute, navigate}) {
  const config = tripStatusConfig[trip.estado];

  return (
    <>
      <button className={styles.backBtn} onClick={() => navigate(originRoute)}>
        <ArrowLeft size={25} style={{color: COLORS.title}} />
      </button>
      <TripInfoCard trip={trip} isInternational={isInternational} />
      <div className={styles.alertBox} style={{backgroundColor: config?.bg}}>
        <p style={{color: config?.color, fontFamily: 'Inter', fontSize: 13, fontWeight: 600}}>
          {tripStatusMessages[trip.estado]}
        </p>
      </div>
    </>
  );
}

export default TripPreviousReviewView;