import { Search, Plus, Pencil, Ban, CheckCircle } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import MenuAdministrador from '../layouts/Menu/Menu_Administrador'
import FormularioCargoModal from '../features/Admin/FormularioCargoModal'
import useGestionCargos from '../hooks/useGestionCargos'
import useMenu from '../hooks/useMenu'
import Button from '../components/ui/Button'
import { COLORS } from '../constants'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'

const CARGO_IMG = "https://i.pinimg.com/474x/92/59/28/9259282c3e36ed39f345a91a1a182041.jpg"

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  title: 'text-3xl font-bold font-inter mb-1',
  subtitulo: 'text-sm font-inter mb-5',
  searchWrapper: 'flex items-center border rounded-xl px-3 py-2 gap-2 mb-4',
  searchInput: 'flex-1 text-sm font-inter outline-none bg-transparent',
  seccionLabel: 'text-xs font-bold font-inter uppercase mb-3',
  cargoCard: 'rounded-2xl p-4 mb-3 shadow-sm flex items-center gap-3',
  cargoImg: 'w-15 h-15 rounded-full object-cover shrink-0',
  cargoInfo: 'flex flex-col flex-1 min-w-0',
  cargoNombre: 'text-sm font-bold font-inter',
  cargoMonto: 'text-xs font-inter',
  accionesRow: 'flex items-center gap-2 shrink-0',
  accionBtn: 'w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer',
  fab: 'fixed bottom-24 right-5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer z-10',
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  confirmCard: 'items-center flex flex-col p-6 rounded-xl w-full max-w-xs mx-4 gap-2 shadow-xl',
  confirmTitle: 'text-2xl font-bold font-inter text-center mt-3',
  confirmLabel: 'font-inter text-center text-sm m-3',
  confirmBtns: 'flex gap-4 mt-2',
  avisoCard: 'rounded-2xl p-4 flex items-center gap-3 mt-7 mb-4',
  avisoTexto: 'flex flex-col flex-1',
  avisoTitulo: 'text-sm font-bold font-inter',
  avisoSub: 'text-xs font-inter',
}

