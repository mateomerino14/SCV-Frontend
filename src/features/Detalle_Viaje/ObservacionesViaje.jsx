import { COLORS } from '../../constants'

const styles = {
  wrapper: "flex flex-col gap-3",
  sectionTitle: "text-xs font-bold font-inter uppercase mb-1",
  item: "flex flex-col gap-1 p-4 rounded-xl border-l-4",
  fecha: "text-xs font-inter",
  descripcion: "text-sm font-inter leading-relaxed",
}

const formatFechaComentario = (fecha) => {
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ObservacionesViaje({ observaciones }) {
  if (!observaciones || observaciones.length === 0) {
    return null
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.sectionTitle} style={{ color: COLORS.text_enviroment_types }}>
        Observaciones
      </p>
      {observaciones.map((obs) => (
        <div
          key={obs.id_comentario}
          className={styles.item}
          style={{
            backgroundColor: COLORS.comments,
            borderLeftColor: COLORS.secondary,
          }}
        >
          <p className={styles.fecha} style={{ color: COLORS.text_enviroment_types }}>
            {formatFechaComentario(obs.fecha)}
          </p>
          <p className={styles.descripcion} style={{ color: COLORS.text }}>
            {obs.descripcion}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ObservacionesViaje;