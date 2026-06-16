import { useState } from 'react'
import { User, ChevronDown, ChevronUp, Check } from 'lucide-react'
import Button from '../../components/ui/Button'
import { COLORS } from '../../constants'

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm',
  scrollWrapper: 'w-full max-w-sm md:max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl',
  card: 'flex flex-col p-6 gap-3',
  iconWrapper: 'rounded-full p-4 self-center',
  titulo: 'text-2xl font-bold font-inter text-center mb-5',
  grid: 'grid grid-cols-1 md:grid-cols-2 gap-3',
  inputLabel: 'text-xs font-bold font-inter uppercase mb-1',
  input: 'w-full border rounded-xl px-3 py-2.5 text-sm font-inter outline-none',
  errorCampo: 'text-xs font-inter mt-1',
  dropdownWrapper: 'relative',
  dropdownBtn: 'w-full border rounded-xl px-3 py-2.5 text-sm font-inter flex items-center justify-between cursor-pointer',
  dropdownMenu: 'absolute z-20 w-full border rounded-xl mt-1 shadow-lg overflow-hidden',
  dropdownItem: 'flex items-center justify-between px-3 py-2.5 text-sm font-inter cursor-pointer',
  btnRow: 'flex gap-3 mt-2 justify-center',
  errorMsg: 'text-red-600 text-sm font-inter italic text-center',
}

const rolesOpciones = [
  { value: 3, label: 'Empleado' },
  { value: 2, label: 'Supervisor' },
  { value: 1, label: 'Administrador' },
  { value: 4, label: 'Revisor' },
]

const soloLetrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/
const soloNumerosRegex = /^[0-9]*$/

function FormularioUsuarioModal({ isOpen, onClose, onConfirm, titulo, btnLabel, formData, setFormData, cargos, loading, error, erroresCampo = {}, setErroresCampo }) {
  const [dropdownCargo, setDropdownCargo] = useState(false)
  const [dropdownRol, setDropdownRol] = useState(false)

  if (!isOpen) return null

  const cargoSeleccionado = cargos.find((c) => String(c.id_cargo) === String(formData.id_cargo))
  const rolSeleccionado = rolesOpciones.find((r) => r.value === formData.id_rol)
  const esNuevo = titulo === 'Nuevo Usuario'

  const handleChange = (key, valor, filtro, maxLen) => {
    if (filtro && !filtro.test(valor)) return
    if (maxLen && valor.length > maxLen) return
    setFormData((prev) => ({ ...prev, [key]: valor }))
    setErroresCampo?.((prev) => ({ ...prev, [key]: undefined }))
  }

  const campoTexto = (key, label, placeholder, filtro, maxLen) => (
    <div key={key}>
      <p className={styles.inputLabel} style={{ color: COLORS.labels }}>{label}</p>
      <input
        className={styles.input}
        style={{
          borderColor: erroresCampo[key] ? '#f87171' : COLORS.dataFields,
          color: COLORS.text,
          backgroundColor: COLORS.background,
        }}
        type="text"
        placeholder={placeholder}
        value={formData[key] || ''}
        onChange={(e) => handleChange(key, e.target.value, filtro, maxLen)}
        maxLength={maxLen}
      />
      {erroresCampo[key] && (
        <p className={styles.errorCampo} style={{ color: '#ef4444' }}>{erroresCampo[key]}</p>
      )}
    </div>
  )

  return (
    <div className={styles.overlay}>
      <div className={styles.scrollWrapper} style={{ backgroundColor: COLORS.background }}>
        <div className={styles.card}>
          <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.backgroundHeader }}>
            <User size={40} style={{ color: COLORS.text }} />
          </div>
          <p className={styles.titulo} style={{ color: COLORS.text }}>{titulo}</p>

          <div className={styles.grid}>
            {campoTexto('nombre', 'Nombre', 'Juan', soloLetrasRegex, 30)}
            {campoTexto('apellido_paterno', 'Apellido Paterno', 'García', soloLetrasRegex, 30)}
            {campoTexto('apellido_materno', 'Apellido Materno (opcional)', 'López', soloLetrasRegex, 30)}

            <div>
              <p className={styles.inputLabel} style={{ color: COLORS.labels }}>Correo Corporativo</p>
              <input
                className={styles.input}
                style={{
                  borderColor: erroresCampo.email_corporativo ? '#f87171' : COLORS.dataFields,
                  color: COLORS.text,
                  backgroundColor: COLORS.background,
                }}
                type="email"
                placeholder="juan@empresa.com"
                value={formData.email_corporativo || ''}
                onChange={(e) => {
                  if (e.target.value.length > 100) return
                  setFormData((prev) => ({ ...prev, email_corporativo: e.target.value }))
                  setErroresCampo?.((prev) => ({ ...prev, email_corporativo: undefined }))
                }}
                maxLength={100}
              />
              {erroresCampo.email_corporativo && (
                <p className={styles.errorCampo} style={{ color: '#ef4444' }}>{erroresCampo.email_corporativo}</p>
              )}
            </div>

            {campoTexto('telefono', 'Teléfono (opcional)', '71234567', soloNumerosRegex, 8)}
            {campoTexto('numero_dependencia', 'N° Dependencia', 'Ej: DEP-001', null, 50)}
            {campoTexto('numero_seccion', 'N° Sección', 'Ej: SEC-01', null, 50)}

            {esNuevo && (
              <div>
                <p className={styles.inputLabel} style={{ color: COLORS.labels }}>Contraseña</p>
                <input
                  className={styles.input}
                  style={{
                    borderColor: erroresCampo.contrasenia ? '#f87171' : COLORS.dataFields,
                    color: COLORS.text,
                    backgroundColor: COLORS.background,
                  }}
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.contrasenia || ''}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, contrasenia: e.target.value }))
                    setErroresCampo?.((prev) => ({ ...prev, contrasenia: undefined }))
                  }}
                />
                {erroresCampo.contrasenia && (
                  <p className={styles.errorCampo} style={{ color: '#ef4444' }}>{erroresCampo.contrasenia}</p>
                )}
              </div>
            )}
          </div>

          <div className={styles.grid}>
            <div>
              <p className={styles.inputLabel} style={{ color: COLORS.labels }}>Cargo</p>
              <div className={styles.dropdownWrapper}>
                <button
                  className={styles.dropdownBtn}
                  style={{
                    borderColor: erroresCampo.id_cargo ? '#f87171' : COLORS.dataFields,
                    backgroundColor: COLORS.background,
                    color: cargoSeleccionado ? COLORS.text : COLORS.labels,
                  }}
                  onClick={() => { setDropdownCargo(!dropdownCargo); setDropdownRol(false) }}
                >
                  <span>{cargoSeleccionado ? cargoSeleccionado.nombre : 'Seleccionar cargo'}</span>
                  {dropdownCargo ? <ChevronUp size={16} style={{ color: COLORS.labels }} /> : <ChevronDown size={16} style={{ color: COLORS.labels }} />}
                </button>
                {erroresCampo.id_cargo && (
                  <p className={styles.errorCampo} style={{ color: '#ef4444' }}>{erroresCampo.id_cargo}</p>
                )}
                {dropdownCargo && (
                  <div className={styles.dropdownMenu} style={{ backgroundColor: COLORS.background, borderColor: COLORS.dataFields }}>
                    <div style={{ maxHeight: `${4 * 44}px`, overflowY: 'auto' }}>
                      {cargos.filter(c => c.activo).map((c) => {
                        const sel = String(formData.id_cargo) === String(c.id_cargo)
                        return (
                          <div
                            key={c.id_cargo}
                            className={styles.dropdownItem}
                            style={{
                              backgroundColor: sel ? COLORS.backgroundHeader : 'transparent',
                              color: sel ? COLORS.primary : COLORS.text,
                              borderTop: `1px solid ${COLORS.dataFields}`,
                            }}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, id_cargo: c.id_cargo }))
                              setErroresCampo?.((prev) => ({ ...prev, id_cargo: undefined }))
                              setDropdownCargo(false)
                            }}
                          >
                            <span>{c.nombre}</span>
                            {sel && <Check size={14} style={{ color: COLORS.primary }} />}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className={styles.inputLabel} style={{ color: COLORS.labels }}>Rol de Sistema</p>
              <div className={styles.dropdownWrapper}>
                <button
                  className={styles.dropdownBtn}
                  style={{ borderColor: COLORS.dataFields, backgroundColor: COLORS.background, color: COLORS.text }}
                  onClick={() => { setDropdownRol(!dropdownRol); setDropdownCargo(false) }}
                >
                  <span>{rolSeleccionado?.label || 'Seleccionar rol'}</span>
                  {dropdownRol ? <ChevronUp size={16} style={{ color: COLORS.labels }} /> : <ChevronDown size={16} style={{ color: COLORS.labels }} />}
                </button>
                {dropdownRol && (
                  <div className={styles.dropdownMenu} style={{ backgroundColor: COLORS.background, borderColor: COLORS.dataFields }}>
                    {rolesOpciones.map((r) => {
                      const sel = formData.id_rol === r.value
                      return (
                        <div
                          key={r.value}
                          className={styles.dropdownItem}
                          style={{
                            backgroundColor: sel ? COLORS.backgroundHeader : 'transparent',
                            color: sel ? COLORS.primary : COLORS.text,
                            borderTop: `1px solid ${COLORS.dataFields}`,
                          }}
                          onClick={() => { setFormData((prev) => ({ ...prev, id_rol: r.value })); setDropdownRol(false) }}
                        >
                          <span>{r.label}</span>
                          {sel && <Check size={14} style={{ color: COLORS.primary }} />}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <div className={styles.btnRow}>
            <Button text="Cancelar" variant="secondary" onClick={onClose} />
            <Button text={loading ? 'Guardando...' : btnLabel} variant="primary" onClick={onConfirm} disabled={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormularioUsuarioModal;