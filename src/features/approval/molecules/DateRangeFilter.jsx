import {COLORS} from '../../../constants';

const styles = {
  row: "grid grid-cols-2 gap-2",
  group: "flex flex-col min-w-0",
  label: "text-xs font-inter uppercase mb-1",
  inputWrapper: "flex items-center border rounded-xl px-3 py-2 gap-2 w-full min-w-0",
  input: "min-w-0 w-full text-sm font-inter outline-none bg-transparent",
};

function DateRangeFilter({startDate, endDate, onStartDateChange, onEndDateChange}) {
  return (
    <div className={styles.row}>
      <div className={styles.group}>
        <p className={styles.label} style={{color: COLORS.labels}}>Desde</p>
        <div className={styles.inputWrapper} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
          <input type="date" className={styles.input} style={{color: COLORS.text}} value={startDate} onChange={onStartDateChange} />
        </div>
      </div>
      <div className={styles.group}>
        <p className={styles.label} style={{color: COLORS.labels}}>Hasta</p>
        <div className={styles.inputWrapper} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
          <input type="date" className={styles.input} style={{color: COLORS.text}} value={endDate} onChange={onEndDateChange} />
        </div>
      </div>
    </div>
  );
}

export default DateRangeFilter;