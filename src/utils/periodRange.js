export const periodOptions = [
  {value: 'mes', label: 'Este mes'},
  {value: 'anio', label: 'Este año'},
  {value: 'todo', label: 'Todo'},
  {value: 'rango', label: 'Personalizado'},
];

const pad = (number) => String(number).padStart(2, '0');

// Fecha local en formato YYYY-MM-DD (sin pasar por UTC)
export const toDateText = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const getPresetRange = (preset) => {
  const today = new Date();
  if (preset === 'mes') {
    return {
      fecha_inicio: toDateText(new Date(today.getFullYear(), today.getMonth(), 1)),
      fecha_fin: toDateText(new Date(today.getFullYear(), today.getMonth() + 1, 0)),
    };
  }
  if (preset === 'anio') {
    return {fecha_inicio: `${today.getFullYear()}-01-01`, fecha_fin: `${today.getFullYear()}-12-31`};
  }
  return {fecha_inicio: '', fecha_fin: ''};
};
