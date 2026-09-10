import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import TripHistoryFilter from '../../features/trip/organisms/TripHistoryFilter';
import RecentTripItem from '../../features/trip/organisms/RecentTripItem';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonList from '../../components/ui/SkeletonList';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useTripHistory from '../../hooks/trip/useTripHistory';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {routes} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full",
  planLabel: "text-xs font-semibold font-inter uppercase mb-2 tracking-wide",
  title: "text-3xl font-bold font-inter mb-6",
  emptyMsg: "text-sm font-inter text-center py-8",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mt-2",
  totalText: "text-xs font-inter mb-3",
  loadMoreBtn: "w-full py-3 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center border mt-3",
};

function TripHistoryPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {trips, total, hasMorePages, loadMore, loading, loadingMore, error, filter, setFilter} = useTripHistory();

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Viajes" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <p className={styles.planLabel} style={{color: COLORS.title}}>Historial Corporativo</p>
        <h1 className={styles.title} style={{color: COLORS.text}}>Mis Viajes</h1>
        <TripHistoryFilter activeFilter={filter} onChange={setFilter} />
        {loading && <SkeletonList count={4} />}
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {!loading && total > 0 && (
          <p className={styles.totalText} style={{color: COLORS.labels}}>Mostrando {trips.length} de {total} viajes</p>
        )}
        {!loading && trips.length === 0 && (
          <EmptyState title="Sin viajes registrados" subtitle="Aún no tienes viajes en esta categoría"
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4C16 4 8 12 8 18C8 22.4 11.6 26 16 26C20.4 26 24 22.4 24 18C24 12 16 4 16 4Z" fill="rgba(255,255,255,0.5)" />
                <circle cx="16" cy="18" r="3" fill="rgba(255,255,255,0.9)" />
              </svg>
            } />
        )}
        {!loading && trips.map((trip) => <RecentTripItem key={trip.id_viaje} trip={trip} from={routes.employeeHistory} />)}
        {!loading && hasMorePages && (
          <button className={styles.loadMoreBtn} style={{borderColor: COLORS.primary, color: COLORS.primary, opacity: loadingMore ? 0.6 : 1}}
            onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? 'Cargando...' : 'Cargar más viajes'}
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default TripHistoryPage;