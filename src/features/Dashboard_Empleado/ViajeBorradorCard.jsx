import { useNavigate } from 'react-router-dom'
import { Pencil, Send, MapPin, Navigation, Calendar, Wallet, Globe } from 'lucide-react'
import { COLORS } from '../../constants'

const styles = {
  card: 'rounded-2xl p-4 shadow-md flex flex-col gap-3 h-full',
  headerRow: 'flex items-center justify-end',
  badge: 'text-xs font-bold font-inter px-2 py-1 rounded-full uppercase',
  motivo: 'text-base font-bold font-inter leading-tight',
  infoRow: 'flex items-center gap-1.5 text-xs font-inter',
  rutaRow: 'flex items-center gap-1.5 text-xs font-inter flex-wrap',
  montosRow: 'flex flex-col gap-1 mt-1 p-2.5 rounded-xl',
  montoLinea: 'flex items-center justify-between text-xs font-inter',
  montoValor: 'font-bold',
  botonesRow: 'flex gap-2 mt-auto',
  boton: 'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold font-nunito text-sm cursor-pointer border transition-colors',
}

const formatFecha = (f) => {
  if (!f) return ''
  const [y, m, d] = f.split('-')
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ViajeBorradorCard({ viaje, onEnviar, enviando }) {
  const navigate = useNavigate()
  const esInternacional = viaje.tipo === 'Internacional'

  return (
    <div className={styles.card} style={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.dataFields}` }}>
      <div className={styles.headerRow}>
        <span className={styles.badge} style={{ backgroundColor: COLORS.dataFields, color: COLORS.text_enviroment_types }}>
          {viaje.tipo?.toUpperCase()}
        </span>
      </div>

      <p className={styles.motivo} style={{ color: COLORS.text }}>{viaje.motivo || 'Sin motivo'}</p>

      {viaje.origen ? (
        <div className={styles.rutaRow} style={{ color: COLORS.labels }}>
          <Navigation size={13} style={{ color: COLORS.labels }} />
          {viaje.origen}
          <span style={{ color: COLORS.dataFields }}>→</span>
          <MapPin size={13} style={{ color: COLORS.secondary }} />
          {viaje.destino || 'Sin destino'}
        </div>
      ) : (
        <div className={styles.infoRow} style={{ color: COLORS.labels }}>
          <MapPin size={13} style={{ color: COLORS.secondary }} />
          {viaje.destino || 'Sin destino'}
        </div>
      )}

      <div className={styles.infoRow} style={{ color: COLORS.labels }}>
        <Calendar size={13} style={{ color: COLORS.labels }} />
        {formatFecha(viaje.fecha_inicio)} - {formatFecha(viaje.fecha_fin)}
      </div>

      <div className={styles.montosRow} style={{ backgroundColor: COLORS.backgroundHeader }}>
        <div className={styles.montoLinea}>
          <span style={{ color: COLORS.labels, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Wallet size={12} style={{ color: COLORS.title }} />
            Fondo Nacional (Bs)
          </span>
          <span className={styles.montoValor} style={{ color: COLORS.title }}>
            {parseFloat(viaje.monto_asignado || 0).toFixed(2)}
          </span>
        </div>
        {esInternacional && (
          <div className={styles.montoLinea}>
            <span style={{ color: COLORS.labels, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Globe size={12} style={{ color: COLORS.primary }} />
              Fondo Internacional (USD)
            </span>
            <span className={styles.montoValor} style={{ color: COLORS.primary }}>
              {parseFloat(viaje.monto_asignado_usd || 0).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className={styles.botonesRow}>
        <button
          className={styles.boton}
          style={{ borderColor: COLORS.primary, color: COLORS.primary, backgroundColor: 'transparent' }}
          onClick={() => navigate(`/dashboard/empleado/viaje/${viaje.id_viaje}/editar`, { state: { from: '/dashboard/empleado' } })}
        >
          <Pencil size={14} />
          Editar
        </button>
        <button
          className={styles.boton}
          style={{
            backgroundColor: enviando ? COLORS.fields : COLORS.secondary,
            color: COLORS.background,
            borderColor: enviando ? COLORS.fields : COLORS.secondary,
          }}
          onClick={() => onEnviar(viaje.id_viaje)}
          disabled={enviando}
        >
          <Send size={14} />
          {enviando ? 'Enviando...' : 'Enviar a Revisión'}
        </button>
      </div>
    </div>
  )
}

export default ViajeBorradorCard;