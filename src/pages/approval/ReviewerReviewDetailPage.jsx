import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {ArrowLeft, AlertTriangle, Download} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import ApproveTripConfirmModal from '../../features/approval/organisms/ApproveTripConfirmModal';
import RejectTripConfirmModal from '../../features/approval/organisms/RejectTripConfirmModal';
import NoObservationsModal from '../../features/approval/organisms/NoObservationsModal';
import ExpenseObservationsModal from '../../features/approval/organisms/ExpenseObservationsModal';
import EditCommentModal from '../../features/approval/organisms/EditCommentModal';
import DeleteCommentConfirmModal from '../../features/approval/organisms/DeleteCommentConfirmModal';
import ExpenseTripInfoCard from '../../features/approval/organisms/ExpenseTripInfoCard';
import ExpenseBudgetBar from '../../features/approval/molecules/ExpenseBudgetBar';
import ExpenseSettlementCard from '../../features/approval/molecules/ExpenseSettlementCard';
import ExpenseAlertsRow from '../../features/approval/molecules/ExpenseAlertsRow';
import ExpenseInvoicedTable from '../../features/approval/organisms/ExpenseInvoicedTable';
import ExpenseUninvoicedTable from '../../features/approval/organisms/ExpenseUninvoicedTable';
import ExpenseInternationalTable from '../../features/approval/organisms/ExpenseInternationalTable';
import ExpenseSummaryCard from '../../features/approval/organisms/ExpenseSummaryCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useReviewerReviewDetail from '../../hooks/approval/useReviewerReviewDetail';
import useMenu from '../../hooks/shared/useMenu';
import useTripExcelExport from '../hooks/useTripExcelExport';
import {buildDayJustifications} from '../../utils/dayJustifications';
import {COLORS} from '../../constants';
import {reviewerExpenseDetailPath, reviewerReviewPath} from '../../constants/routes';

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
  warningMsg: 'text-xs font-inter text-center mb-4',
  card: 'rounded-2xl p-5 mb-4 shadow-md',
  exportBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-sm cursor-pointer flex items-center justify-center gap-2 mb-4',
  actionsRow: 'flex gap-3 mb-4',
  approveBtn: 'flex-1 py-2 rounded-xl font-bold font-nunito text-base cursor-pointer text-center',
  rejectBtn: 'flex-1 py-2 rounded-xl font-bold font-nunito text-base cursor-pointer text-center border-2',
  hint: 'text-xs font-inter text-center mb-3',
};

