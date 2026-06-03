import { COLORS } from '../../constants'

const politicas = [
  'Los fondos asignados deben utilizarse únicamente para gastos relacionados con el viaje laboral.',
  'Es obligatorio registrar todos los gastos en el sistema y adjuntar comprobantes cuando corresponda.',
  'No está permitido el uso de fondos para la compra de bebidas alcohólicas.',
]

const styles = {
  container: "rounded-2xl p-5",
  header: "flex items-center gap-2 mb-4",
  title: "text-base font-bold font-inter",
  list: "flex flex-col gap-3",
  item: "flex items-start gap-2",
  icon: "shrink-0 mt-0.5",
  text: "text-sm font-inter",
}

function PoliticasViaje() {
  return (
    <div className={styles.container} style={{ backgroundColor: COLORS.backgroundHeader }}>
      <div className={styles.header}>
        <span style={{ color: COLORS.secondary }}>ⓘ</span>
        <p className={styles.title} style={{ color: COLORS.secondary }}>Políticas de Viaje</p>
      </div>
      <div className={styles.list}>
        {politicas.map((p, i) => (
          <div key={i} className={styles.item}>
            <svg className={styles.icon} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" fill={COLORS.secondary} opacity="0.15" />
              <path d="M5 8L7 10L11 6" stroke={COLORS.secondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className={styles.text} style={{ color: COLORS.labels }}>{p}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PoliticasViaje