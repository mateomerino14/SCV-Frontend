export const lodgingLabel = (trip) => {
  if (trip?.gestion_hospedaje === 'Empresa') {
    return 'Lo reserva la empresa';
  }
  return 'Lo gestiona el empleado';
};

export const fuelAmountOf = (trip) => parseFloat(trip?.monto_combustible || 0);
