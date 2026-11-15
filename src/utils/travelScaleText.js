const formatAmount = (value) => parseFloat(value || 0).toFixed(2);

export const scaleRatesText = (scale) => {
  if (!scale) {
    return 'Sin tipo de la escala';
  }
  return `Bs ${formatAmount(scale.monto_interior)} / día · USD ${formatAmount(scale.monto_clase_1_usd)} clase 1 · USD ${formatAmount(scale.monto_clase_2_usd)} clase 2`;
};