function ReviewerReviewDetailPage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const originRoute = location.state?.from || '/dashboard/revisor';
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {exportToExcel} = useTripExcelExport();

  const {
    data, loading, savingAction, error, warning, blocked,
    showApprove, setShowApprove, showReject, setShowReject, showNoObservations, setShowNoObservations,
    actionCompleted, commentAdded, resetCommentAdded,
    editingComment, setEditingComment, deletingComment, setDeletingComment, editText, setEditText,
    activeExpense, showExpenseObservations, newText, setNewText,
    openExpenseObservations, closeExpenseObservations, activeExpenseObservations, countExpenseObservations,
    handleApprove, handleRequestReject, handleReject,
    handleAddComment, handleOpenEdit, handleConfirmEdit, handleOpenDelete, handleConfirmDelete,
  } = useReviewerReviewDetail(id);

  if (commentAdded) {
    resetCommentAdded();
  }

  if (loading) {
    return (
      <div className={styles.page} style={{backgroundColor: COLORS.background}}>
        <Navbar text="Revisión Final" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
        <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
        <div className={styles.content}><SkeletonCard lines={6} /></div>
        <Footer />
      </div>
    );
  }

  if (blocked || !data) {
    return (
      <div className={styles.page} style={{backgroundColor: COLORS.background}}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Revisión Final" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
        <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
        <div className={styles.blockedWrapper}>
          <div className={styles.blockedIcon} style={{backgroundColor: COLORS.error}}>
            <AlertTriangle size={36} style={{color: COLORS.secondary}} />
          </div>
          <p className={styles.blockedTitle} style={{color: COLORS.text}}>Revisión no disponible</p>
          <p className={styles.blockedSubtitle} style={{color: COLORS.labels}}>{error}</p>
          <button className={styles.blockedBtn} style={{backgroundColor: COLORS.primary, color: COLORS.background}} onClick={() => navigate(originRoute)}>Volver</button>
        </div>
        <Footer />
      </div>
    );
  }

  const trip = data.viaje;
  const expenses = data.gastos || [];
  const isInternational = trip.tipo === 'Internacional';

  const nationalExpenses = expenses.filter((expense) => !expense.es_gasto_internacional);
  const internationalExpenses = expenses.filter((expense) => !!expense.es_gasto_internacional);
  const invoicedExpenses = nationalExpenses.filter((expense) => !!expense.Factura);
  const uninvoicedExpenses = nationalExpenses.filter((expense) => !expense.Factura);

  const totalVat = invoicedExpenses.reduce((sum, expense) => {
    return sum + Math.max(0, parseFloat(expense.monto_total || 0) - parseFloat(expense.Factura?.monto_parcial || 0));
  }, 0);

  const isPending = trip.estado === 'APROBADO_SUPERVISOR';
  const canAct = isPending && !actionCompleted;
  const {map: dayJustifications, list: dayJustificationsList} = buildDayJustifications(data.comentarios);

  let successMessage = 'Rendición rechazada correctamente';
  let successBg = '#ffa7a8aa';
  let successColor = '#500203';
  if (actionCompleted === 'APROBADO_FINAL') {
    successMessage = 'Rendición aprobada definitivamente';
    successBg = '#d4edda';
    successColor = '#155724';
  }

  const goToExpenseDetail = (expenseId) => {
    navigate(reviewerExpenseDetailPath(expenseId), {state: {from: reviewerReviewPath(id), origenViaje: originRoute}});
  };

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Revisión Final" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(originRoute)}>
          <ArrowLeft size={25} style={{color: COLORS.title}} />
        </button>

        <ExpenseTripInfoCard trip={trip} />

        <div className={styles.card} style={{backgroundColor: COLORS.background}}>
          <ExpenseBudgetBar accumulated={data.gastoAcumulado} assignedAmount={parseFloat(trip.monto_asignado)} isUsd={false} />
        </div>

        {isInternational && (
          <div className={styles.card} style={{backgroundColor: COLORS.background}}>
            <ExpenseBudgetBar accumulated={data.gastoAcumuladoUsd} assignedAmount={parseFloat(trip.monto_asignado_usd || 0)} isUsd />
          </div>
        )}

        <ExpenseSettlementCard
          amount={data.excedeTotal ? data.gastoAcumulado - parseFloat(trip.monto_asignado) : parseFloat(trip.monto_asignado) - data.gastoAcumulado}
          exceeds={data.excedeTotal} isInternational={isInternational}
          amountUsd={data.excedeTotalUsd ? data.gastoAcumuladoUsd - parseFloat(trip.monto_asignado_usd || 0) : parseFloat(trip.monto_asignado_usd || 0) - data.gastoAcumuladoUsd}
          exceedsUsd={data.excedeTotalUsd} exceededDays={data.diasExcedidos} exceedsHotels={data.excedeHoteles} dayJustifications={dayJustifications} />

        <ExpenseAlertsRow alerts={data.alertas} />

        <ExpenseInvoicedTable expenses={invoicedExpenses} onViewExpense={goToExpenseDetail}
          countObservations={countExpenseObservations} onOpenObservations={openExpenseObservations} />

        <ExpenseUninvoicedTable expenses={uninvoicedExpenses} onViewExpense={goToExpenseDetail}
          countObservations={countExpenseObservations} onOpenObservations={openExpenseObservations} />

        {isInternational && (
          <ExpenseInternationalTable expenses={internationalExpenses} onViewExpense={goToExpenseDetail}
            countObservations={countExpenseObservations} onOpenObservations={openExpenseObservations} />
        )}

        <ExpenseSummaryCard totalVat={totalVat} netBalance={data.gastoAcumulado} isInternational={isInternational} netBalanceUsd={data.gastoAcumuladoUsd} />

        {expenses.length > 0 && (
          <button className={styles.exportBtn} style={{backgroundColor: COLORS.primary, color: COLORS.background}} onClick={() => exportToExcel(trip, expenses, dayJustificationsList)}>
            <Download size={16} />
            Exportar Excel
          </button>
        )}

        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}

        {actionCompleted && (
          <p className={styles.successBadge} style={{backgroundColor: successBg, color: successColor}}>{successMessage}</p>
        )}

        {actionCompleted && warning && (
          <p className={styles.warningMsg} style={{color: '#856404'}}>{warning}</p>
        )}

        {canAct && (
          <>
            <p className={styles.hint} style={{color: COLORS.labels}}>Para observar un gasto, ve a la tabla y presiona el ícono de mensaje junto a él</p>
            <div className={styles.actionsRow}>
              <button className={styles.approveBtn} style={{backgroundColor: COLORS.primary, color: COLORS.background}} onClick={() => setShowApprove(true)}>Aprobar Definitivamente</button>
              <button className={styles.rejectBtn} style={{backgroundColor: 'transparent', borderColor: COLORS.secondary, color: COLORS.secondary}} onClick={handleRequestReject}>Rechazar</button>
            </div>
          </>
        )}
      </div>

      <ApproveTripConfirmModal isOpen={showApprove} onClose={() => setShowApprove(false)} onConfirm={handleApprove} loading={savingAction} />
      <RejectTripConfirmModal isOpen={showReject} onClose={() => setShowReject(false)} onConfirm={handleReject} loading={savingAction} />
      <NoObservationsModal isOpen={showNoObservations} onClose={() => setShowNoObservations(false)} />
      <ExpenseObservationsModal isOpen={showExpenseObservations} onClose={closeExpenseObservations}
        expenseName={expenses.find((expense) => expense.id_gasto === activeExpense)?.Proveedor?.nombre}
        observations={activeExpenseObservations()} canEdit={canAct} newText={newText} setNewText={setNewText}
        onAdd={handleAddComment} onEdit={handleOpenEdit} onDelete={handleOpenDelete} loading={savingAction} error={error} />
      <EditCommentModal isOpen={!!editingComment} onClose={() => setEditingComment(null)} onConfirm={handleConfirmEdit} text={editText} setText={setEditText} loading={savingAction} error={error} />
      <DeleteCommentConfirmModal isOpen={!!deletingComment} onClose={() => setDeletingComment(null)} onConfirm={handleConfirmDelete} loading={savingAction} />

      <Footer />
    </div>
  );
}

export default ReviewerReviewDetailPage;