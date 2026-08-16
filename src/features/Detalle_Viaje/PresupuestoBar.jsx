import { COLORS } from '../../constants'

const styles = {
  wrapper: "flex flex-col gap-1 mb-2",
  label: "text-xs font-nunito font-bold uppercase",
  barBackground: "w-full rounded-full h-2",
  barFill: "h-2 rounded-full transition-all",
  amounts: "flex justify-between text-xs font-inter mt-1",
}

function PresupuestoBar({ gastoAcumulado, montoAsignado, esUsd = false }) {
  const montoAsignadoNum = parseFloat(montoAsignado) || 0
  const porcentaje = montoAsignadoNum > 0
    ? Math.min((gastoAcumulado / montoAsignadoNum) * 100, 100)
    : (gastoAcumulado > 0 ? 100 : 0)
  const excede = montoAsignadoNum === 0 ? gastoAcumulado > 0 : porcentaje >= 100
  const moneda = esUsd ? 'USD' : 'Bs'
  const colorBarra = excede ? COLORS.secondary : COLORS.title
  const colorMonto = excede ? COLORS.secondary : COLORS.text
  const colorSub = excede ? COLORS.secondary : COLORS.title
  const colorPorcentaje = COLORS.title

  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{ color: COLORS.text_enviroment_types }}>
        {esUsd ? 'Presupuesto Internacional (USD)' : 'Presupuesto Gastado'}
      </p>
      <p style={{ color: colorMonto, fontSize: '22px', fontWeight: '600' }}>
        {gastoAcumulado.toFixed(2)} {moneda}
        <span style={{ color: colorSub, fontSize: '14px', fontWeight: '500' }}>
          {' '}/ {parseFloat(montoAsignado).toFixed(2)} {moneda}
        </span>
      </p>
      <div className={styles.barBackground} style={{ backgroundColor: COLORS.dataFields }}>
        <div
          className={styles.barFill}
          style={{ width: `${porcentaje}%`, backgroundColor: colorBarra }}
        />
      </div>
      <div className={styles.amounts}>
        <span style={{ color: colorPorcentaje }}>
          {porcentaje.toFixed(0)}% del límite alcanzado
        </span>
      </div>
    </div>
  )
}

export default PresupuestoBar;