function useTripBalance(accumulatedExpense, assignedAmount) {
  const difference = parseFloat(assignedAmount) - accumulatedExpense;
  const hasSurplus = difference > 0;
  return {difference, hasSurplus};
}

export default useTripBalance;