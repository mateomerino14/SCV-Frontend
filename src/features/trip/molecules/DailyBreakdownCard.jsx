import {useState} from 'react';
import {ChevronDown, ChevronUp} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  wrapper: 'rounded-xl p-3 border mt-2',
  header: 'flex items-center justify-between cursor-pointer',
  title: 'text-xs font-bold font-inter uppercase',
  dayRow: 'mt-2',
  dayHeader: 'flex justify-between items-center mb-0.5',
  dayLabel: 'text-xs font-inter',
  dayAmount: 'text-xs font-bold font-inter',
  progressBar: 'w-full h-1.5 rounded',
  progress: 'h-1.5 rounded',
};

function formatDayCompact(dateStr) {
  if (!dateStr) return '';
  const [, month, day] = dateStr.split('-');
  return `${day}/${month}`;
}

function DailyBreakdownCard({dailyBreakdown = [], dailyRate = 0, dailyRateUsd = 0}) {
  const [open, setOpen] = useState(false);
  if (dailyBreakdown.length === 0) {
    return null;
  }
  return (
    <div className={styles.wrapper} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
      <div className={styles.header} onClick={() => setOpen((prev) => !prev)}>
        <p className={styles.title} style={{color: COLORS.labels}}>Gasto por Día</p>
        {open ? <ChevronUp size={16} style={{color: COLORS.labels}} /> : <ChevronDown size={16} style={{color: COLORS.labels}} />}
      </div>
      {open && (
        <div>
          {dailyBreakdown.map((day) => {
            const isUsd = day.montoUsd > 0 && day.montoBs === 0;
            const amount = isUsd ? day.montoUsd : day.montoBs;
            const rate = isUsd ? dailyRateUsd : dailyRate;
            const exceeds = isUsd ? day.excedeUsd : day.excedeBs;
            const percentage = rate > 0 ? Math.min((amount / rate) * 100, 100) : 0;
            const currency = isUsd ? 'USD' : 'Bs';
            return (
              <div key={day.fecha} className={styles.dayRow}>
                <div className={styles.dayHeader}>
                  <p className={styles.dayLabel} style={{color: COLORS.text}}>{formatDayCompact(day.fecha)}</p>
                  <p className={styles.dayAmount} style={{color: exceeds ? COLORS.secondary : COLORS.title}}>
                    {amount.toFixed(2)} / {rate.toFixed(2)} {currency}
                  </p>
                </div>
                <div className={styles.progressBar} style={{backgroundColor: COLORS.bar}}>
                  <div className={styles.progress} style={{width: `${percentage}%`, backgroundColor: exceeds ? COLORS.secondary : COLORS.title}} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DailyBreakdownCard;
