import {useNavigate} from 'react-router-dom';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import PageHeader from '../../components/ui/PageHeader';
import DraftTripCard from '../../features/trip/organisms/DraftTripCard';
import InProgressTripCard from '../../features/trip/organisms/InProgressTripCard';
import RecentTripItem from '../../features/trip/organisms/RecentTripItem';
import SubmitTripConfirmModal from '../../features/trip/organisms/SubmitTripConfirmModal';
import PasswordExpiredModal from '../../features/user/organisms/PasswordExpiredModal';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import SkeletonCard from '../../components/ui/SkeletonCard';
import useEmployeeDashboard from '../../hooks/trip/useEmployeeDashboard';
import useMenu from '../../hooks/shared/useMenu';
import usePasswordExpiredCheck from '../../hooks/user/usePasswordExpiredCheck';
import {COLORS} from '../../constants';
import {routes} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  sectionLabel: "text-sm font-bold font-inter uppercase mb-8",
  newTripBtn: "flex items-center gap-2 text-white font-bold font-nunito text-md py-2 px-5 rounded-lg cursor-pointer transition-colors w-58 md:w-60",
  headerRow: "flex flex-col md:flex-row md:items-center md:justify-between mb-5",
  tripsHeader: "flex items-center justify-between mt-8 mb-3",
  viewAll: "text-xs font-bold font-inter cursor-pointer",
  emptyRecent: "rounded-xl p-8 text-white text-center flex flex-col items-center gap-2",
  recentWrapper: "rounded-xl overflow-hidden",
  recentInner: "px-0",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-4",
  scrollRow: "flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory items-stretch",
};

function EmployeeDashboardPage() {
  const navigate = useNavigate();
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    draftTrips, inProgressTrips, substitutionTrips, displayedTrips, recentTrips, loading,
    submittingReview, submitError, tripToConfirm,
    handleRequestSubmitReview, handleCancelSubmitReview, handleConfirmSubmitReview,
  } = useEmployeeDashboard();
  const {showModal: showPasswordExpired, loading: loadingPasswordChange, error: errorPasswordChange, handleChange} = usePasswordExpiredCheck();

  if (loading) {
    return (
      <div className={styles.page} style={{backgroundColor: COLORS.background}}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <div className={styles.content}><SkeletonCard lines={4} /><SkeletonCard lines={4} /></div>
      </div>
    );
  }

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <style>{`
        .scroll-trips::-webkit-scrollbar { height: 6px; }
        .scroll-trips::-webkit-scrollbar-track { background: transparent; }
        .scroll-trips::-webkit-scrollbar-thumb { background: ${COLORS.dataFields}; border-radius: 999px; }
        .scroll-trips::-webkit-scrollbar-thumb:hover { background: ${COLORS.labels}; }
        .scroll-trips { scrollbar-width: thin; scrollbar-color: ${COLORS.dataFields} transparent; }
      `}</style>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <PasswordExpiredModal isOpen={showPasswordExpired} onConfirm={handleChange} loading={loadingPasswordChange} error={errorPasswordChange} />
      <Navbar text="Gestor de Viajes" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <PageHeader title="Mis Viajes" subtitle="Gestiona tus viajes y rinde tus gastos." />
          <button className={styles.newTripBtn} style={{backgroundColor: COLORS.primary}} onClick={() => navigate(routes.employeeCreateTrip)}>
            <span className="w-8 h-8 text-sm bg-white rounded-full inline-flex items-center justify-center" style={{color: COLORS.primary}}>+</span>
            Crear Nuevo Viaje
          </button>
        </div>
        {submitError && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{submitError}</p>}
        <p className={styles.sectionLabel} style={{color: COLORS.title}}>Viajes sin Enviar</p>
        {draftTrips.length > 0 ? (
          <div className="relative mb-2">
            <div className={`${styles.scrollRow} scroll-trips`}>
              {draftTrips.map((trip) => (
                <div key={trip.id_viaje} className="snap-start shrink-0 w-full md:w-[450px] flex flex-col">
                  <DraftTripCard trip={trip} onSubmit={handleRequestSubmitReview} submitting={submittingReview === trip.id_viaje} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.emptyRecent} style={{background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.title})`, marginBottom: 16}}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.1)" />
              <path d="M12 28L16 16L20 22L25 13L28 28H12Z" fill="rgba(255,255,255,0.6)" />
            </svg>
            <p className="font-inter font-bold text-base text-white">Sin borradores pendientes</p>
            <p className="font-inter text-xs text-white opacity-70">Todos tus viajes ya fueron enviados a revisión</p>
          </div>
        )}
        <p className={styles.sectionLabel} style={{color: COLORS.title}}>Viajes en Curso</p>
        <div className="relative">
          <div className={`${styles.scrollRow} scroll-trips`}>
            {inProgressTrips.length > 0 || substitutionTrips.length > 0 ? (
              [...inProgressTrips, ...substitutionTrips].map((trip) => (
                <div key={trip.id_viaje} className="snap-start shrink-0 w-full md:w-[450px] flex flex-col">
                  <InProgressTripCard trip={trip} />
                </div>
              ))
            ) : (
              <div className="w-full"><InProgressTripCard trip={null} /></div>
            )}
          </div>
        </div>
        <div className={styles.tripsHeader}>
          <p className={styles.sectionLabel} style={{color: COLORS.title}}>Viajes Recientes</p>
          {recentTrips.length > 0 && (
            <span className={styles.viewAll} style={{color: COLORS.secondary}} onClick={() => navigate(routes.employeeHistory)}>VER TODO →</span>
          )}
        </div>
        <div className={styles.recentWrapper} style={{backgroundColor: COLORS.background}}>
          {displayedTrips.length > 0 ? (
            <div className={styles.recentInner}>
              {displayedTrips.map((trip) => <RecentTripItem key={trip.id_viaje} trip={trip} from={routes.employeeDashboard} />)}
            </div>
          ) : (
            <div className={styles.emptyRecent} style={{background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.title})`}}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.1)" />
                <path d="M12 28L16 16L20 22L25 13L28 28H12Z" fill="rgba(255,255,255,0.6)" />
              </svg>
              <p className="font-inter font-bold text-base text-white">Sin viajes recientes</p>
              <p className="font-inter text-xs text-white opacity-70">Aún no tienes viajes registrados</p>
            </div>
          )}
        </div>
      </div>
      <SubmitTripConfirmModal isOpen={!!tripToConfirm} onClose={handleCancelSubmitReview} onConfirm={handleConfirmSubmitReview} loading={!!submittingReview} />
      <Footer />
    </div>
  );
}

export default EmployeeDashboardPage;