import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Target, MapPin, Calendar } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import ResumenCorporativo from '../features/Form_Crear_Viaje/ResumenCorporativo'
import PoliticasViaje from '../features/Form_Crear_Viaje/PoliticasViaje'
import MapaModal from '../features/Form_Crear_Viaje/MapaModal'
import useCrearViaje from '../hooks/useCrearViaje'
import useDashboard from '../hooks/useDashboard'
import { COLORS } from '../constants'

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-7xl mx-auto w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-4 w-fit",
  planLabel: "text-xs font-bold font-inter uppercase mb-1",
  title: "text-3xl font-bold font-inter mb-6",
  grid: "grid grid-cols-1 md:grid-cols-2 gap-8",
  formCard: "rounded-2xl p-6 flex flex-col gap-5",
  badgeWrapper: "flex items-center gap-3 mb-2",
  badgeIcon: "rounded-full p-2",
  badgeInfo: "flex flex-col",
  badgeLabel: "text-xs font-inter uppercase opacity-70",
  badgeCargo: "text-sm font-bold font-inter",
  fieldLabel: "text-xs font-bold font-inter uppercase mb-1",
  inputWrapper: "flex items-center gap-3 rounded-xl px-4 py-3",
  input: "bg-transparent w-full outline-none font-inter text-sm",
  dateRow: "grid grid-cols-2 gap-3",
  radioGroup: "flex gap-3",
  radioBtn: "flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer font-inter text-sm font-bold transition-colors",
  confirmBtn: "w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer transition-colors mt-2",
  errorMsg: "text-xs font-inter italic text-center",
  rightCol: "flex flex-col gap-4",
}

function CrearViajePage() {
  const navigate = useNavigate()
  const { usuario } = useDashboard()
  const {
    motivo, setMotivo,
    destino, setDestino,
    fechaInicio, setFechaInicio,
    fechaFin, setFechaFin,
    tipo, setTipo,
    entorno, setEntorno,
    montoTotal,
    tarifaDiaria,
    loading,
    error,
    showMapa, setShowMapa,
    handleConfirmarMapa,
    handleConfirmar,
  } = useCrearViaje(usuario)

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <Navbar text="Registro de Viaje" />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard/empleado')}>
          <ArrowLeft size={18} style={{ color: COLORS.labels }} />
        </button>

        <p className={styles.planLabel} style={{ color: COLORS.secondary }}>Planificación de Itinerario</p>
        <h1 className={styles.title} style={{ color: COLORS.backgroundSecondary }}>Nuevo Registro de Viaje</h1>

        <div className={styles.grid}>
          <div className={styles.formCard} style={{ backgroundColor: COLORS.backgroundHeader }}>
            <div className={styles.badgeWrapper}>
              <div className={styles.badgeIcon} style={{ backgroundColor: COLORS.primary }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L12 7H18L13 11L15 16L10 13L5 16L7 11L2 7H8L10 2Z" fill="white" />
                </svg>
              </div>
              <div className={styles.badgeInfo}>
                <span className={styles.badgeLabel} style={{ color: COLORS.labels }}>Cargo</span>
                <span className={styles.badgeCargo} style={{ color: COLORS.secondary }}>
                  {usuario?.Cargo?.nombre?.toUpperCase() || '—'}
                </span>
              </div>
            </div>

            <div>
              <p className={styles.fieldLabel} style={{ color: COLORS.labels }}>Motivo</p>
              <div className={styles.inputWrapper} style={{ backgroundColor: COLORS.dataFields }}>
                <Target size={16} style={{ color: COLORS.labels }} />
                <input
                  type="text"
                  placeholder="Inspección técnica y de producción..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className={styles.input}
                  style={{ color: COLORS.text }}
                />
              </div>
            </div>

            <div>
              <p className={styles.fieldLabel} style={{ color: COLORS.labels }}>Destino</p>
              <div className={styles.inputWrapper} style={{ backgroundColor: COLORS.dataFields }}>
                <button onClick={() => setShowMapa(true)}>
                  <MapPin size={16} style={{ color: COLORS.secondary, cursor: 'pointer' }} />
                </button>
                <input
                  type="text"
                  placeholder="¿A dónde se dirige?"
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  className={styles.input}
                  style={{ color: COLORS.text }}
                />
              </div>
            </div>

            <div className={styles.dateRow}>
              <div>
                <p className={styles.fieldLabel} style={{ color: COLORS.labels }}>Fecha Inicio</p>
                <div className={styles.inputWrapper} style={{ backgroundColor: COLORS.dataFields }}>
                  <Calendar size={16} style={{ color: COLORS.labels }} />
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className={styles.input}
                    style={{ color: COLORS.text }}
                  />
                </div>
              </div>
              <div>
                <p className={styles.fieldLabel} style={{ color: COLORS.labels }}>Fecha Fin</p>
                <div className={styles.inputWrapper} style={{ backgroundColor: COLORS.dataFields }}>
                  <Calendar size={16} style={{ color: COLORS.labels }} />
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className={styles.input}
                    style={{ color: COLORS.text }}
                  />
                </div>
              </div>
            </div>

            <div>
              <p className={styles.fieldLabel} style={{ color: COLORS.labels }}>Tipo de Viaje</p>
              <div className={styles.radioGroup}>
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

            <div>
              <p className={styles.fieldLabel} style={{ color: COLORS.labels }}>Entorno de Destino</p>
              <div className={styles.radioGroup}>
                {['Urbano', 'Rural'].map((e) => (
                  <button
                    key={e}
                    className={styles.radioBtn}
                    onClick={() => setEntorno(e)}
                    style={{
                      backgroundColor: entorno === e ? COLORS.primary : COLORS.dataFields,
                      borderColor: entorno === e ? COLORS.primary : COLORS.fields,
                      color: entorno === e ? COLORS.background : COLORS.labels,
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className={styles.errorMsg} style={{ color: COLORS.secondary }}>{error}</p>}

            <button
              className={styles.confirmBtn}
              style={{ backgroundColor: loading ? COLORS.fields : COLORS.secondary }}
              onClick={handleConfirmar}
              disabled={loading}
            >
              {loading ? 'Confirmando...' : 'Confirmar Viaje'}
            </button>
          </div>

          <div className={styles.rightCol}>
            <ResumenCorporativo
              cargo={usuario?.Cargo?.nombre}
              tarifaDiaria={tarifaDiaria}
              montoTotal={montoTotal}
              tipo={tipo}
              entorno={entorno}
            />
            <PoliticasViaje />
          </div>
        </div>
      </div>

      <MapaModal
        isOpen={showMapa}
        onClose={() => setShowMapa(false)}
        onConfirm={handleConfirmarMapa}
      />

      <Footer />
    </div>
  )
}

export default CrearViajePage;