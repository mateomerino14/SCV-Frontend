import { COLORS } from '../../constants'
import { useNavigate } from 'react-router-dom'
import { Navigation, MapPin } from 'lucide-react'

const styles = {
  container: "rounded-xl overflow-hidden shadow-lg flex flex-col h-full",
  emptyContainer: "rounded-xl p-8 text-white text-center flex flex-col items-center justify-center gap-2 h-full min-h-[280px]",
  topSection: "p-5 shrink-0",
  motivo: "text-lg font-bold font-inter uppercase leading-tight mb-1 text-white line-clamp-2",
  fecha: "text-xs font-inter opacity-70 text-white mt-1",
  ruta: "text-xs font-inter opacity-80 text-white mt-1 flex items-center gap-1",
  bottomSection: "p-4 flex flex-col flex-1",
  destinoRow: "flex flex-col gap-1 mb-2",
  destino: "font-inter font-semibold text-xs line-clamp-1",
  badgesRow: "flex gap-1 flex-wrap mb-1",
  badge: "text-xs font-bold font-nunito px-2 py-0.5 rounded-xl whitespace-nowrap",
  presupuestoRow: "flex justify-between items-center mb-0.5",
  progressBar: "w-full h-1.5 rounded mt-0.5 mb-2",
  progress: "h-1.5 rounded",
  divisor: "border-t mb-2 mt-1",
  detalles: "text-xs font-bold font-inter cursor-pointer mt-auto pt-2",
}

const formatFecha = (fecha) => {
  const [y, m, d] = fecha.split('-')
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ViajeEnCursoCard({ viaje }) {
  const navigate = useNavigate()

  if (!viaje) {
    return (
      <div className={styles.emptyContainer} style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.title})` }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.1)" />
          <path d="M12 28L16 16L20 22L25 13L28 28H12Z" fill="rgba(255,255,255,0.6)" />
        </svg>
        <p className="font-inter font-bold text-base">Sin viajes en curso</p>
        <p className="font-inter text-xs opacity-70">No tienes ningún viaje activo en este momento</p>
      </div>
    )
  }

const esInternacional = viaje.tipo === 'Internacional'
  const gastoNacional = viaje.gastoAcumulado || 0
  const gastoInternacional = viaje.gastoAcumuladoUsd || 0

  const montoAsignadoNum = parseFloat(viaje.monto_asignado) || 0
  const porcentajeNacional = montoAsignadoNum > 0
    ? Math.min((gastoNacional / montoAsignadoNum) * 100, 100)
    : (gastoNacional > 0 ? 100 : 0)
  const excedeNacional = montoAsignadoNum === 0 ? gastoNacional > 0 : porcentajeNacional >= 100

  const montoAsignadoUsdNum = parseFloat(viaje.monto_asignado_usd) || 0
  const porcentajeInternacional = montoAsignadoUsdNum > 0
    ? Math.min((gastoInternacional / montoAsignadoUsdNum) * 100, 100)
    : (gastoInternacional > 0 ? 100 : 0)
  const excedeInternacional = montoAsignadoUsdNum === 0 ? gastoInternacional > 0 : porcentajeInternacional >= 100

  return (
    <div className={styles.container}>
      <div className={styles.topSection} style={{ backgroundColor: COLORS.backgroundSecondary }}>
        <p className={styles.motivo}>{viaje.motivo?.toUpperCase()}</p>
        <p className={styles.fecha}>{formatFecha(viaje.fecha_inicio)} - {formatFecha(viaje.fecha_fin)}</p>
        {viaje.origen && (
          <p className={styles.ruta}>
            <Navigation size={10} style={{ flexShrink: 0 }} />
            <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{viaje.origen}</span>
            <span style={{ opacity: 0.5, margin: '0 2px' }}>→</span>
            <MapPin size={10} style={{ flexShrink: 0 }} />
            <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{viaje.destino}</span>
          </p>
        )}
      </div>

      <div className={styles.bottomSection} style={{ backgroundColor: COLORS.background }}>
        <div className={styles.destinoRow}>
          <div className={styles.badgesRow}>
            <span className={styles.badge} style={{ backgroundColor: COLORS.travel_types, color: COLORS.text_types_text }}>
              {viaje.tipo?.toUpperCase() || 'NACIONAL'}
            </span>
            {viaje.transporte && (
              <span className={styles.badge} style={{ backgroundColor: COLORS.enviroment_types, color: COLORS.text_enviroment_types }}>
                {viaje.transporte.toUpperCase()}
              </span>
            )}
          </div>
          {!viaje.origen && (
            <p className={styles.destino} style={{ color: COLORS.labels }}>{viaje.destino}</p>
          )}
        </div>

        <div className={styles.presupuestoRow}>
          <div>
            <p style={{ color: COLORS.text, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 }}>
              {esInternacional ? 'Nacional (Bs)' : 'Gasto Acumulado'}
            </p>
            <p style={{ color: excedeNacional ? COLORS.secondary : COLORS.title, fontSize: '18px', fontWeight: 'bold' }}>
              {gastoNacional.toFixed(2)} Bs
            </p>
          </div>
          <p style={{ color: COLORS.labels, fontSize: '14px', textAlign: 'right' }}>
            / {parseFloat(viaje.monto_asignado).toFixed(2)} Bs
          </p>
        </div>

        <div className={styles.progressBar} style={{ backgroundColor: COLORS.bar }}>
          <div className={styles.progress} style={{ width: `${porcentajeNacional}%`, backgroundColor: excedeNacional ? COLORS.secondary : COLORS.title }} />
        </div>

        {esInternacional && (
          <>
            <div className={styles.divisor} style={{ borderColor: COLORS.dataFields }} />
            <div className={styles.presupuestoRow}>
              <div>
                <p style={{ color: COLORS.text, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 }}>Internacional (USD)</p>
                <p style={{ color: excedeInternacional ? COLORS.secondary : COLORS.title, fontSize: '17px', fontWeight: 'bold' }}>
                  {gastoInternacional.toFixed(2)} USD
                </p>
              </div>
              <p style={{ color: COLORS.labels, fontSize: '14px', textAlign: 'right' }}>
                / {parseFloat(viaje.monto_asignado_usd || 0).toFixed(2)} USD
              </p>
            </div>
            <div className={styles.progressBar} style={{ backgroundColor: COLORS.bar }}>
              <div className={styles.progress} style={{ width: `${porcentajeInternacional}%`, backgroundColor: excedeInternacional ? COLORS.secondary : COLORS.title }} />
            </div>
          </>
        )}

        <p className={styles.detalles} style={{ color: COLORS.title }} onClick={() => navigate(`/dashboard/empleado/viaje/${viaje.id_viaje}`)}>
          DETALLES →
        </p>
      </div>
    </div>
  )
}

export default ViajeEnCursoCard;