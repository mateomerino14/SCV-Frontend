import {ArrowLeft, Globe, Download} from 'lucide-react';
import {COLORS} from '../../../constants';
import {tripStatusConfig, tripStatusMessages} from '../hooks/useTripStatusConfig';
import TripInfoCard from '../molecules/TripInfoCard';
import TripBalanceSummary from '../molecules/TripBalanceSummary';
import ExpenseItem from '../../expense/organisms/ExpenseItem';

const styles = {
  backBtn: 'flex items-center gap-1 cursor-pointer mb-4 w-fit',
  card: 'rounded-2xl p-5 shadow-md mb-4 border',
  sectionTitle: 'text-xs font-bold font-inter uppercase mb-3',
  sectionTitleInter: 'text-xs font-bold font-inter uppercase mb-3 flex items-center gap-2',
  justificationLabel: 'text-xs font-bold font-inter uppercase mb-2',
  textarea: 'w-full rounded-xl p-3 text-sm font-inter outline-none border resize-none',
  exportBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-sm cursor-pointer flex items-center justify-center gap-2 mb-4',
  statusBadge: 'text-xs font-semibold font-inter px-3 py-2 rounded-xl text-center mb-4',
};

function TripFinalApprovedView({trip, tripId, isInternational, originRoute, navigate, expenses, nationalExpenses, internationalExpenses, accumulatedExpense, accumulatedExpenseUsd, exceedsBudget, exceedsBudgetUsd, justification, observations, exportToExcel}) {
  const config = tripStatusConfig[trip.estado];

  return (
    <>
      <button className={styles.backBtn} onClick={() => navigate(originRoute)}>
        <ArrowLeft size={25} style={{color: COLORS.title}} />
      </button>
      <TripInfoCard trip={trip} isInternational={isInternational} />
      {nationalExpenses.length > 0 && (
        <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
          <p className={styles.sectionTitle} style={{color: COLORS.text_enviroment_types}}>Gastos Nacionales</p>
          {nationalExpenses.map((expense) => (
            <ExpenseItem key={expense.id_gasto} expense={expense} tripInProgress={false} onDelete={() => {}} tripId={tripId} originTrip={originRoute} observations={observations} />
          ))}
        </div>
      )}
      {isInternational && internationalExpenses.length > 0 && (
        <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
          <p className={styles.sectionTitleInter} style={{color: COLORS.primary}}>
            <Globe size={13} />
            Gastos Internacionales
          </p>
          {internationalExpenses.map((expense) => (
            <ExpenseItem key={expense.id_gasto} expense={expense} tripInProgress={false} onDelete={() => {}} tripId={tripId} originTrip={originRoute} observations={observations} />
          ))}
        </div>
      )}
      <TripBalanceSummary trip={trip} accumulatedExpense={accumulatedExpense} accumulatedExpenseUsd={accumulatedExpenseUsd}
        exceedsBudget={exceedsBudget} exceedsBudgetUsd={exceedsBudgetUsd} isInternational={isInternational} />
      {(exceedsBudget || exceedsBudgetUsd) && justification && (
        <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
          <p className={styles.justificationLabel} style={{color: COLORS.text_enviroment_types}}>Justificación de Reembolso</p>
          <textarea className={styles.textarea} rows={4} value={justification} readOnly
            style={{backgroundColor: 'rgba(243,243,243,0.13)', borderColor: COLORS.dataFields, color: COLORS.text, cursor: 'default'}} />
        </div>
      )}
      <button className={styles.exportBtn} style={{backgroundColor: COLORS.primary, color: COLORS.background}} onClick={() => exportToExcel(trip, expenses)}>
        <Download size={16} />
        Exportar Planilla Excel
      </button>
      <p className={styles.statusBadge} style={{backgroundColor: config?.bg, color: config?.color}}>{tripStatusMessages[trip.estado]}</p>
    </>
  );
}

export default TripFinalApprovedView;