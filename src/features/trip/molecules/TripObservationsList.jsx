import {COLORS} from '../../../constants';
import CommentCard from '../../../components/ui/CommentCard';
import {formatDateTime} from '../../../utils/dateFormatter';

const styles = {
  wrapper: "flex flex-col gap-3",
  sectionTitle: "text-xs font-bold font-inter uppercase mb-1",
};

function TripObservationsList({observations}) {
  if (!observations || observations.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.sectionTitle} style={{color: COLORS.environmentTypesText}}>Observaciones</p>
      {observations.map((observation) => (
        <CommentCard key={observation.id_comentario} date={formatDateTime(observation.fecha)} text={observation.descripcion}
          backgroundColor={COLORS.comments} borderColor={COLORS.secondary} />
      ))}
    </div>
  );
}

export default TripObservationsList;