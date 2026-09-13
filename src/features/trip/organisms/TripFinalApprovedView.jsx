import {ArrowLeft, Globe, Download} from 'lucide-react';
import {COLORS} from '../../../constants';
import {tripStatusConfig, tripStatusMessages} from '../hooks/useTripStatusConfig';
import TripInfoCard from '../molecules/TripInfoCard';
import TripBalanceSummary from '../molecules/TripBalanceSummary';
import ExpenseItem from '../../expense/organisms/ExpenseItem';
import useStatementPdfDownload from '../../../hooks/trip/useStatementPdfDownload';

import {formatDateShort} from '../../../utils/dateFormatter';

const styles = {
  backBtn: 'flex items-center gap-1 cursor-pointer mb-4 w-fit',
  card: 'rounded-2xl p-5 shadow-md mb-4 border',
  sectionTitle: 'text-xs font-bold font-inter uppercase mb-3',
  sectionTitleInter: 'text-xs font-bold font-inter uppercase mb-3 flex items-center gap-2',
  justificationLabel: 'text-xs font-bold font-inter uppercase mb-2',
  justificationItem: 'mb-3',
  itemLabel: 'text-sm font-semibold font-inter mb-2',
  textarea: 'w-full rounded-xl p-3 text-sm font-inter outline-none border resize-none',
  exportBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-sm cursor-pointer flex items-center justify-center gap-2 mb-4',
  downloadError: 'text-xs font-inter italic text-center -mt-2 mb-4',
  statusBadge: 'text-xs font-semibold font-inter px-3 py-2 rounded-xl text-center mb-4',
};

function TripFinalApprovedView({trip, tripId, isInternational, originRoute, navigate, nationalExpenses, internationalExpenses, accumulatedExpense, accumulatedExpenseUsd, totalExceeds, totalExceedsUsd, exceededDays = [], exceedsHotels, dayJustifications = {}, observations}) {
  const config = tripStatusConfig[trip.estado];
  const {downloading, error: downloadError, handleDownload} = useStatementPdfDownload(tripId);

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
            <ExpenseItem key={expense.id_gasto} expense={expense} tripInProgress={false} isFinalApproved onDelete={() => {}} tripId={tripId} originTrip={originRoute} observations={observations} />
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
            <ExpenseItem key={expense.id_gasto} expense={expense} tripInProgress={false} isFinalApproved onDelete={() => {}} tripId={tripId} originTrip={originRoute} observations={observations} />
          ))}
        </div>
      )}
      <TripBalanceSummary trip={trip} accumulatedExpense={accumulatedExpense} accumulatedExpenseUsd={accumulatedExpenseUsd}
        exceedsBudget={totalExceeds} exceedsBudgetUsd={totalExceedsUsd} isInternational={isInternational} />
      {(exceededDays.length > 0 || exceedsHotels) && (
        <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
          <p className={styles.justificationLabel} style={{color: COLORS.text_enviroment_types}}>Justificación de Excesos</p>
          {exceededDays.map((day) => dayJustifications[day.fecha] && (
            <div key={day.fecha} className={styles.justificationItem}>
              <p className={styles.itemLabel} style={{color: COLORS.secondary}}>{formatDateShort(day.fecha)}</p>
              <textarea className={styles.textarea} rows={3} value={dayJustifications[day.fecha]} readOnly
                style={{backgroundColor: 'rgba(243,243,243,0.13)', borderColor: COLORS.dataFields, color: COLORS.text, cursor: 'default'}} />
            </div>
          ))}
          {exceedsHotels && dayJustifications.HOTEL && (
            <div className={styles.justificationItem}>
              <p className={styles.itemLabel} style={{color: COLORS.secondary}}>Hoteles</p>
              <textarea className={styles.textarea} rows={3} value={dayJustifications.HOTEL} readOnly
                style={{backgroundColor: 'rgba(243,243,243,0.13)', borderColor: COLORS.dataFields, color: COLORS.text, cursor: 'default'}} />
            </div>
          )}
        </div>
      )}
      <button className={styles.exportBtn} style={{backgroundColor: downloading ? COLORS.fields : COLORS.primary, color: COLORS.background}} onClick={handleDownload} disabled={downloading}>
        <Download size={16} />
        {downloading ? 'Generando PDF...' : 'Descargar Planilla PDF'}
      </button>
      {downloadError && <p className={styles.downloadError} style={{color: COLORS.secondary}}>{downloadError}</p>}
      <p className={styles.statusBadge} style={{backgroundColor: config?.bg, color: config?.color}}>{tripStatusMessages[trip.estado]}</p>
    </>
  );
}

export default TripFinalApprovedView;