import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Target, MapPin, LocateFixed } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import ResumenCorporativo from '../features/Form_Crear_Viaje/ResumenCorporativo'
import PoliticasViaje from '../features/Form_Crear_Viaje/PoliticasViaje'
import InputField from '../components/ui/InputField'
import useCrearViaje from '../hooks/useCrearViaje'
import useDashboard from '../hooks/useDashboard'
import { COLORS } from '../constants'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import ConfirmacionModal from '../features/Form_Crear_Viaje/ConfirmacionModal'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import useMenu from '../hooks/useMenu'

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-4 w-fit",
  planLabel: "text-md font-semibold font-inter uppercase mb-3 tracking-wide",
  title: "text-3xl font-bold font-inter mb-6",
  grid: "grid grid-cols-1 md:grid-cols-2 gap-8",
  formCard: "rounded-2xl p-6 flex flex-col gap-5 shadow-lg",
  badgeWrapper: "flex items-center gap-3 mb-2 w-fit p-3 rounded-lg",
  badgeIcon: "rounded-full p-2",
  badgeInfo: "flex flex-col",
  badgeLabel: "text-xs font-inter uppercase opacity-70 font-semibold",
  badgeCargo: "text-sm font-bold font-inter",
  input: "bg-transparent w-full outline-none font-inter text-sm",
  dateRow: "grid grid-cols-1 md:grid-cols-2 gap-3",
  radioRow: "flex flex-col gap-4",
  radioGroup: "flex flex-col gap-2",
  radioLabel: "text-xs font-bold font-inter uppercase mb-1",
  radioBtns: "flex gap-2 flex-wrap",
  radioBtn: "flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer font-inter text-sm font-bold transition-colors",
  confirmBtn: "w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer transition-colors mt-3",
  errorMsg: "text-xs font-inter italic text-center mt-3",
  rightCol: "flex flex-col gap-4",
  politicasWrapper: "px-5 pb-6 max-w-8xl mx-auto w-full",
  internacionalBadge: "text-xs font-inter p-3 rounded-xl flex items-start gap-2",
}

