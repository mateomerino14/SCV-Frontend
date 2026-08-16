import { useNavigate } from 'react-router-dom'
import { COLORS } from '../../constants'

const AVATAR_DEFAULT = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg"

const styles = {
  card: 'rounded-2xl shadow-sm overflow-hidden flex flex-col',
  cardContent: 'p-4 flex flex-col flex-1',
  headerRow: 'flex items-center gap-3 mb-3',
  avatar: 'w-12 h-12 rounded-full object-cover shrink-0',
  empleadoInfo: 'flex flex-col flex-1 min-w-0',
  empleadoNombre: 'text-base font-semibold font-inter leading-tight',
  empleadoCargo: 'text-xs font-inter mt-0.5',
  empleadoFechas: 'text-xs font-inter mt-0.5',
  estadoBadge: 'text-xs font-semibold font-inter px-2.5 py-1 rounded-full uppercase shrink-0',
  motivoLabel: 'text-xs font-semibold font-inter uppercase mb-0.5',
  motivo: 'text-sm font-semibold font-inter mb-3 leading-snug',
  lugarLabel: 'text-xs font-semibold font-inter uppercase mb-0.5',
  lugar: 'text-sm font-inter mb-3',
  spacer: 'flex-1',
  divider: 'border-t mb-3',
  infoRow: 'flex justify-between items-end mb-4',
  infoItem: 'flex flex-col',
  infoLabel: 'text-xs font-semibold font-inter uppercase mb-0.5',
  infoValor: 'text-2xl font-semibold font-inter leading-none',
  infoSufijo: 'text-sm font-inter ml-1',
  estadoRow: 'flex items-center gap-1.5',
  estadoPunto: 'w-2 h-2 rounded-full',
  estadoTexto: 'text-sm font-inter',
  detallesBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center tracking-widest',
}

const estadoConfig = {
  APROBADO_SUPERVISOR: { label: 'Apr. Preliminar', color: '#000a65', bg: '#85aff3ab', puntoColor: '#000a65' },
  APROBADO_FINAL: { label: 'Aprobado', color: '#155724', bg: '#d4edda', puntoColor: '#2d7a3a' },
  RECHAZADO: { label: 'Rechazado', color: '#500203', bg: '#ffa7a8aa', puntoColor: '#D20F12' },
}

const formatFecha = (f1, f2) => {
  const [y1, m1, d1] = f1.split('-')
  const [y2, m2, d2] = f2.split('-')
  const opts = { day: 'numeric', month: 'short' }
  return `${new Date(y1, m1 - 1, d1).toLocaleDateString('es-ES', opts)} - ${new Date(y2, m2 - 1, d2).toLocaleDateString('es-ES', opts)}`
}

function ViajeHistorialItem({ viaje, rutaDetalle, origenDetalle }) {
  const navigate = useNavigate()
  const cfg = estadoConfig[viaje.estado] || { label: viaje.estado, color: COLORS.labels, bg: COLORS.backgroundHeader, puntoColor: COLORS.labels }
  const ruta = rutaDetalle || `/dashboard/supervisor/revision/${viaje.id_viaje}`
  const origen = origenDetalle || '/dashboard/supervisor/historial'

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
          <span className={styles.estadoBadge} style={{ backgroundColor: cfg.bg, color: cfg.color }}>
            {cfg.label}
          </span>
        </div>

        <p className={styles.motivoLabel} style={{ color: COLORS.secondary }}>Motivo</p>
        <p className={styles.motivo} style={{ color: COLORS.text }}>{viaje.motivo}</p>

        <p className={styles.lugarLabel} style={{ color: COLORS.secondary }}>Lugar</p>
        <p className={styles.lugar} style={{ color: COLORS.text }}>{viaje.destino}</p>

        <div className={styles.spacer} />
        <div className={styles.divider} style={{ borderColor: COLORS.dataFields }} />

        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Monto Total</p>
            <p style={{ color: COLORS.text }}>
              <span className={styles.infoValor}>{parseFloat(viaje.gastoAcumulado || 0).toFixed(2)}</span>
              <span className={styles.infoSufijo} style={{ color: COLORS.labels }}>Bs</span>
            </p>
          </div>
          <div className={styles.infoItem}>
            <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Estado</p>
            <div className={styles.estadoRow}>
              <div className={styles.estadoPunto} style={{ backgroundColor: cfg.puntoColor }} />
              <p className={styles.estadoTexto} style={{ color: cfg.color }}>{cfg.label}</p>
            </div>
          </div>
        </div>

        <button
          className={styles.detallesBtn}
          style={{ backgroundColor: COLORS.title, color: COLORS.background }}
          onClick={() => navigate(ruta, { state: { from: origen } })}
        >
          Ver Detalles
        </button>
      </div>
    </div>
  )
}

export default ViajeHistorialItem;