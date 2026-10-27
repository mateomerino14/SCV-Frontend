export const filterValidSubitems = (subitems) => subitems.filter((subitem) => subitem.description.trim() && parseFloat(subitem.amount) > 0);

export const sumSubitems = (subitems) => parseFloat(subitems.reduce((sum, subitem) => sum + parseFloat(subitem.amount || 0), 0).toFixed(2));

export const amountWithSubitems = (amount, usesSubitems, validSubitems) => {
  if (usesSubitems && validSubitems.length > 0) {
    return sumSubitems(validSubitems);
  }
  return parseFloat(amount) || 0;
};

export const validateSubitems = (subitems) => {
  const errors = {};
  subitems.forEach((subitem) => {
    const subitemErrors = {};
    if (!subitem.description.trim()) {
      subitemErrors.description = 'La descripción es requerida';
    }
    if (!subitem.amount || parseFloat(subitem.amount) <= 0) {
      subitemErrors.amount = 'El monto es requerido';
    }
    if (Object.keys(subitemErrors).length > 0) {
      errors[subitem.id] = subitemErrors;
    }
  });
  return errors;
};

export const buildSubitemsPayload = (validSubitems) => validSubitems.map((subitem) => ({
  descripcion: subitem.description.trim(),
  monto: parseFloat(subitem.amount),
}));
