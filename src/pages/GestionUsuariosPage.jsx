import { Search, Plus, Pencil, Ban, CheckCircle } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import MenuAdministrador from '../layouts/Menu/Menu_Administrador'
import FormularioUsuarioModal from '../features/Admin/FormularioUsuarioModal'
import EmptyState from '../components/ui/EmptyState'
import useGestionUsuarios from '../hooks/useGestionUsuarios'
import useMenu from '../hooks/useMenu'
import Button from '../components/ui/Button'
import { COLORS } from '../constants'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'

const AVATAR_DEFAULT = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg"

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  title: 'text-3xl font-bold font-inter mb-1',
  subtitulo: 'text-sm font-inter mb-5',
  searchWrapper: 'flex items-center border rounded-xl px-3 py-2 gap-2 mb-4',
  searchInput: 'flex-1 text-sm font-inter outline-none bg-transparent',
  tabsRow: 'flex gap-2 mb-4',
  tab: 'flex-1 py-1.5 rounded-full text-xs font-bold font-inter cursor-pointer border text-center transition-colors',
  usuarioCard: 'rounded-2xl p-4 mb-3 shadow-sm flex items-center gap-3',
  avatar: 'w-11 h-11 rounded-full object-cover shrink-0',
  usuarioInfo: 'flex flex-col flex-1 min-w-0',
  usuarioNombre: 'text-sm font-bold font-inter',
  usuarioCargo: 'text-xs font-inter',
  usuarioRol: 'text-xs font-bold font-inter px-2 py-0.5 rounded-full uppercase mt-1 self-start',
  accionesRow: 'flex items-center gap-2 shrink-0',
  accionBtn: 'w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer',
  fab: 'fixed bottom-24 right-5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer z-10',
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm',
  confirmCard: 'items-center flex flex-col p-6 rounded-xl w-full max-w-xs mx-4 gap-2 shadow-xl',
  confirmTitle: 'text-2xl font-bold font-inter text-center mt-3',
  confirmLabel: 'font-inter text-center text-sm m-3',
  confirmBtns: 'flex gap-4 mt-2',
  avisoCard: 'rounded-2xl p-4 flex items-center gap-3 mt-7 mb-4',
  avisoTexto: 'flex flex-col flex-1',
  avisoTitulo: 'text-sm font-bold font-inter',
  avisoSub: 'text-xs font-inter',
}

const tabs = [
  { valor: 'TODOS', label: 'Todos' },
  { valor: 'EMPLEADO', label: 'Empleados' },
  { valor: 'SUPERVISOR', label: 'Supervisores' },
]

const rolConfig = {
  ADMINISTRADOR: { label: 'Administrador', bg: '#d4edda', color: '#155724' },
  SUPERVISOR: { label: 'Supervisor', bg: '#85aff3ab', color: '#000a65' },
  EMPLEADO: { label: 'Empleado', bg: COLORS.text_enviroment_types, color: COLORS.background },
}

