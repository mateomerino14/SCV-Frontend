import {AlertTriangle} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  section: 'mb-4',
  title: 'text-xs font-bold font-inter uppercase mb-2',
  row: 'flex gap-2 flex-wrap',
  badge: 'text-xs font-bold font-inter px-3 py-1.5 rounded-lg flex items-center gap-1',
};

const alertConfig = {
  EXCESO_PRESUPUESTO: {label: 'Exceso Detectado', color: '#856404', bg: '#fef3cd'},
  ALCOHOL: {label: 'Alcohol', color: '#721c24', bg: '#f8d7da'},
};

function ExpenseAlertsRow({alerts}) {
  if (!alerts || alerts.length === 0) {
    return null;
  }
  return (
    <div className={styles.section}>
      <p className={styles.title} style={{color: COLORS.labels}}>Alertas</p>
      <div className={styles.row}>
        {alerts.map((alert) => {
          const config = alertConfig[alert];
          if (!config) {
            return null;
          }
          return (
            <span key={alert} className={styles.badge} style={{backgroundColor: config.bg, color: config.color}}>
              <AlertTriangle size={12} />
              {config.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default ExpenseAlertsRow;