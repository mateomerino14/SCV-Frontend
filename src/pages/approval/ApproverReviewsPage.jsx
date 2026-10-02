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
import useApproverReviews from '../../hooks/approval/useApproverReviews';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {approverPendingTripPath, routes} from '../../constants/routes';
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
  {valor: 'MIS_PENDIENTES', label: 'Pendientes'},
  {valor: 'APROBADOS', label: 'Aprobados'},
  {valor: 'RECHAZADOS', label: 'Rechazados'},
];

function ApproverReviewsPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    trips, totalMyPending, employees, sections, loading, applyingFilters, error, tab, setTab,
    filters, setFilters, applyFilters, clearFilters,
  } = useApproverReviews();
  // Lo mas reciente primero, de 12 en 12, para que el historial no crezca sin fin
  const pagination = useClientPagination(trips, 12, tab);
  let subtitle = 'Viajes aprobados por el supervisor: al aprobarlos se genera el memorándum y pasan a tesorería.';
  if (tab === 'APROBADOS') {
    subtitle = 'Historial de los viajes que aprobaste, con el estado en que están ahora.';
  }
  else if (tab === 'RECHAZADOS') {
    subtitle = 'Viajes que rechazaste y el empleado aún no corrige. Al reenviarlos a revisión salen de esta lista.';
  }

  const mascotMessage = loading ? null : pendingMessage(user?.nombre, totalMyPending, 'viaje por aprobar', 'viajes por aprobar');

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Viajes por Aprobar" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Viajes por Aprobar" subtitle={subtitle} />
        <ReviewFilters filters={filters} setFilters={setFilters} statusFilter={tab} setStatusFilter={setTab}
          onApply={applyFilters} onClear={clearFilters} employees={employees} sections={sections} tabs={mainTabs} applyingFilters={applyingFilters} />
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {!loading && <ListCount shown={pagination.visibleItems.length} total={pagination.total} singular="viaje" plural="viajes" />}
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
            {pagination.visibleItems.map((trip) => (
              <PendingTripItem key={trip.id_viaje} trip={trip} detailRoute={approverPendingTripPath(trip.id_viaje)} originRoute={routes.approverReviews}
                assignedField="id_aprobador_asignado" detailLabel="Ver Detalle" />
            ))}
          </div>
        )}
        {!loading && pagination.hasMorePages && <LoadMoreButton onClick={pagination.loadMore} label="Cargar más" />}
      </div>
      <MascotGreeting pageKey="aprobador-viajes" message={mascotMessage} />
      <Footer />
    </div>
  );
}

export default ApproverReviewsPage;