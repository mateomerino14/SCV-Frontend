export function extractOracleAccount(categoryName) {
  if (!categoryName) {
    return '';
  }
  const match = categoryName.match(/^(\d{6})\s+(.+)$/);
  if (!match) {
    return categoryName;
  }
  return `${match[1]} ${match[2]}`;
}