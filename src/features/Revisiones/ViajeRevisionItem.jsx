import { useNavigate } from 'react-router-dom'
import { COLORS } from '../../constants'
import { AlertTriangle, CheckCircle } from 'lucide-react'

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
  estadoBadge: 'text-xs font-semibold font-inter px-2.5 py-1 rounded-full uppercase shrink-0 flex items-center gap-1',
  motivoLabel: 'text-xs font-semibold font-inter uppercase mb-0.5',
  motivo: 'text-sm font-semibold font-inter mb-3 leading-snug',
  lugarLabel: 'text-xs font-semibold font-inter uppercase mb-0.5',
  lugar: 'text-sm font-inter mb-3',
  spacer: 'flex-1',
  divider: 'border-t mb-3',
  infoRow: 'flex justify-between items-end mb-3',
  infoItem: 'flex flex-col',
  infoLabel: 'text-xs font-semibold font-inter uppercase mb-0.5',
  infoValor: 'text-2xl font-semibold font-inter leading-none',
  infoSufijo: 'text-sm font-inter ml-1',
  estadoRow: 'flex items-center gap-1.5',
  estadoPunto: 'w-2 h-2 rounded-full',
  estadoTexto: 'text-sm font-inter',
  alertasRow: 'flex gap-2 flex-wrap mb-3',
  alertaBadge: 'text-xs font-bold font-inter px-2.5 py-1 rounded-lg flex items-center gap-1',
  botonesRow: 'flex gap-2',
  btn: 'flex-1 h-9 rounded-xl font-bold font-nunito text-xs cursor-pointer text-center tracking-wide flex items-center justify-center',
}

const alertaConfig = {
  EXCESO_PRESUPUESTO: { label: 'Exceso Detectado', color: '#856404', bg: '#fef3cd' },
  ALCOHOL: { label: 'Alcohol', color: '#721c24', bg: '#f8d7da' },
}

const formatFecha = (f1, f2) => {
  const opts = { day: 'numeric', month: 'short' }
  return `${new Date(f1).toLocaleDateString('es-ES', opts)} - ${new Date(f2).toLocaleDateString('es-ES', opts)}`
}

function ViajeRevisionItem({ viaje, rutaDetalle, origenDetalle, onTomar, onDevolver, tomando }) {
  const navigate = useNavigate()
  const esObservado = viaje.estadoRevision === 'OBSERVADO'
  const ruta = rutaDetalle || `/dashboard/supervisor/revision/${viaje.id_viaje}`
  const origen = origenDetalle || '/dashboard/supervisor'

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
            {esObservado ? 'Observado' : 'Conforme'}
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
              <div className={styles.estadoPunto} style={{ backgroundColor: '#f59e0b' }} />
              <p className={styles.estadoTexto} style={{ color: COLORS.labels }}>Pendiente</p>
            </div>
          </div>
        </div>

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