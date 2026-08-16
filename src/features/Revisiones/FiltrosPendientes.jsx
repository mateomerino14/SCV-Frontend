import { useState } from 'react'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'
import { COLORS } from '../../constants'

const styles = {
  wrapper: 'mb-5',
  card: 'rounded-2xl p-4 shadow-md',
  cardTitle: 'text-xs font-bold font-inter uppercase mb-3',
  row: 'grid grid-cols-2 gap-2',
  inputWrapper: 'flex items-center border rounded-xl px-3 py-2 gap-2 w-full min-w-0',
  input: 'min-w-0 w-full text-sm font-inter outline-none bg-transparent',
  inputLabel: 'text-xs font-inter uppercase mb-1',
  inputGroup: 'flex flex-col min-w-0',
  dropdownWrapper: 'relative',
  dropdownBtn: 'w-full border rounded-xl px-3 py-2.5 text-sm font-inter flex items-center justify-between cursor-pointer',
  dropdownMenu: 'absolute z-20 w-full border rounded-xl mt-1 shadow-lg overflow-hidden',
  dropdownList: 'overflow-y-auto',
  dropdownItem: 'flex items-center justify-between px-3 py-2.5 text-sm font-inter cursor-pointer',
  btnRow: 'flex gap-2 mt-3',
  btn: 'flex-1 py-2.5 rounded-xl text-sm font-bold font-nunito cursor-pointer border transition-colors text-center',
  divider: 'border-t mt-3 pt-3',
  tabsRow: 'flex gap-2',
  tab: 'flex-1 py-1.5 px-4 rounded-full text-xs font-bold font-inter cursor-pointer border transition-colors whitespace-nowrap text-center',
}

const tabsPendientes = [
  { valor: 'TODOS', label: 'Todos' },
  { valor: 'OBSERVADO', label: 'Observados' },
  { valor: 'CONFORME', label: 'Conformes' },
]

const tabsHistorial = [
  { valor: 'TODOS', label: 'Todos' },
  { valor: 'APROBADO_FINAL', label: 'Aprobados' },
  { valor: 'RECHAZADO', label: 'Rechazados' },
]

function FiltrosPendientes({ filtros, setFiltros, filtroEstado, setFiltroEstado, onAplicar, onLimpiar, empleados = [], ocultarTabsEstado = false, tabsVariant = 'PENDIENTES' }) {
  const [dropdownAbierto, setDropdownAbierto] = useState(false)
  const tabs = tabsVariant === 'HISTORIAL' ? tabsHistorial : tabsPendientes

  const empleadoSeleccionado = empleados.find(
    (e) => String(e.id_usuario) === String(filtros.id_empleado)
  )

  const handleSeleccionarEmpleado = (id) => {
    setFiltros((prev) => ({ ...prev, id_empleado: id }))
    setDropdownAbierto(false)
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.card}
        style={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.fields}` }}
      >
        <p className={styles.cardTitle} style={{ color: COLORS.labels }}>
          Filtros de Búsqueda
        </p>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <p className={styles.inputLabel} style={{ color: COLORS.labels }}>Desde</p>
            <div
              className={styles.inputWrapper}
              style={{ borderColor: COLORS.dataFields, backgroundColor: COLORS.background }}
            >
              <input
                className={styles.input}
                style={{ color: COLORS.text }}
                type="date"
                value={filtros.fecha_inicio}
                onChange={(e) => setFiltros((prev) => ({ ...prev, fecha_inicio: e.target.value }))}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <p className={styles.inputLabel} style={{ color: COLORS.labels }}>Hasta</p>
            <div
              className={styles.inputWrapper}
              style={{ borderColor: COLORS.dataFields, backgroundColor: COLORS.background }}
            >
              <input
                className={styles.input}
                style={{ color: COLORS.text }}
                type="date"
                value={filtros.fecha_fin}
                onChange={(e) => setFiltros((prev) => ({ ...prev, fecha_fin: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {empleados.length > 0 && (
          <div className="mt-3">
            <p className={styles.inputLabel} style={{ color: COLORS.labels }}>Empleado</p>
            <div className={styles.dropdownWrapper}>
              <button
                className={styles.dropdownBtn}
                style={{ borderColor: COLORS.dataFields, backgroundColor: COLORS.background, color: empleadoSeleccionado ? COLORS.text : COLORS.labels }}
                onClick={() => setDropdownAbierto(!dropdownAbierto)}
              >
                <span>
                  {empleadoSeleccionado
                    ? `${empleadoSeleccionado.nombre} ${empleadoSeleccionado.apellido_paterno}`
                    : 'Todos los empleados'}
                </span>
                {dropdownAbierto
                  ? <ChevronUp size={16} style={{ color: COLORS.labels }} />
                  : <ChevronDown size={16} style={{ color: COLORS.labels }} />
                }
              </button>

              {dropdownAbierto && (
                <div
                  className={styles.dropdownMenu}
                  style={{ backgroundColor: COLORS.background, borderColor: COLORS.dataFields }}
                >
                  <div
                    className={styles.dropdownList}
                    style={{ maxHeight: `${5 * 44}px` }}
                  >
                    <div
                      className={styles.dropdownItem}
                      style={{
                        backgroundColor: !filtros.id_empleado ? COLORS.backgroundHeader : 'transparent',
                        color: COLORS.text,
                      }}
                      onClick={() => handleSeleccionarEmpleado('')}
                    >
                      <span>Todos los empleados</span>
                      {!filtros.id_empleado && <Check size={14} style={{ color: COLORS.primary }} />}
                    </div>
                    {empleados.map((emp) => {
                      const seleccionado = String(filtros.id_empleado) === String(emp.id_usuario)
                      return (
                        <div
                          key={emp.id_usuario}
                          className={styles.dropdownItem}
                          style={{
                            backgroundColor: seleccionado ? COLORS.backgroundHeader : 'transparent',
                            color: seleccionado ? COLORS.primary : COLORS.text,
                            borderTop: `1px solid ${COLORS.dataFields}`,
                          }}
                          onClick={() => handleSeleccionarEmpleado(emp.id_usuario)}
                        >
                          <span>{emp.nombre} {emp.apellido_paterno}</span>
                          {seleccionado && <Check size={14} style={{ color: COLORS.primary }} />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.btnRow}>
          <button
            className={styles.btn}
            style={{ backgroundColor: COLORS.primary, borderColor: COLORS.primary, color: COLORS.background }}
            onClick={onAplicar}
          >
            Aplicar Filtros
          </button>
          <button
            className={styles.btn}
            style={{ backgroundColor: 'transparent', borderColor: COLORS.dataFields, color: COLORS.labels }}
            onClick={onLimpiar}
          >
            Limpiar
          </button>
        </div>

        {!ocultarTabsEstado && (
          <div className={styles.divider} style={{ borderColor: COLORS.dataFields }}>
            <div className={styles.tabsRow}>
              {tabs.map((tabItem) => (
                <button
                  key={tabItem.valor}
                  className={styles.tab}
                  style={{
                    backgroundColor: filtroEstado === tabItem.valor ? COLORS.backgroundHeader : 'transparent',
                    borderColor: filtroEstado === tabItem.valor ? COLORS.labels : COLORS.dataFields,
                    color: filtroEstado === tabItem.valor ? COLORS.text : COLORS.labels,
                  }}
                  onClick={() => setFiltroEstado(tabItem.valor)}
                >
                  {tabItem.label}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default FiltrosPendientes;