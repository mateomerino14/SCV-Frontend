const controlCharacters = /\p{Cc}/gu;

export const removeControlCharacters = (value) => String(value || '').replace(controlCharacters, '');