function GestionUsuariosPage() {
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const {
    usuarios, cargos, loading, loadingAccion, error, erroresCampo, setErroresCampo,
    busqueda, setBusqueda, filtroRol, setFiltroRol,
    usuarioSeleccionado,
    showCrear, setShowCrear,
    showEditar, setShowEditar,
    showSuspender, setShowSuspender,
    showExito, setShowExito,
    mensajeExito, formData, setFormData,
    abrirCrear, abrirEditar, abrirSuspender,
    handleCrear, handleEditar, handleToggleActivo,
  } = useGestionUsuarios()

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Gestión de Usuarios" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuAdministrador isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Usuarios</h1>
        <p className={styles.subtitulo} style={{ color: COLORS.labels }}>
          Administra los usuarios del sistema.
        </p>

        <div className={styles.searchWrapper} style={{ borderColor: COLORS.dataFields, backgroundColor: COLORS.background }}>
          <Search size={16} style={{ color: COLORS.labels }} />
          <input
            className={styles.searchInput}
            style={{ color: COLORS.text }}
            placeholder="Buscar usuarios..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className={styles.tabsRow}>
          {tabs.map((tab) => (
            <button
              key={tab.valor}
              className={styles.tab}
              style={{
                backgroundColor: filtroRol === tab.valor ? COLORS.primary : 'transparent',
                borderColor: filtroRol === tab.valor ? COLORS.primary : COLORS.dataFields,
                color: filtroRol === tab.valor ? COLORS.background : COLORS.labels,
              }}
              onClick={() => setFiltroRol(tab.valor)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && <p className="text-sm font-inter text-center py-8" style={{ color: COLORS.labels }}>Cargando...</p>}

        {!loading && usuarios.map((u) => {
          const cfg = rolConfig[u.Rol?.nombre] || rolConfig['EMPLEADO']
          return (
            <div key={u.id_usuario} className={styles.usuarioCard} style={{ backgroundColor: COLORS.backgroundHeader }}>
              <img src={u.foto_perfil || AVATAR_DEFAULT} alt="avatar" className={styles.avatar} />
              <div className={styles.usuarioInfo}>
                <p className={styles.usuarioNombre} style={{ color: COLORS.text }}>
                  {u.nombre} {u.apellido_paterno}
                </p>
                <p className={styles.usuarioCargo} style={{ color: COLORS.labels }}>
                  {u.Cargo?.nombre || 'Sin cargo'}
                </p>
                <span className={styles.usuarioRol} style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                  {cfg.label}
                </span>
              </div>
              <div className={styles.accionesRow}>
                <div className={styles.accionBtn} style={{ backgroundColor: u.activo ? '#d4edda' : COLORS.error }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: u.activo ? '#2d7a3a' : COLORS.secondary }} />
                </div>
                <div
                  className={styles.accionBtn}
                  style={{ backgroundColor: COLORS.primary }}
                  onClick={() => abrirEditar(u)}
                >
                  <Pencil size={14} style={{ color: COLORS.background }} />
                </div>
                <div
                  className={styles.accionBtn}
                  style={{ backgroundColor: u.activo ? COLORS.error : '#d4edda' }}
                  onClick={() => abrirSuspender(u)}
                >
                  {u.activo
                    ? <Ban size={14} style={{ color: COLORS.secondary }} />
                    : <CheckCircle size={14} style={{ color: '#2d7a3a' }} />
                  }
                </div>
              </div>
            </div>
          )
        })}

        {!loading && usuarios.length === 0 && (
          <EmptyState
            titulo="Sin usuarios registrados"
            subtitulo="No se encontraron usuarios con los filtros aplicados"
            icono={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="12" r="5" fill="rgba(255,255,255,0.6)" />
                <path d="M6 26C6 21 10 18 16 18C22 18 26 21 26 26" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          />
        )}

        <div className={styles.avisoCard} style={{ backgroundColor: COLORS.error }}>
          <Ban size={22} style={{ color: COLORS.secondary }} />
          <div className={styles.avisoTexto}>
            <p className={styles.avisoTitulo} style={{ color: COLORS.secondary }}>Suspender Cuenta</p>
            <p className={styles.avisoSub} style={{ color: COLORS.secondary }}>Inhabilita el acceso temporalmente</p>
          </div>
        </div>
      </div>

      <div className={styles.fab} style={{ backgroundColor: COLORS.secondary }} onClick={abrirCrear}>
        <Plus size={26} style={{ color: COLORS.background }} />
      </div>

      <FormularioUsuarioModal
        isOpen={showCrear}
        onClose={() => setShowCrear(false)}
        onConfirm={handleCrear}
        titulo="Nuevo Usuario"
        btnLabel="Registrar"
        formData={formData}
        setFormData={setFormData}
        cargos={cargos}
        loading={loadingAccion}
        error={error}
        erroresCampo={erroresCampo}
        setErroresCampo={setErroresCampo}
      />

      <FormularioUsuarioModal
        isOpen={showEditar}
        onClose={() => setShowEditar(false)}
        onConfirm={handleEditar}
        titulo="Editar Usuario"
        btnLabel="Actualizar"
        formData={formData}
        setFormData={setFormData}
        cargos={cargos}
        loading={loadingAccion}
        error={error}
        erroresCampo={erroresCampo}
        setErroresCampo={setErroresCampo}
      />

      {showSuspender && (
        <div className={styles.overlay}>
          <div className={styles.confirmCard} style={{ backgroundColor: COLORS.primary }}>
            <div style={{ backgroundColor: COLORS.background, borderRadius: '50%', padding: 16 }}>
              {usuarioSeleccionado?.activo
                ? <Ban size={50} style={{ color: COLORS.text }} />
                : <CheckCircle size={50} style={{ color: COLORS.text }} />
              }
            </div>
            <p className={styles.confirmTitle} style={{ color: COLORS.background }}>
              {usuarioSeleccionado?.activo ? 'Suspender Usuario' : 'Activar Usuario'}
            </p>
            <p className={styles.confirmLabel} style={{ color: COLORS.backgroundHeader }}>
              {usuarioSeleccionado?.activo
                ? '¿Estás seguro de que deseas suspender este usuario?'
                : '¿Estás seguro de que deseas activar este usuario?'
              }
            </p>
            <div className={styles.confirmBtns}>
              <Button text="Cancelar" variant="secondary" onClick={() => setShowSuspender(false)} />
              <Button
                text={loadingAccion ? 'Procesando...' : usuarioSeleccionado?.activo ? 'Suspender' : 'Activar'}
                variant="primary"
                onClick={handleToggleActivo}
                disabled={loadingAccion}
              />
            </div>
          </div>
        </div>
      )}

      {showExito && (
        <div className={styles.overlay}>
          <div className={styles.confirmCard} style={{ backgroundColor: COLORS.primary }}>
            <div style={{ backgroundColor: COLORS.background, borderRadius: '50%', padding: 16 }}>
              <CheckCircle size={50} style={{ color: COLORS.text }} />
            </div>
            <p className={styles.confirmTitle} style={{ color: COLORS.background }}>Éxito</p>
            <p className={styles.confirmLabel} style={{ color: COLORS.backgroundHeader }}>{mensajeExito}</p>
            <div className={styles.confirmBtns}>
              <Button text="Aceptar" variant="secondary" onClick={() => setShowExito(false)} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default GestionUsuariosPage;