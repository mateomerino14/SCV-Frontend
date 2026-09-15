import {Users, Briefcase} from 'lucide-react';
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid} from 'recharts';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import PageHeader from '../../components/ui/PageHeader';
import AdminMenu from '../../layouts/menu/AdminMenu';
import PasswordExpiredModal from '../../features/user/organisms/PasswordExpiredModal';
import SkeletonCard from '../../components/ui/SkeletonCard';
import TripPhaseSection from '../../features/admin/organisms/TripPhaseSection';
import PhaseTotalCard from '../../features/admin/molecules/PhaseTotalCard';
import useAdminDashboard from '../../hooks/admin/useAdminDashboard';
import useMenu from '../../hooks/shared/useMenu';
import usePasswordExpiredCheck from '../../hooks/user/usePasswordExpiredCheck';
import {approvalPhaseStats, expensePhaseStats, rejectedStat, approvalPhaseTotal, expensePhaseTotal} from '../../features/admin/constants/tripPhaseStats';
import {COLORS} from '../../constants';

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 max-w-8xl mx-auto w-full',
  subtitle: 'text-sm font-inter mb-6',
  grid2: 'grid grid-cols-2 gap-3 mb-6',
  statCard: 'rounded-2xl p-4 shadow-sm flex flex-col gap-1',
  statLabel: 'text-xs font-inter uppercase mt-1',
  statValue: 'text-3xl font-bold font-inter',
  statSub: 'text-xs font-inter',
  phaseTotalsGrid: 'grid grid-cols-1 md:grid-cols-3 gap-3 mb-6',
  sectionDivider: 'border-t my-6',
  chartCard: 'rounded-2xl p-4 shadow-sm mb-6',
  chartTitle: 'text-sm font-bold font-inter mb-1',
  chartSub: 'text-xs font-inter mb-4',
};

const radian = Math.PI / 180;
function renderPieLabel({cx, cy, midAngle, innerRadius, outerRadius, percent}) {
  if (percent < 0.05) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * radian);
  const y = cy + radius * Math.sin(-midAngle * radian);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" style={{fontSize: 11, fontWeight: 'bold'}}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

const roleColors = [COLORS.primary, '#4a7fd4', '#2d7a3a', COLORS.secondary, COLORS.title];

