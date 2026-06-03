import { useNavigate } from 'react-router-dom'
import { COLORS } from '../../constants'

const styles = {
  container: "flex items-center justify-between p-3 shadow-sm border mb-3 rounded-xl",
  left: "flex items-center gap-3 flex-1 min-w-0",
  iconWrapper: "rounded-xl p-1 shrink-0",
  info: "flex flex-col min-w-0",
  motivo: "text-sm font-bold font-inter leading-tight m-1 mb-3",
  fecha: "text-xs font-nunito mt-0.5 mb-3",
  monto: "text-xs font-inter mt-0.5 mb-3",
  right: "flex flex-col items-end gap-1 ml-4 shrink-0",
  estado: "text-xs font-bold font-nunito mb-10 p-1 rounded-xl",
  detalles: "text-xs font-bold font-nunito cursor-pointer",
}

const estadoColors = {
  EN_CURSO: COLORS.background,
  EN_REVISION: '#000a65',
  APROBADO_SUPERVISOR: '#7a5900',
  APROBADO_FINAL: '#008330',
  RECHAZADO: '#500203',
}

const fondoColores = {
  EN_CURSO: COLORS.primary,
  EN_REVISION: '#85aff3ab',
  APROBADO_SUPERVISOR: '#ffd700aa',
  APROBADO_FINAL: '#aafac9a2',
  RECHAZADO: '#ffa7a8aa',
}

const estadoLabels = {
  EN_CURSO: 'EN CURSO',
  EN_REVISION: 'EN REVISIÓN',
  APROBADO_SUPERVISOR: 'EN REVISIÓN FINAL',
  APROBADO_FINAL: 'APROBADO',
  RECHAZADO: 'RECHAZADO',
}

const formatFecha = (f1, f2) => {
  const opts = { month: 'short', day: 'numeric' }
  return `${new Date(f1).toLocaleDateString('es-ES', opts)} - ${new Date(f2).toLocaleDateString('es-ES', opts)}`
}

function ViajeRecienteItem({ viaje, from }) {
  const navigate = useNavigate()
  const origen = from || '/dashboard/empleado'

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
          <p className={styles.motivo} style={{ color: COLORS.text }}>{viaje.motivo}</p>
          <p className={styles.fecha} style={{ color: COLORS.text_enviroment_types }}>
            {formatFecha(viaje.fecha_inicio, viaje.fecha_fin)}
          </p>
          <p className={styles.monto} style={{ color: COLORS.text_enviroment_types }}>
            <span className="font-bold">Total:</span> {parseFloat(viaje.monto_asignado).toFixed(2)} Bs
          </p>
        </div>
      </div>
      <div className={styles.right}>
        <span
          className={styles.estado}
          style={{
            color: estadoColors[viaje.estado] || COLORS.labels,
            backgroundColor: fondoColores[viaje.estado] || COLORS.backgroundHeader,
          }}
        >
          {estadoLabels[viaje.estado] || viaje.estado}
        </span>
        <p
          className={styles.detalles}
          style={{ color: COLORS.title }}
          onClick={() => navigate(`/dashboard/empleado/viaje/${viaje.id_viaje}`, { state: { from: origen } })}
        >
          DETALLES →
        </p>
      </div>
    </div>
  )
}

export default ViajeRecienteItem;