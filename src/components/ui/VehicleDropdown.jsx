import {Car} from 'lucide-react';
import InlineDropdown from './InlineDropdown';
import useSimpleSelector from '../../hooks/shared/useSimpleSelector';
import {COLORS} from '../../constants';

function VehicleDropdown({vehicles, selectedVehicle, onSelect, placeholder = 'Elige un vehículo libre', error}) {
  const {open, opensUpward, wrapperRef, triggerRef, toggle, close} = useSimpleSelector();
  const options = vehicles.map((vehicle) => ({value: vehicle.id_vehiculo, label: [vehicle.placa, vehicle.descripcion].filter(Boolean).join(' — ')}));
  const selected = options.find((option) => String(option.value) === String(selectedVehicle));
  let label = placeholder;
  if (selected) {
    label = selected.label;
  }

  return (
    <InlineDropdown wrapperRef={wrapperRef} triggerRef={triggerRef} open={open} opensUpward={opensUpward} onToggle={toggle}
      label={label} options={options} selectedValue={selectedVehicle} hasValue={!!selected} error={error} asField
      icon={<Car size={16} style={{color: COLORS.primary}} />}
      onSelect={(value) => {onSelect(value); close();}} />
  );
}

export default VehicleDropdown;
