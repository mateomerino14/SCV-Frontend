import { COLORS } from '../../constants'

const styles = {
  wrapper: "flex flex-col gap-1 mb-2",
  label: "text-xs font-nunito font-bold uppercase",
  barBackground: "w-full rounded-full h-2",
  barFill: "h-2 rounded-full transition-all",
  amounts: "flex justify-between text-xs font-inter mt-1",
}

function PresupuestoBar({ gastoAcumulado, montoAsignado }) {
  const porcentaje = montoAsignado > 0 ? Math.min((gastoAcumulado / montoAsignado) * 100, 100) : 0
  const colorBarra = porcentaje >= 100 ? COLORS.secondary : COLORS.title
  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{ color: COLORS.text_enviroment_types }}>Presupuesto Gastado</p>
      <p style={{ color: porcentaje >= 100 ? COLORS.secondary : COLORS.text, fontSize: '22px', fontWeight: '600' }}>
        {gastoAcumulado.toFixed(2)} Bs
        <span style={{ color: COLORS.title, fontSize: '14px', fontWeight: '500' }}>
          {' '}/ {parseFloat(montoAsignado).toFixed(2)} Bs
        </span>
      </p>
      <div className={styles.barBackground} style={{ backgroundColor: COLORS.dataFields }}>
        <div
          className={styles.barFill}
          style={{ width: `${porcentaje}%`, backgroundColor: colorBarra }}
        />
      </div>
      <div className={styles.amounts}>
        <span style={{ color: COLORS.title }}>
          {porcentaje.toFixed(0)}% del límite alcanzado
        </span>
      </div>
    </div>
  )
}

export default PresupuestoBar;