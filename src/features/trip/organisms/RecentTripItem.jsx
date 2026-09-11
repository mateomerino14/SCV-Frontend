import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {COLORS} from '../../../constants';
import {routes, tripPath} from '../../../constants/routes';
import {formatDateRange} from '../../../utils/dateFormatter';
import TripTypeBadge from '../atoms/TripTypeBadge';
import TripRoute from '../atoms/TripRoute';

const styles = {
  container: "flex items-center justify-between p-3 shadow-sm border mb-3 rounded-xl gap-2",
  left: "flex items-center gap-3 flex-1 min-w-0",
  imageWrapper: "rounded-xl p-1 shrink-0 hidden sm:block",
  info: "flex flex-col min-w-0 flex-1",
  reason: "text-sm font-bold font-inter leading-tight m-1 mb-1 truncate",
  date: "text-xs font-nunito mt-0.5 mb-1 ml-1",
  route: "ml-1 mb-1",
  amountRow: "flex flex-col gap-0.5 ml-1 mb-1",
  amount: "text-xs font-inter",
  badgeWrapper: "ml-1",
  right: "flex flex-col items-end gap-1 shrink-0 max-w-[110px] sm:max-w-none",
  status: "text-[10px] sm:text-xs font-bold font-nunito mb-4 px-2 py-1 rounded-xl text-center whitespace-nowrap",
  detailsLink: "text-xs font-bold font-nunito mt-11 cursor-pointer whitespace-nowrap",
};

const statusColors = {
  EN_REVISION_VIAJE: '#5b00a0',
  APROBADO_VIAJE: '#7a5900',
  EN_REVISION_TESORERO: '#8a4b00',
  EN_CURSO: COLORS.background,
  EN_REVISION: '#000a65',
  APROBADO_SUPERVISOR: '#7a5900',
  APROBADO_APROBADOR: '#000a65',
  APROBADO_FINAL: '#008330',
  RECHAZADO: '#500203',
};

const statusBackgrounds = {
  EN_REVISION_VIAJE: '#e8d5ff',
  APROBADO_VIAJE: '#ffd700aa',
  EN_REVISION_TESORERO: '#ffd8a8aa',
  EN_CURSO: COLORS.primary,
  EN_REVISION: '#85aff3ab',
  APROBADO_SUPERVISOR: '#ffd700aa',
  APROBADO_APROBADOR: '#85aff3ab',
  APROBADO_FINAL: '#aafac9a2',
  RECHAZADO: '#ffa7a8aa',
};

const statusLabels = {
  EN_REVISION_VIAJE: 'REVISIÓN PREVIA',
  APROBADO_VIAJE: 'APR. SUPERVISOR',
  EN_REVISION_TESORERO: 'ESPERANDO FONDOS',
  EN_CURSO: 'EN CURSO',
  EN_REVISION: 'EN REVISIÓN',
  APROBADO_SUPERVISOR: 'APR. SUPERVISOR',
  APROBADO_APROBADOR: 'APR. APROBADOR',
  APROBADO_FINAL: 'APROBADO',
  RECHAZADO: 'RECHAZADO',
};

function RecentTripItem({trip, from}) {
  const navigate = useNavigate();
  const originRoute = from || routes.employeeDashboard;
  const isInternational = trip.tipo === 'Internacional';

  return (
    <motion.div className={styles.container} style={{borderColor: COLORS.dataFields}}
      whileHover={{y: -2, boxShadow: '0 8px 18px rgba(0,0,0,0.08)'}} transition={{duration: 0.15}}>
      <div className={styles.left}>
        <div className={styles.imageWrapper} style={{backgroundColor: COLORS.fields}}>
          <img
            src="https://thumbs.dreamstime.com/b/icono-de-glifo-negro-para-viajes-negocios-reuni%C3%B3n-trabajo-fly-work-viaje-internacional-corporativo-un-pa%C3%ADs-extranjero-222264681.jpg"
            alt="Imagen por Defecto" className="h-20 rounded-lg" />
        </div>
        <div className={styles.info}>
          <p className={styles.reason} style={{color: COLORS.text}} title={trip.motivo}>{trip.motivo}</p>
          <p className={styles.date} style={{color: COLORS.environmentTypesText}}>{formatDateRange(trip.fecha_inicio, trip.fecha_fin)}</p>
          <div className={styles.route}>
            <TripRoute origin={trip.origen} destination={trip.destino} size={10} maxWidth="35%" />
          </div>
          <div className={styles.amountRow}>
            <p className={styles.amount} style={{color: COLORS.environmentTypesText}}><span className="font-bold">Bs:</span> {parseFloat(trip.monto_asignado).toFixed(2)}</p>
            {isInternational && parseFloat(trip.monto_asignado_usd || 0) > 0 && (
              <p className={styles.amount} style={{color: COLORS.primary}}><span className="font-bold">USD:</span> {parseFloat(trip.monto_asignado_usd).toFixed(2)}</p>
            )}
          </div>
          <div className={styles.badgeWrapper}>
            <TripTypeBadge isInternational={isInternational} />
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <span className={styles.status} style={{color: statusColors[trip.estado] || COLORS.labels, backgroundColor: statusBackgrounds[trip.estado] || COLORS.backgroundHeader}}>
          {statusLabels[trip.estado] || trip.estado}
        </span>
        <p className={styles.detailsLink} style={{color: COLORS.title}} onClick={() => navigate(tripPath(trip.id_viaje), {state: {from: originRoute}})}>DETALLES →</p>
      </div>
    </motion.div>
  );
}

export default RecentTripItem;