import { useNavigate } from 'react-router-dom'
import { COLORS } from '../../constants'
import { AlertTriangle, CheckCircle, Globe, MapPin, Navigation, Plane, Car } from 'lucide-react'

const AVATAR_DEFAULT = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg"

const styles = {
  card: 'rounded-2xl shadow-sm overflow-hidden flex flex-col',
  cardContent: 'p-4 flex flex-col flex-1',
  headerRow: 'flex items-center gap-3 mb-3',
  avatar: 'w-12 h-12 rounded-full object-cover shrink-0',
  empleadoInfo: 'flex flex-col flex-1 min-w-0',
  empleadoNombre: 'text-sm font-semibold font-inter leading-tight truncate',
  empleadoCargo: 'text-xs font-inter mt-0.5 truncate',
  empleadoFechas: 'text-xs font-inter mt-0.5',
  estadoBadge: 'text-xs font-semibold font-inter px-2 py-1 rounded-full uppercase shrink-0 flex items-center gap-1 max-w-[110px] truncate',
  motivoLabel: 'text-xs font-semibold font-inter uppercase mb-0.5',
  motivo: 'text-sm font-semibold font-inter mb-3 leading-snug line-clamp-2',
  lugarLabel: 'text-xs font-semibold font-inter uppercase mb-0.5',
  lugar: 'text-sm font-inter mb-3 truncate',
  rutaRow: 'flex items-center gap-1 mb-3 flex-wrap',
  rutaTxt: 'text-xs font-inter',
  badgesRow: 'flex gap-1.5 flex-wrap mb-3',
  internacionalBadge: 'inline-flex items-center gap-1 text-xs font-bold font-inter px-2 py-0.5 rounded-lg w-fit',
  transporteBadge: 'inline-flex items-center gap-1 text-xs font-bold font-inter px-2 py-0.5 rounded-lg w-fit',
  spacer: 'flex-1',
  divider: 'border-t mb-3',
  infoRow: 'flex justify-between items-end mb-2',
  infoItem: 'flex flex-col min-w-0',
  infoLabel: 'text-xs font-semibold font-inter uppercase mb-0.5 flex items-center gap-1',
  infoValor: 'text-xl font-semibold font-inter leading-none',
  infoValorSm: 'text-base font-semibold font-inter leading-none',
  infoSufijo: 'text-sm font-inter ml-1',
  estadoRow: 'flex items-center gap-1.5',
  estadoPunto: 'w-2 h-2 rounded-full shrink-0',
  estadoTexto: 'text-xs font-inter',
  alertasRow: 'flex gap-2 flex-wrap mb-3',
  alertaBadge: 'text-xs font-bold font-inter px-2.5 py-1 rounded-lg flex items-center gap-1',
  botonesRow: 'flex gap-2',
  btn: 'flex-1 h-9 rounded-xl font-bold font-nunito text-xs cursor-pointer text-center tracking-wide flex items-center justify-center',
}

const alertaConfig = {
  EXCESO_PRESUPUESTO: { label: 'Exceso Detectado', color: '#856404', bg: '#fef3cd' },
  ALCOHOL: { label: 'Alcohol', color: '#721c24', bg: '#f8d7da' },
}

const estadoRevisionConfig = {
  EN_REVISION: { label: 'En Revisión', color: '#f59e0b', bg: '#fef3cd' },
  APROBADO_SUPERVISOR: { label: 'Apr. Supervisor', color: '#000a65', bg: '#85aff3ab' },
  APROBADO_APROBADOR: { label: 'Apr. Aprobador', color: '#155724', bg: '#d4edda' },
  APROBADO_FINAL: { label: 'Aprobado', color: '#155724', bg: '#d4edda' },
  RECHAZADO: { label: 'Rechazado', color: '#500203', bg: '#ffa7a8aa' },
}

const formatFecha = (f1, f2) => {
  const [y1, m1, d1] = f1.split('-')
  const [y2, m2, d2] = f2.split('-')
  const opts = { day: 'numeric', month: 'short', year: 'numeric' }
  return `${new Date(y1, m1 - 1, d1).toLocaleDateString('es-ES', opts)} - ${new Date(y2, m2 - 1, d2).toLocaleDateString('es-ES', opts)}`
}

const getTransporteIcon = (transporte) => {
  const t = (transporte || '').toLowerCase()
  if (t.includes('aére') || t.includes('aer') || t.includes('avi')) return Plane
  if (t.includes('terrestre') || t.includes('bus') || t.includes('auto')) return Car
  return Navigation
}

