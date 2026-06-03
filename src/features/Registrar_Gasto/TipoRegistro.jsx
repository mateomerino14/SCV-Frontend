import { COLORS } from '../../constants'

const styles = {
  wrapper: "flex flex-col gap-1",
  label: "text-xs font-bold font-inter uppercase mb-3",
  toggleRow: "flex gap-2",
  toggleBtn: "flex-1 py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer border transition-colors",
}

function TipoRegistro({ tipo, onChange }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{ color: COLORS.labels }}>Tipo de Registro</p>
      <div className={styles.toggleRow}>
        {['C', 'S'].map((t) => (
          <button
            key={t}
            className={styles.toggleBtn}
            style={{
              backgroundColor: tipo === t ? COLORS.primary : 'transparent',
              borderColor: tipo === t ? COLORS.primary : COLORS.fields,
              color: tipo === t ? COLORS.background : COLORS.labels,
            }}
            onClick={() => onChange(t)}
          >
            {t === 'C' ? 'Compra (C)' : 'Servicio (S)'}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TipoRegistro