import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import PageHeader from '../../components/ui/PageHeader';
import ReviewFilters from '../../features/approval/organisms/ReviewFilters';
import PendingTripItem from '../../features/approval/organisms/PendingTripItem';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonList from '../../components/ui/SkeletonList';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useSupervisorTripHistory from '../../hooks/approval/useSupervisorTripHistory';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {supervisorPendingTripPath, routes} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-4",
  totalText: "text-xs font-inter mb-3",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
};

const tabs = [
  {valor: 'EN_REVISION_VIAJE', label: 'Pendientes'},
  {valor: 'APROBADO_VIAJE', label: 'Aprobados'},
  {valor: 'RECHAZADO', label: 'Rechazados'},
];

function SupervisorTripHistoryPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    trips, total, employees, sections, loading, applyingFilters, error, filters, setFilters,
    statusFilter, setStatusFilter, applyFilters, clearFilters,
  } = useSupervisorTripHistory();
  let subtitle = 'Viajes pendientes de tu revisión previa.';
  if (statusFilter === 'APROBADO_VIAJE') {
    subtitle = 'Viajes que ya aprobaste.';
  }
  else if (statusFilter === 'RECHAZADO') {
    subtitle = 'Viajes que ya rechazaste.';
  }

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Mis Viajes" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Mis Viajes" subtitle={subtitle} />
        <ReviewFilters filters={filters} setFilters={setFilters} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          onApply={applyFilters} onClear={clearFilters} employees={employees} sections={sections} tabs={tabs} applyingFilters={applyingFilters} />
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {!loading && <p className={styles.totalText} style={{color: COLORS.labels}}>{total} viaje{total !== 1 ? 's' : ''}</p>}
        {loading && <SkeletonList count={3} />}
        {!loading && trips.length === 0 && (
          <EmptyState title="Sin viajes en esta categoría" subtitle="No se encontraron viajes con el filtro seleccionado"
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M8 16L14 22L24 10" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            } />
        )}
        {!loading && trips.length > 0 && (
          <div className={styles.grid}>
            {trips.map((trip) => (
              <PendingTripItem key={trip.id_viaje} trip={trip} detailRoute={supervisorPendingTripPath(trip.id_viaje)} originRoute={routes.supervisorTripHistory}
                detailLabel="Ver Detalle" />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default SupervisorTripHistoryPage;