import { COLORS } from '../../constants'

const styles = {
  wrapper: "flex gap-2 mb-4 overflow-x-auto pb-1",
  tab: "px-4 py-1.5 rounded-full text-xs font-bold font-inter cursor-pointer whitespace-nowrap border transition-colors",
}

const tabs = [
  { valor: 'TODOS', label: 'Todos' },
  { valor: 'EN_CURSO', label: 'En Curso' },
  { valor: 'EN_REVISION', label: 'En Revisión' },
  { valor: 'APROBADO_SUPERVISOR', label: 'Aprobación Preliminar' },
  { valor: 'APROBADO_FINAL', label: 'Aprobado' },
  { valor: 'RECHAZADO', label: 'Rechazado' },
]

function FiltroTabs({ filtroActivo, onChange }) {
  return (
    <div className={styles.wrapper}>
      {tabs.map((tab) => (
        <button
          key={tab.valor}
          className={styles.tab}
          style={{
            backgroundColor: filtroActivo === tab.valor ? COLORS.primary : 'transparent',
            borderColor: filtroActivo === tab.valor ? COLORS.primary : COLORS.dataFields,
            color: filtroActivo === tab.valor ? COLORS.background : COLORS.labels,
          }}
          onClick={() => onChange(tab.valor)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default FiltroTabs;