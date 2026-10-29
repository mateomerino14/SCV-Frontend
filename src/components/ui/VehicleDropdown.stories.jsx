import {useState} from 'react';
import VehicleDropdown from './VehicleDropdown';

export default {
  title: 'UI/VehicleDropdown',
  component: VehicleDropdown,
  parameters: {
    docs: {
      description: {
        component: 'Lista desplegable de los vehículos de la empresa que están libres, con su placa y descripción.',
      },
    },
  },
};

const vehicles = [
  {id_vehiculo: 1, placa: '2345-ABC', descripcion: 'Camioneta Toyota Hilux'},
  {id_vehiculo: 2, placa: '3456-BCD', descripcion: 'Vagoneta Nissan Patrol'},
  {id_vehiculo: 3, placa: '4567-CDE', descripcion: null},
];

export const Interactive = {
  render: () => {
    const [selectedVehicle, setSelectedVehicle] = useState('');
    return (
      <div style={{width: 300}}>
        <VehicleDropdown vehicles={vehicles} selectedVehicle={selectedVehicle} onSelect={setSelectedVehicle} />
      </div>
    );
  },
};
