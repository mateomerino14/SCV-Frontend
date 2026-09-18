import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import PageHeader from '../../components/ui/PageHeader';
import ReviewFilters from '../../features/approval/organisms/ReviewFilters';
import ExpenseReviewItem from '../../features/approval/organisms/ExpenseReviewItem';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonList from '../../components/ui/SkeletonList';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import PasswordExpiredModal from '../../features/user/organisms/PasswordExpiredModal';
import useReviewerReviews from '../../hooks/approval/useReviewerReviews';
import useMenu from '../../hooks/shared/useMenu';
import usePasswordExpiredCheck from '../../hooks/user/usePasswordExpiredCheck';
import {pendingTabsDefault} from '../../features/approval/constants/reviewTabs';
import {COLORS} from '../../constants';
import {reviewerReviewPath, routes} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  tabsRow: "flex gap-2 mb-4 flex-wrap",
  tab: "py-1.5 px-3 rounded-full text-xs font-bold font-inter cursor-pointer border text-center transition-colors",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-4",
  totalText: "text-xs font-inter mb-3",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
};

const mainTabs = [
  {valor: 'MIS_PENDIENTES', label: 'Mis Pendientes'},
  {valor: 'PENDIENTES', label: 'Sin Asignar'},
  {valor: 'HISTORIAL', label: 'Historial'},
];

const historyStatusTabs = [
  {valor: 'TODOS', label: 'Todos'},
  {valor: 'APROBADO_FINAL', label: 'Aprobados'},
  {valor: 'RECHAZADO', label: 'Rechazados'},
];

function ReviewerReviewsPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    trips, totalPending, totalMyPending, employees, sections, loading, applyingFilters, error, filters, setFilters,
    statusFilter, setStatusFilter, tab, setTab, applyFilters, clearFilters,
  } = useReviewerReviews();
  const {showModal: showPasswordExpired, loading: loadingPasswordChange, error: errorPasswordChange, handleChange} = usePasswordExpiredCheck();
  const isPendingTab = tab === 'PENDIENTES';
  let subtitle = 'Rendiciones asignadas directamente a vos, pendientes de tu revisión final.';
  if (tab === 'PENDIENTES') {
    subtitle = 'Rendiciones sin jefe directo asignado en la jerarquía, o cuya sección no tiene un revisor cargado. Se muestran a todos para que alguien las tome.';
  }
  else if (tab === 'HISTORIAL') {
    subtitle = 'Rendiciones que ya aprobaste o rechazaste en revisión final.';
  }

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <PasswordExpiredModal isOpen={showPasswordExpired} onConfirm={handleChange} loading={loadingPasswordChange} error={errorPasswordChange} />
      <Navbar text="Revisión Final" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Revisión Final" subtitle={subtitle} />
        <div className={styles.tabsRow}>
          {mainTabs.map((mainTab) => (
            <button key={mainTab.valor} className={styles.tab} onClick={() => setTab(mainTab.valor)}
              style={{backgroundColor: tab === mainTab.valor ? COLORS.primary : 'transparent', borderColor: tab === mainTab.valor ? COLORS.primary : COLORS.dataFields, color: tab === mainTab.valor ? COLORS.background : COLORS.labels}}>
              {mainTab.label} {mainTab.valor === 'MIS_PENDIENTES' && totalMyPending > 0 ? `(${totalMyPending})` : ''}
              {mainTab.valor === 'PENDIENTES' && totalPending > 0 ? `(${totalPending})` : ''}
            </button>
          ))}
        </div>
        {tab !== 'MIS_PENDIENTES' && (
          <ReviewFilters filters={filters} setFilters={setFilters} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            onApply={applyFilters} onClear={clearFilters} employees={employees} sections={sections} tabs={isPendingTab ? pendingTabsDefault : historyStatusTabs} applyingFilters={applyingFilters} />
        )}
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {!loading && <p className={styles.totalText} style={{color: COLORS.labels}}>{trips.length} viaje{trips.length !== 1 ? 's' : ''}</p>}
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
              <ExpenseReviewItem key={trip.id_viaje} trip={trip} detailRoute={reviewerReviewPath(trip.id_viaje)} originRoute={routes.reviewerReviews} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ReviewerReviewsPage;