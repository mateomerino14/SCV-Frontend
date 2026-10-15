export function formatQuantity(value) {
  const quantity = parseFloat(value);
  if (Number.isNaN(quantity)) {
    return '';
  }
  return String(parseFloat(quantity.toFixed(2)));
}
