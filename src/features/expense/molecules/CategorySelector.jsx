import InlineDropdown from '../../../components/ui/InlineDropdown';
import {COLORS} from '../../../constants';
import useSimpleSelector from '../../../hooks/shared/useSimpleSelector';

const styles = {
  wrapper: "flex flex-col gap-1",
  label: "text-xs font-bold font-inter uppercase mb-1",
  fieldError: "text-xs font-inter mt-1",
};

function CategorySelector({categories, categoryId, onChange, error}) {
  const {open, opensUpward, wrapperRef, triggerRef, toggle, close} = useSimpleSelector();

  const selectedCategory = categories.find((category) => category.id_categoria === categoryId);
  const options = categories.map((category) => ({value: category.id_categoria, label: category.nombre}));

  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{color: COLORS.labels}}>Categoría</p>
      <InlineDropdown wrapperRef={wrapperRef} triggerRef={triggerRef} open={open} opensUpward={opensUpward} onToggle={toggle}
        label={selectedCategory ? selectedCategory.nombre : 'Seleccione una Categoría'} options={options} selectedValue={categoryId}
        onSelect={(value) => {onChange(value); close();}} />
      {error && <p className={styles.fieldError} style={{color: '#ef4444'}}>{error}</p>}
    </div>
  );
}

export default CategorySelector;