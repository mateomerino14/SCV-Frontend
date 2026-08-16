import { COLORS } from '../../constants'
import useFormularioFactura from '../../hooks/useFormularioFactura'
import { QrCode } from 'lucide-react'

const styles = {
  wrapper: "flex flex-col gap-4 mt-4 p-5 shadow-md rounded-lg",
  sectionTitle: "text-xs font-bold font-inter uppercase mb-2",
  toggleRow: "flex gap-2 mb-2",
  toggleBtn: "flex-1 py-2 rounded-xl font-bold font-nunito text-sm cursor-pointer border transition-colors",
  fieldWrapper: "flex flex-col gap-1",
  label: "text-xs font-bold font-inter uppercase",
  inputBox: "rounded-xl px-4 py-3 border",
  input: "w-full bg-transparent outline-none font-inter text-sm",
  errorCampo: "text-xs font-inter mt-1",
  montoTotalBox: "rounded-xl px-4 py-3 border-2",
  montoTotalText: "text-2xl font-bold font-inter",
  alerta: "flex items-center gap-2 p-2 rounded-xl text-xs font-inter justify-center",
  qrBadge: "flex items-center gap-2 p-2 rounded-xl text-xs font-bold font-inter justify-center",
}

const camposConfig = [
  { key: 'proveedor', label: 'Proveedor', type: 'text', requerido: true },
  { key: 'numero_factura', label: 'Número de Factura', type: 'text', requerido: true },
  { key: 'nit', label: 'NIT / CI', type: 'text', requerido: false },
  { key: 'fecha_emision', label: 'Fecha de Emisión', type: 'date', requerido: true },
  { key: 'monto', label: 'Monto', type: 'text', requerido: true },
]

function FormularioFactura({ datos, onChange, modificadoManualmente, erroresCampo = {}, guardado = false }) {
  const { montoTotal, porcentajeIva, handleCampoChange, handleTipoDocChange } = useFormularioFactura(datos, onChange, guardado)

  return (
    <div className={styles.wrapper}>

      {datos.extraido_por_qr && !modificadoManualmente && (
        <div className={styles.qrBadge} style={{ backgroundColor: '#d4edda', color: '#155724' }}>
          <QrCode size={14} />
          Datos extraídos del QR del SIAT
        </div>
      )}

      <div className="mt-3">
        <p className={styles.sectionTitle} style={{ color: COLORS.labels }}>Tipo de Documento</p>
        <div className={styles.toggleRow}>
          {['F', 'R'].map((tipo) => (
            <button
              key={tipo}
              className={styles.toggleBtn}
              style={{
                backgroundColor: datos.tipo_doc === tipo ? COLORS.primary : 'transparent',
                borderColor: datos.tipo_doc === tipo ? COLORS.primary : COLORS.fields,
                color: datos.tipo_doc === tipo ? COLORS.background : COLORS.labels,
                opacity: guardado ? 0.6 : 1,
                cursor: guardado ? 'default' : 'pointer',
              }}
              onClick={() => !guardado && handleTipoDocChange(tipo)}
              disabled={guardado}
            >
              {tipo === 'F' ? 'Factura (F)' : 'Recibo (R)'}
            </button>
          ))}
        </div>
      </div>

      {camposConfig.map(({ key, label, type, requerido }) => (
        <div key={key} className={styles.fieldWrapper}>
          <p className={styles.label} style={{ color: COLORS.labels }}>
            {label}{!requerido ? ' (Opcional)' : ''}
          </p>
          <div
            className={styles.inputBox}
            style={{
              borderColor: erroresCampo[key] ? '#f87171' : COLORS.dataFields,
              borderWidth: erroresCampo[key] ? '1.5px' : '1px',
              opacity: guardado ? 0.6 : 1,
            }}
          >
            <input
              className={styles.input}
              style={{ color: COLORS.text }}
              value={datos[key] || ''}
              onChange={(e) => handleCampoChange(key, e.target.value)}
              type={type}
              inputMode={key === 'monto' ? 'decimal' : 'text'}
              disabled={guardado}
            />
          </div>
          {erroresCampo[key] && (
            <p className={styles.errorCampo} style={{ color: '#ef4444' }}>{erroresCampo[key]}</p>
          )}
        </div>
      ))}

      <div className={styles.fieldWrapper}>
        <p className={styles.label} style={{ color: COLORS.labels }}>
          IVA {porcentajeIva > 0 ? `(${porcentajeIva}%)` : '(No aplica)'}
        </p>
        <div
          className={styles.inputBox}
          style={{
            borderColor: COLORS.dataFields,
            opacity: 0.6,
            backgroundColor: COLORS.backgroundHeader,
          }}
        >
          <input
            className={styles.input}
            style={{ color: COLORS.text, cursor: 'default' }}
            value={datos.iva || '0.00'}
            readOnly
            type="text"
          />
        </div>
      </div>

      <div className={styles.fieldWrapper}>
        <p className={styles.label} style={{ color: COLORS.labels }}>Monto Total</p>
        <div className={styles.montoTotalBox} style={{ borderColor: COLORS.secondary }}>
          <p className={styles.montoTotalText} style={{ color: COLORS.secondary }}>
            {montoTotal.toFixed(2)} Bs
          </p>
        </div>
      </div>

      {modificadoManualmente && (
        <div className={styles.alerta} style={{ backgroundColor: '#fef3cd', color: '#856404' }}>
          Se han detectado cambios manuales en los datos extraídos
        </div>
      )}
    </div>
  )
}

export default FormularioFactura;