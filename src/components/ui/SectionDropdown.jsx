import InlineDropdown from './InlineDropdown';
import useSimpleSelector from '../../hooks/shared/useSimpleSelector';

function SectionDropdown({sections, selectedSection, onSelect, placeholder = 'Todas las secciones'}) {
  const {open, opensUpward, wrapperRef, triggerRef, toggle, close} = useSimpleSelector();
  const activeSections = sections.filter((section) => section.activo !== false);
  const selected = activeSections.find((section) => String(section.id_seccion) === String(selectedSection));
  const options = [
    {value: '', label: placeholder},
    ...activeSections.map((section) => ({value: section.id_seccion, label: section.nombre})),
  ];
  const label = selected ? selected.nombre : placeholder;

  return (
    <InlineDropdown wrapperRef={wrapperRef} triggerRef={triggerRef} open={open} opensUpward={opensUpward} onToggle={toggle}
      label={label} options={options} selectedValue={selectedSection}
      onSelect={(value) => {onSelect(value); close();}} />
  );
}

export default SectionDropdown;