function ViajeRevisionItem({ viaje, rutaDetalle, origenDetalle, onTomar, onDevolver, tomando }) {
  const navigate = useNavigate()
  const esObservado = viaje.estadoRevision === 'OBSERVADO'
  const esInternacional = viaje.tipo === 'Internacional'
  const ruta = rutaDetalle || `/dashboard/supervisor/revision/${viaje.id_viaje}`
  const origen = origenDetalle || '/dashboard/supervisor'
  const estadoCfg = estadoRevisionConfig[viaje.estado]
  const TransporteIcon = getTransporteIcon(viaje.transporte)

  return (
    <div className={styles.card} style={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.dataFields}` }}>
      <div className={styles.cardContent}>
        <div className={styles.headerRow}>
          <img src={viaje.Usuario?.foto_perfil || AVATAR_DEFAULT} alt="empleado" className={styles.avatar} />
          <div className={styles.empleadoInfo}>
            <p className={styles.empleadoNombre} style={{ color: COLORS.text }}>
              {viaje.Usuario?.nombre} {viaje.Usuario?.apellido_paterno}
            </p>
            <p className={styles.empleadoCargo} style={{ color: COLORS.labels }}>{viaje.Usuario?.Cargo?.nombre}</p>
            <p className={styles.empleadoFechas} style={{ color: COLORS.labels }}>{formatFecha(viaje.fecha_inicio, viaje.fecha_fin)}</p>
          </div>
          <span
            className={styles.estadoBadge}
            style={{ backgroundColor: esObservado ? COLORS.error : '#d4edda', color: esObservado ? COLORS.secondary : '#155724' }}
          >
            {esObservado ? <AlertTriangle size={11} /> : <CheckCircle size={11} />}
            <span className="truncate">{esObservado ? 'Observado' : 'Conforme'}</span>
          </span>
        </div>

        <p className={styles.motivoLabel} style={{ color: COLORS.secondary }}>Motivo</p>
        <p className={styles.motivo} style={{ color: COLORS.text }}>{viaje.motivo}</p>

        <p className={styles.lugarLabel} style={{ color: COLORS.secondary }}>{viaje.origen ? 'Ruta' : 'Lugar'}</p>
        {viaje.origen ? (
          <div className={styles.rutaRow}>
            <Navigation size={10} style={{ color: COLORS.labels }} />
            <p className={styles.rutaTxt} style={{ color: COLORS.labels, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {viaje.origen}
            </p>
            <span style={{ color: COLORS.dataFields, fontSize: 10 }}>→</span>
            <MapPin size={10} style={{ color: COLORS.secondary }} />
            <p className={styles.rutaTxt} style={{ color: COLORS.labels, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {viaje.destino}
            </p>
          </div>
        ) : (
          <p className={styles.lugar} style={{ color: COLORS.text }}>{viaje.destino}</p>
        )}

        {(esInternacional || viaje.transporte) && (
          <div className={styles.badgesRow}>
            {esInternacional && (
              <span className={styles.internacionalBadge} style={{ backgroundColor: COLORS.primary + '20', color: COLORS.primary }}>
                <Globe size={11} />
                Viaje Internacional
              </span>
            )}
            {viaje.transporte && (
              <span className={styles.transporteBadge} style={{ backgroundColor: COLORS.title + '15', color: COLORS.title }}>
                <TransporteIcon size={11} />
                {viaje.transporte}
              </span>
            )}
          </div>
        )}

        <div className={styles.spacer} />
        <div className={styles.divider} style={{ borderColor: COLORS.dataFields }} />

        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <p className={styles.infoLabel} style={{ color: COLORS.title }}>
              <MapPin size={11} style={{ color: COLORS.title }} />Monto Nacional
            </p>
            <p style={{ color: COLORS.text }}>
              <span className={esInternacional ? styles.infoValorSm : styles.infoValor}>{parseFloat(viaje.gastoAcumulado || 0).toFixed(2)}</span>
              <span className={styles.infoSufijo} style={{ color: COLORS.labels }}>Bs</span>
            </p>
          </div>
          <div className={styles.infoItem}>
            <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Estado</p>
            {estadoCfg ? (
              <div className={styles.estadoRow}>
                <div className={styles.estadoPunto} style={{ backgroundColor: estadoCfg.color }} />
                <p className={styles.estadoTexto} style={{ color: COLORS.labels }}>{estadoCfg.label}</p>
              </div>
            ) : (
              <div className={styles.estadoRow}>
                <div className={styles.estadoPunto} style={{ backgroundColor: '#f59e0b' }} />
                <p className={styles.estadoTexto} style={{ color: COLORS.labels }}>Pendiente</p>
              </div>
            )}
          </div>
        </div>

        {esInternacional && (
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel} style={{ color: COLORS.primary }}>
                <Globe size={11} style={{ color: COLORS.primary }} />Monto Internacional
              </p>
              <p style={{ color: COLORS.text }}>
                <span className={styles.infoValorSm}>{parseFloat(viaje.gastoAcumuladoUsd || 0).toFixed(2)}</span>
                <span className={styles.infoSufijo} style={{ color: COLORS.labels }}>USD</span>
              </p>
            </div>
          </div>
        )}

        {viaje.alertas?.length > 0 && (
          <div className={styles.alertasRow}>
            {viaje.alertas.map((alerta) => {
              const cfg = alertaConfig[alerta]
              return cfg ? (
                <span key={alerta} className={styles.alertaBadge} style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                  <AlertTriangle size={11} />{cfg.label}
                </span>
              ) : null
            })}
          </div>
        )}

        <div className={styles.botonesRow}>
          {onTomar ? (
            <>
              <button
                className={styles.btn}
                style={{ backgroundColor: 'transparent', border: `1.5px solid ${COLORS.title}`, color: COLORS.title }}
                onClick={() => navigate(ruta, { state: { from: origen } })}
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
          ) : onDevolver ? (
            <>
              <button
                className={styles.btn}
                style={{ backgroundColor: COLORS.title, color: COLORS.background }}
                onClick={() => navigate(ruta, { state: { from: origen } })}
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
              onClick={() => navigate(ruta, { state: { from: origen } })}
            >
              Revisar Detalles
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViajeRevisionItem;