import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { User, ChevronDown, ChevronUp, Check } from 'lucide-react'
import Button from '../../components/ui/Button'
import SelectorCargo from './SelectorCargo'
import { COLORS } from '../../constants'

const AVATAR_DEFAULT = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg"

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm',
  scrollWrapper: 'w-full max-w-sm md:max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl',
  card: 'flex flex-col p-6 gap-3',
  avatarWrapper: 'flex justify-center mb-2',
  avatar: 'w-20 h-20 rounded-full object-cover border-4',
  iconWrapper: 'rounded-full p-4 self-center',
  titulo: 'text-2xl font-bold font-inter text-center mb-5',
  grid: 'grid grid-cols-1 md:grid-cols-2 gap-3',
  inputLabel: 'text-xs font-bold font-inter uppercase mb-1',
  input: 'w-full border rounded-xl px-3 py-2.5 text-sm font-inter outline-none',
  errorCampo: 'text-xs font-inter mt-1',
  dropdownWrapper: 'relative',
  dropdownBtn: 'w-full border rounded-xl px-3 py-2.5 text-sm font-inter flex items-center justify-between cursor-pointer',
  dropdownMenu: 'fixed z-[10000] rounded-xl border shadow-lg overflow-hidden',
  dropdownItem: 'flex items-center justify-between px-3 py-2.5 text-sm font-inter cursor-pointer',
  btnRow: 'flex gap-3 mt-2 justify-center',
  errorMsg: 'text-red-600 text-sm font-inter italic text-center',
}

const rolesOpciones = [
  { value: 3, label: 'Empleado' },
  { value: 2, label: 'Supervisor' },
  { value: 5, label: 'Aprobador' },
  { value: 4, label: 'Revisor' },
  { value: 1, label: 'Administrador' },
]

const soloLetrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/
const soloNumerosRegex = /^[0-9]*$/

function FormularioUsuarioModal({ isOpen, onClose, onConfirm, titulo, btnLabel, formData, setFormData, cargos, loading, error, erroresCampo = {}, setErroresCampo, usuarioSeleccionado }) {
  const [dropdownRol, setDropdownRol] = useState(false)
  const [posicionRol, setPosicionRol] = useState(null)
  const triggerRolRef = useRef(null)
  const menuRolRef = useRef(null)

  if (!isOpen) return null

  const rolSeleccionado = rolesOpciones.find((r) => r.value === formData.id_rol)
  const esNuevo = titulo === 'Nuevo Usuario'
  const fotoPerfil = usuarioSeleccionado?.foto_perfil || null

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

  const calcularPosicionRol = () => {
    if (!triggerRolRef.current) return
    const rect = triggerRolRef.current.getBoundingClientRect()
    const espacioAbajo = window.innerHeight - rect.bottom
    const abreArriba = espacioAbajo < 220
    setPosicionRol({
      left: rect.left,
      width: rect.width,
      top: abreArriba ? undefined : rect.bottom + 4,
      bottom: abreArriba ? window.innerHeight - rect.top + 4 : undefined,
    })
  }

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (
        triggerRolRef.current && !triggerRolRef.current.contains(e.target) &&
        menuRolRef.current && !menuRolRef.current.contains(e.target)
      ) {
        setDropdownRol(false)
      }
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  useEffect(() => {
    if (!dropdownRol) return
    const handleReposicionar = () => calcularPosicionRol()
    window.addEventListener('scroll', handleReposicionar, true)
    window.addEventListener('resize', handleReposicionar)
    return () => {
      window.removeEventListener('scroll', handleReposicionar, true)
      window.removeEventListener('resize', handleReposicionar)
    }
  }, [dropdownRol])

  const handleToggleRol = () => {
    const nuevoEstado = !dropdownRol
    if (nuevoEstado) calcularPosicionRol()
    setDropdownRol(nuevoEstado)
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.scrollWrapper} style={{ backgroundColor: COLORS.background }}>
        <div className={styles.card}>
          {!esNuevo && fotoPerfil ? (
            <div className={styles.avatarWrapper}>
              <img
                src={fotoPerfil}
                alt="foto perfil"
                className={styles.avatar}
                style={{ borderColor: COLORS.primary }}
                onError={(e) => { e.target.src = AVATAR_DEFAULT }}
              />
            </div>
          ) : (
            <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.backgroundHeader }}>
              <User size={40} style={{ color: COLORS.text }} />
            </div>
          )}

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
            <SelectorCargo
              cargos={cargos}
              idCargo={formData.id_cargo}
              onChange={(id) => {
                setFormData((prev) => ({ ...prev, id_cargo: id }))
                setErroresCampo?.((prev) => ({ ...prev, id_cargo: undefined }))
              }}
              error={erroresCampo.id_cargo}
            />

            <div>
              <p className={styles.inputLabel} style={{ color: COLORS.labels }}>Rol de Sistema</p>
              <button
                ref={triggerRolRef}
                type="button"
                className={styles.dropdownBtn}
                style={{ borderColor: COLORS.dataFields, backgroundColor: COLORS.background, color: COLORS.text }}
                onClick={handleToggleRol}
              >
                <span>{rolSeleccionado?.label || 'Seleccionar rol'}</span>
                {dropdownRol ? <ChevronUp size={16} style={{ color: COLORS.labels }} /> : <ChevronDown size={16} style={{ color: COLORS.labels }} />}
              </button>
              {dropdownRol && posicionRol && createPortal(
                <div
                  ref={menuRolRef}
                  className={styles.dropdownMenu}
                  style={{
                    backgroundColor: COLORS.background,
                    borderColor: COLORS.dataFields,
                    left: posicionRol.left,
                    width: posicionRol.width,
                    top: posicionRol.top,
                    bottom: posicionRol.bottom,
                  }}
                >
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
                </div>,
                document.body
              )}
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