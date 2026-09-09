export function toOracleExpenseType(internalType) {
  if (internalType === 'S') {
    return 'A';
  }
  return internalType;
}