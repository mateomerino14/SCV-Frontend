import ExcelImportModal from './ExcelImportModal';
import {positionImportTexts} from '../../constants/importTexts';

export default {
  title: 'UI/ExcelImportModal',
  component: ExcelImportModal,
  parameters: {
    docs: {
      description: {
        component: 'Importación desde Excel en dos pasos: descargar la plantilla y subir el archivo. Antes de guardar muestra cada fila con lo que hará y sus errores. Los textos cambian según el catálogo (usuarios, secciones o cargos).',
      },
    },
  },
};

const preview = [
  {fila: 2, nombre: 'Jefe de Planta', tipo_viatico: 'B', estado: 'Activo', accion: 'Crear', valido: true, errores: []},
  {fila: 3, nombre: 'Gerente de Ventas', tipo_viatico: 'C', estado: '', accion: 'Actualizar', valido: true, errores: []},
  {fila: 4, nombre: 'Sin tipo', tipo_viatico: '', estado: '', accion: 'Crear', valido: false, errores: ['El tipo de viático debe ser A, B o C']},
];

const baseArgs = {
  texts: positionImportTexts, isOpen: true, fileName: '', preview: [], result: null, error: '', validRows: [], invalidRows: [], actionableRows: [],
  checking: false, importing: false, downloading: false, onClose: () => {}, onDownloadTemplate: () => {}, onSelectFile: () => {}, onConfirm: () => {},
};

export const Inicio = {args: baseArgs};

export const ConRevision = {
  args: {...baseArgs, fileName: 'cargos.xlsx', preview, validRows: preview.slice(0, 2), invalidRows: preview.slice(2), actionableRows: preview.slice(0, 2)},
};

export const Resultado = {
  args: {...baseArgs, preview, result: {creados: 1, actualizados: 1, sinCambios: 0, omitidos: [{fila: 4, errores: ['El tipo de viático debe ser A, B o C']}]}},
};
