import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import ReviewFilters from '../../features/approval/organisms/ReviewFilters';
import ExpenseReviewItem from '../../features/approval/organisms/ExpenseReviewItem';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonList from '../../components/ui/SkeletonList';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useSupervisorExpenseReviewHistory from '../../hooks/approval/useSupervisorExpenseReviewHistory';
import useMenu from '../../hooks/shared/useMenu';
import {historyTabsDefault} from '../../features/approval/constants/reviewTabs';
import {COLORS} from '../../constants';
import {supervisorTripReviewPath, routes} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  planLabel: "text-xs font-semibold font-inter uppercase mb-2 tracking-wide",
  title: "text-3xl font-bold font-inter mb-6",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-4",
  totalText: "text-xs font-inter mb-3",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
};

function SupervisorExpenseReviewHistoryPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    trips, total, employees, loading, applyingFilters, error, filters, setFilters,
    statusFilter, setStatusFilter, applyFilters, clearFilters, handleReturn,
  } = useSupervisorExpenseReviewHistory();

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Mis Revisiones" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <p className={styles.planLabel} style={{color: COLORS.title}}>Historial de gastos revisados</p>
        <h1 className={styles.title} style={{color: COLORS.text}}>Mis Revisiones</h1>
        <ReviewFilters filters={filters} setFilters={setFilters} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          onApply={applyFilters} onClear={clearFilters} employees={employees} tabs={historyTabsDefault} applyingFilters={applyingFilters} />
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {!loading && <p className={styles.totalText} style={{color: COLORS.labels}}>{total} viaje{total !== 1 ? 's' : ''}</p>}
        {loading && <SkeletonList count={3} />}
        {!loading && trips.length === 0 && (
          <EmptyState title="Sin revisiones en esta categoría" subtitle="No se encontraron viajes con el filtro seleccionado"
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M8 16L14 22L24 10" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            } />
        )}
        {!loading && trips.length > 0 && (
          <div className={styles.grid}>
            {trips.map((trip) => (
              <ExpenseReviewItem key={trip.id_viaje} trip={trip} detailRoute={supervisorTripReviewPath(trip.id_viaje)} originRoute={routes.supervisorExpenseReviewHistory}
                onReturn={trip.estado === 'EN_REVISION' ? handleReturn : null} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default SupervisorExpenseReviewHistoryPage;