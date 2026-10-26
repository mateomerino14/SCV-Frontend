export function formatQuantity(value) {
  const quantity = parseFloat(value);
  if (Number.isNaN(quantity)) {
    return '';
  }
  return String(parseFloat(quantity.toFixed(3)));
}

const maxPriceDecimals = 4;
const minPriceDecimals = 2;

export function formatUnitPrice(value) {
  const price = parseFloat(value);
  if (Number.isNaN(price)) {
    return '';
  }
  const [whole, decimals] = price.toFixed(maxPriceDecimals).split('.');
  let trimmed = decimals.replace(/0+$/, '');
  if (trimmed.length < minPriceDecimals) {
    trimmed = trimmed.padEnd(minPriceDecimals, '0');
  }
  return `${whole}.${trimmed}`;
}
