import { COLORS } from '../../constants'
import { useNavigate } from 'react-router-dom'

const styles = {
  container: "rounded-xl overflow-hidden shadow-lg mb-4 flex flex-col h-[355px]",
  emptyContainer: "rounded-xl p-8 text-white text-center flex flex-col items-center justify-center gap-2 h-[340px]",
  topSection: "p-5 shrink-0 h-[130px] overflow-hidden",
  motivo: "text-lg font-bold font-inter uppercase leading-tight mb-1 text-white line-clamp-2",
  fecha: "text-xs font-inter opacity-70 text-white mt-3",
  bottomSection: "p-5 flex flex-col flex-1 overflow-hidden",
  destinoRow: "flex flex-col gap-2 mb-3",
  destino: "font-inter font-semibold text-sm line-clamp-2",
  badgesRow: "flex gap-2 flex-wrap",
  badge: "text-xs font-bold font-nunito px-2 py-1 rounded-xl whitespace-nowrap",
  gastoRow: "flex justify-between items-end mb-1 mt-auto",
  gastoLabel: "text-xs font-inter uppercase font-bold mb-2",
  gastoMonto: "text-2xl font-bold font-inter",
  presupuestoLabel: "text-xs font-inter uppercase font-bold text-right mb-2",
  presupuestoMonto: "text-sm font-bold font-inter text-right",
  progressBar: "w-full h-2 rounded mt-2 mb-3",
  progress: "h-2 rounded",
  detalles: "text-xs font-bold font-inter cursor-pointer",
}

const formatFecha = (fecha) => new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

function ViajeEnCursoCard({ viaje }) {
  const navigate = useNavigate();
  if (!viaje) {
    return (
      <div
        className={styles.emptyContainer}
        style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.title})` }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.1)" />
          <path d="M12 28L16 16L20 22L25 13L28 28H12Z" fill="rgba(255,255,255,0.6)" />
        </svg>
        <p className="font-inter font-bold text-base">Sin viajes en curso</p>
        <p className="font-inter text-xs opacity-70">No tienes ningún viaje activo en este momento</p>
      </div>
    )
  }

  const porcentaje = Math.min((viaje.gastoAcumulado / viaje.monto_asignado) * 100, 100)
  const excede = porcentaje >= 100

  return (
    <div className={styles.container}>
      <div className={styles.topSection} style={{ backgroundColor: COLORS.backgroundSecondary }}>
        <p className={styles.motivo}>{viaje.motivo.toUpperCase()}</p>
        <p className={styles.fecha}>{formatFecha(viaje.fecha_inicio)} - {formatFecha(viaje.fecha_fin)}</p>
      </div>

      <div className={styles.bottomSection} style={{ backgroundColor: COLORS.background, minHeight: '200px' }}>
        <div className={styles.destinoRow}>
          <div className={styles.badgesRow}>
            <span
              className={styles.badge}
              style={{ backgroundColor: COLORS.travel_types, color: COLORS.text_types_text }}
            >
              {viaje.tipo.toUpperCase()}
            </span>
            <span
              className={styles.badge}
              style={{ backgroundColor: COLORS.enviroment_types, color: COLORS.text_enviroment_types }}
            >
              {viaje.entorno_destino.toUpperCase()}
            </span>
          </div>
          <p className={styles.destino} style={{ color: COLORS.labels }}>{viaje.destino}</p>
        </div>

        <div className="flex-1" />

        <div className={styles.gastoRow}>
          <div>
            <p className={styles.gastoLabel} style={{ color: COLORS.text }}>Gasto Acumulado</p>
            <p className={styles.gastoMonto} style={{ color: excede ? COLORS.secondary : COLORS.title }}>
              {viaje.gastoAcumulado.toFixed(2)} Bs
            </p>
          </div>
          <div>
            <p className={styles.presupuestoLabel} style={{ color: COLORS.text }}>Presupuesto</p>
            <p className={styles.presupuestoMonto} style={{ color: COLORS.text }}>
              {parseFloat(viaje.monto_asignado).toFixed(2)} Bs
            </p>
          </div>
        </div>

        <div className={styles.progressBar} style={{ backgroundColor: COLORS.bar }}>
          <div
            className={styles.progress}
            style={{ width: `${porcentaje}%`, backgroundColor: excede ? COLORS.secondary : COLORS.title }}
          />
        </div>
        <p className={styles.detalles} style={{ color: COLORS.title }}  onClick={() => navigate(`/dashboard/empleado/viaje/${viaje.id_viaje}`)}>DETALLES →</p>
      </div>
    </div>
  )
}

export default ViajeEnCursoCard;