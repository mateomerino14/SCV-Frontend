import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import PageHeader from '../../components/ui/PageHeader';
import SubstitutionRequestCard from '../../features/approval/molecules/SubstitutionRequestCard';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonList from '../../components/ui/SkeletonList';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useSubstitutionRequests from '../../hooks/approval/useSubstitutionRequests';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import ListCount from '../../components/ui/ListCount';
import LoadMoreButton from '../../components/ui/LoadMoreButton';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import useClientPagination from '../../hooks/shared/useClientPagination';
import {CheckCircle} from 'lucide-react';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  tabsRow: "flex gap-2 mb-4 flex-wrap",
  tab: "py-1.5 px-3 rounded-full text-xs font-bold font-inter cursor-pointer border text-center transition-colors",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
};

const tabs = [
  {valor: 'PENDIENTES', label: 'Pendientes'},
  {valor: 'HISTORIAL', label: 'Historial'},
];

function SubstitutionRequestsPage() {
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {trips, totalPending, loading, savingAction, error, tab, setTab, handleApprove, handleReject, resultMessage, closeResult} = useSubstitutionRequests();
  const pagination = useClientPagination(trips, 12, tab);

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Solicitudes de Reemplazo" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Solicitudes de Reemplazo" subtitle="Aprueba o rechaza las solicitudes para que otra persona de la misma sección rinda los gastos de un viaje." />
        <div className={styles.tabsRow}>
          {tabs.map((mainTab) => (
            <button key={mainTab.valor} className={styles.tab} onClick={() => setTab(mainTab.valor)}
              style={{backgroundColor: tab === mainTab.valor ? COLORS.primary : 'transparent', borderColor: tab === mainTab.valor ? COLORS.primary : COLORS.dataFields, color: tab === mainTab.valor ? COLORS.background : COLORS.labels}}>
              {mainTab.label} {mainTab.valor === 'PENDIENTES' && totalPending > 0 ? `(${totalPending})` : ''}
            </button>
          ))}
        </div>
        {error && <p className="text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-4" style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {!loading && <ListCount shown={pagination.visibleItems.length} total={pagination.total} singular="solicitud" plural="solicitudes" />}
        {loading && <SkeletonList count={3} />}
        {!loading && trips.length === 0 && (
          <EmptyState title="Sin solicitudes" subtitle={tab === 'PENDIENTES' ? 'No hay solicitudes de reemplazo pendientes' : 'Aún no hay historial de solicitudes'}
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="12" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                <path d="M16 10V16L20 19" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            } />
        )}
        {!loading && trips.length > 0 && (
          <div className={styles.grid}>
            {pagination.visibleItems.map((request) => (
              <SubstitutionRequestCard key={request.id_solicitud} request={request} onApprove={handleApprove} onReject={handleReject}
                savingAction={savingAction} showActions={tab === 'PENDIENTES'} />
            ))}
          </div>
        )}
        {!loading && pagination.hasMorePages && <LoadMoreButton onClick={pagination.loadMore} label="Cargar más" />}
      </div>
      <ConfirmDialog isOpen={!!resultMessage} compact icon={CheckCircle} iconColor={COLORS.primary}
        title="Listo" message={resultMessage} confirmText="Entendido" hideCancel onConfirm={closeResult} />
      <Footer />
    </div>
  );
}

export default SubstitutionRequestsPage;