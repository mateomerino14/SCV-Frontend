import {buildImportTemplate, downloadImportTemplate, readImportRows, parseImportFile} from './excelImportFile';

const statusOptions = ['Activo', 'Suspendido'];
const defaultScaleTypes = ['A', 'B', 'C'];

const sectionImportConfig = {
  sheetName: 'SECCIONES',
  fileName: 'PLANTILLA_SECCIONES',
  emptyMessage: 'El archivo no tiene secciones para importar',
  columns: [
    {key: 'codigo_seccion', header: 'Sección Oracle', aliases: ['Código', 'Codigo de seccion'], required: true, width: 16, example: '999'},
    {key: 'nombre', header: 'Sección', aliases: ['Nombre'], required: true, width: 50, example: 'SECCIÓN DE EJEMPLO'},
    {key: 'estado', header: 'Estado', width: 14, list: 'status', example: 'Activo'},
  ],
  instructions: [
    'Cómo llenar la plantilla de secciones',
    '1. Una fila por sección, desde la fila 3 de la hoja SECCIONES. La fila 2 es un ejemplo: bórrala o reemplázala.',
    '2. Sección Oracle: el código de 3 dígitos del segmento de sección de la cuenta (por ejemplo 220). Sección: el nombre tal como figura en Oracle.',
    '3. Si el código ya existe, se actualiza el nombre de esa sección; si no existe, se crea una sección nueva.',
    '4. Estado: Activo o Suspendido. Si queda vacío, una sección nueva entra activa y una existente queda como está.',
    '5. También puedes subir el Excel que exporta la pantalla de Secciones: las columnas que sobran se ignoran.',
    '6. Antes de guardar nada, el sistema muestra cada fila con lo que va a hacer y sus errores. Solo se guardan las filas correctas.',
  ],
};

const positionImportConfig = {
  sheetName: 'CARGOS',
  fileName: 'PLANTILLA_CARGOS',
  emptyMessage: 'El archivo no tiene cargos para importar',
  columns: [
    {key: 'nombre', header: 'Cargo', aliases: ['Nombre'], required: true, width: 50, example: 'Cargo de ejemplo'},
    {key: 'tipo_viatico', header: 'Tipo de viático', aliases: ['Tipo'], required: true, width: 16, list: 'scaleTypes', example: 'A'},
    {key: 'estado', header: 'Estado', width: 14, list: 'status', example: 'Activo'},
  ],
  instructions: [
    'Cómo llenar la plantilla de cargos',
    '1. Una fila por cargo, desde la fila 3 de la hoja CARGOS. La fila 2 es un ejemplo: bórrala o reemplázala.',
    '2. Cargo: el nombre tal como figura en la empresa y en Oracle.',
    '3. Tipo de viático: la letra del tipo de la escala de viáticos (pantalla Cargos), por ejemplo C para Gerente General y Gerentes de Área, B para Jefes de Área y A para el resto del personal.',
    '4. Si el cargo ya existe (mismo nombre, sin importar mayúsculas ni tildes), se actualiza su tipo; si no existe, se crea.',
    '5. Estado: Activo o Suspendido. Si queda vacío, un cargo nuevo entra activo y uno existente queda como está.',
    '6. También puedes subir el Excel que exporta la pantalla de Cargos: las columnas que sobran se ignoran.',
    '7. Antes de guardar nada, el sistema muestra cada fila con lo que va a hacer y sus errores. Solo se guardan las filas correctas.',
  ],
};

const listsOf = (scaleTypes) => ({status: statusOptions, scaleTypes});

export const buildSectionImportTemplate = (workbook) => buildImportTemplate(workbook, sectionImportConfig, {status: statusOptions});

export const buildPositionImportTemplate = (workbook, scaleTypes = defaultScaleTypes) => buildImportTemplate(workbook, positionImportConfig, listsOf(scaleTypes));

export const downloadSectionImportTemplate = () => downloadImportTemplate(sectionImportConfig, {status: statusOptions});

export const downloadPositionImportTemplate = (scaleTypes = defaultScaleTypes) => downloadImportTemplate(positionImportConfig, listsOf(scaleTypes));

export const readSectionImportRows = (sheet) => readImportRows(sheet, sectionImportConfig);

export const readPositionImportRows = (sheet) => readImportRows(sheet, positionImportConfig);

export const parseSectionImportFile = (file) => parseImportFile(file, sectionImportConfig);

export const parsePositionImportFile = (file) => parseImportFile(file, positionImportConfig);
