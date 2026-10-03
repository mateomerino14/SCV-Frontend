import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import MascotGreeting from '../../components/mascot/MascotGreeting';
import {greetingFor} from '../../utils/mascotPreferences';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import PageHeader from '../../components/ui/PageHeader';
import ReviewFilters from '../../features/approval/organisms/ReviewFilters';
import ExpenseReviewItem from '../../features/approval/organisms/ExpenseReviewItem';
import TripAlreadyTakenModal from '../../features/approval/organisms/TripAlreadyTakenModal';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonList from '../../components/ui/SkeletonList';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useSupervisorPendingExpenseReviews from '../../hooks/approval/useSupervisorPendingExpenseReviews';
import useMenu from '../../hooks/shared/useMenu';
import {pendingTabsDefault} from '../../features/approval/constants/reviewTabs';
import {COLORS} from '../../constants';
import {supervisorTripReviewPath, routes} from '../../constants/routes';
import ListCount from '../../components/ui/ListCount';
import LoadMoreButton from '../../components/ui/LoadMoreButton';
import useClientPagination from '../../hooks/shared/useClientPagination';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-4",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
};

function SupervisorPendingExpenseReviewsPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    trips, total, employees, sections, loading, applyingFilters, taking, error, alreadyTaken, closeAlreadyTakenModal,
    filters, setFilters, statusFilter, setStatusFilter, applyFilters, clearFilters, handleTake,
  } = useSupervisorPendingExpenseReviews();
  const pagination = useClientPagination(trips, 12, statusFilter);

  const mascotMessage = loading ? null : (total > 0 ? `${greetingFor(user?.nombre)} Hay ${total} ${total === 1 ? 'rendición sin asignar esperando' : 'rendiciones sin asignar esperando'} que alguien la${total === 1 ? '' : 's'} tome.` : `${greetingFor(user?.nombre)} No hay rendiciones sin asignar por ahora.`);

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <TripAlreadyTakenModal isOpen={alreadyTaken} onClose={closeAlreadyTakenModal} />
      <Navbar text="Rendiciones Sin Asignar" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Rendiciones Sin Asignar" subtitle="Rendiciones de gastos que no tienen un supervisor asignado; tómalas para revisarlas." />
        <ReviewFilters filters={filters} setFilters={setFilters} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          onApply={applyFilters} onClear={clearFilters} employees={employees} sections={sections} tabs={pendingTabsDefault} applyingFilters={applyingFilters} />
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {!loading && <ListCount shown={pagination.visibleItems.length} total={pagination.total} singular="rendición" plural="rendiciones" />}
        {loading && <SkeletonList count={3} />}
        {!loading && trips.length === 0 && (
          <EmptyState title="Sin solicitudes pendientes" subtitle="No hay rendiciones de gastos esperando revisión"
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M8 16L14 22L24 10" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            } />
        )}
        {!loading && trips.length > 0 && (
          <div className={styles.grid}>
            {pagination.visibleItems.map((trip) => (
              <ExpenseReviewItem key={trip.id_viaje} trip={trip} detailRoute={supervisorTripReviewPath(trip.id_viaje)} originRoute={routes.supervisorPendingExpenseReviews}
                onTake={handleTake} taking={taking === trip.id_viaje} />
            ))}
          </div>
        )}
        {!loading && pagination.hasMorePages && <LoadMoreButton onClick={pagination.loadMore} label="Cargar más" />}
      </div>
      <MascotGreeting pageKey="supervisor-rendiciones-sin-asignar" message={mascotMessage} />
      <Footer />
    </div>
  );
}

export default SupervisorPendingExpenseReviewsPage;