import {COLORS} from '../../../constants';

const styles = {
  row: "grid grid-cols-2 gap-2",
  group: "flex flex-col min-w-0",
  label: "text-xs font-inter uppercase mb-1",
  inputWrapper: "flex items-center border rounded-xl px-3 py-2 gap-2 w-full min-w-0",
  input: "min-w-0 w-full text-sm font-inter outline-none bg-transparent",
  hint: "text-xs font-inter mt-1",
};

// El calendario no deja elegir un "Hasta" anterior al "Desde"; si se escribe a mano, se avisa
function DateRangeFilter({startDate, endDate, onStartDateChange, onEndDateChange}) {
  const invertedRange = startDate && endDate && startDate > endDate;
  return (
    <div>
      <div className={styles.row}>
        <div className={styles.group}>
          <p className={styles.label} style={{color: COLORS.labels}}>Desde</p>
          <div className={styles.inputWrapper} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
            <input type="date" className={styles.input} style={{color: COLORS.text}} value={startDate} max={endDate || undefined} onChange={onStartDateChange} />
          </div>
        </div>
        <div className={styles.group}>
          <p className={styles.label} style={{color: COLORS.labels}}>Hasta</p>
          <div className={styles.inputWrapper} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
            <input type="date" className={styles.input} style={{color: COLORS.text}} value={endDate} min={startDate || undefined} onChange={onEndDateChange} />
          </div>
        </div>
      </div>
      {invertedRange && <p className={styles.hint} style={{color: COLORS.secondary}}>La fecha "Desde" no puede ser posterior a "Hasta".</p>}
    </div>
  );
}

export default DateRangeFilter;