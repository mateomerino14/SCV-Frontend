function useBudgetPercentage(expense, assignedAmount) {
  let percentage = 0;
  if (assignedAmount > 0) {
    percentage = Math.min((expense / assignedAmount) * 100, 100);
  }
  else if (expense > 0) {
    percentage = 100;
  }

  let exceeds = percentage >= 100;
  if (assignedAmount === 0) {
    exceeds = expense > 0;
  }

  return {percentage, exceeds};
}

export default useBudgetPercentage;