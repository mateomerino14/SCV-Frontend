import InlineDropdown from '../../../components/ui/InlineDropdown';
import useTripHistoryFilter from '../hooks/useTripHistoryFilter';
import useDropdownPosition from '../hooks/useDropdownPosition';

const styles = {
  wrapper: "flex flex-col gap-2 mb-4",
  row: "flex gap-2 flex-wrap",
};

function TripHistoryFilter({activeFilter, onChange}) {
  const {categories, currentCategory, selectedCategory, handleCategoryChange, handleStateChange} = useTripHistoryFilter(activeFilter, onChange);
  const categoryDropdown = useDropdownPosition();
  const stateDropdown = useDropdownPosition();
  const selectedCategoryOption = categories.find((category) => category.value === selectedCategory);

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <InlineDropdown wrapperRef={categoryDropdown.wrapperRef} triggerRef={categoryDropdown.triggerRef} open={categoryDropdown.open}
          opensUpward={categoryDropdown.opensUpward} onToggle={categoryDropdown.toggle}
          label={selectedCategoryOption?.label || 'Seleccionar'} options={categories} selectedValue={selectedCategory}
          onSelect={(value) => {handleCategoryChange(value); categoryDropdown.toggle();}} />
        {currentCategory.states && (
          <InlineDropdown wrapperRef={stateDropdown.wrapperRef} triggerRef={stateDropdown.triggerRef} open={stateDropdown.open}
            opensUpward={stateDropdown.opensUpward} onToggle={stateDropdown.toggle}
            label={currentCategory.states.find((state) => state.value === activeFilter)?.label || 'Seleccionar'}
            options={currentCategory.states} selectedValue={activeFilter}
            onSelect={(value) => {handleStateChange(value); stateDropdown.toggle();}} />
        )}
      </div>
    </div>
  );
}

export default TripHistoryFilter;