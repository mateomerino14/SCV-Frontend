import { Users, Briefcase, Plane, Clock, CheckCircle, XCircle, Wallet } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import MenuAdministrador from '../layouts/Menu/Menu_Administrador'
import useDashboardAdmin from '../hooks/useDashboardAdmin'
import useMenu from '../hooks/useMenu'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import { COLORS } from '../constants'
import useContraseniavencida from '../hooks/useContraseniavencida'
import ContraseniavencidaModal from '../features/Login/ContraseniavencidaModal'

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  planLabel: 'text-xs font-semibold font-inter uppercase mb-2 tracking-wide',
  title: 'text-3xl font-bold font-inter mb-1',
  subtitulo: 'text-sm font-inter mb-6',
  grid2: 'grid grid-cols-2 gap-3 mb-3',
  statCard: 'rounded-2xl p-4 shadow-sm flex flex-col gap-1',
  statLabel: 'text-xs font-inter uppercase mt-1',
  statValor: 'text-3xl font-bold font-inter',
  statSub: 'text-xs font-inter',
  seccionTitulo: 'text-xs font-bold font-inter uppercase mb-3 mt-6',
  viajesGrid: 'grid grid-cols-2 gap-3 mb-6',
  viajeCard: 'rounded-2xl p-4 shadow-sm flex items-center gap-3',
  viajeIconWrapper: 'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
  viajeInfo: 'flex flex-col',
  viajeValor: 'text-2xl font-bold font-inter',
  viajeLabel: 'text-xs font-inter',
  chartCard: 'rounded-2xl p-4 shadow-sm mb-4',
  chartTitulo: 'text-sm font-bold font-inter mb-1',
  chartSub: 'text-xs font-inter mb-4',
}

const viajesConfig = [
  { key: 'viajesEnRevisionViaje', label: 'Rev. Previa', icono: Clock, color: '#5b00a0', bg: '#e8d5ff' },
  { key: 'viajesAprViaje', label: 'Esperando Apr.', icono: CheckCircle, color: '#7a5900', bg: '#ffd700aa' },
  { key: 'viajesEnRevisionTesorero', label: 'Esperando Fondos', icono: Wallet, color: '#8a4b00', bg: '#ffd8a8aa' },
  { key: 'viajesEnCurso', label: 'En Curso', icono: Plane, color: COLORS.primary, bg: COLORS.error },
  { key: 'viajesEnRevision', label: 'En Revisión', icono: Clock, color: '#000a65', bg: '#85aff3ab' },
  { key: 'viajesAprSupervisor', label: 'Apr. Supervisor', icono: CheckCircle, color: '#7a5900', bg: '#ffd700aa' },
  { key: 'viajesAprAprobador', label: 'Apr. Aprobador', icono: CheckCircle, color: '#000a65', bg: '#85aff3ab' },
  { key: 'viajesAprobados', label: 'Aprobado Final', icono: CheckCircle, color: '#155724', bg: '#d4edda' },
  { key: 'viajesRechazados', label: 'Rechazados', icono: XCircle, color: '#500203', bg: '#ffa7a8aa' },
]

const ROL_COLORS = [COLORS.primary, '#4a7fd4', '#2d7a3a', COLORS.secondary, '#7a5900']

const RADIAN = Math.PI / 180
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 11, fontWeight: 'bold' }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

