import SearchableSelector from './SearchableSelector';

const noSection = {value: '', label: 'Sin sección asignada'};

function SectionSelector({sections, sectionId, onChange, error}) {
  const options = sections
    .filter((section) => section.activo)
    .sort((first, second) => first.nombre.localeCompare(second.nombre))
    .map((section) => ({value: section.id_seccion, label: section.nombre}));
  return (
    <SearchableSelector label="Sección (opcional)" options={options} value={sectionId ?? ''} onChange={onChange} error={error}
      placeholder={noSection.label} searchPlaceholder="Buscar sección..." emptyOption={noSection} />
  );
}

export default SectionSelector;
