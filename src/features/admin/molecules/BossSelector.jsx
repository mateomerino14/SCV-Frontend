import InlineDropdown from '../../../components/ui/InlineDropdown';
import {COLORS} from '../../../constants';
import useSimpleSelector from '../../../hooks/shared/useSimpleSelector';

const styles = {
  wrapper: "flex flex-col gap-1",
  label: "text-xs font-bold font-inter uppercase mb-1",
  fieldError: "text-xs font-inter mt-1",
};

function BossSelector({users, bossId, onChange, error}) {
  const {open, opensUpward, wrapperRef, triggerRef, toggle, close} = useSimpleSelector();
  const selectedBoss = users.find((user) => user.id_usuario === bossId);
  const options = [
    {value: '', label: 'Sin jefe directo asignado'},
    ...users.map((user) => ({value: user.id_usuario, label: `${user.nombre} ${user.apellido_paterno} (${user.Rol?.nombre || 'Sin rol'})`})),
  ];
  const label = selectedBoss ? `${selectedBoss.nombre} ${selectedBoss.apellido_paterno}` : 'Sin jefe directo asignado';
  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{color: COLORS.labels}}>Jefe Directo (opcional)</p>
      <InlineDropdown wrapperRef={wrapperRef} triggerRef={triggerRef} open={open} opensUpward={opensUpward} onToggle={toggle}
        label={label} options={options} selectedValue={bossId}
        onSelect={(value) => {onChange(value); close();}} />
      {error && <p className={styles.fieldError} style={{color: '#ef4444'}}>{error}</p>}
    </div>
  );
}

export default BossSelector;
