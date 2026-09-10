import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import ReviewFilters from '../../features/approval/organisms/ReviewFilters';
import PendingTripItem from '../../features/approval/organisms/PendingTripItem';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonList from '../../components/ui/SkeletonList';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import PasswordExpiredModal from '../../features/user/organisms/PasswordExpiredModal';
import useTreasurerReviews from '../../hooks/approval/useTreasurerReviews';
import useMenu from '../../hooks/shared/useMenu';
import usePasswordExpiredCheck from '../../hooks/user/usePasswordExpiredCheck';
import {COLORS} from '../../constants';
import {treasurerTripPath, routes} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  planLabel: "text-xs font-semibold font-inter uppercase mb-2 tracking-wide",
  title: "text-3xl font-bold font-inter mb-6",
  tabsRow: "flex gap-2 mb-4 flex-wrap",
  tab: "py-1.5 px-3 rounded-full text-xs font-bold font-inter cursor-pointer border text-center transition-colors",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-4",
  totalText: "text-xs font-inter mb-3",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
};

const mainTabs = [
  {valor: 'PENDIENTES', label: 'Pendientes'},
  {valor: 'APROBADOS', label: 'Aprobados'},
  {valor: 'RECHAZADOS', label: 'Rechazados'},
];

function TreasurerReviewsPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    trips, totalPending, totalApproved, totalRejected, employees, loading, applyingFilters, error, tab, setTab,
    filters, setFilters, applyFilters, clearFilters,
  } = useTreasurerReviews();
  const {showModal: showPasswordExpired, loading: loadingPasswordChange, error: errorPasswordChange, handleChange} = usePasswordExpiredCheck();
  let total = totalPending;
  if (tab === 'APROBADOS') {
    total = totalApproved;
  }
  else if (tab === 'RECHAZADOS') {
    total = totalRejected;
  }

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <PasswordExpiredModal isOpen={showPasswordExpired} onConfirm={handleChange} loading={loadingPasswordChange} error={errorPasswordChange} />
      <Navbar text="Aprobación de Fondos" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <p className={styles.planLabel} style={{color: COLORS.title}}>Panel de tesorería</p>
        <h1 className={styles.title} style={{color: COLORS.text}}>Aprobación de Fondos</h1>
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
            employees={employees} hideStatusTabs applyingFilters={applyingFilters} />
        )}
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {!loading && <p className={styles.totalText} style={{color: COLORS.labels}}>{total} viaje{total !== 1 ? 's' : ''}</p>}
        {loading && <SkeletonList count={3} />}
        {!loading && trips.length === 0 && (
          <EmptyState title="Sin solicitudes en esta categoría" subtitle="No se encontraron viajes con el filtro seleccionado"
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M8 16L14 22L24 10" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            } />
        )}
        {!loading && trips.length > 0 && (
          <div className={styles.grid}>
            {trips.map((trip) => (
              <PendingTripItem key={trip.id_viaje} trip={trip} detailRoute={treasurerTripPath(trip.id_viaje)} originRoute={routes.treasurerReviews}
                detailLabel="Ver Detalle" />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default TreasurerReviewsPage;