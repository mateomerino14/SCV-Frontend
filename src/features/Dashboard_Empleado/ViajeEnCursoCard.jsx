import { COLORS } from '../../constants'

const styles = {
  container: "rounded-xl p-5 mb-4 text-white shadow-lg",
  emptyContainer: "rounded-xl p-8 text-white text-center flex flex-col items-center justify-center gap-2",
  motivo: "text-sm font-bold font-inter uppercase leading-tight mb-1",
  fecha: "text-xs font-inter mb-1 opacity-70",
  destino: "text-sm font-inter mb-3 opacity-80",
  badges: "flex gap-2 mb-4",
  badge: "text-xs font-bold font-nunito px-2 py-1 rounded",
  gastoLabel: "text-xs font-inter uppercase opacity-70",
  gastoMonto: "text-2xl font-bold font-inter",
  presupuestoLabel: "text-xs font-inter uppercase opacity-70 text-right",
  presupuestoMonto: "text-sm font-bold font-inter text-right",
  progressBar: "w-full h-1 rounded mt-2 mb-3",
  progress: "h-1 rounded",
  detalles: "text-xs font-bold font-inter cursor-pointer hover:underline mt-1",
}

const badgeColors = {
  Nacional: "bg-yellow-400 text-black",
  Internacional: "bg-blue-500 text-white",
  Urbano: "bg-gray-500 text-white",
  Rural: "bg-green-600 text-white",
}

const formatFecha = (fecha) =>
  new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })

function ViajeEnCursoCard({ viaje }) {
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
    <div className="rounded-xl overflow-hidden shadow-lg mb-4">

      <div className="p-5" style={{ backgroundColor: COLORS.backgroundSecondary }}>
        <p className="text-sm font-bold font-inter uppercase leading-tight mb-1 text-white">
          {viaje.motivo}
        </p>
        <p className="text-xs font-inter opacity-70 text-white">
          {formatFecha(viaje.fecha_inicio)} - {formatFecha(viaje.fecha_fin)}
        </p>
      </div>

      <div className="p-5" style={{ backgroundColor: COLORS.background }}>
        <p className="text-sm font-inter mb-3" style={{ color: COLORS.labels }}>{viaje.destino}</p>
        <div className={styles.badges}>
          <span className={`${styles.badge} ${badgeColors[viaje.tipo]}`}>{viaje.tipo.toUpperCase()}</span>
          <span className={`${styles.badge} ${badgeColors[viaje.entorno_destino]}`}>{viaje.entorno_destino.toUpperCase()}</span>
        </div>
        <div className="flex justify-between items-end mb-1">
          <div>
            <p className={styles.gastoLabel} style={{ color: COLORS.labels }}>Gasto Acumulado</p>
            <p className={styles.gastoMonto} style={{ color: excede ? '#ff4444' : COLORS.secondary }}>
              {viaje.gastoAcumulado.toFixed(2)} Bs
            </p>
          </div>
          <div>
            <p className={styles.presupuestoLabel} style={{ color: COLORS.labels }}>Presupuesto</p>
            <p className={styles.presupuestoMonto} style={{ color: COLORS.text }}>
              {parseFloat(viaje.monto_asignado).toFixed(2)} Bs
            </p>
          </div>
        </div>
        <div className={styles.progressBar} style={{ backgroundColor: COLORS.dataFields }}>
          <div
            className={styles.progress}
            style={{ width: `${porcentaje}%`, backgroundColor: excede ? '#ff4444' : COLORS.secondary }}
          />
        </div>
        <p className={styles.detalles} style={{ color: COLORS.secondary }}>DETALLES →</p>
      </div>

    </div>
  )
}

export default ViajeEnCursoCard;