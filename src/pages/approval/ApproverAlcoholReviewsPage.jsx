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
import useApproverAlcoholReviews from '../../hooks/approval/useApproverAlcoholReviews';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {approverAlcoholReviewPath, routes} from '../../constants/routes';
import ListCount from '../../components/ui/ListCount';

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

function ApproverAlcoholReviewsPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    trips, totalMyPending, totalApproved, totalRejected, employees, sections, loading, applyingFilters, error,
    tab, setTab, filters, setFilters, applyFilters, clearFilters,
  } = useApproverAlcoholReviews();
  let total = totalMyPending;
  let subtitle = 'Rendiciones con gastos de alcohol que necesitan tu revisión antes de pasar a la revisión final.';
  if (tab === 'APROBADOS') {
    total = totalApproved;
    subtitle = 'Historial de las rendiciones con alcohol que aprobaste, con el estado en que están ahora.';
  }
  else if (tab === 'RECHAZADOS') {
    total = totalRejected;
    subtitle = 'Rendiciones con alcohol que rechazaste y el empleado aún no corrige. Al reenviarlas salen de esta lista.';
  }

  const mascotMessage = loading ? null : pendingMessage(user?.nombre, totalMyPending, 'rendición con alcohol por revisar', 'rendiciones con alcohol por revisar');

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Rendiciones con Alcohol" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Rendiciones con Alcohol" subtitle={subtitle} />
        <ReviewFilters filters={filters} setFilters={setFilters} statusFilter={tab} setStatusFilter={setTab}
          onApply={applyFilters} onClear={clearFilters} employees={employees} sections={sections} tabs={mainTabs} applyingFilters={applyingFilters} />
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {!loading && <ListCount shown={total} total={total} singular="rendición" plural="rendiciones" />}
        {loading && <SkeletonList count={3} />}
        {!loading && trips.length === 0 && (
          <EmptyState title="Sin viajes en esta categoría" subtitle="No se encontraron rendiciones con alcohol con el filtro seleccionado"
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M8 16L14 22L24 10" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            } />
        )}
        {!loading && trips.length > 0 && (
          <div className={styles.grid}>
            {trips.map((trip) => (
              <ExpenseReviewItem key={trip.id_viaje} trip={trip} detailRoute={approverAlcoholReviewPath(trip.id_viaje)} originRoute={routes.approverAlcoholReviews} />
            ))}
          </div>
        )}
      </div>
      <MascotGreeting pageKey="aprobador-alcohol" message={mascotMessage} />
      <Footer />
    </div>
  );
}

export default ApproverAlcoholReviewsPage;
