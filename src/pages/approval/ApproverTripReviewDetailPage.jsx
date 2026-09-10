import {useState} from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {ArrowLeft, AlertTriangle} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import ApproveTripConfirmModal from '../../features/approval/organisms/ApproveTripConfirmModal';
import RejectTripConfirmModal from '../../features/approval/organisms/RejectTripConfirmModal';
import NoObservationsModal from '../../features/approval/organisms/NoObservationsModal';
import AddCommentModal from '../../features/approval/organisms/AddCommentModal';
import EditCommentModal from '../../features/approval/organisms/EditCommentModal';
import DeleteCommentConfirmModal from '../../features/approval/organisms/DeleteCommentConfirmModal';
import TripReviewDetailCard from '../../features/approval/organisms/TripReviewDetailCard';
import SelectableObservationsList from '../../features/approval/organisms/SelectableObservationsList';
import SkeletonCard from '../../components/ui/SkeletonCard';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useApproverPendingTripDetail from '../../hooks/approval/useApproverPendingTripDetail';
import useMenu from '../../hooks/shared/useMenu';
import approverTripStatusConfig from '../../features/approval/constants/approverTripStatus';
import {COLORS} from '../../constants';

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  backBtn: 'flex items-center gap-1 cursor-pointer mb-4 w-fit',
  blockedWrapper: 'flex-1 flex flex-col items-center justify-center gap-3 px-6 py-12',
  blockedIcon: 'rounded-full p-5',
  blockedTitle: 'text-base font-bold font-inter text-center mt-2',
  blockedSubtitle: 'text-sm font-inter text-center',
  blockedBtn: 'mt-4 py-2.5 px-8 rounded-xl font-bold font-nunito text-sm',
  errorMsg: 'text-xs font-inter italic text-center py-3 px-3 rounded-xl mb-3',
  successBadge: 'text-sm font-bold font-inter text-center py-3 px-4 rounded-xl mb-4',
  actionsRow: 'flex gap-3',
  approveBtn: 'flex-1 py-2 rounded-xl font-bold font-nunito text-base cursor-pointer text-center',
  rejectBtn: 'flex-1 py-2 rounded-xl font-bold font-nunito text-base cursor-pointer text-center border-2',
};

function ApproverTripReviewDetailPage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const originRoute = location.state?.from || '/dashboard/aprobador/viajes-pendientes';
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const [showAddComment, setShowAddComment] = useState(false);
  const {
    data, loading, savingAction, error, modalError, blocked,
    showApprove, setShowApprove, showReject, setShowReject, showNoObservations, setShowNoObservations,
    actionCompleted, observations, commentAdded, resetCommentAdded,
    editingComment, setEditingComment, deletingComment, setDeletingComment, editText, setEditText,
    handleApprove, handleRequestReject, handleReject, handleAddComment, editObservation,
    handleOpenEdit, handleConfirmEdit, handleOpenDelete, handleConfirmDelete,
  } = useApproverPendingTripDetail(id);
  if (commentAdded) {
    resetCommentAdded();
    setShowAddComment(false);
  }
  if (loading) {
    return (
      <div className={styles.page} style={{backgroundColor: COLORS.background}}>
        <Navbar text="Aprobación de Viaje" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
        <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
        <div className={styles.content}><SkeletonCard lines={6} /></div>
        <Footer />
      </div>
    );
  }
  if (blocked) {
    return (
      <div className={styles.page} style={{backgroundColor: COLORS.background}}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Aprobación de Viaje" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
        <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
        <div className={styles.blockedWrapper}>
          <div className={styles.blockedIcon} style={{backgroundColor: COLORS.error}}>
            <AlertTriangle size={36} style={{color: COLORS.secondary}} />
          </div>
          <p className={styles.blockedTitle} style={{color: COLORS.text}}>No disponible</p>
          <p className={styles.blockedSubtitle} style={{color: COLORS.labels}}>{error}</p>
          <button className={styles.blockedBtn} style={{backgroundColor: COLORS.primary, color: COLORS.background}} onClick={() => navigate(originRoute)}>Volver</button>
        </div>
        <Footer />
      </div>
    );
  }
  if (!data) {
    return null;
  }
  const trip = data.viaje;
  const observationComments = (data.comentarios || []).filter((comment) => comment.tipo === 'OBSERVACION');
  const isPending = trip.estado === 'APROBADO_VIAJE';
  const canAct = isPending;
  let successMessage = 'Viaje rechazado correctamente';
  let successBg = '#ffa7a8aa';
  let successColor = '#500203';
  if (actionCompleted === 'EN_REVISION_TESORERO') {
    successMessage = 'Viaje aprobado. Enviado a revisión de tesorería.';
    successBg = '#ffd8a8aa';
    successColor = '#8a4b00';
  }
  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Aprobación de Viaje" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(originRoute)}>
          <ArrowLeft size={25} style={{color: COLORS.title}} />
        </button>
        <TripReviewDetailCard trip={trip} statusConfig={approverTripStatusConfig} />
        <SelectableObservationsList observations={observationComments} canManage={canAct}
          onAdd={() => setShowAddComment(true)} onEdit={handleOpenEdit} onDelete={handleOpenDelete}
          editingComment={editingComment} deletingComment={deletingComment} />
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {actionCompleted && (
          <p className={styles.successBadge} style={{backgroundColor: successBg, color: successColor}}>{successMessage}</p>
        )}
        {canAct && !actionCompleted && (
          <div className={styles.actionsRow}>
            <button className={styles.approveBtn} style={{backgroundColor: COLORS.primary, color: COLORS.background}} onClick={() => setShowApprove(true)}>Aprobar Viaje</button>
            <button className={styles.rejectBtn} style={{backgroundColor: 'transparent', borderColor: COLORS.secondary, color: COLORS.secondary}} onClick={handleRequestReject}>Rechazar</button>
          </div>
        )}
      </div>
      <ApproveTripConfirmModal isOpen={showApprove} onClose={() => setShowApprove(false)} onConfirm={handleApprove} loading={savingAction} />
      <RejectTripConfirmModal isOpen={showReject} onClose={() => setShowReject(false)} onConfirm={handleReject} loading={savingAction} />
      <NoObservationsModal isOpen={showNoObservations} onClose={() => setShowNoObservations(false)} />
      <AddCommentModal isOpen={showAddComment} onClose={() => {setShowAddComment(false); editObservation(0, '');}} onConfirm={handleAddComment} observations={observations} onEdit={editObservation} loading={savingAction} error={modalError} />
      <EditCommentModal isOpen={!!editingComment} onClose={() => setEditingComment(null)} onConfirm={handleConfirmEdit} text={editText} setText={setEditText} loading={savingAction} error={modalError} />
      <DeleteCommentConfirmModal isOpen={!!deletingComment} onClose={() => setDeletingComment(null)} onConfirm={handleConfirmDelete} loading={savingAction} />
      <Footer />
    </div>
  );
}

export default ApproverTripReviewDetailPage;