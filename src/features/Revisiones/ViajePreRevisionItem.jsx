import { useNavigate } from 'react-router-dom'
import { Globe, MapPin, Navigation, Calendar, Plane, Car, CheckCircle2, AlertTriangle } from 'lucide-react'
import { COLORS } from '../../constants'

const AVATAR_DEFAULT = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg"

const estadoConfig = {
  EN_REVISION_VIAJE: { label: 'Pendiente', bg: '#e8d5ff', color: '#5b00a0' },
  APROBADO_VIAJE: { label: 'Esperando Aprobador', bg: '#ffd700aa', color: '#7a5900' },
  EN_REVISION_TESORERO: { label: 'Esperando Fondos', bg: '#ffd8a8aa', color: '#8a4b00' },
  EN_CURSO: { label: 'Aprobado (En Curso)', bg: '#d4edda', color: '#155724' },
  APROBADO_SUPERVISOR: { label: 'Pend. Revisión Final', bg: '#85aff3ab', color: '#000a65' },
  APROBADO_FINAL: { label: 'Aprobado', bg: '#d4edda', color: '#155724' },
  RECHAZADO: { label: 'Rechazado', bg: '#ffa7a8aa', color: '#500203' },
}

const estadoRevisionConfig = {
  CONFORME: { label: 'Conforme', bg: '#d4edda', color: '#155724', icono: CheckCircle2 },
  OBSERVADO: { label: 'Observado', bg: '#fef3cd', color: '#856404', icono: AlertTriangle },
}

const formatFecha = (f1, f2) => {
  const [y1, m1, d1] = f1.split('-')
  const [y2, m2, d2] = f2.split('-')
  const opts = { day: 'numeric', month: 'short' }
  return `${new Date(y1, m1 - 1, d1).toLocaleDateString('es-ES', opts)} — ${new Date(y2, m2 - 1, d2).toLocaleDateString('es-ES', opts)}`
}

const estadoPendienteSegunCampo = {
  id_supervisor_asignado: 'EN_REVISION_VIAJE',
  id_aprobador_asignado: 'APROBADO_VIAJE',
  id_tesorero_asignado: 'EN_REVISION_TESORERO',
}

const getTransporteIcon = (transporte) => {
  const t = (transporte || '').toLowerCase()
  if (t.includes('aére') || t.includes('aer') || t.includes('avi')) return Plane
  if (t.includes('terrestre') || t.includes('bus') || t.includes('auto')) return Car
  return Navigation
}

const styles = {
  container: "flex flex-col p-4 shadow-sm border mb-3 rounded-2xl gap-3",
  headerRow: "flex items-start justify-between gap-3",
  empleadoRow: "flex items-center gap-2.5 min-w-0",
  avatar: "w-11 h-11 rounded-full object-cover border shrink-0",
  empleadoNombre: "text-sm font-bold font-inter truncate",
  estadosCol: "flex flex-col gap-1.5 items-end shrink-0",
  estadoBadge: "text-xs font-bold font-inter px-2 py-1 rounded-xl text-center whitespace-nowrap",
  estadoRevisionBadge: "text-xs font-bold font-inter px-2 py-1 rounded-lg text-center whitespace-nowrap flex items-center gap-1",
  info: "flex flex-col min-w-0",
  motivo: "text-sm font-bold font-inter leading-tight mb-1",
  fechaRow: "flex items-center gap-1 mb-1",
  fechaTxt: "text-xs font-nunito",
  rutaRow: "flex items-center gap-1 mb-1 flex-wrap",
  rutaTxt: "text-xs font-inter",
  badgesRow: "flex gap-1 flex-wrap mb-1",
  badge: "text-xs font-bold font-inter px-2 py-0.5 rounded-lg flex items-center gap-1",
  montoRow: "flex gap-3 flex-wrap",
  montoTxt: "text-xs font-inter",
  botonesRow: "flex gap-2",
  btn: "flex-1 h-9 rounded-xl font-bold font-nunito text-xs cursor-pointer text-center tracking-wide flex items-center justify-center",
}

