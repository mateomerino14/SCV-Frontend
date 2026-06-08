import { useState } from 'react'
import { Briefcase } from 'lucide-react'
import Button from '../../components/ui/Button'
import { COLORS } from '../../constants'

const MAX_MONTO = 99999.99
const MAX_NOMBRE = 50

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm',
  card: 'flex flex-col p-6 rounded-2xl w-full max-w-sm mx-4 shadow-xl gap-3',
  iconWrapper: 'rounded-full p-4 self-center',
  titulo: 'text-2xl font-bold font-inter text-center',
  subtitulo: 'text-sm font-inter text-center',
  inputLabel: 'text-xs font-bold font-inter uppercase mb-1',
  inputWrapper: 'flex items-center border rounded-xl px-3 py-2.5 gap-2',
  input: 'flex-1 text-sm font-inter outline-none bg-transparent',
  errorCampo: 'text-xs font-inter mt-1',
  impactoLabel: 'text-xs font-inter mt-1',
  sugerenciasWrapper: 'border rounded-xl overflow-hidden mt-1',
  sugerenciaItem: 'px-3 py-2 text-sm font-inter cursor-pointer',
  btnRow: 'flex gap-3 mt-2 justify-center',
}

function FormularioCargoModal({ isOpen, onClose, onConfirm, titulo, subtitulo, btnLabel, formData, setFormData, loading, erroresCampo = {}, setErroresCampo, sugerencias = [] }) {
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)

  if (!isOpen) return null

  const impactoMensual = formData.monto_diario
    ? (parseFloat(formData.monto_diario) * 30).toFixed(2)
    : '0.00'

  const handleNombreChange = (e) => {
    const val = e.target.value
    if (val.length > MAX_NOMBRE) return
    setFormData((prev) => ({ ...prev, nombre: val }))
    setErroresCampo?.((prev) => ({ ...prev, nombre: undefined }))
    setMostrarSugerencias(true)
  }

  const handleMontoChange = (e) => {
    const val = e.target.value
    if (val === '') { setFormData((prev) => ({ ...prev, monto_diario: '' })); return }
    if (!/^\d*\.?\d{0,2}$/.test(val)) return
    if (parseFloat(val) > MAX_MONTO) return
    setFormData((prev) => ({ ...prev, monto_diario: val }))
    setErroresCampo?.((prev) => ({ ...prev, monto_diario: undefined }))
  }

  const handleMontoKeyDown = (e) => {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', '.']
    if (allowed.includes(e.key)) {
      if (e.key === '.' && formData.monto_diario.toString().includes('.')) e.preventDefault()
      return
    }
    if (!/^\d$/.test(e.key)) e.preventDefault()
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
        <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.backgroundHeader }}>
          <Briefcase size={40} style={{ color: COLORS.text }} />
        </div>
        <p className={styles.titulo} style={{ color: COLORS.text }}>{titulo}</p>
        <p className={styles.subtitulo} style={{ color: COLORS.labels }}>{subtitulo}</p>

        <div>
          <p className={styles.inputLabel} style={{ color: COLORS.labels }}>Nombre del Cargo</p>
          <div
            className={styles.inputWrapper}
            style={{
              borderColor: erroresCampo.nombre ? '#f87171' : COLORS.dataFields,
              backgroundColor: COLORS.background,
            }}
          >
            <input
              className={styles.input}
              style={{ color: COLORS.text }}
              placeholder="Ej: Especialista de Marketing"
              value={formData.nombre}
              onChange={handleNombreChange}
              onBlur={() => setTimeout(() => setMostrarSugerencias(false), 150)}
              maxLength={MAX_NOMBRE}
              autoComplete="off"
            />
          </div>
          {erroresCampo.nombre && (
            <p className={styles.errorCampo} style={{ color: '#ef4444' }}>{erroresCampo.nombre}</p>
          )}
          {mostrarSugerencias && sugerencias.length > 0 && (
            <div className={styles.sugerenciasWrapper} style={{ borderColor: COLORS.dataFields, backgroundColor: COLORS.background }}>
              {sugerencias.slice(0, 4).map((s) => (
                <div
                  key={s.id_cargo}
                  className={styles.sugerenciaItem}
                  style={{ color: COLORS.text, borderBottom: `1px solid ${COLORS.dataFields}` }}
                  onMouseDown={() => { setFormData((prev) => ({ ...prev, nombre: s.nombre })); setMostrarSugerencias(false) }}
                >
                  {s.nombre}
                  <span className="text-xs ml-2" style={{ color: COLORS.secondary }}>ya existe</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className={styles.inputLabel} style={{ color: COLORS.labels }}>Sueldo Diario (Bs.)</p>
          <div
            className={styles.inputWrapper}
            style={{
              borderColor: erroresCampo.monto_diario ? '#f87171' : COLORS.dataFields,
              backgroundColor: COLORS.background,
            }}
          >
            <input
              className={styles.input}
              style={{ color: COLORS.text }}
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={formData.monto_diario}
              onChange={handleMontoChange}
              onKeyDown={handleMontoKeyDown}
              autoComplete="off"
            />
          </div>
          {erroresCampo.monto_diario && (
            <p className={styles.errorCampo} style={{ color: '#ef4444' }}>{erroresCampo.monto_diario}</p>
          )}
          {!erroresCampo.monto_diario && parseFloat(formData.monto_diario) > 0 && (
            <p className={styles.impactoLabel} style={{ color: COLORS.secondary }}>
              Impacto mensual estimado: Bs. {impactoMensual}
            </p>
          )}
        </div>

        <div className={styles.btnRow}>
          <Button text="Cancelar" variant="secondary" onClick={onClose} />
          <Button text={loading ? 'Guardando...' : btnLabel} variant="primary" onClick={onConfirm} disabled={loading} />
        </div>
      </div>
    </div>
  )
}

export default FormularioCargoModal;