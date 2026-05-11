import { COLORS } from '../../constants'

const styles = {
  container: "flex items-center justify-between py-4 border-b",
  left: "flex items-center gap-3 flex-1 min-w-0",
  iconWrapper: "rounded-lg p-3 shrink-0",
  info: "flex flex-col min-w-0",
  motivo: "text-sm font-bold font-inter leading-tight truncate",
  fecha: "text-xs font-inter mt-0.5",
  monto: "text-xs font-inter mt-0.5",
  right: "flex flex-col items-end gap-1 ml-4 shrink-0",
  estado: "text-xs font-bold font-inter",
  detalles: "text-xs font-bold font-inter cursor-pointer hover:underline",
}

const estadoColors = {
  EN_REVISION: '#F59E0B',
  APROBADO: '#22C55E',
  RECHAZADO: '#D20F12',
  EN_CURSO: '#3B82F6',
}

const estadoLabels = {
  EN_REVISION: 'EN REVISIÓN',
  APROBADO: 'ACEPTADO',
  RECHAZADO: 'RECHAZADO',
  EN_CURSO: 'EN CURSO',
}

const formatFecha = (f1, f2) => {
  const opts = { month: 'short', day: 'numeric' }
  return `${new Date(f1).toLocaleDateString('es-ES', opts)} - ${new Date(f2).toLocaleDateString('es-ES', opts)}`
}

function ViajeRecienteItem({ viaje }) {
  return (
    <div className={styles.container} style={{ borderColor: COLORS.dataFields }}>
      <div className={styles.left}>
        <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.backgroundHeader }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="8" fill={COLORS.dataFields} />
            <path d="M8 26L13 14L18 20L23 11L28 26H8Z" fill={COLORS.labels} />
            <circle cx="11" cy="20" r="2" fill={COLORS.labels} />
          </svg>
        </div>
        <div className={styles.info}>
          <p className={styles.motivo} style={{ color: COLORS.text }}>{viaje.motivo}</p>
          <p className={styles.fecha} style={{ color: COLORS.labels }}>{formatFecha(viaje.fecha_inicio, viaje.fecha_fin)}</p>
          <p className={styles.monto} style={{ color: COLORS.labels }}>{parseFloat(viaje.monto_asignado).toFixed(2)} Bs Total</p>
        </div>
      </div>
      <div className={styles.right}>
        <span className={styles.estado} style={{ color: estadoColors[viaje.estado] }}>
          {estadoLabels[viaje.estado] || viaje.estado}
        </span>
        <p className={styles.detalles} style={{ color: COLORS.secondary }}>DETALLES →</p>
      </div>
    </div>
  )
}

export default ViajeRecienteItem;