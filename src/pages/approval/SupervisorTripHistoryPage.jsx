import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import MascotGreeting from '../../components/mascot/MascotGreeting';
import {pendingMessage} from '../../utils/mascotPreferences';
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
import ListCount from '../../components/ui/ListCount';
import LoadMoreButton from '../../components/ui/LoadMoreButton';
import useClientPagination from '../../hooks/shared/useClientPagination';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-4",
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
    statusFilter, setStatusFilter, applyFilters, clearFilters, handleReturn,
  } = useSupervisorTripHistory();
  // Lo mas reciente primero, de 12 en 12, para que el historial no crezca sin fin
  const pagination = useClientPagination(trips, 12, statusFilter);
  let subtitle = 'Viajes asignados a ti: revísalos y apruébalos, o recházalos con observaciones.';
  if (statusFilter === 'APROBADO_VIAJE') {
    subtitle = 'Historial de los viajes que aprobaste tú, con el estado en que están ahora.';
  }
  else if (statusFilter === 'RECHAZADO') {
    subtitle = 'Viajes que rechazaste y el empleado aún no corrige. Al reenviarlos a revisión salen de esta lista.';
  }

  const mascotMessage = !loading && statusFilter === 'EN_REVISION_VIAJE' ? pendingMessage(user?.nombre, total, 'viaje por revisar', 'viajes por revisar') : null;

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Viajes Asignados a Mí" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Viajes Asignados a Mí" subtitle={subtitle} />
        <ReviewFilters filters={filters} setFilters={setFilters} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          onApply={applyFilters} onClear={clearFilters} employees={employees} sections={sections} tabs={tabs} applyingFilters={applyingFilters} />
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {!loading && <ListCount shown={pagination.visibleItems.length} total={pagination.total} singular="viaje" plural="viajes" />}
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
            {pagination.visibleItems.map((trip) => (
              <PendingTripItem key={trip.id_viaje} trip={trip} detailRoute={supervisorPendingTripPath(trip.id_viaje)} originRoute={routes.supervisorTripHistory}
                detailLabel="Ver Detalle" onReturn={trip.estado === 'EN_REVISION_VIAJE' && trip.asignado_a_mi !== false ? handleReturn : null} />
            ))}
          </div>
        )}
        {!loading && pagination.hasMorePages && <LoadMoreButton onClick={pagination.loadMore} label="Cargar más" />}
      </div>
      <MascotGreeting pageKey="supervisor-viajes" message={mascotMessage} />
      <Footer />
    </div>
  );
}

export default SupervisorTripHistoryPage;