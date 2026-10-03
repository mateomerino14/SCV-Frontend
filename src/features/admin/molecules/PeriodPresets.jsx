import {COLORS} from '../../../constants';

const styles = {
  chips: 'grid grid-cols-2 sm:grid-cols-4 gap-2',
  chip: 'py-2 rounded-xl text-sm font-bold font-nunito cursor-pointer border transition-colors text-center',
};

function PeriodPresets({options, selected, onSelect, disabled = false}) {
  return (
    <div className={styles.chips}>
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button key={option.value} className={styles.chip} onClick={() => onSelect(option.value)} disabled={disabled}
            style={{backgroundColor: isSelected ? COLORS.primary : 'transparent', borderColor: isSelected ? COLORS.primary : COLORS.fields, color: isSelected ? COLORS.background : COLORS.labels}}>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default PeriodPresets;
