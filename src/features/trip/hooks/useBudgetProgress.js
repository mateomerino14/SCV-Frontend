import useBudgetPercentage from './useBudgetPercentage';

function useBudgetProgress(trip) {
  const isInternational = trip.tipo === 'Internacional';
  const nationalExpense = trip.gastoAcumulado || 0;
  const internationalExpense = trip.gastoAcumuladoUsd || 0;
  const assignedAmount = parseFloat(trip.monto_asignado) || 0;
  const assignedAmountUsd = parseFloat(trip.monto_asignado_usd) || 0;
  const national = useBudgetPercentage(nationalExpense, assignedAmount);
  const international = useBudgetPercentage(internationalExpense, assignedAmountUsd);

  return {
    isInternational,
    nationalExpense, assignedAmount, nationalPercentage: national.percentage, exceedsNational: national.exceeds,
    internationalExpense, assignedAmountUsd, internationalPercentage: international.percentage, 
    exceedsInternational: international.exceeds,
  };
}

export default useBudgetProgress;