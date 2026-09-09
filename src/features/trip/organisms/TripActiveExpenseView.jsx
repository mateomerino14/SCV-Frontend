import {ArrowLeft, PlusCircle, Upload, Globe, Navigation, MapPin, AlertTriangle} from 'lucide-react';
import {COLORS} from '../../../constants';
import {registerExpensePath, uploadInvoicePath} from '../../../constants/routes';
import {formatDateRange} from '../../../utils/dateFormatter';
import {tripStatusConfig, tripStatusMessages} from '../hooks/useTripStatusConfig';
import TripStatusBadge from '../atoms/TripStatusBadge';
import TripTypeBadge from '../atoms/TripTypeBadge';
import BudgetBar from '../molecules/BudgetBar';
import TripBalanceSummary from '../molecules/TripBalanceSummary';
import TripObservationsList from '../molecules/TripObservationsList';
import ExpenseItem from '../../expense/organisms/ExpenseItem';

const styles = {
  backBtn: 'flex items-center gap-1 cursor-pointer mb-4 w-fit',
  headerRow: 'flex items-start justify-between gap-3 mb-1',
  title: 'text-2xl font-bold font-inter mb-1 leading-tight break-words',
  badges: 'flex gap-2 mb-4 flex-wrap',
  date: 'text-xs font-nunito font-bold mb-1',
  route: 'text-xs font-nunito font-bold mb-4 flex items-start gap-1 flex-wrap',
  routeText: 'truncate',
  destination: 'text-xs font-nunito font-bold mb-4 break-words',
  card: 'rounded-2xl p-5 shadow-md mb-4 border',
  sectionTitle: 'text-xs font-bold font-inter uppercase mb-3',
  sectionTitleInter: 'text-xs font-bold font-inter uppercase mb-3 flex items-center gap-2',
  actionRow: 'flex gap-3 mb-2',
  actionBtn: 'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold font-nunito text-sm border transition-colors',
  internationalLabel: 'text-xs font-bold font-inter uppercase mb-2 mt-3',
  expensesHeader: 'flex items-center justify-between mb-3',
  showAll: 'text-xs font-bold font-inter cursor-pointer',
  justificationLabel: 'text-xs font-bold font-inter uppercase mb-2',
  excessAmount: 'text-sm font-semibold font-inter mb-2',
  textarea: 'w-full rounded-xl p-3 text-sm font-inter outline-none border resize-none',
  submitBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-white text-base mt-3',
  errorMsg: 'text-xs font-inter italic text-center py-2 px-3 rounded-xl mt-2 mb-2',
  statusBadge: 'text-xs font-semibold font-inter px-3 py-2 rounded-xl text-center mb-4',
  alertBox: 'rounded-xl px-4 py-3 mb-4 text-center',
  requestBtn: 'w-full py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer mt-3 flex items-center justify-center gap-2',
};

