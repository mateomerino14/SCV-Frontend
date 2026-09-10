import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import ReviewFilters from '../../features/approval/organisms/ReviewFilters';
import PendingTripItem from '../../features/approval/organisms/PendingTripItem';
import TripAlreadyTakenModal from '../../features/approval/organisms/TripAlreadyTakenModal';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonList from '../../components/ui/SkeletonList';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import PasswordExpiredModal from '../../features/user/organisms/PasswordExpiredModal';
import useSupervisorPendingTrips from '../../hooks/approval/useSupervisorPendingTrips';
import useMenu from '../../hooks/shared/useMenu';
import usePasswordExpiredCheck from '../../hooks/user/usePasswordExpiredCheck';
import {COLORS} from '../../constants';
import {supervisorPendingTripPath, routes} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  planLabel: "text-xs font-semibold font-inter uppercase mb-2 tracking-wide",
  title: "text-3xl font-bold font-inter mb-6",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-4",
  totalText: "text-xs font-inter mb-3",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
};

function SupervisorPendingTripsPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    trips, employees, loading, taking, error, alreadyTaken, closeAlreadyTakenModal,
    filters, setFilters, applyingFilters, applyFilters, clearFilters, handleTake,
  } = useSupervisorPendingTrips();
  const {showModal: showPasswordExpired, loading: loadingPasswordChange, error: errorPasswordChange, handleChange} = usePasswordExpiredCheck();

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <PasswordExpiredModal isOpen={showPasswordExpired} onConfirm={handleChange} loading={loadingPasswordChange} error={errorPasswordChange} />
      <TripAlreadyTakenModal isOpen={alreadyTaken} onClose={closeAlreadyTakenModal} />
      <Navbar text="Revisión de Viajes" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <p className={styles.planLabel} style={{color: COLORS.title}}>Viajes por revisar</p>
        <h1 className={styles.title} style={{color: COLORS.text}}>Viajes Pendientes</h1>
        <ReviewFilters filters={filters} setFilters={setFilters} onApply={applyFilters} onClear={clearFilters}
          employees={employees} hideStatusTabs applyingFilters={applyingFilters} />
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {!loading && <p className={styles.totalText} style={{color: COLORS.labels}}>{trips.length} viaje{trips.length !== 1 ? 's' : ''} pendiente{trips.length !== 1 ? 's' : ''}</p>}
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
            {trips.map((trip) => (
              <PendingTripItem key={trip.id_viaje} trip={trip} detailRoute={supervisorPendingTripPath(trip.id_viaje)} originRoute={routes.supervisorPendingTrips}
                onTake={handleTake} taking={taking === trip.id_viaje} assignedField="id_supervisor_asignado" />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default SupervisorPendingTripsPage;