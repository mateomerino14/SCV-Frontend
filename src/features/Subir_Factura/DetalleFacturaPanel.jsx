import { Trash2 } from 'lucide-react'
import { COLORS } from '../../constants'
import useDetalleFacturaPanel from '../../hooks/useDetalleFacturaPanel'

const styles = {
  wrapper: "mt-4 shadow-md p-5 rounded-xl",
  sectionTitle: "text-sm font-bold font-inter uppercase mb-3",
  tablaWrapper: "border rounded-xl overflow-hidden",
  tablaHeader: "grid gap-1 font-bold uppercase py-2 text-xs font-nunito text-center rounded-tl-xl rounded-tr-xl",
  tablaScroll: "overflow-y-scroll max-h-77",
  tablaFila: "grid gap-1 py-2 items-center text-xs font-inter text-center border-b",
  iconWrapper: "flex items-center justify-center",
  label: "text-xs font-bold font-inter uppercase mt-4 mb-1",
  inputBox: "rounded-xl px-3 py-2 border w-full",
  input: "w-full bg-transparent outline-none font-inter text-xs",
  errorCampo: "text-xs font-inter mt-1",
  btnsRow: "flex gap-2 mt-4",
  addBtn: "flex-1 py-2 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center",
}

const gridColumnas = { gridTemplateColumns: '2fr 1fr 1fr 1fr' }

const campos = [
  { key: 'nombre_producto', label: 'Descripción', type: 'text' },
  { key: 'precio', label: 'Precio', type: 'number' },
  { key: 'cantidad', label: 'Cantidad', type: 'number' },
]

function DetalleFacturaPanel({ detalle, onAgregar, onEliminar, guardado = false }) {
  const hayMuchosItems = detalle.length > 9
  const { item, indexSeleccionado, erroresCampo, handleSeleccionarFila, handleCampoChange, handleAgregar, handleModificar } =
    useDetalleFacturaPanel(detalle, onAgregar, onEliminar)

  return (
    <div className={styles.wrapper}>
      <p className={styles.sectionTitle} style={{ color: COLORS.labels }}>
        Detalle de Productos / Servicios
      </p>

      <div className={styles.tablaWrapper} style={{ borderColor: COLORS.dataFields }}>
        <div
          className={styles.tablaHeader}
          style={{
            color: COLORS.background,
            backgroundColor: COLORS.backgroundSecondary,
            ...gridColumnas,
            paddingRight: hayMuchosItems ? '17px' : '0px',
          }}
        >
          <span>Descripción</span>
          <span>Cant.</span>
          <span>Precio</span>
          <span>Acciones</span>
        </div>
        <div className={hayMuchosItems ? styles.tablaScroll : ''}>
          {detalle.map((detalleFila, indice) => (
            <div
              key={indice}
              className={styles.tablaFila}
              style={{
                borderColor: COLORS.dataFields,
                backgroundColor: indexSeleccionado === indice ? COLORS.backgroundHeader : 'transparent',
                cursor: guardado ? 'default' : 'pointer',
                ...gridColumnas,
              }}
              onClick={() => !guardado && handleSeleccionarFila(indice)}
            >
              <span className="px-1 text-left" style={{ color: COLORS.text }}>{detalleFila.nombre_producto}</span>
              <span style={{ color: COLORS.text }}>{detalleFila.cantidad}</span>
              <span style={{ color: COLORS.text }}>{parseFloat(detalleFila.precio).toFixed(2)} Bs</span>
              <div className={styles.iconWrapper}>
                {!guardado && (
                  <Trash2
                    size={14}
                    style={{ color: COLORS.secondary, cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); onEliminar(indice) }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!guardado && (
        <>
          <div className="flex flex-col gap-3" style={{ marginTop: hayMuchosItems ? '0.5rem' : '1.3rem' }}>
            {campos.map(({ key, label, type }) => (
              <div key={key}>
                <p className={styles.label} style={{ color: COLORS.labels }}>{label}</p>
                <div
                  className={styles.inputBox}
                  style={{
                    borderColor: erroresCampo[key] ? '#f87171' : COLORS.dataFields,
                    borderWidth: erroresCampo[key] ? '1.5px' : '1px',
                  }}
                >
                  <input
                    className={styles.input}
                    style={{ color: COLORS.text }}
                    type={type === 'number' ? 'text' : type}
                    inputMode={key === 'precio' ? 'decimal' : key === 'cantidad' ? 'numeric' : 'text'}
                    value={item[key]}
                    onChange={(e) => handleCampoChange(key, e.target.value)}
                    maxLength={key === 'nombre_producto' ? 50 : undefined}
                  />
                </div>
                {erroresCampo[key] && (
                  <p className={styles.errorCampo} style={{ color: '#ef4444' }}>{erroresCampo[key]}</p>
                )}
              </div>
            ))}
          </div>

          <div className={styles.btnsRow}>
            <button
              className={styles.addBtn}
              style={{ backgroundColor: COLORS.primary, color: COLORS.background }}
              onClick={handleAgregar}
            >
              Agregar
            </button>
            <button
              className={styles.addBtn}
              style={{
                backgroundColor: indexSeleccionado !== null ? COLORS.secondary : COLORS.dataFields,
                color: indexSeleccionado !== null ? COLORS.background : COLORS.labels,
              }}
              onClick={handleModificar}
              disabled={indexSeleccionado === null}
            >
              Modificar
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default DetalleFacturaPanel;