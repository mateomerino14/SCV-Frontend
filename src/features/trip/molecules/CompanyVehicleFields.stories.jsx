import {useState} from 'react';
import CompanyVehicleFields from './CompanyVehicleFields';

export default {
  title: 'Trip/Molecules/CompanyVehicleFields',
  component: CompanyVehicleFields,
  parameters: {
    docs: {
      description: {
        component: 'Campos del viaje en vehículo de la empresa: la lista de vehículos libres y el fondo aparte para combustible.',
      },
    },
  },
};

const vehicles = [
  {id_vehiculo: 1, placa: '2345-ABC', descripcion: 'Camioneta Toyota Hilux'},
  {id_vehiculo: 2, placa: '3456-BCD', descripcion: 'Vagoneta Nissan Patrol'},
];

export const Interactive = {
  render: () => {
    const [vehicle, setVehicle] = useState('');
    const [fuel, setFuel] = useState('');
    return (
      <div style={{maxWidth: 420}}>
        <CompanyVehicleFields vehicles={vehicles} selectedVehicle={vehicle} onSelectVehicle={setVehicle} fuelAmount={fuel} onFuelChange={setFuel} />
      </div>
    );
  },
};

export const SinVehiculosLibres = {
  args: {vehicles: [], selectedVehicle: '', fuelAmount: '', onSelectVehicle: () => {}, onFuelChange: () => {}},
};

export const ConErrores = {
  args: {vehicles, selectedVehicle: '', fuelAmount: '-5', onSelectVehicle: () => {}, onFuelChange: () => {}, errors: {vehicle: 'Elige el vehículo de la empresa', fuel: 'El monto debe ser mayor o igual a cero'}},
};
