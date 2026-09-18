import InlineDropdown from '../../../components/ui/InlineDropdown';
import {COLORS} from '../../../constants';
import useSimpleSelector from '../../../hooks/shared/useSimpleSelector';

const styles = {
  wrapper: "flex flex-col gap-1",
  label: "text-xs font-bold font-inter uppercase mb-1",
  fieldError: "text-xs font-inter mt-1",
};

function SectionSelector({sections, sectionId, onChange, error}) {
  const {open, opensUpward, wrapperRef, triggerRef, toggle, close} = useSimpleSelector();
  const activeSections = sections.filter((section) => section.activo);
  const selectedSection = activeSections.find((section) => section.id_seccion === sectionId);
  const options = [
    {value: '', label: 'Sin sección asignada'},
    ...activeSections.map((section) => ({value: section.id_seccion, label: section.nombre})),
  ];
  const label = selectedSection ? selectedSection.nombre : 'Sin sección asignada';
  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{color: COLORS.labels}}>Sección (opcional)</p>
      <InlineDropdown wrapperRef={wrapperRef} triggerRef={triggerRef} open={open} opensUpward={opensUpward} onToggle={toggle}
        label={label} options={options} selectedValue={sectionId}
        onSelect={(value) => {onChange(value); close();}} />
      {error && <p className={styles.fieldError} style={{color: '#ef4444'}}>{error}</p>}
    </div>
  );
}

export default SectionSelector;
