// Genera el codigo unico de un viaje; debe coincidir con buildTripCode del backend
function buildTripCode(trip) {
  const tripId = trip.id_viaje || trip.id;
  const referenceDate = trip.fecha_inicio ? new Date(`${trip.fecha_inicio}T00:00:00`) : new Date();
  const year = referenceDate.getFullYear();
  return `VIA-${tripId}/${year}`;
}

export default buildTripCode;
