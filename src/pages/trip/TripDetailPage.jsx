import {useNavigate, useParams, useLocation} from 'react-router-dom';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import DeleteExpenseConfirmModal from '../../features/expense/organisms/DeleteExpenseConfirmModal';
import SubmitReviewConfirmModal from '../../features/trip/organisms/SubmitReviewConfirmModal';
import DeadlineRequestModal from '../../features/approval/organisms/DeadlineRequestModal';
import SubstitutionRequestModal from '../../features/trip/organisms/SubstitutionRequestModal';
import DeadlineExpiredModal from '../../features/approval/organisms/DeadlineExpiredModal';
import DeadlineExpiredNoticeModal from '../../features/approval/organisms/DeadlineExpiredNoticeModal';
import TripDraftView from '../../features/trip/organisms/TripDraftView';
import TripRejectedPreviousView from '../../features/trip/organisms/TripRejectedPreviousView';
import TripPreviousReviewView from '../../features/trip/organisms/TripPreviousReviewView';
import TripFinalApprovedView from '../../features/trip/organisms/TripFinalApprovedView';
import TripActiveExpenseView from '../../features/trip/organisms/TripActiveExpenseView';
import SkeletonCard from '../../components/ui/SkeletonCard';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useTripDetail from '../../hooks/trip/useTripDetail';
import useDeadlineAuthorization from '../../hooks/approval/useDeadlineAuthorization';
import useSubstitutionRequest from '../../hooks/approval/useSubstitutionRequest';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 max-w-8xl mx-auto w-full',
};

function TripDetailPage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const originRoute = location.state?.from || '/dashboard/empleado';
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const tripDetail = useTripDetail(id);
  const {trip, loading, error} = tripDetail;
  const tripInProgress = trip?.estado === 'EN_CURSO' || (trip?.estado === 'RECHAZADO' && !!trip?.fue_iniciado);
  const deadline = useDeadlineAuthorization(id, trip?.fecha_fin, tripInProgress);
  const substitution = useSubstitutionRequest(id);

  if (loading) {
    return (
      <div className={styles.page} style={{backgroundColor: COLORS.background}}>
        <Navbar text="Detalles de Viaje" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
        <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
        <div className={styles.content}><SkeletonCard lines={6} /></div>
        <Footer />
      </div>
    );
  }
  if (!trip) {
    return (
      <div className={styles.page} style={{backgroundColor: COLORS.background}}>
        <Navbar text="Detalles de Viaje" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
        <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
        <div className="flex-1 flex items-center justify-center"><p style={{color: COLORS.secondary}}>{error || 'No se encontró el viaje'}</p></div>
        <Footer />
      </div>
    );
  }

  const isInternational = trip.tipo === 'Internacional';
  const isDraft = trip.estado === 'BORRADOR';
  const isPreviousReview = ['EN_REVISION_VIAJE', 'APROBADO_VIAJE', 'EN_REVISION_TESORERO'].includes(trip.estado);
  const isRejectedPrevious = trip.estado === 'RECHAZADO' && !trip.fue_iniciado;
  const isFinalApproved = trip.estado === 'APROBADO_FINAL';
  let content;
  if (isDraft) {
    content = <TripDraftView trip={trip} tripId={id} isInternational={isInternational} originRoute={originRoute} navigate={navigate} />;
  }
  else if (isRejectedPrevious) {
    content = <TripRejectedPreviousView trip={trip} tripId={id} isInternational={isInternational} originRoute={originRoute} navigate={navigate} observations={tripDetail.observations} error={tripDetail.error} />;
  }
  else if (isPreviousReview) {
    content = <TripPreviousReviewView trip={trip} isInternational={isInternational} originRoute={originRoute} navigate={navigate} />;
  }
  else if (isFinalApproved) {
    content = <TripFinalApprovedView trip={trip} tripId={id} isInternational={isInternational} originRoute={originRoute} navigate={navigate}
      nationalExpenses={tripDetail.nationalExpenses} internationalExpenses={tripDetail.internationalExpenses}
      accumulatedExpense={tripDetail.accumulatedExpense} accumulatedExpenseUsd={tripDetail.accumulatedExpenseUsd}
      totalExceeds={tripDetail.totalExceeds} totalExceedsUsd={tripDetail.totalExceedsUsd}
      exceededDays={tripDetail.exceededDays} exceedsHotels={tripDetail.exceedsHotels} dayJustifications={tripDetail.dayJustifications}
      observations={tripDetail.observations} />;
  }
  else {
    content = <TripActiveExpenseView trip={trip} tripId={id} isInternational={isInternational} originRoute={originRoute} navigate={navigate}
      tripDetail={tripDetail} deadline={deadline} substitution={substitution} />;
  }

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Detalles de Viaje" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>{content}</div>
      <DeleteExpenseConfirmModal isOpen={tripDetail.showDeleteModal} onClose={tripDetail.handleCancelDelete} onConfirm={tripDetail.handleConfirmDelete} loading={tripDetail.deletingExpense} />
      <SubmitReviewConfirmModal isOpen={tripDetail.showSubmitReviewModal} onClose={tripDetail.handleCancelSubmitReview} onConfirm={tripDetail.handleConfirmSubmitReview} />
      <DeadlineExpiredNoticeModal isOpen={deadline.showExpiredNotice} onClose={deadline.closeExpiredNotice} />
      <DeadlineRequestModal isOpen={deadline.showModal} onClose={() => deadline.setShowModal(false)} onConfirm={deadline.handleRequest} loading={deadline.submitting} error={deadline.modalError} />
      <DeadlineExpiredModal isOpen={deadline.isApprovedExpired && tripDetail.submitted} onClose={() => {}} message="Tu autorización de plazo ha vencido." />
      <SubstitutionRequestModal isOpen={substitution.showModal} onClose={substitution.closeModal} onConfirm={substitution.handleRequest}
        substituteId={substitution.substituteId} onSelectSubstitute={substitution.setSubstituteId}
        employees={substitution.employees} loading={substitution.submitting} error={substitution.modalError} />
      <Footer />
    </div>
  );
}

export default TripDetailPage;