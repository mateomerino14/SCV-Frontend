import SearchableSelector from './SearchableSelector';

function PositionSelector({positions, positionId, onChange, error}) {
  const options = positions
    .filter((position) => position.activo)
    .sort((first, second) => first.nombre.localeCompare(second.nombre))
    .map((position) => ({value: position.id_cargo, label: position.nombre}));
  return (
    <SearchableSelector label="Cargo" options={options} value={positionId} onChange={onChange} error={error}
      placeholder="Seleccionar cargo" searchPlaceholder="Buscar cargo..." />
  );
}

export default PositionSelector;
