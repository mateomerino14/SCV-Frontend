import {useState} from 'react';
import {ChevronDown, ChevronUp, CalendarDays} from 'lucide-react';
import DailyLimitBar from '../atoms/DailyLimitBar';
import {dailyLimitStatus, getLimitStatus, dayLimitBs, dayLimitUsd} from '../constants/dailyLimitStatus';
import {COLORS} from '../../../constants';

const styles = {
  wrapper: 'rounded-2xl border mt-3 overflow-hidden',
  header: 'flex items-center justify-between gap-3 p-4 cursor-pointer',
  headerLeft: 'flex items-center gap-3 min-w-0',
  iconWrap: 'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
  title: 'text-sm font-bold font-inter',
  subtitle: 'text-xs font-inter',
  body: 'px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-3',
  dayCard: 'rounded-xl p-3 border flex flex-col gap-3',
  dayHeader: 'flex items-center justify-between gap-2',
  dayLabel: 'text-sm font-bold font-inter capitalize',
  badge: 'inline-flex items-center gap-1 text-[11px] font-bold font-inter rounded-full px-2 py-0.5 whitespace-nowrap',
  excess: 'text-xs font-inter',
  note: 'text-[11px] font-inter -mt-1',
};

const formatDayLabel = (dateText) => {
  const [year, month, day] = dateText.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('es-ES', {weekday: 'short', day: 'numeric', month: 'short'});
};

const showsUsdBar = (day, isInternational) => isInternational && (!day.soloBs || day.montoUsd > 0);

const buildDayStatus = (day, dailyRate, dailyRateUsd, isInternational, justified) => {
  const statuses = [getLimitStatus(day.montoBs, dayLimitBs(day, dailyRate))];
  if (showsUsdBar(day, isInternational)) {
    statuses.push(getLimitStatus(day.montoUsd, dayLimitUsd(day, dailyRateUsd)));
  }
  if (statuses.includes('EXCEEDED')) {
    if (justified) {
      return 'JUSTIFIED';
    }
    return 'EXCEEDED';
  }
  if (statuses.includes('NEAR')) {
    return 'NEAR';
  }
  return 'OK';
};

const buildExcessText = (day, dailyRate, dailyRateUsd, isInternational) => {
  const parts = [];
  const limitBs = dayLimitBs(day, dailyRate);
  const limitUsd = dayLimitUsd(day, dailyRateUsd);
  if (limitBs > 0 && day.montoBs > limitBs) {
    parts.push(`${(day.montoBs - limitBs).toFixed(2)} Bs`);
  }
  if (isInternational && limitUsd > 0 && day.montoUsd > limitUsd) {
    parts.push(`${(day.montoUsd - limitUsd).toFixed(2)} USD`);
  }
  if (parts.length === 0) {
    return '';
  }
  return `Excede en ${parts.join(' y ')}`;
};

function DailyBreakdownCard({dailyBreakdown = [], dailyRate = 0, dailyRateUsd = 0, isInternational = false, justifiedDays = [], defaultOpen = false}) {
  const [open, setOpen] = useState(defaultOpen);
  if (dailyBreakdown.length === 0) {
    return null;
  }
  const days = dailyBreakdown.map((day) => ({
    ...day,
    status: buildDayStatus(day, dailyRate, dailyRateUsd, isInternational, justifiedDays.includes(day.fecha)),
  }));
  const exceededCount = days.filter((day) => day.status === 'EXCEEDED').length;
  const justifiedCount = days.filter((day) => day.status === 'JUSTIFIED').length;
  let summary = 'Todos los días dentro del límite';
  if (exceededCount > 0) {
    summary = `${exceededCount} día${exceededCount === 1 ? '' : 's'} por justificar`;
  }
  else if (justifiedCount > 0) {
    summary = `${justifiedCount} día${justifiedCount === 1 ? '' : 's'} justificado${justifiedCount === 1 ? '' : 's'}`;
  }
  const ToggleIcon = open ? ChevronUp : ChevronDown;
  return (
    <div className={styles.wrapper} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
      <div className={styles.header} onClick={() => setOpen((prev) => !prev)}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrap} style={{backgroundColor: COLORS.error}}>
            <CalendarDays size={18} style={{color: COLORS.primary}} />
          </div>
          <div className="min-w-0">
            <p className={styles.title} style={{color: COLORS.text}}>Control Diario</p>
            <p className={styles.subtitle} style={{color: exceededCount > 0 ? COLORS.secondary : COLORS.labels}}>
              {days.length} día{days.length === 1 ? '' : 's'} con gastos · {summary}
            </p>
          </div>
        </div>
        <ToggleIcon size={18} style={{color: COLORS.labels}} />
      </div>
      {open && (
        <div className={styles.body}>
          {days.map((day) => {
            const status = dailyLimitStatus[day.status];
            const StatusIcon = status.icon;
            const excessText = buildExcessText(day, dailyRate, dailyRateUsd, isInternational);
            return (
              <div key={day.fecha} className={styles.dayCard} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.backgroundHeader}}>
                <div className={styles.dayHeader}>
                  <p className={styles.dayLabel} style={{color: COLORS.text}}>{formatDayLabel(day.fecha)}</p>
                  <span className={styles.badge} style={{backgroundColor: status.bg, color: status.color}}>
                    <StatusIcon size={12} />
                    {status.label}
                  </span>
                </div>
                <DailyLimitBar currency="Bs" amount={day.montoBs} limit={dayLimitBs(day, dailyRate)} />
                {day.tipoCambio && (
                  <p className={styles.note} style={{color: COLORS.labels}}>
                    Fondo solo en Bs: límite de {dayLimitUsd(day, dailyRateUsd).toFixed(2)} USD × T/C {day.tipoCambio.toFixed(4)}
                  </p>
                )}
                {showsUsdBar(day, isInternational) && <DailyLimitBar currency="USD" amount={day.montoUsd} limit={dayLimitUsd(day, dailyRateUsd)} />}
                {excessText && <p className={styles.excess} style={{color: status.color}}>{excessText}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DailyBreakdownCard;
