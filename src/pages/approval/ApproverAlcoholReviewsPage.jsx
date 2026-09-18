import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import PageHeader from '../../components/ui/PageHeader';
import ReviewFilters from '../../features/approval/organisms/ReviewFilters';
import ExpenseReviewItem from '../../features/approval/organisms/ExpenseReviewItem';
import TripAlreadyTakenModal from '../../features/approval/organisms/TripAlreadyTakenModal';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonList from '../../components/ui/SkeletonList';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import PasswordExpiredModal from '../../features/user/organisms/PasswordExpiredModal';
import useApproverAlcoholReviews from '../../hooks/approval/useApproverAlcoholReviews';
import useMenu from '../../hooks/shared/useMenu';
import usePasswordExpiredCheck from '../../hooks/user/usePasswordExpiredCheck';
import {COLORS} from '../../constants';
import {approverAlcoholReviewPath, routes} from '../../constants/routes';

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
  {valor: 'APROBADOS', label: 'Aprobados'},
  {valor: 'RECHAZADOS', label: 'Rechazados'},
];

function ApproverAlcoholReviewsPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    trips, totalPending, totalMyPending, totalApproved, totalRejected, employees, sections, loading, applyingFilters, taking, error,
    alreadyTaken, closeAlreadyTakenModal, tab, setTab, filters, setFilters, applyFilters, clearFilters, handleTake,
  } = useApproverAlcoholReviews();
  const {showModal: showPasswordExpired, loading: loadingPasswordChange, error: errorPasswordChange, handleChange} = usePasswordExpiredCheck();
  let total = totalMyPending;
  let subtitle = 'Rendiciones con alcohol asignadas directamente a vos, pendientes de tu decisión.';
  if (tab === 'PENDIENTES') {
    total = totalPending;
    subtitle = 'Rendiciones sin jefe directo asignado en la jerarquía, o cuya sección no tiene un aprobador cargado. Se muestran a todos para que alguien las tome.';
  }
  else if (tab === 'APROBADOS') {
    total = totalApproved;
    subtitle = 'Rendiciones con alcohol que ya aprobaste.';
  }
  else if (tab === 'RECHAZADOS') {
    total = totalRejected;
    subtitle = 'Rendiciones con alcohol que ya rechazaste.';
  }

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <PasswordExpiredModal isOpen={showPasswordExpired} onConfirm={handleChange} loading={loadingPasswordChange} error={errorPasswordChange} />
      <TripAlreadyTakenModal isOpen={alreadyTaken} onClose={closeAlreadyTakenModal} />
      <Navbar text="Revisión por Alcohol" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Revisión por Alcohol" subtitle={subtitle} />
        <div className={styles.tabsRow}>
          {mainTabs.map((mainTab) => (
            <button key={mainTab.valor} className={styles.tab} onClick={() => setTab(mainTab.valor)}
              style={{backgroundColor: tab === mainTab.valor ? COLORS.primary : 'transparent', borderColor: tab === mainTab.valor ? COLORS.primary : COLORS.dataFields, color: tab === mainTab.valor ? COLORS.background : COLORS.labels}}>
              {mainTab.label}
            </button>
          ))}
        </div>
        {tab === 'PENDIENTES' && (
          <ReviewFilters filters={filters} setFilters={setFilters} onApply={applyFilters} onClear={clearFilters}
            employees={employees} sections={sections} hideStatusTabs applyingFilters={applyingFilters} />
        )}
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {!loading && <p className={styles.totalText} style={{color: COLORS.labels}}>{total} viaje{total !== 1 ? 's' : ''}</p>}
        {loading && <SkeletonList count={3} />}
        {!loading && trips.length === 0 && (
          <EmptyState title="Sin viajes en esta categoría" subtitle="No se encontraron rendiciones con alcohol pendientes"
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M8 16L14 22L24 10" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            } />
        )}
        {!loading && trips.length > 0 && (
          <div className={styles.grid}>
            {trips.map((trip) => (
              <ExpenseReviewItem key={trip.id_viaje} trip={trip} detailRoute={approverAlcoholReviewPath(trip.id_viaje)} originRoute={routes.approverAlcoholReviews}
                onTake={tab === 'PENDIENTES' ? handleTake : null} taking={taking === trip.id_viaje} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ApproverAlcoholReviewsPage;
