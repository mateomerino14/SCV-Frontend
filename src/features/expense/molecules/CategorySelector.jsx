import {Info} from 'lucide-react';
import SearchableSelector from '../../../components/ui/SearchableSelector';
import {COLORS} from '../../../constants';

const styles = {
  wrapper: "flex flex-col gap-1",
  label: "text-xs font-bold font-inter uppercase mb-1",
  disabledWrapper: "rounded-xl px-4 py-3 border flex items-center justify-between",
  disabledText: "text-sm font-inter",
  disabledIcon: "text-xs font-inter",
  help: "flex gap-1.5 text-[11px] font-inter leading-snug mt-1",
};

function CategorySelector({categories, categoryId, onChange, error, disabled}) {
  const selectedCategory = categories.find((category) => category.id_categoria === categoryId);
  const options = categories.map((category) => ({
    value: category.id_categoria, label: category.nombre, description: category.descripcion,
    searchText: `${category.nombre} ${category.descripcion || ''}`,
  }));
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
    <div className={styles.wrapper}>
      <SearchableSelector label="Categoría" options={options} value={categoryId ?? ''} onChange={onChange} error={error}
        placeholder="Seleccione una Categoría" searchPlaceholder="Busca por cuenta, nombre o para qué se usa..." />
      {selectedCategory?.descripcion && (
        <p className={styles.help} style={{color: COLORS.labels}}>
          <Info size={12} className="shrink-0 mt-0.5" style={{color: COLORS.primary}} />
          <span>{selectedCategory.descripcion}</span>
        </p>
      )}
    </div>
  );
}

export default CategorySelector;