function DashboardAdminPage() {
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const { datos, loading } = useDashboardAdmin()
  const { showModal, loading: loadingCambio, error: errorCambio, handleCambio } = useContraseniavencida()

  const totalViajes = datos
    ? (datos.viajesEnRevisionViaje || 0) +
      (datos.viajesAprViaje || 0) +
      (datos.viajesEnRevisionTesorero || 0) +
      (datos.viajesEnCurso || 0) +
      (datos.viajesEnRevision || 0) +
      (datos.viajesAprSupervisor || 0) +
      (datos.viajesAprAprobador || 0) +
      (datos.viajesAprobados || 0) +
      (datos.viajesRechazados || 0)
    : 0

  const barViajesData = datos ? [
    { name: 'Rev. Previa', valor: datos.viajesEnRevisionViaje || 0, fill: '#5b00a0' },
    { name: 'Esp. Apr.', valor: datos.viajesAprViaje || 0, fill: '#7a5900' },
    { name: 'Esp. Fondos', valor: datos.viajesEnRevisionTesorero || 0, fill: '#c47a1f' },
    { name: 'En Curso', valor: datos.viajesEnCurso || 0, fill: COLORS.primary },
    { name: 'En Rev.', valor: datos.viajesEnRevision || 0, fill: '#4a7fd4' },
    { name: 'Apr. Sup.', valor: datos.viajesAprSupervisor || 0, fill: '#c49000' },
    { name: 'Apr. Apr.', valor: datos.viajesAprAprobador || 0, fill: '#000a65' },
    { name: 'Aprobado', valor: datos.viajesAprobados || 0, fill: '#2d7a3a' },
    { name: 'Rechazado', valor: datos.viajesRechazados || 0, fill: COLORS.secondary },
  ] : []

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <ContraseniavencidaModal isOpen={showModal} onConfirm={handleCambio} loading={loadingCambio} error={errorCambio} />
      <Navbar text="Dashboard" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuAdministrador isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <p className={styles.planLabel} style={{ color: COLORS.title }}>Panel de Control</p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Dashboard</h1>
        <p className={styles.subtitulo} style={{ color: COLORS.labels }}>Resumen general del sistema.</p>

        {loading ? (
          <p className="text-sm font-inter text-center py-8" style={{ color: COLORS.labels }}>Cargando...</p>
        ) : (
          <>
            <div className={styles.grid2}>
              <div className={styles.statCard} style={{ backgroundColor: COLORS.primary }}>
                <Users size={20} style={{ color: COLORS.background }} />
                <p className={styles.statValor} style={{ color: COLORS.background }}>{datos?.totalUsuarios || 0}</p>
                <p className={styles.statLabel} style={{ color: 'rgba(255,255,255,0.7)' }}>Usuarios</p>
                <p className={styles.statSub} style={{ color: 'rgba(255,255,255,0.6)' }}>{datos?.usuariosActivos || 0} activos</p>
              </div>
              <div className={styles.statCard} style={{ backgroundColor: COLORS.backgroundHeader }}>
                <Briefcase size={20} style={{ color: COLORS.primary }} />
                <p className={styles.statValor} style={{ color: COLORS.text }}>{datos?.totalCargos || 0}</p>
                <p className={styles.statLabel} style={{ color: COLORS.labels }}>Cargos</p>
                <p className={styles.statSub} style={{ color: COLORS.labels }}>{datos?.cargosActivos || 0} activos</p>
              </div>
            </div>

            <p className={styles.seccionTitulo} style={{ color: COLORS.labels }}>Estado de Viajes</p>
            <div className={styles.viajesGrid}>
              {viajesConfig.map(({ key, label, icono: Icono, color, bg }) => (
                <div key={key} className={styles.viajeCard} style={{ backgroundColor: COLORS.backgroundHeader }}>
                  <div className={styles.viajeIconWrapper} style={{ backgroundColor: bg }}>
                    <Icono size={18} style={{ color }} />
                  </div>
                  <div className={styles.viajeInfo}>
                    <p className={styles.viajeValor} style={{ color: COLORS.text }}>{datos?.[key] || 0}</p>
                    <p className={styles.viajeLabel} style={{ color: COLORS.labels }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {(datos?.usuariosPorRol?.length > 0) && (
              <div className={styles.chartCard} style={{ backgroundColor: COLORS.backgroundHeader }}>
                <p className={styles.chartTitulo} style={{ color: COLORS.text }}>Usuarios por Rol</p>
                <p className={styles.chartSub} style={{ color: COLORS.labels }}>
                  Distribución de {datos.totalUsuarios} usuarios en el sistema
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={datos.usuariosPorRol}
                      dataKey="cantidad"
                      nameKey="nombre"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      labelLine={false}
                      label={renderLabel}
                    >
                      {datos.usuariosPorRol.map((_, i) => (
                        <Cell key={i} fill={ROL_COLORS[i % ROL_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} usuarios`, name]}
                      contentStyle={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.dataFields}`, borderRadius: 12, fontSize: 12, fontFamily: 'Inter' }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => <span style={{ color: COLORS.text, fontSize: 11, fontFamily: 'Inter' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {totalViajes > 0 && (
              <div className={styles.chartCard} style={{ backgroundColor: COLORS.backgroundHeader }}>
                <p className={styles.chartTitulo} style={{ color: COLORS.text }}>Viajes por Estado</p>
                <p className={styles.chartSub} style={{ color: COLORS.labels }}>
                  {totalViajes} viajes registrados en total
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={barViajesData} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.dataFields} />
                    <XAxis dataKey="name" tick={{ fontSize: 7.5, fontFamily: 'Inter', fill: COLORS.labels }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fontFamily: 'Inter', fill: COLORS.labels }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      formatter={(value) => [`${value} viajes`]}
                      contentStyle={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.dataFields}`, borderRadius: 12, fontSize: 12, fontFamily: 'Inter' }}
                    />
                    <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                      {barViajesData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default DashboardAdminPage;