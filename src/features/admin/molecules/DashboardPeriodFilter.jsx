import DateRangeFilter from '../../approval/molecules/DateRangeFilter';
import {formatDateShort} from '../../../utils/dateFormatter';
import {COLORS} from '../../../constants';

const styles = {
  card: 'rounded-2xl p-4 shadow-md mb-5',
  title: 'text-xs font-bold font-inter uppercase mb-3',
  chips: 'grid grid-cols-2 sm:grid-cols-4 gap-2',
  chip: 'py-2 rounded-xl text-sm font-bold font-nunito cursor-pointer border transition-colors text-center',
  rangeBox: 'mt-3',
  applyBtn: 'w-full mt-3 py-2.5 rounded-xl text-sm font-bold font-nunito cursor-pointer',
  error: 'text-xs font-inter mt-2',
  caption: 'text-xs font-inter mt-3',
};

// Filtro de periodo del resumen general, por fecha de inicio del viaje
function DashboardPeriodFilter({options, preset, onSelectPreset, customRange, onCustomRangeChange, onApply, rangeError, appliedPeriod}) {
  let caption = 'Se muestran los viajes de todo el historial.';
  if (appliedPeriod?.fecha_inicio && appliedPeriod?.fecha_fin) {
    caption = `Se muestran los viajes que inician del ${formatDateShort(appliedPeriod.fecha_inicio)} al ${formatDateShort(appliedPeriod.fecha_fin)}. Los usuarios y cargos no dependen del periodo.`;
  }
  return (
    <div className={styles.card} style={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.fields}`}}>
      <p className={styles.title} style={{color: COLORS.labels}}>Periodo</p>
      <div className={styles.chips}>
        {options.map((option) => {
          const selected = preset === option.value;
          return (
            <button key={option.value} className={styles.chip} onClick={() => onSelectPreset(option.value)}
              style={{backgroundColor: selected ? COLORS.primary : 'transparent', borderColor: selected ? COLORS.primary : COLORS.fields, color: selected ? COLORS.background : COLORS.labels}}>
              {option.label}
            </button>
          );
        })}
      </div>
      {preset === 'rango' && (
        <div className={styles.rangeBox}>
          <DateRangeFilter startDate={customRange.fecha_inicio} endDate={customRange.fecha_fin}
            onStartDateChange={(event) => onCustomRangeChange({...customRange, fecha_inicio: event.target.value})}
            onEndDateChange={(event) => onCustomRangeChange({...customRange, fecha_fin: event.target.value})} />
          <button className={styles.applyBtn} onClick={onApply} style={{backgroundColor: COLORS.primary, color: COLORS.background}}>
            Aplicar Periodo
          </button>
          {rangeError && <p className={styles.error} style={{color: COLORS.secondary}}>{rangeError}</p>}
        </div>
      )}
      <p className={styles.caption} style={{color: COLORS.labels}}>{caption}</p>
    </div>
  );
}

export default DashboardPeriodFilter;
