import {Fuel} from 'lucide-react';
import FieldLabel from '../../../components/ui/FieldLabel';
import InputField from '../../../components/ui/InputField';
import VehicleDropdown from '../../../components/ui/VehicleDropdown';
import {COLORS} from '../../../constants';

const styles = {
  wrapper: 'flex flex-col gap-4 rounded-xl p-4',
  vehicleGroup: 'flex flex-col gap-1',
  label: 'text-xs font-bold font-inter uppercase mb-1',
  input: 'bg-transparent w-full outline-none font-inter text-sm',
  message: 'text-xs font-inter',
  fieldError: 'text-xs font-inter mt-1',
};

function CompanyVehicleFields({vehicles, loading, loadError, selectedVehicle, onSelectVehicle, fuelAmount, onFuelChange, errors = {}}) {
  let vehiclePicker = <VehicleDropdown vehicles={vehicles} selectedVehicle={selectedVehicle} onSelect={onSelectVehicle} />;
  if (loading) {
    vehiclePicker = <p className={styles.message} style={{color: COLORS.labels}}>Cargando vehículos libres...</p>;
  }
  else if (loadError) {
    vehiclePicker = <p className={styles.message} style={{color: COLORS.fieldError}}>{loadError}</p>;
  }
  else if (vehicles.length === 0) {
    vehiclePicker = <p className={styles.message} style={{color: COLORS.labels}}>No hay vehículos libres: todos están en otro viaje o suspendidos.</p>;
  }
  return (
    <div className={styles.wrapper} style={{backgroundColor: COLORS.backgroundHeader}}>
      <div className={styles.vehicleGroup}>
        <FieldLabel text="Vehículo de la Empresa" required className={styles.label} />
        {vehiclePicker}
        {errors.vehicle && <p className={styles.fieldError} style={{color: COLORS.fieldError}}>{errors.vehicle}</p>}
      </div>
      <InputField label="Fondo para Combustible (Bs)" icon={<Fuel size={16} style={{color: COLORS.primary}} />} error={errors.fuel}>
        <input type="number" inputMode="decimal" min="0" step="0.01" placeholder="0.00" className={styles.input} style={{color: COLORS.text}}
          value={fuelAmount} onChange={(event) => onFuelChange(event.target.value)} aria-label="Fondo para combustible" />
      </InputField>
      <p className={styles.message} style={{color: COLORS.labels}}>El combustible es un monto aparte de los viáticos: se suma al fondo del viaje y la gasolina no cuenta en el control diario.</p>
    </div>
  );
}

export default CompanyVehicleFields;
