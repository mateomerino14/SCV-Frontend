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
import useTreasurerReviews from '../../hooks/approval/useTreasurerReviews';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {treasurerTripPath, routes} from '../../constants/routes';
import ListCount from '../../components/ui/ListCount';
import LoadMoreButton from '../../components/ui/LoadMoreButton';
import useClientPagination from '../../hooks/shared/useClientPagination';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-4",
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
    trips, totalPending, employees, sections, loading, applyingFilters, error, tab, setTab,
    filters, setFilters, applyFilters, clearFilters,
  } = useTreasurerReviews();
  const pagination = useClientPagination(trips, 12, tab);
  let subtitle = 'Viajes aprobados que esperan fondos: revisa o ajusta los montos y apruébalos.';
  if (tab === 'APROBADOS') {
    subtitle = 'Historial de los viajes a los que asignaste fondos, con el estado en que están ahora.';
  }
  else if (tab === 'RECHAZADOS') {
    subtitle = 'Viajes que rechazaste en la asignación de fondos y el empleado aún no corrige.';
  }

  const mascotMessage = loading ? null : pendingMessage(user?.nombre, totalPending, 'viaje esperando fondos', 'viajes esperando fondos');

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Asignación de Fondos" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Asignación de Fondos" subtitle={subtitle} />
        <ReviewFilters filters={filters} setFilters={setFilters} statusFilter={tab} setStatusFilter={setTab}
          onApply={applyFilters} onClear={clearFilters} employees={employees} sections={sections} tabs={mainTabs} applyingFilters={applyingFilters} />
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {!loading && <ListCount shown={pagination.visibleItems.length} total={pagination.total} singular="viaje" plural="viajes" />}
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
            {pagination.visibleItems.map((trip) => (
              <PendingTripItem key={trip.id_viaje} trip={trip} detailRoute={treasurerTripPath(trip.id_viaje)} originRoute={routes.treasurerReviews}
                detailLabel="Ver Detalle" />
            ))}
          </div>
        )}
        {!loading && pagination.hasMorePages && <LoadMoreButton onClick={pagination.loadMore} label="Cargar más" />}
      </div>
      <MascotGreeting pageKey="tesorero-fondos" message={mascotMessage} />
      <Footer />
    </div>
  );
}

export default TreasurerReviewsPage;