function ViajePreRevisionItem({ viaje, rutaDetalle, origenDetalle, onTomar, onDevolver, tomando, campoAsignado = 'id_supervisor_asignado', labelDetalle = 'Ver Detalle' }) {
  const navigate = useNavigate()
  const estado = estadoConfig[viaje.estado] || estadoConfig['EN_REVISION_VIAJE']
  const esInternacional = viaje.tipo === 'Internacional'
  const sinAsignar = !viaje[campoAsignado]
  const estadoPendiente = estadoPendienteSegunCampo[campoAsignado]
  const puedeDevolver = !!onDevolver && !sinAsignar && viaje.estado === estadoPendiente
  const TransporteIcon = getTransporteIcon(viaje.transporte)
  const empleado = viaje.Usuario
  const revisionInfo = viaje.estadoRevision ? estadoRevisionConfig[viaje.estadoRevision] : null
  const IconoRevision = revisionInfo?.icono

  return (
    <div
      className={styles.container}
      style={{
        borderColor: COLORS.dataFields,
        backgroundColor: COLORS.background,
      }}
    >
      <div className={styles.headerRow}>
        {empleado ? (
          <div className={styles.empleadoRow}>
            <img
              src={empleado.foto_perfil || AVATAR_DEFAULT}
              alt="empleado"
              className={styles.avatar}
              style={{ borderColor: COLORS.dataFields }}
              onError={(e) => { e.target.src = AVATAR_DEFAULT }}
            />
            <p className={styles.empleadoNombre} style={{ color: COLORS.text }}>
              {empleado.nombre} {empleado.apellido_paterno}
            </p>
          </div>
        ) : <div />}

        <div className={styles.estadosCol}>
          <span
            className={styles.estadoBadge}
            style={{ backgroundColor: estado.bg, color: estado.color }}
          >
            {estado.label}
          </span>
          {revisionInfo && (
            <span
              className={styles.estadoRevisionBadge}
              style={{ backgroundColor: revisionInfo.bg, color: revisionInfo.color }}
            >
              {IconoRevision && <IconoRevision size={11} />}
              {revisionInfo.label}
            </span>
          )}
        </div>
      </div>

      <div className={styles.info}>
        <p className={styles.motivo} style={{ color: COLORS.text }}>{viaje.motivo}</p>

        <div className={styles.fechaRow}>
          <Calendar size={11} style={{ color: COLORS.labels }} />
          <p className={styles.fechaTxt} style={{ color: COLORS.labels }}>
            {formatFecha(viaje.fecha_inicio, viaje.fecha_fin)}
          </p>
        </div>

        {viaje.origen && (
          <div className={styles.rutaRow}>
            <Navigation size={10} style={{ color: COLORS.labels }} />
            <p className={styles.rutaTxt} style={{ color: COLORS.labels, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {viaje.origen}
            </p>
            <span style={{ color: COLORS.dataFields, fontSize: 10 }}>→</span>
            <MapPin size={10} style={{ color: COLORS.secondary }} />
            <p className={styles.rutaTxt} style={{ color: COLORS.labels, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {viaje.destino}
            </p>
          </div>
        )}
        {!viaje.origen && (
          <div className={styles.rutaRow}>
            <MapPin size={10} style={{ color: COLORS.secondary }} />
            <p className={styles.rutaTxt} style={{ color: COLORS.labels }}>{viaje.destino}</p>
          </div>
        )}

        <div className={styles.badgesRow}>
          <span
            className={styles.badge}
            style={{
              backgroundColor: esInternacional ? COLORS.primary + '20' : COLORS.title + '15',
              color: esInternacional ? COLORS.primary : COLORS.title,
            }}
          >
            {esInternacional ? <Globe size={11} /> : <MapPin size={11} />}
            {esInternacional ? 'Internacional' : 'Nacional'}
          </span>
          {viaje.transporte && (
            <span
              className={styles.badge}
              style={{ backgroundColor: COLORS.title + '15', color: COLORS.title }}
            >
              <TransporteIcon size={11} />
              {viaje.transporte}
            </span>
          )}
        </div>

        <div className={styles.montoRow}>
          <p className={styles.montoTxt} style={{ color: COLORS.text_enviroment_types }}>
            <span className="font-bold">Bs:</span> {parseFloat(viaje.monto_asignado).toFixed(2)}
          </p>
          {esInternacional && parseFloat(viaje.monto_asignado_usd || 0) > 0 && (
            <p className={styles.montoTxt} style={{ color: COLORS.primary }}>
              <span className="font-bold">USD:</span> {parseFloat(viaje.monto_asignado_usd).toFixed(2)}
            </p>
          )}
        </div>
      </div>

      <div className={styles.botonesRow}>
        {onTomar && sinAsignar ? (
          <>
            <button
              className={styles.btn}
              style={{ backgroundColor: 'transparent', border: `1.5px solid ${COLORS.title}`, color: COLORS.title }}
              onClick={() => navigate(rutaDetalle, { state: { from: origenDetalle } })}
            >
              Ver
            </button>
            <button
              className={styles.btn}
              style={{ backgroundColor: COLORS.primary, color: COLORS.background, opacity: tomando ? 0.7 : 1 }}
              onClick={() => onTomar(viaje.id_viaje)}
              disabled={tomando}
            >
              {tomando ? 'Asignando...' : 'Asignarme'}
            </button>
          </>
        ) : puedeDevolver ? (
          <>
            <button
              className={styles.btn}
              style={{ backgroundColor: COLORS.title, color: COLORS.background }}
              onClick={() => navigate(rutaDetalle, { state: { from: origenDetalle } })}
            >
              Revisar
            </button>
            <button
              className={styles.btn}
              style={{ backgroundColor: 'transparent', border: `1.5px solid ${COLORS.secondary}`, color: COLORS.secondary }}
              onClick={() => onDevolver(viaje.id_viaje)}
            >
              Devolver
            </button>
          </>
        ) : (
          <button
            className={styles.btn}
            style={{ backgroundColor: COLORS.title, color: COLORS.background }}
            onClick={() => navigate(rutaDetalle, { state: { from: origenDetalle } })}
          >
            {labelDetalle}
          </button>
        )}
      </div>
    </div>
  )
}

export default ViajePreRevisionItem;