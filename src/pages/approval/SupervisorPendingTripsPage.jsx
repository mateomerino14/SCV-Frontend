import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import MascotGreeting from '../../components/mascot/MascotGreeting';
import {greetingFor} from '../../utils/mascotPreferences';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import PageHeader from '../../components/ui/PageHeader';
import ReviewFilters from '../../features/approval/organisms/ReviewFilters';
import PendingTripItem from '../../features/approval/organisms/PendingTripItem';
import TripAlreadyTakenModal from '../../features/approval/organisms/TripAlreadyTakenModal';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonList from '../../components/ui/SkeletonList';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useSupervisorPendingTrips from '../../hooks/approval/useSupervisorPendingTrips';
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

function SupervisorPendingTripsPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    trips, employees, sections, loading, taking, error, alreadyTaken, closeAlreadyTakenModal,
    filters, setFilters, applyingFilters, applyFilters, clearFilters, handleTake,
  } = useSupervisorPendingTrips();
  // Lo mas reciente primero, de 12 en 12, para que el historial no crezca sin fin
  const pagination = useClientPagination(trips, 12, '');

  const mascotMessage = loading ? null : (trips.length > 0 ? `${greetingFor(user?.nombre)} Hay ${trips.length} ${trips.length === 1 ? 'viaje sin asignar esperando' : 'viajes sin asignar esperando'} que alguien lo${trips.length === 1 ? '' : 's'} tome.` : `${greetingFor(user?.nombre)} No hay viajes sin asignar por ahora.`);

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <TripAlreadyTakenModal isOpen={alreadyTaken} onClose={closeAlreadyTakenModal} />
      <Navbar text="Viajes Sin Asignar" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Viajes Sin Asignar" subtitle="Viajes que esperan revisión y no tienen un supervisor asignado; tómalos para revisarlos." />
        <ReviewFilters filters={filters} setFilters={setFilters} onApply={applyFilters} onClear={clearFilters}
          employees={employees} sections={sections} hideStatusTabs applyingFilters={applyingFilters} />
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {!loading && <ListCount shown={pagination.visibleItems.length} total={pagination.total} singular="viaje" plural="viajes" />}
        {loading && <SkeletonList count={3} />}
        {!loading && trips.length === 0 && (
          <EmptyState title="Sin viajes pendientes" subtitle="No hay viajes esperando revisión"
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M8 16L14 22L24 10" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            } />
        )}
        {!loading && trips.length > 0 && (
          <div className={styles.grid}>
            {pagination.visibleItems.map((trip) => (
              <PendingTripItem key={trip.id_viaje} trip={trip} detailRoute={supervisorPendingTripPath(trip.id_viaje)} originRoute={routes.supervisorPendingTrips}
                onTake={handleTake} taking={taking === trip.id_viaje} assignedField="id_supervisor_asignado" />
            ))}
          </div>
        )}
        {!loading && pagination.hasMorePages && <LoadMoreButton onClick={pagination.loadMore} label="Cargar más" />}
      </div>
      <MascotGreeting pageKey="supervisor-viajes-sin-asignar" message={mascotMessage} />
      <Footer />
    </div>
  );
}

export default SupervisorPendingTripsPage;