import FieldLabel from '../../../components/ui/FieldLabel';
import {COLORS} from '../../../constants';
import {scaleRatesText} from '../../../utils/travelScaleText';

const styles = {
  wrapper: 'flex flex-col gap-2',
  label: 'text-xs font-bold font-inter uppercase',
  option: 'w-full text-left border-2 rounded-xl px-4 py-3 flex flex-col gap-0.5 cursor-pointer transition-colors',
  optionTitle: 'text-sm font-bold font-inter',
  optionText: 'text-xs font-inter',
  error: 'text-xs font-inter',
};

function ScaleTypePicker({scale, value, onChange, error}) {
  return (
    <div className={styles.wrapper}>
      <FieldLabel text="Tipo de la Escala de Viáticos" required className={styles.label} />
      {scale.map((row) => {
        const selected = value === row.tipo;
        return (
          <button key={row.tipo} type="button" className={styles.option} onClick={() => onChange(row.tipo)}
            style={{borderColor: selected ? COLORS.primary : COLORS.dataFields, backgroundColor: selected ? COLORS.backgroundHeader : COLORS.background}}>
            <span className={styles.optionTitle} style={{color: selected ? COLORS.primary : COLORS.text}}>Tipo {row.tipo} · {row.descripcion}</span>
            <span className={styles.optionText} style={{color: COLORS.labels}}>{scaleRatesText(row)}</span>
            <span className={styles.optionText} style={{color: COLORS.labels}}>Hospedaje: {row.hospedaje}</span>
          </button>
        );
      })}
      {error && <p className={styles.error} style={{color: COLORS.fieldError}}>{error}</p>}
    </div>
  );
}

export default ScaleTypePicker;
