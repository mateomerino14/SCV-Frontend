import {COLORS} from '../../../constants';

const styles = {
  wrapper: "flex flex-col gap-1",
  label: "text-xs font-bold font-inter uppercase mb-3",
  row: "flex gap-2",
  button: "flex-1 py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer border transition-colors",
};

function ExpenseTypeToggle({type, onChange}) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{color: COLORS.labels}}>Tipo de Registro</p>
      <div className={styles.row}>
        {['C', 'S'].map((option) => (
          <button key={option} className={styles.button} onClick={() => onChange(option)}
            style={{backgroundColor: type === option ? COLORS.primary : 'transparent', borderColor: type === option ? COLORS.primary : COLORS.fields, color: type === option ? COLORS.background : COLORS.labels}}>
            {option === 'C' ? 'Compra (C)' : 'Servicio (S)'}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ExpenseTypeToggle;