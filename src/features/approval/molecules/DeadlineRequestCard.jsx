import {useState} from 'react';
import {Calendar} from 'lucide-react';
import {COLORS} from '../../../constants';
import {formatDateTime, formatDateRange} from '../../../utils/dateFormatter';
import TripRoute from '../../trip/atoms/TripRoute';

const avatarDefault = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg";

const styles = {
  card: "rounded-2xl p-4 shadow-sm flex flex-col h-full",
  headerRow: "flex items-start gap-3 mb-3",
  avatar: "w-11 h-11 rounded-full object-cover shrink-0",
  info: "flex flex-col flex-1 min-w-0",
  name: "text-sm font-bold font-inter truncate",
  position: "text-xs font-inter mt-0.5 truncate",
  statusBadge: "text-xs font-bold font-inter px-2.5 py-1 rounded-full shrink-0",
  reasonTripLabel: "text-xs font-bold font-inter uppercase mb-1",
  reasonTrip: "text-sm font-semibold font-inter mb-3 leading-snug break-words",
  dateRow: "flex items-center gap-1 mb-2",
  dateText: "text-xs font-nunito",
  routeLabel: "text-xs font-bold font-inter uppercase mb-1",
  route: "mb-3",
  reasonBox: "rounded-xl p-3 mb-3",
  reasonLabel: "text-xs font-bold font-inter uppercase mb-1",
  reasonText: "text-sm font-inter break-words",
  spacer: "flex-1",
  actionsRow: "flex gap-2",
  approveBtn: "flex-1 py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center",
  rejectBtn: "flex-1 py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center border-2",
  textarea: "w-full border rounded-xl p-2.5 text-xs font-inter outline-none resize-none mt-2",
};

const statusConfig = {
  PENDIENTE: {label: 'Pendiente', bg: '#ffd700aa', color: '#7a5900'},
  APROBADA: {label: 'Aprobada', bg: '#d4edda', color: '#155724'},
  RECHAZADA: {label: 'Rechazada', bg: '#ffa7a8aa', color: '#500203'},
};

function DeadlineRequestCard({request, onApprove, onReject, savingAction, showActions}) {
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const config = statusConfig[request.estado] || statusConfig.PENDIENTE;
  const employee = request.Viaje?.Usuario;

  const handleConfirmReject = () => {
    onReject(request.id_solicitud, rejectReason);
    setShowRejectBox(false);
    setRejectReason('');
  };

  return (
    <div className={styles.card} style={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.dataFields}`}}>
      <div className={styles.headerRow}>
        <img src={employee?.foto_perfil || avatarDefault} alt="empleado" className={styles.avatar} />
        <div className={styles.info}>
          <p className={styles.name} style={{color: COLORS.text}}>{employee?.nombre} {employee?.apellido_paterno}</p>
          <p className={styles.position} style={{color: COLORS.labels}}>{employee?.Cargo?.nombre}</p>
        </div>
        <span className={styles.statusBadge} style={{backgroundColor: config.bg, color: config.color}}>{config.label}</span>
      </div>
      {request.Viaje?.motivo && (
        <>
          <p className={styles.reasonTripLabel} style={{color: COLORS.secondary}}>Motivo</p>
          <p className={styles.reasonTrip} style={{color: COLORS.text}}>{request.Viaje.motivo}</p>
        </>
      )}
      {request.Viaje?.fecha_inicio && (
        <div className={styles.dateRow}>
          <Calendar size={11} style={{color: COLORS.labels}} />
          <p className={styles.dateText} style={{color: COLORS.labels}}>{formatDateRange(request.Viaje.fecha_inicio, request.Viaje.fecha_fin)}</p>
        </div>
      )}
      {request.Viaje?.destino && (
        <div className={styles.route}>
          <p className={styles.routeLabel} style={{color: COLORS.secondary}}>{request.Viaje.origen ? 'Ruta' : 'Lugar'}</p>
          <TripRoute origin={request.Viaje.origen} destination={request.Viaje.destino} size={10} maxWidth={150} />
        </div>
      )}
      <div className={styles.reasonBox} style={{backgroundColor: COLORS.backgroundHeader}}>
        <p className={styles.reasonLabel} style={{color: COLORS.labels}}>Motivo de la solicitud</p>
        <p className={styles.reasonText} style={{color: COLORS.text}}>{request.motivo}</p>
        {request.fecha_solicitud && <p className="text-xs font-inter mt-1" style={{color: COLORS.labels}}>{formatDateTime(request.fecha_solicitud)}</p>}
      </div>
      {request.observacion_revisor && (
        <div className={styles.reasonBox} style={{backgroundColor: COLORS.error}}>
          <p className={styles.reasonLabel} style={{color: COLORS.secondary}}>Motivo del rechazo</p>
          <p className={styles.reasonText} style={{color: COLORS.secondary}}>{request.observacion_revisor}</p>
        </div>
      )}
      <div className={styles.spacer} />
      {showActions && request.estado === 'PENDIENTE' && (
        <>
          {showRejectBox && (
            <textarea className={styles.textarea} style={{borderColor: COLORS.dataFields, color: COLORS.text, backgroundColor: COLORS.background}} rows={2} maxLength={500}
              placeholder="Motivo del rechazo (obligatorio)..." value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} />
          )}
          <div className={styles.actionsRow} style={{marginTop: showRejectBox ? 8 : 12}}>
            {!showRejectBox ? (
              <>
                <button className={styles.approveBtn} style={{backgroundColor: savingAction ? COLORS.fields : COLORS.primary, color: COLORS.background, opacity: savingAction ? 0.7 : 1}}
                  disabled={savingAction} onClick={() => onApprove(request.id_solicitud)}>
                  Aprobar
                </button>
                <button className={styles.rejectBtn} style={{backgroundColor: 'transparent', borderColor: COLORS.secondary, color: COLORS.secondary, opacity: savingAction ? 0.7 : 1}}
                  disabled={savingAction} onClick={() => setShowRejectBox(true)}>
                  Rechazar
                </button>
              </>
            ) : (
              <>
                <button className={styles.rejectBtn} style={{backgroundColor: 'transparent', borderColor: COLORS.primary, color: COLORS.primary}}
                  onClick={() => setShowRejectBox(false)}>
                  Cancelar
                </button>
                <button className={styles.approveBtn} style={{backgroundColor: savingAction || !rejectReason.trim() ? COLORS.fields : COLORS.secondary, color: COLORS.background}}
                  disabled={savingAction || !rejectReason.trim()} onClick={handleConfirmReject}>
                  {savingAction ? 'Enviando...' : 'Confirmar Rechazo'}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default DeadlineRequestCard;