import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import MascotGreeting from '../../components/mascot/MascotGreeting';
import {pendingMessage} from '../../utils/mascotPreferences';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import PageHeader from '../../components/ui/PageHeader';
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
import ListCount from '../../components/ui/ListCount';
import LoadMoreButton from '../../components/ui/LoadMoreButton';
import useClientPagination from '../../hooks/shared/useClientPagination';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-4",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
};

function SupervisorExpenseReviewHistoryPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    trips, total, employees, sections, loading, applyingFilters, error, filters, setFilters,
    statusFilter, setStatusFilter, applyFilters, clearFilters, handleReturn,
  } = useSupervisorExpenseReviewHistory();
  const pagination = useClientPagination(trips, 12, statusFilter);
  let subtitle = 'Rendiciones asignadas a ti: revisa los gastos, deja observaciones y apruébalas o recházalas.';
  if (statusFilter === 'APROBADO_SUPERVISOR') {
    subtitle = 'Historial de las rendiciones que aprobaste tú, con el estado en que están ahora.';
  }
  else if (statusFilter === 'RECHAZADO') {
    subtitle = 'Rendiciones que rechazaste y el empleado aún no corrige. Al reenviarlas a revisión salen de esta lista.';
  }

  const mascotMessage = !loading && statusFilter === 'EN_REVISION' ? pendingMessage(user?.nombre, total, 'rendición por revisar', 'rendiciones por revisar') : null;

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Rendiciones Asignadas a Mí" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Rendiciones Asignadas a Mí" subtitle={subtitle} />
        <ReviewFilters filters={filters} setFilters={setFilters} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          onApply={applyFilters} onClear={clearFilters} employees={employees} sections={sections} tabs={historyTabsDefault} applyingFilters={applyingFilters} />
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {!loading && <ListCount shown={pagination.visibleItems.length} total={pagination.total} singular="rendición" plural="rendiciones" />}
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
            {pagination.visibleItems.map((trip) => (
              <ExpenseReviewItem key={trip.id_viaje} trip={trip} detailRoute={supervisorTripReviewPath(trip.id_viaje)} originRoute={routes.supervisorExpenseReviewHistory}
                onReturn={trip.estado === 'EN_REVISION' ? handleReturn : null} />
            ))}
          </div>
        )}
        {!loading && pagination.hasMorePages && <LoadMoreButton onClick={pagination.loadMore} label="Cargar más" />}
      </div>
      <MascotGreeting pageKey="supervisor-rendiciones" message={mascotMessage} />
      <Footer />
    </div>
  );
}

export default SupervisorExpenseReviewHistoryPage;