function TripActiveExpenseView({trip, tripId, isInternational, originRoute, navigate, tripDetail, deadline}) {
  const {
    expenses, nationalExpenses, internationalExpenses, displayedNationalExpenses, displayedInternationalExpenses,
    accumulatedExpense, accumulatedExpenseUsd, exceedsBudget, exceedsBudgetUsd, tripInProgress,
    submittingReview, error, justification, setJustification, observations,
    showAllNational, setShowAllNational, showAllInternational, setShowAllInternational,
    handleRequestSubmitReview, handleRequestDelete,
  } = tripDetail;

  const {
    isPending: deadlinePending, canRequest: canRequestDeadline, deadlineExpired,
    isApproved: hasActiveExtension, request: deadlineRequest,
    setShowModal: setShowDeadlineModal, error: deadlineError,
  } = deadline;

  const isRejectedExpenses = trip.estado === 'RECHAZADO' && !!trip.fue_iniciado;
  const generalObservations = observations.filter((observation) => !observation.id_gasto);
  const showObservations = trip.estado === 'RECHAZADO' && generalObservations.length > 0;
  const actionsDisabled = deadlineExpired && !hasActiveExtension;

  const excessParts = [];
  if (exceedsBudget) {
    excessParts.push(`${Math.abs(parseFloat(trip.monto_asignado) - accumulatedExpense).toFixed(2)} Bs excedidos`);
  }
  if (isInternational && exceedsBudgetUsd) {
    excessParts.push(`${Math.abs(parseFloat(trip.monto_asignado_usd || 0) - accumulatedExpenseUsd).toFixed(2)} USD excedidos`);
  }
  const excessText = excessParts.join(' · ');

  const navigateToRegister = () => navigate(registerExpensePath(tripId), {state: {fechaFin: trip.fecha_fin}});
  const navigateToUpload = () => navigate(uploadInvoicePath(tripId), {state: {fechaFin: trip.fecha_fin}});
  const navigateToRegisterInternational = () => navigate(`${registerExpensePath(tripId)}?internacional=true`, {state: {fechaFin: trip.fecha_fin}});

  const primaryActionStyle = {
    backgroundColor: actionsDisabled ? COLORS.fields : COLORS.primary,
    borderColor: actionsDisabled ? COLORS.fields : COLORS.primary,
    color: COLORS.background,
    cursor: actionsDisabled ? 'not-allowed' : 'pointer',
    opacity: actionsDisabled ? 0.6 : 1,
  };

  const secondaryActionStyle = {
    borderColor: actionsDisabled ? COLORS.fields : COLORS.primary,
    color: actionsDisabled ? COLORS.labels : COLORS.primary,
    cursor: actionsDisabled ? 'not-allowed' : 'pointer',
    opacity: actionsDisabled ? 0.6 : 1,
  };

  return (
    <>
      <button className={styles.backBtn} onClick={() => navigate(originRoute)}>
        <ArrowLeft size={25} style={{color: COLORS.title}} />
      </button>

      <div className={styles.headerRow}>
        <h1 className={styles.title} style={{color: COLORS.text, marginBottom: 0}}>{trip.motivo}</h1>
        <TripStatusBadge status={trip.estado} />
      </div>

      <div className={styles.badges}>
        <TripTypeBadge isInternational={isInternational} />
        {trip.transporte && (
          <span className="text-xs font-semibold font-inter px-3 py-1 rounded-full uppercase" style={{backgroundColor: COLORS.dataFields, color: COLORS.text}}>{trip.transporte}</span>
        )}
      </div>

      <p className={styles.date} style={{color: COLORS.labels}}>{formatDateRange(trip.fecha_inicio, trip.fecha_fin)}</p>

      {trip.origen ? (
        <p className={styles.route} style={{color: COLORS.labels}}>
          <Navigation size={11} style={{color: COLORS.labels, marginTop: 2, flexShrink: 0}} />
          <span className={styles.routeText} style={{maxWidth: 100}}>{trip.origen}</span>
          <span style={{color: COLORS.dataFields, margin: '0 4px', flexShrink: 0}}>→</span>
          <MapPin size={11} style={{color: COLORS.secondary, marginTop: 2, flexShrink: 0}} />
          <span className={styles.routeText} style={{maxWidth: 100}}>{trip.destino}</span>
        </p>
      ) : (
        <p className={styles.destination} style={{color: COLORS.labels}}>{trip.destino}</p>
      )}

      <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
        <BudgetBar accumulatedExpense={accumulatedExpense} assignedAmount={trip.monto_asignado} isUsd={false} />
      </div>
      {isInternational && (
        <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
          <BudgetBar accumulatedExpense={accumulatedExpenseUsd} assignedAmount={trip.monto_asignado_usd} isUsd />
        </div>
      )}

      {tripInProgress && !isInternational && (
        <div className={styles.actionRow}>
          <button className={styles.actionBtn} style={primaryActionStyle} onClick={() => !actionsDisabled && navigateToRegister()} disabled={actionsDisabled}>
            <PlusCircle size={16} />
            Registrar Gasto
          </button>
          <button className={styles.actionBtn} style={secondaryActionStyle} onClick={() => !actionsDisabled && navigateToUpload()} disabled={actionsDisabled}>
            <Upload size={16} />
            Subir Facturas
          </button>
        </div>
      )}

      {tripInProgress && isInternational && (
        <>
          <p className={styles.internationalLabel} style={{color: COLORS.labels}}>Gastos Nacionales (Bs)</p>
          <div className={styles.actionRow}>
            <button className={styles.actionBtn} style={primaryActionStyle} onClick={() => !actionsDisabled && navigateToRegister()} disabled={actionsDisabled}>
              <PlusCircle size={16} />
              Gasto sin Factura
            </button>
            <button className={styles.actionBtn} style={secondaryActionStyle} onClick={() => !actionsDisabled && navigateToUpload()} disabled={actionsDisabled}>
              <Upload size={16} />
              Subir Facturas
            </button>
          </div>
          <p className={styles.internationalLabel} style={{color: COLORS.labels}}>Gastos Internacionales (USD)</p>
          <div className={styles.actionRow}>
            <button className={styles.actionBtn} style={primaryActionStyle} onClick={() => !actionsDisabled && navigateToRegisterInternational()} disabled={actionsDisabled}>
              <Globe size={16} />
              Gasto Internacional
            </button>
          </div>
        </>
      )}

      {isInternational ? (
        <>
          {nationalExpenses.length > 0 && (
            <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
              <div className={styles.expensesHeader}>
                <p className={styles.sectionTitle} style={{color: COLORS.labels}}>Gastos Nacionales</p>
                {nationalExpenses.length > 3 && (
                  <p className={styles.showAll} style={{color: COLORS.secondary}} onClick={() => setShowAllNational(!showAllNational)}>
                    {showAllNational ? 'VER MENOS' : 'VER TODO'}
                  </p>
                )}
              </div>
              {displayedNationalExpenses.map((expense) => (
                <ExpenseItem key={expense.id_gasto} expense={expense} tripInProgress={tripInProgress && !actionsDisabled} onDelete={handleRequestDelete} tripId={tripId} originTrip={originRoute} observations={observations} />
              ))}
            </div>
          )}
          {internationalExpenses.length > 0 && (
            <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
              <div className={styles.expensesHeader}>
                <p className={styles.sectionTitleInter} style={{color: COLORS.primary}}>
                  <Globe size={13} />
                  Gastos Internacionales
                </p>
                {internationalExpenses.length > 3 && (
                  <p className={styles.showAll} style={{color: COLORS.secondary}} onClick={() => setShowAllInternational(!showAllInternational)}>
                    {showAllInternational ? 'VER MENOS' : 'VER TODO'}
                  </p>
                )}
              </div>
              {displayedInternationalExpenses.map((expense) => (
                <ExpenseItem key={expense.id_gasto} expense={expense} tripInProgress={tripInProgress && !actionsDisabled} onDelete={handleRequestDelete} tripId={tripId} originTrip={originRoute} observations={observations} />
              ))}
            </div>
          )}
        </>
      ) : (
        nationalExpenses.length > 0 && (
          <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
            <div className={styles.expensesHeader}>
              <p className={styles.sectionTitle} style={{color: COLORS.labels}}>Gastos Registrados</p>
              {nationalExpenses.length > 3 && (
                <p className={styles.showAll} style={{color: COLORS.secondary}} onClick={() => setShowAllNational(!showAllNational)}>
                  {showAllNational ? 'VER MENOS' : 'VER TODO'}
                </p>
              )}
            </div>
            {displayedNationalExpenses.map((expense) => (
              <ExpenseItem key={expense.id_gasto} expense={expense} tripInProgress={tripInProgress && !actionsDisabled} onDelete={handleRequestDelete} tripId={tripId} originTrip={originRoute} observations={observations} />
            ))}
          </div>
        )
      )}

      <TripBalanceSummary trip={trip} accumulatedExpense={accumulatedExpense} accumulatedExpenseUsd={accumulatedExpenseUsd}
        exceedsBudget={exceedsBudget} exceedsBudgetUsd={exceedsBudgetUsd} isInternational={isInternational} />

      {tripInProgress && (exceedsBudget || (isInternational && exceedsBudgetUsd)) && (
        <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
          <p className={styles.justificationLabel} style={{color: COLORS.labels}}>Justificación de Reembolso</p>
          <p className={styles.excessAmount} style={{color: COLORS.secondary}}>{excessText}</p>
          <textarea className={styles.textarea} rows={3} placeholder="Detalle el motivo del exceso de presupuesto..."
            value={justification} onChange={(event) => setJustification(event.target.value)} disabled={actionsDisabled}
            style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields, color: COLORS.text, opacity: actionsDisabled ? 0.6 : 1}} />
        </div>
      )}

      {!tripInProgress && (exceedsBudget || exceedsBudgetUsd) && justification && (
        <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
          <p className={styles.justificationLabel} style={{color: COLORS.labels}}>Justificación de Reembolso</p>
          <textarea className={styles.textarea} rows={4} value={justification} readOnly
            style={{backgroundColor: 'rgba(243,243,243,0.13)', borderColor: COLORS.dataFields, color: COLORS.text, cursor: 'default'}} />
        </div>
      )}

      {showObservations && (
        <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
          <TripObservationsList observations={generalObservations} />
        </div>
      )}

      {isRejectedExpenses && (
        <div className={styles.alertBox} style={{backgroundColor: '#ffa7a8aa'}}>
          <p style={{color: '#500203', fontFamily: 'Inter', fontSize: 13, fontWeight: 600}}>
            Tu rendición de gastos fue rechazada. Revisa las observaciones, corrige los gastos y vuelve a enviar.
          </p>
        </div>
      )}

      {hasActiveExtension && tripInProgress && (
        <div className={styles.alertBox} style={{backgroundColor: '#d4edda'}}>
          <p style={{color: '#155724', fontFamily: 'Inter', fontSize: 13, fontWeight: 600}}>
            Tienes una autorización de plazo activa. Puedes registrar gastos hasta el {deadlineRequest?.limite_extendido?.split('-').reverse().join('/')}.
          </p>
        </div>
      )}

      {actionsDisabled && tripInProgress && (
        <div className={styles.alertBox} style={{backgroundColor: '#fef3cd'}}>
          <p style={{color: '#856404', fontFamily: 'Inter', fontSize: 13, fontWeight: 600}}>
            El plazo para registrar gastos ha vencido. Solicita una autorización al revisor para continuar.
          </p>
        </div>
      )}

      {deadlinePending && (
        <div className={styles.alertBox} style={{backgroundColor: '#ffd700aa'}}>
          <p style={{color: '#7a5900', fontFamily: 'Inter', fontSize: 13, fontWeight: 600}}>
            Tienes una solicitud de autorización de plazo pendiente de revisión.
          </p>
        </div>
      )}

      {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
      {deadlineError && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{deadlineError}</p>}

      {tripInProgress && (
        <button className={styles.submitBtn}
          style={{backgroundColor: submittingReview || actionsDisabled ? COLORS.fields : COLORS.secondary, cursor: actionsDisabled ? 'not-allowed' : 'pointer', opacity: actionsDisabled ? 0.6 : 1}}
          onClick={handleRequestSubmitReview} disabled={submittingReview || actionsDisabled}>
          {submittingReview ? 'Enviando...' : (isRejectedExpenses ? 'Reenviar a Revisión' : 'Confirmar Finalización')}
        </button>
      )}

      {canRequestDeadline && !deadlinePending && tripInProgress && (
        <button className={styles.requestBtn} style={{backgroundColor: COLORS.secondary, color: COLORS.background}}
          onClick={() => setShowDeadlineModal(true)}>
          <AlertTriangle size={15} />
          Solicitar Autorización al Revisor
        </button>
      )}

      {!tripInProgress && (
        <p className={styles.statusBadge} style={{backgroundColor: tripStatusConfig[trip.estado]?.bg, color: tripStatusConfig[trip.estado]?.color}}>
          {tripStatusMessages[trip.estado]}
        </p>
      )}
    </>
  );
}

export default TripActiveExpenseView;