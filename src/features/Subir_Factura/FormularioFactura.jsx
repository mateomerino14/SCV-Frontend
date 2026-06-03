import { COLORS } from '../../constants'
import useFormularioFactura from '../../hooks/useFormularioFactura'

const styles = {
  wrapper: "flex flex-col gap-4 mt-4 p-5 shadow-md rounded-lg h-200",
  sectionTitle: "text-xs font-bold font-inter uppercase mb-2",
  toggleRow: "flex gap-2 mb-2",
  toggleBtn: "flex-1 py-2 rounded-xl font-bold font-nunito text-sm cursor-pointer border transition-colors",
  fieldWrapper: "flex flex-col gap-1",
  label: "text-xs font-bold font-inter uppercase",
  inputBox: "rounded-xl px-4 py-3 border",
  input: "w-full bg-transparent outline-none font-inter text-sm",
  montoTotalBox: "rounded-xl px-4 py-3 border-2",
  montoTotalText: "text-2xl font-bold font-inter",
  alerta: "flex items-center gap-2 p-2 rounded-xl text-xs font-inter justify-center",
}

const camposLabels = {
  proveedor: 'Proveedor',
  numero_factura: 'Número de Factura',
  nit: 'NIT / CI',
  fecha_emision: 'Fecha de Emisión',
  monto: 'Monto',
}

const tiposInput = {
  fecha_emision: 'date',
  monto: 'text',
}

const modoInput = {
  monto: 'decimal',
}

function FormularioFactura({ datos, onChange, modificadoManualmente }) {
  const {
    montoTotal,
    porcentajeIva,
    handleCampoChange,
  } = useFormularioFactura(datos, onChange)

  return (
    <div className={styles.wrapper}>

      <div className="mt-3">
        <p className={styles.sectionTitle} style={{ color: COLORS.labels }}>
          Tipo de Documento
        </p>
        <div className={styles.toggleRow}>
          {['F', 'R'].map((tipo) => (
            <button
              key={tipo}
              className={styles.toggleBtn}
              style={{
                backgroundColor: datos.tipo_doc === tipo ? COLORS.primary : 'transparent',
                borderColor: datos.tipo_doc === tipo ? COLORS.primary : COLORS.fields,
                color: datos.tipo_doc === tipo ? COLORS.background : COLORS.labels,
              }}
              onClick={() => onChange('tipo_doc', tipo)}
            >
              {tipo === 'F' ? 'Factura (F)' : 'Recibo (R)'}
            </button>
          ))}
        </div>
      </div>

      {Object.entries(camposLabels).map(([campo, label]) => (
        <div key={campo} className={styles.fieldWrapper}>
          <p className={styles.label} style={{ color: COLORS.labels }}>
            {label}
          </p>
          <div className={styles.inputBox} style={{ borderColor: COLORS.dataFields }}>
            <input
              className={styles.input}
              style={{ color: COLORS.text }}
              value={datos[campo] || ''}
              onChange={(e) => handleCampoChange(campo, e.target.value)}
              type={tiposInput[campo] || 'text'}
              inputMode={modoInput[campo] || 'text'}
            />
          </div>
        </div>
      ))}

      <div className={styles.fieldWrapper}>
        <p className={styles.label} style={{ color: COLORS.labels }}>
          IVA{porcentajeIva > 0 ? ` (${porcentajeIva}%)` : ''}
        </p>
        <div className={styles.inputBox} style={{ borderColor: COLORS.dataFields }}>
          <input
            className={styles.input}
            style={{ color: COLORS.text }}
            value={datos.iva || ''}
            onChange={(e) => handleCampoChange('iva', e.target.value)}
            type="text"
            inputMode="decimal"
          />
        </div>
      </div>

      <div className={styles.fieldWrapper}>
        <p className={styles.label} style={{ color: COLORS.labels }}>
          Monto Total
        </p>
        <div className={styles.montoTotalBox} style={{ borderColor: COLORS.secondary }}>
          <p className={styles.montoTotalText} style={{ color: COLORS.secondary }}>
            {montoTotal.toFixed(2)} Bs
          </p>
        </div>
      </div>

      {modificadoManualmente && (
        <div
          className={styles.alerta}
          style={{ backgroundColor: '#fef3cd', color: '#856404'}}
        >
          Se han detectado cambios manuales en los datos extraídos
        </div>
      )}

    </div>
  )
}

export default FormularioFactura;