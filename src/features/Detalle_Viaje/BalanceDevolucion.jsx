import { ArrowUp, ArrowDown } from 'lucide-react'
import { COLORS } from '../../constants'

const styles = {
  wrapper: "flex items-center justify-between p-4 rounded-2xl shadow-lg my-5",
  left: "flex items-center gap-3",
  iconWrapper: "rounded-full p-2",
  info: "flex flex-col",
  label: "text-xs font-bold font-inter uppercase",
  estado: "text-xs font-inter mt-0.5",
  montoWrapper: "flex flex-col items-end",
  monto: "text-2xl font-bold font-inter",
  moneda: "text-xs font-inter",
}

function BalanceDevolucion({ gastoAcumulado, montoAsignado }) {
  const diferencia = parseFloat(montoAsignado) - gastoAcumulado
  const esSobrante = diferencia > 0

  if (!esSobrante) {
    return null
  }

  return (
    <div
      className={styles.wrapper}
      style={{ backgroundColor: COLORS.background ,border: `1px solid ${COLORS.fields}`}}
    >
      <div className={styles.left}>
        <div
          className={styles.iconWrapper}
          style={{ backgroundColor: COLORS.dataFields }}
        >
          <ArrowUp size={20} style={{ color: COLORS.title }} />
        </div>
        <div className={styles.info}>
          <p className={styles.label} style={{ color: COLORS.text }}>
            Balance
          </p>
          <p className={styles.estado} style={{ color: COLORS.title }}>
            Estado: Retorno
          </p>
        </div>
      </div>
      <div className={styles.montoWrapper}>
        <p className={styles.monto} style={{ color: COLORS.title }}>
          {diferencia.toFixed(2)}
        </p>
        <p className={styles.moneda} style={{ color: COLORS.labels }}>
          Bs
        </p>
      </div>
    </div>
  )
}

export default BalanceDevolucion;