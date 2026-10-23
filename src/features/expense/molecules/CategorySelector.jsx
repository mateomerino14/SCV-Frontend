import SearchableSelector from '../../../components/ui/SearchableSelector';
import {COLORS} from '../../../constants';

const styles = {
  wrapper: "flex flex-col gap-1",
  label: "text-xs font-bold font-inter uppercase mb-1",
  disabledWrapper: "rounded-xl px-4 py-3 border flex items-center justify-between",
  disabledText: "text-sm font-inter",
  disabledIcon: "text-xs font-inter",
};

function CategorySelector({categories, categoryId, onChange, error, disabled}) {
  const selectedCategory = categories.find((category) => category.id_categoria === categoryId);
  const options = categories.map((category) => ({value: category.id_categoria, label: category.nombre}));
  if (disabled) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.label} style={{color: COLORS.labels}}>Categoría</p>
        <div className={styles.disabledWrapper} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.backgroundHeader}}>
          <p className={styles.disabledText} style={{color: COLORS.labels}}>{selectedCategory ? selectedCategory.nombre : '—'}</p>
          <p className={styles.disabledIcon} style={{color: COLORS.fields}}>●</p>
        </div>
      </div>
    );
  }
  return (
    <SearchableSelector label="Categoría" options={options} value={categoryId ?? ''} onChange={onChange} error={error}
      placeholder="Seleccione una Categoría" searchPlaceholder="Busca por número de cuenta o nombre..." />
  );
}

export default CategorySelector;
