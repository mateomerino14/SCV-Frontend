import { useNavigate } from 'react-router-dom'
import { Globe, MapPin, Navigation } from 'lucide-react'
import { COLORS } from '../../constants'

const styles = {
  container: "flex items-center justify-between p-3 shadow-sm border mb-3 rounded-xl gap-2",
  left: "flex items-center gap-3 flex-1 min-w-0",
  iconWrapper: "rounded-xl p-1 shrink-0 hidden sm:block",
  info: "flex flex-col min-w-0 flex-1",
  motivo: "text-sm font-bold font-inter leading-tight m-1 mb-1 truncate",
  fecha: "text-xs font-nunito mt-0.5 mb-1 ml-1",
  ruta: "text-xs font-inter ml-1 mb-1 flex items-center gap-1 min-w-0",
  montoRow: "flex flex-col gap-0.5 ml-1 mb-1",
  monto: "text-xs font-inter",
  tipoBadge: "inline-flex items-center gap-1 text-xs font-bold font-inter px-1.5 py-0.5 rounded-lg mt-0.5 w-fit ml-1",
  right: "flex flex-col items-end gap-1 shrink-0",
  estado: "text-xs font-bold font-nunito mb-4 p-1 rounded-xl text-center whitespace-nowrap",
  detalles: "text-xs font-bold font-nunito mt-11 cursor-pointer whitespace-nowrap",
}

const estadoColors = {
  EN_REVISION_VIAJE: '#5b00a0',
  APROBADO_VIAJE: '#7a5900',
  EN_REVISION_TESORERO: '#8a4b00',
  EN_CURSO: COLORS.background,
  EN_REVISION: '#000a65',
  APROBADO_SUPERVISOR: '#7a5900',
  APROBADO_APROBADOR: '#000a65',
  APROBADO_FINAL: '#008330',
  RECHAZADO: '#500203',
}

const fondoColores = {
  EN_REVISION_VIAJE: '#e8d5ff',
  APROBADO_VIAJE: '#ffd700aa',
  EN_REVISION_TESORERO: '#ffd8a8aa',
  EN_CURSO: COLORS.primary,
  EN_REVISION: '#85aff3ab',
  APROBADO_SUPERVISOR: '#ffd700aa',
  APROBADO_APROBADOR: '#85aff3ab',
  APROBADO_FINAL: '#aafac9a2',
  RECHAZADO: '#ffa7a8aa',
}

const estadoLabels = {
  EN_REVISION_VIAJE: 'EN REVISIÓN PREVIA',
  APROBADO_VIAJE: 'APR. SUPERVISOR',
  EN_REVISION_TESORERO: 'ESPERANDO FONDOS',
  EN_CURSO: 'EN CURSO',
  EN_REVISION: 'EN REVISIÓN',
  APROBADO_SUPERVISOR: 'APR. SUPERVISOR',
  APROBADO_APROBADOR: 'APR. APROBADOR',
  APROBADO_FINAL: 'APROBADO',
  RECHAZADO: 'RECHAZADO',
}

const formatFecha = (f1, f2) => {
  const [y1, m1, d1] = f1.split('-')
  const [y2, m2, d2] = f2.split('-')
  const opts = { day: 'numeric', month: 'short', year: 'numeric' }
  return `${new Date(y1, m1 - 1, d1).toLocaleDateString('es-ES', opts)} - ${new Date(y2, m2 - 1, d2).toLocaleDateString('es-ES', opts)}`
}

function ViajeRecienteItem({ viaje, from }) {
  const navigate = useNavigate()
  const origenNav = from || '/dashboard/empleado'
  const esInternacional = viaje.tipo === 'Internacional'

  return (
    <div className={styles.container} style={{ borderColor: COLORS.dataFields }}>
      <div className={styles.left}>
        <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.fields }}>
          <img
            src="https://thumbs.dreamstime.com/b/icono-de-glifo-negro-para-viajes-negocios-reuni%C3%B3n-trabajo-fly-work-viaje-internacional-corporativo-un-pa%C3%ADs-extranjero-222264681.jpg"
            alt="Imagen por Defecto"
            className="h-20 rounded-lg"
          />
        </div>
        <div className={styles.info}>
          <p className={styles.motivo} style={{ color: COLORS.text }} title={viaje.motivo}>{viaje.motivo}</p>
          <p className={styles.fecha} style={{ color: COLORS.text_enviroment_types }}>
            {formatFecha(viaje.fecha_inicio, viaje.fecha_fin)}
          </p>
          {viaje.origen && (
            <p className={styles.ruta} style={{ color: COLORS.labels }}>
              <Navigation size={10} style={{ color: COLORS.labels, flexShrink: 0 }} />
              <span className="truncate" style={{ maxWidth: '35%' }}>{viaje.origen}</span>
              <span style={{ color: COLORS.dataFields, flexShrink: 0 }}>→</span>
              <MapPin size={10} style={{ color: COLORS.secondary, flexShrink: 0 }} />
              <span className="truncate" style={{ maxWidth: '35%' }}>{viaje.destino}</span>
            </p>
          )}
          <div className={styles.montoRow}>
            <p className={styles.monto} style={{ color: COLORS.text_enviroment_types }}>
              <span className="font-bold">Bs:</span> {parseFloat(viaje.monto_asignado).toFixed(2)}
            </p>
            {esInternacional && parseFloat(viaje.monto_asignado_usd || 0) > 0 && (
              <p className={styles.monto} style={{ color: COLORS.primary }}>
                <span className="font-bold">USD:</span> {parseFloat(viaje.monto_asignado_usd).toFixed(2)}
              </p>
            )}
          </div>
          {esInternacional ? (
            <span className={styles.tipoBadge} style={{ backgroundColor: COLORS.primary + '20', color: COLORS.primary }}>
              <Globe size={10} />
              Internacional
            </span>
          ) : (
            <span className={styles.tipoBadge} style={{ backgroundColor: COLORS.title + '15', color: COLORS.title }}>
              <MapPin size={10} />
              Nacional
            </span>
          )}
        </div>
      </div>
      <div className={styles.right}>
        <span className={styles.estado} style={{ color: estadoColors[viaje.estado] || COLORS.labels, backgroundColor: fondoColores[viaje.estado] || COLORS.backgroundHeader }}>
          {estadoLabels[viaje.estado] || viaje.estado}
        </span>
        <p className={styles.detalles} style={{ color: COLORS.title }} onClick={() => navigate(`/dashboard/empleado/viaje/${viaje.id_viaje}`, { state: { from: origenNav } })}>
          DETALLES →
        </p>
      </div>
    </div>
  )
}

export default ViajeRecienteItem;