function CrearViajePage() {
  const navigate = useNavigate()
  const { usuario } = useDashboard()
  const {
    motivo, origen, destino,
    fechaInicio, fechaFin,
    tipo, setTipo,
    transporte, setTransporte,
    dias, diasNacionales, diasInternacionales,
    montoTotal, montoTotalUsd,
    tarifaDiaria, tarifaDiariaUsd,
    loading, error, erroresCampo,
    showConfirmacion, setShowConfirmacion,
    cargandoUbicacion,
    handleMotivoChange,
    handleOrigenChange,
    handleDestinoChange,
    handleFechaInicioChange,
    handleFechaFinChange,
    handleUsarUbicacionActual,
    handleGuardarBorrador,
  } = useCrearViaje(usuario)

  const { menuAbierto, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose, usuario: usuarioMenu } = useMenu()
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Registro de Viaje" onMenuClick={abrirMenu} fotoPerfil={usuarioMenu?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuarioMenu} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard/empleado')}>
          <ArrowLeft size={25} style={{ color: COLORS.title }} />
        </button>

        <p className={styles.planLabel} style={{ color: COLORS.title }}>Planificación de Itinerario</p>
        <h1 className={styles.title} style={{ color: COLORS.backgroundSecondary }}>Nuevo Registro de Viaje</h1>

        <div className={styles.badgeWrapper} style={{ backgroundColor: COLORS.backgroundHeader }}>
          <div className={styles.badgeIcon} style={{ backgroundColor: COLORS.primary }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L12 7H18L13 11L15 16L10 13L5 16L7 11L2 7H8L10 2Z" fill="white" />
            </svg>
          </div>
          <div className={styles.badgeInfo}>
            <span className={styles.badgeLabel} style={{ color: COLORS.labels }}>Cargo</span>
            <span className={styles.badgeCargo} style={{ color: COLORS.primary }}>
              {usuario?.Cargo?.nombre?.toUpperCase() || '—'}
            </span>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.formCard} style={{ backgroundColor: COLORS.background }}>

            <InputField label="Motivo" icon={<Target size={16} style={{ color: COLORS.labels }} />} error={erroresCampo.motivo}>
              <input
                type="text"
                placeholder="Inspección técnica y de producción..."
                value={motivo}
                onChange={(e) => handleMotivoChange(e.target.value)}
                className={styles.input}
                maxLength={100}
                style={{ color: COLORS.text }}
              />
            </InputField>

            <InputField
              label="Origen"
              icon={
                <button
                  type="button"
                  onClick={handleUsarUbicacionActual}
                  disabled={cargandoUbicacion}
                  title="Usar mi ubicación actual"
                >
                  <LocateFixed size={16} style={{ color: cargandoUbicacion ? COLORS.labels : COLORS.primary, cursor: cargandoUbicacion ? 'default' : 'pointer' }} />
                </button>
              }
              error={erroresCampo.origen}
            >
              <input
                type="text"
                placeholder={cargandoUbicacion ? 'Obteniendo ubicación...' : 'Ciudad de origen...'}
                value={origen}
                onChange={(e) => handleOrigenChange(e.target.value)}
                className={styles.input}
                maxLength={200}
                style={{ color: COLORS.text }}
              />
            </InputField>

            <InputField
              label="Destino"
              icon={<MapPin size={16} style={{ color: COLORS.secondary }} />}
              error={erroresCampo.destino}
            >
              <input
                type="text"
                placeholder="¿A dónde se dirige?"
                value={destino}
                onChange={(e) => handleDestinoChange(e.target.value)}
                className={styles.input}
                maxLength={200}
                style={{ color: COLORS.text }}
              />
            </InputField>

            <div className={styles.dateRow}>
              <InputField label="Fecha Inicio" error={erroresCampo.fechaInicio}>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => handleFechaInicioChange(e.target.value)}
                  className={styles.input}
                  min={today}
                  style={{ color: COLORS.text }}
                />
              </InputField>
              <InputField label="Fecha Fin" error={erroresCampo.fechaFin}>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => handleFechaFinChange(e.target.value)}
                  className={styles.input}
                  min={today}
                  style={{ color: COLORS.text }}
                />
              </InputField>
            </div>

            <div className={styles.radioRow}>
              <div className={styles.radioGroup}>
                <p className={styles.radioLabel} style={{ color: COLORS.labels }}>Tipo de Viaje</p>
                <div className={styles.radioBtns}>
                  {['Nacional', 'Internacional'].map((t) => (
                    <button
                      key={t}
                      className={styles.radioBtn}
                      onClick={() => setTipo(t)}
                      style={{
                        backgroundColor: tipo === t ? COLORS.primary : COLORS.dataFields,
                        borderColor: tipo === t ? COLORS.primary : COLORS.fields,
                        color: tipo === t ? COLORS.background : COLORS.labels,
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.radioGroup}>
                <p className={styles.radioLabel} style={{ color: COLORS.labels }}>Medio de Transporte</p>
                <div className={styles.radioBtns}>
                  {['Terrestre', 'Aéreo'].map((t) => (
                    <button
                      key={t}
                      className={styles.radioBtn}
                      onClick={() => setTransporte(t)}
                      style={{
                        backgroundColor: transporte === t ? COLORS.primary : COLORS.dataFields,
                        borderColor: transporte === t ? COLORS.primary : COLORS.fields,
                        color: transporte === t ? COLORS.background : COLORS.labels,
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {tipo === 'Internacional' && dias > 0 && (
              <div className={styles.internacionalBadge} style={{ backgroundColor: COLORS.backgroundHeader }}>
                <span style={{ color: COLORS.primary, fontSize: 17 }}>ⓘ</span>
                <p className="text-xs font-inter mt-1" style={{ color: COLORS.labels }}>
                  Día de salida y regreso en <strong>Bs</strong> ({diasNacionales} día{diasNacionales !== 1 ? 's' : ''}).
                  Días intermedios en <strong>USD</strong> ({diasInternacionales} día{diasInternacionales !== 1 ? 's' : ''}).
                </p>
              </div>
            )}

            {error && (
              <p className={styles.errorMsg} style={{ color: COLORS.secondary }}>{error}</p>
            )}

            <button
              className={styles.confirmBtn}
              style={{ backgroundColor: loading ? COLORS.fields : COLORS.secondary }}
              onClick={handleGuardarBorrador}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Borrador'}
            </button>
          </div>

          <div className={styles.rightCol}>
            <ResumenCorporativo
              cargo={usuario?.Cargo?.nombre}
              tarifaDiaria={tarifaDiaria}
              tarifaDiariaUsd={tarifaDiariaUsd}
              montoTotal={montoTotal}
              montoTotalUsd={montoTotalUsd}
              diasNacionales={diasNacionales}
              diasInternacionales={diasInternacionales}
              tipo={tipo}
              transporte={transporte}
            />
          </div>
        </div>
      </div>

      <div className={styles.politicasWrapper}>
        <PoliticasViaje />
      </div>

      <ConfirmacionModal
        isOpen={showConfirmacion}
        onClose={() => { setShowConfirmacion(false); navigate('/dashboard/empleado') }}
      />

      <Footer />
    </div>
  )
}

export default CrearViajePage;