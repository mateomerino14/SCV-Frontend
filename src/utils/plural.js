export const pluralOf = (count, singular, plural) => {
  if (count === 1) {
    return singular;
  }
  return plural;
};
