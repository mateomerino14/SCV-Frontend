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
import PasswordExpiredModal from '../../features/user/organisms/PasswordExpiredModal';
import useTreasurerReviews from '../../hooks/approval/useTreasurerReviews';
import useMenu from '../../hooks/shared/useMenu';
import usePasswordExpiredCheck from '../../hooks/user/usePasswordExpiredCheck';
import {COLORS} from '../../constants';
import {treasurerTripPath, routes} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
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
    trips, totalPending, totalApproved, totalRejected, employees, sections, loading, applyingFilters, error, tab, setTab,
    filters, setFilters, applyFilters, clearFilters,
  } = useTreasurerReviews();
  const {showModal: showPasswordExpired, loading: loadingPasswordChange, error: errorPasswordChange, handleChange} = usePasswordExpiredCheck();
  let total = totalPending;
  let subtitle = 'Viajes aprobados que esperan fondos: revisa o ajusta los montos y apruébalos.';
  if (tab === 'APROBADOS') {
    total = totalApproved;
    subtitle = 'Viajes a los que ya les asignaste fondos.';
  }
  else if (tab === 'RECHAZADOS') {
    total = totalRejected;
    subtitle = 'Viajes que rechazaste en la asignación de fondos.';
  }

  const mascotMessage = loading ? null : pendingMessage(user?.nombre, totalPending, 'viaje esperando fondos', 'viajes esperando fondos');

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <PasswordExpiredModal isOpen={showPasswordExpired} onConfirm={handleChange} loading={loadingPasswordChange} error={errorPasswordChange} />
      <Navbar text="Asignación de Fondos" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Asignación de Fondos" subtitle={subtitle} />
        <ReviewFilters filters={filters} setFilters={setFilters} statusFilter={tab} setStatusFilter={setTab}
          onApply={applyFilters} onClear={clearFilters} employees={employees} sections={sections} tabs={mainTabs} applyingFilters={applyingFilters} />
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
      <MascotGreeting pageKey="tesorero-fondos" message={mascotMessage} />
      <Footer />
    </div>
  );
}

export default TreasurerReviewsPage;