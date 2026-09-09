import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import PendingTripItem from '../../features/approval/organisms/PendingTripItem';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonList from '../../components/ui/SkeletonList';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useApproverTripHistory from '../../hooks/approval/useApproverTripHistory';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {approverPendingTripPath, routes} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full max-w-3xl mx-auto",
  planLabel: "text-xs font-semibold font-inter uppercase mb-2 tracking-wide",
  title: "text-3xl font-bold font-inter mb-6",
  tabsRow: "flex gap-2 mb-4 flex-wrap",
  tab: "py-1.5 px-3 rounded-full text-xs font-bold font-inter cursor-pointer border text-center transition-colors",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-4",
  totalText: "text-xs font-inter mb-3",
};

const tabs = [
  {valor: 'APROBADO_VIAJE', label: 'Aprobados'},
  {valor: 'EN_REVISION_TESORERO', label: 'Esp. Fondos'},
  {valor: 'EN_CURSO', label: 'En Curso'},
  {valor: 'RECHAZADO', label: 'Rechazados'},
];

function ApproverTripHistoryPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {trips, total, loading, error, statusFilter, setStatusFilter} = useApproverTripHistory();

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Mis Viajes" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />

      <div className={styles.content}>
        <p className={styles.planLabel} style={{color: COLORS.title}}>Historial de viajes revisados</p>
        <h1 className={styles.title} style={{color: COLORS.text}}>Mis Viajes</h1>

        <div className={styles.tabsRow}>
          {tabs.map((tab) => (
            <button key={tab.valor} className={styles.tab} onClick={() => setStatusFilter(tab.valor)}
              style={{backgroundColor: statusFilter === tab.valor ? COLORS.primary : 'transparent', borderColor: statusFilter === tab.valor ? COLORS.primary : COLORS.dataFields, color: statusFilter === tab.valor ? COLORS.background : COLORS.labels}}>
              {tab.label}
            </button>
          ))}
        </div>

        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}

        {!loading && <p className={styles.totalText} style={{color: COLORS.labels}}>{total} viaje{total !== 1 ? 's' : ''}</p>}

        {loading && <SkeletonList count={3} />}

        {!loading && trips.length === 0 && (
          <EmptyState title="Sin viajes en esta categoría" subtitle="No se encontraron viajes con el filtro seleccionado"
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="12" fill="rgba(255,255,255,0.4)" />
              </svg>
            } />
        )}

        {!loading && trips.map((trip) => (
          <PendingTripItem key={trip.id_viaje} trip={trip} detailRoute={approverPendingTripPath(trip.id_viaje)} originRoute={routes.approverTripHistory}
            detailLabel="Ver Detalle" />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default ApproverTripHistoryPage;