function GestionCargosPage() {
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const {
  cargos, loading, loadingAccion, error,
  busqueda, setBusqueda,
  cargoSeleccionado,
  showCrear, setShowCrear,
  showEditar, setShowEditar,
  showSuspender, setShowSuspender,
  showExito, setShowExito,
  mensajeExito, formData, setFormData,
  sugerenciasCargo,
  abrirCrear, abrirEditar, abrirSuspender,
  handleCrear, handleEditar, handleToggleActivo,
} = useGestionCargos()

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Gestión de Cargos" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuAdministrador isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Gestión de Cargos</h1>
        <p className={styles.subtitulo} style={{ color: COLORS.labels }}>
          Administra los cargos y salarios del sistema.
        </p>

        <div className={styles.searchWrapper} style={{ borderColor: COLORS.dataFields, backgroundColor: COLORS.background }}>
          <Search size={16} style={{ color: COLORS.labels }} />
          <input
            className={styles.searchInput}
            style={{ color: COLORS.text }}
            placeholder="Buscar cargos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <p className={styles.seccionLabel} style={{ color: COLORS.labels }}>Puesto y Salario Diario</p>

        {loading && <p className="text-sm font-inter text-center py-8" style={{ color: COLORS.labels }}>Cargando...</p>}

        {!loading && cargos.map((cargo) => (
          <div key={cargo.id_cargo} className={styles.cargoCard} style={{ backgroundColor: COLORS.backgroundHeader }}>
            <img src={CARGO_IMG} alt="cargo" className={styles.cargoImg} />
            <div className={styles.cargoInfo}>
              <p className={styles.cargoNombre} style={{ color: COLORS.text }}>{cargo.nombre}</p>
              <p className={styles.cargoMonto} style={{ color: COLORS.labels }}>
                {parseFloat(cargo.monto_diario).toFixed(2)} Bs / día
              </p>
            </div>
            <div className={styles.accionesRow}>
              <div className={styles.accionBtn} style={{ backgroundColor: cargo.activo ? '#d4edda' : COLORS.error }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cargo.activo ? '#2d7a3a' : COLORS.secondary }} />
              </div>
              <div
                className={styles.accionBtn}
                style={{ backgroundColor: COLORS.primary }}
                onClick={() => abrirEditar(cargo)}
              >
                <Pencil size={14} style={{ color: COLORS.background }} />
              </div>
              <div
                className={styles.accionBtn}
                style={{ backgroundColor: cargo.activo ? COLORS.error : '#d4edda' }}
                onClick={() => abrirSuspender(cargo)}
              >
                {cargo.activo
                  ? <Ban size={14} style={{ color: COLORS.secondary }} />
                  : <CheckCircle size={14} style={{ color: '#2d7a3a' }} />
                }
              </div>
            </div>
          </div>
        ))}

        {!loading && cargos.length === 0 && (
          <p className="text-sm font-inter text-center py-8" style={{ color: COLORS.labels }}>
            No se encontraron cargos
          </p>
        )}

        <div className={styles.avisoCard} style={{ backgroundColor: COLORS.error }}>
          <Ban size={22} style={{ color: COLORS.secondary }} />
          <div className={styles.avisoTexto}>
            <p className={styles.avisoTitulo} style={{ color: COLORS.secondary }}>Bloquear Cargo</p>
            <p className={styles.avisoSub} style={{ color: COLORS.secondary }}>Inhabilita el uso temporalmente</p>
          </div>
        </div>
      </div>

      <div className={styles.fab} style={{ backgroundColor: COLORS.secondary }} onClick={abrirCrear}>
        <Plus size={26} style={{ color: COLORS.background }} />
      </div>

      <FormularioCargoModal
        isOpen={showCrear}
        onClose={() => setShowCrear(false)}
        onConfirm={handleCrear}
        titulo="Agregar Nuevo Cargo"
        subtitulo="Defina las especificaciones del nuevo rol dentro de la estructura organizacional."
        btnLabel="Guardar Cargo"
        formData={formData}
        setFormData={setFormData}
        loading={loadingAccion}
        error={error}
        sugerencias={sugerenciasCargo}
        />

        <FormularioCargoModal
        isOpen={showEditar}
        onClose={() => setShowEditar(false)}
        onConfirm={handleEditar}
        titulo="Editar Cargo"
        subtitulo="Actualice la información estructural y financiera para la posición seleccionada."
        btnLabel="Actualizar Cargo"
        formData={formData}
        setFormData={setFormData}
        loading={loadingAccion}
        error={error}
        sugerencias={sugerenciasCargo}
        />

      {showSuspender && (
        <div className={styles.overlay}>
          <div className={styles.confirmCard} style={{ backgroundColor: COLORS.primary }}>
            <div style={{ backgroundColor: COLORS.background, borderRadius: '50%', padding: 16 }}>
              {cargoSeleccionado?.activo
                ? <Ban size={50} style={{ color: COLORS.text }} />
                : <CheckCircle size={50} style={{ color: COLORS.text }} />
              }
            </div>
            <p className={styles.confirmTitle} style={{ color: COLORS.background }}>
              {cargoSeleccionado?.activo ? 'Bloquear Cargo' : 'Activar Cargo'}
            </p>
            <p className={styles.confirmLabel} style={{ color: COLORS.backgroundHeader }}>
              {cargoSeleccionado?.activo
                ? '¿Estás seguro de que deseas bloquear este cargo?'
                : '¿Estás seguro de que deseas activar este cargo?'
              }
            </p>
            <div className={styles.confirmBtns}>
              <Button text="Cancelar" variant="secondary" onClick={() => setShowSuspender(false)} />
              <Button
                text={loadingAccion ? 'Procesando...' : cargoSeleccionado?.activo ? 'Bloquear' : 'Activar'}
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

export default GestionCargosPage;