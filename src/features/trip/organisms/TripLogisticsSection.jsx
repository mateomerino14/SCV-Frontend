import OptionSelector from '../molecules/OptionSelector';
import CompanyVehicleFields from '../molecules/CompanyVehicleFields';
import useAvailableVehicles from '../../../hooks/trip/useAvailableVehicles';
import {lodgingOptions} from '../../../hooks/trip/useTripLogistics';

function TripLogisticsSection({logistics, tripId}) {
  const {vehicles, loadingVehicles, vehiclesError} = useAvailableVehicles(logistics.usesCompanyVehicle, tripId);
  return (
    <>
      {logistics.usesCompanyVehicle && (
        <CompanyVehicleFields vehicles={vehicles} loading={loadingVehicles} loadError={vehiclesError}
          selectedVehicle={logistics.vehicleId} onSelectVehicle={logistics.handleVehicleChange}
          fuelAmount={logistics.fuelAmount} onFuelChange={logistics.handleFuelChange} errors={logistics.logisticsErrors} />
      )}
      <OptionSelector label="Gestión de Hospedaje" required options={lodgingOptions} value={logistics.lodging} onChange={logistics.setLodging}
        hint="Empresa: la empresa reserva el hotel. Propio: lo reservas tú y lo rindes como gasto." />
    </>
  );
}

export default TripLogisticsSection;
