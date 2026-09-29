import SearchableSelector from './SearchableSelector';

const noBoss = {value: '', label: 'Sin jefe directo asignado'};

function BossSelector({users, bossId, onChange, error}) {
  // Solo usuarios activos, salvo el jefe que ya tiene asignado (para no perderlo al editar)
  const options = users
    .filter((user) => user.activo !== false || String(user.id_usuario) === String(bossId))
    .sort((first, second) => `${first.nombre} ${first.apellido_paterno}`.localeCompare(`${second.nombre} ${second.apellido_paterno}`))
    .map((user) => {
      const fullName = `${user.nombre} ${user.apellido_paterno}`;
      return {value: user.id_usuario, label: `${fullName} (${user.Rol?.nombre || 'Sin rol'})`, searchText: `${fullName} ${user.Rol?.nombre || ''}`};
    });
  return (
    <SearchableSelector label="Jefe Directo (opcional)" options={options} value={bossId ?? ''} onChange={onChange} error={error}
      placeholder={noBoss.label} searchPlaceholder="Buscar por nombre o rol..." emptyOption={noBoss} />
  );
}

export default BossSelector;