function DashboardAdminPage() {
  const {menuOpen, user, openMenu, closeMenu} = useMenu();
  const {data, loading} = useAdminDashboard();
  const {showModal, loading: loadingChange, error: errorChange, handleChange} = usePasswordExpiredCheck();
  const approvalTotal = approvalPhaseStats.reduce((sum, stat) => sum + (data?.[stat.key] || 0), 0);
  const expenseTotal = expensePhaseStats.reduce((sum, stat) => sum + (data?.[stat.key] || 0), 0);

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <PasswordExpiredModal isOpen={showModal} onConfirm={handleChange} loading={loadingChange} error={errorChange} />
      <Navbar text="Dashboard" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <AdminMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Dashboard" subtitle="Resumen general del sistema." />
        {loading ? (
          <SkeletonCard lines={6} />
        ) : (
          <>
            <div className={styles.grid2}>
              <div className={styles.statCard} style={{backgroundColor: COLORS.primary}}>
                <Users size={20} style={{color: COLORS.background}} />
                <p className={styles.statValue} style={{color: COLORS.background}}>{data?.totalUsuarios || 0}</p>
                <p className={styles.statLabel} style={{color: 'rgba(255,255,255,0.7)'}}>Usuarios</p>
                <p className={styles.statSub} style={{color: 'rgba(255,255,255,0.6)'}}>{data?.usuariosActivos || 0} activos</p>
              </div>
              <div className={styles.statCard} style={{backgroundColor: COLORS.backgroundHeader}}>
                <Briefcase size={20} style={{color: COLORS.primary}} />
                <p className={styles.statValue} style={{color: COLORS.text}}>{data?.totalCargos || 0}</p>
                <p className={styles.statLabel} style={{color: COLORS.labels}}>Cargos</p>
                <p className={styles.statSub} style={{color: COLORS.labels}}>{data?.cargosActivos || 0} activos</p>
              </div>
            </div>
            <div className={styles.phaseTotalsGrid}>
              <PhaseTotalCard icon={approvalPhaseTotal.icon} title="Aprobación de Viaje" subtitle="Viajes en la etapa previa, sin gastos"
                total={approvalTotal} color={approvalPhaseTotal.color} bg={approvalPhaseTotal.bg} />
              <PhaseTotalCard icon={expensePhaseTotal.icon} title="Rendición de Gastos" subtitle="Viajes en curso o con gastos en revisión"
                total={expenseTotal} color={expensePhaseTotal.color} bg={expensePhaseTotal.bg} />
              <PhaseTotalCard icon={rejectedStat.icon} title="Rechazados" subtitle="Total de viajes rechazados"
                total={data?.[rejectedStat.key] || 0} color={rejectedStat.color} bg={rejectedStat.bg} />
            </div>
            {data?.usuariosPorRol?.length > 0 && (
              <div className={styles.chartCard} style={{backgroundColor: COLORS.backgroundHeader}}>
                <p className={styles.chartTitle} style={{color: COLORS.text}}>Usuarios por Rol</p>
                <p className={styles.chartSub} style={{color: COLORS.labels}}>Distribución de {data.totalUsuarios} usuarios en el sistema</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={data.usuariosPorRol} dataKey="cantidad" nameKey="nombre" cx="50%" cy="50%" outerRadius={85} labelLine={false} label={renderPieLabel}>
                      {data.usuariosPorRol.map((_, index) => <Cell key={index} fill={roleColors[index % roleColors.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} usuarios`, name]}
                      contentStyle={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.dataFields}`, borderRadius: 12, fontSize: 12, fontFamily: 'Inter'}} />
                    <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{color: COLORS.text, fontSize: 11, fontFamily: 'Inter'}}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            {data?.viajesPorSeccion?.length > 0 && (
              <div className={styles.chartCard} style={{backgroundColor: COLORS.backgroundHeader}}>
                <p className={styles.chartTitle} style={{color: COLORS.text}}>Viajes por Sección</p>
                <p className={styles.chartSub} style={{color: COLORS.labels}}>Cantidad de viajes y monto asignado, agrupados por sección del empleado</p>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={data.viajesPorSeccion} margin={{top: 10, right: 10, left: 0, bottom: 10}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.dataFields} />
                    <XAxis dataKey="seccion" tick={{fontSize: 11, fontFamily: 'Inter', fill: COLORS.labels}} />
                    <YAxis tick={{fontSize: 11, fontFamily: 'Inter', fill: COLORS.labels}} />
                    <Tooltip formatter={(value, name) => [name === 'cantidadViajes' ? `${value} viaje(s)` : `Bs ${parseFloat(value).toFixed(2)}`, name === 'cantidadViajes' ? 'Viajes' : 'Monto asignado']}
                      contentStyle={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.dataFields}`, borderRadius: 12, fontSize: 12, fontFamily: 'Inter'}} />
                    <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{color: COLORS.text, fontSize: 11, fontFamily: 'Inter'}}>{value === 'cantidadViajes' ? 'Viajes' : 'Monto asignado (Bs)'}</span>} />
                    <Bar dataKey="cantidadViajes" fill={COLORS.primary} radius={[6, 6, 0, 0]} />
                    <Bar dataKey="montoAsignado" fill={COLORS.title} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className={styles.sectionDivider} style={{borderColor: COLORS.dataFields}} />
            <TripPhaseSection title="Fase 1 · Aprobación del Viaje" stats={approvalPhaseStats} data={data} showChart />
            <TripPhaseSection title="Fase 2 · Rendición de Gastos" stats={expensePhaseStats} data={data} showChart />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default DashboardAdminPage;