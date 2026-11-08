import {Fuel} from 'lucide-react';
import FieldLabel from '../../../components/ui/FieldLabel';
import InputField from '../../../components/ui/InputField';
import SearchableSelector from '../../../components/ui/SearchableSelector';
import {COLORS} from '../../../constants';

const styles = {
  wrapper: 'flex flex-col gap-5',
  vehicleGroup: 'flex flex-col gap-1',
  label: 'text-xs font-bold font-inter uppercase mb-1',
  input: 'bg-transparent w-full outline-none font-inter text-sm',
  message: 'w-full border rounded-xl px-4 py-3 text-sm font-inter',
  hint: 'text-[11px] font-inter -mt-3',
};

const vehicleOptionOf = (vehicle) => ({
  value: vehicle.id_vehiculo,
  label: vehicle.placa,
  description: vehicle.descripcion,
  searchText: [vehicle.placa, vehicle.descripcion].filter(Boolean).join(' '),
});

function CompanyVehicleFields({vehicles, loading, loadError, selectedVehicle, onSelectVehicle, fuelAmount, onFuelChange, errors = {}}) {
  let message = null;
  if (loading) {
    message = <p className={styles.message} style={{color: COLORS.labels, borderColor: COLORS.dataFields}}>Cargando vehículos libres...</p>;
  }
  else if (loadError) {
    message = <p className={styles.message} style={{color: COLORS.fieldError, borderColor: COLORS.fieldErrorBorder}}>{loadError}</p>;
  }
  else if (vehicles.length === 0) {
    message = <p className={styles.message} style={{color: COLORS.labels, borderColor: COLORS.dataFields}}>No hay vehículos libres: todos están en otro viaje o suspendidos.</p>;
  }
  let vehiclePicker = (
    <SearchableSelector label="Vehículo de la Empresa" required options={vehicles.map(vehicleOptionOf)} value={selectedVehicle ?? ''}
      onChange={onSelectVehicle} placeholder="Elige un vehículo libre" searchPlaceholder="Busca por placa o descripción..." error={errors.vehicle} />
  );
  if (message) {
    vehiclePicker = (
      <div className={styles.vehicleGroup}>
        <FieldLabel text="Vehículo de la Empresa" required className={styles.label} />
        {message}
      </div>
    );
  }
  return (
    <div className={styles.wrapper}>
      {vehiclePicker}
      <InputField label="Fondo para Combustible (Bs)" icon={<Fuel size={16} style={{color: COLORS.primary}} />} error={errors.fuel}>
        <input type="text" inputMode="decimal" placeholder="0.00" className={styles.input} style={{color: COLORS.text}}
          value={fuelAmount} onChange={(event) => onFuelChange(event.target.value)} aria-label="Fondo para combustible" />
      </InputField>
      <p className={styles.hint} style={{color: COLORS.labels}}>Monto aparte de los viáticos: se suma al fondo del viaje y la gasolina no cuenta en el control diario.</p>
    </div>
  );
}

export default CompanyVehicleFields;
