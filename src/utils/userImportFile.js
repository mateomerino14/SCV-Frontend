import {buildImportTemplate, downloadImportTemplate, readImportRows, parseImportFile} from './excelImportFile';

const roleNames = ['EMPLEADO', 'SUPERVISOR', 'APROBADOR', 'REVISOR', 'ADMINISTRADOR'];

export const importColumns = [
  {key: 'nombre', header: 'Nombre', required: true, width: 20, example: 'Juan Carlos'},
  {key: 'apellido_paterno', header: 'Apellido paterno', required: true, width: 20, example: 'Pérez'},
  {key: 'apellido_materno', header: 'Apellido materno', width: 20, example: 'Rojas'},
  {key: 'email_corporativo', header: 'Correo corporativo', required: true, width: 32, example: 'juan.perez@maxam.com'},
  {key: 'carnet_identidad', header: 'CI', width: 14, example: '1234567'},
  {key: 'telefono', header: 'Teléfono', width: 12, example: '71234567'},
  {key: 'cargo', header: 'Cargo', required: true, width: 34, list: 'positions'},
  {key: 'seccion', header: 'Sección', width: 24, list: 'sections'},
  {key: 'rol', header: 'Rol', width: 16, list: 'roles', example: 'EMPLEADO'},
  {key: 'correo_jefe', header: 'Correo del jefe directo', width: 32, example: 'jefe.area@maxam.com'},
  {key: 'codigo_dependencia', header: 'Dependencia Oracle', width: 14, example: '421'},
];

const userImportConfig = {
  sheetName: 'USUARIOS',
  fileName: 'PLANTILLA_USUARIOS',
  columns: importColumns,
  emptyMessage: 'El archivo no tiene personas para importar',
  instructions: [
    'Cómo llenar la plantilla',
    '1. Una fila por persona, desde la fila 3 de la hoja USUARIOS. La fila 2 es un ejemplo: bórrala o reemplázala.',
    '2. Las columnas en rojo son obligatorias (Nombre, Apellido paterno, Correo corporativo y Cargo).',
    '3. Cargo, Sección y Rol se eligen de la lista. Si el Rol queda vacío, la persona entra como EMPLEADO. La sección también se puede escribir solo con su código de Oracle (por ejemplo 230).',
    '4. El jefe directo se indica con su correo: puede ser alguien que ya está en el sistema o alguien de este mismo archivo.',
    '5. Dependencia Oracle: 3 dígitos (por ejemplo 421). Va en el jefe; quien no tiene jefe, como el gerente general, lleva la suya.',
    '6. Antes de crear nada, el sistema muestra cada fila con sus errores: correos o CI repetidos en el archivo o que ya existen, cargos que no existen, jefes que no se encuentran, etc. Solo se crean las filas correctas.',
    '7. Cada usuario nuevo recibe por correo una contraseña temporal y la cambia al ingresar por primera vez.',
  ],
};

export const sectionOption = (section) => {
  if (section.codigo_seccion) {
    return `${section.codigo_seccion} - ${section.nombre}`;
  }
  return section.nombre;
};

const userImportLists = ({positions = [], sections = []}) => ({
  positions: positions.filter((position) => position.activo).map((position) => position.nombre).sort(),
  sections: sections.filter((section) => section.activo).map(sectionOption).sort(),
  roles: roleNames,
});

export const buildUserImportTemplate = (workbook, catalogs) => buildImportTemplate(workbook, userImportConfig, userImportLists(catalogs));

export const downloadUserImportTemplate = (catalogs) => downloadImportTemplate(userImportConfig, userImportLists(catalogs));

export const readUserImportRows = (sheet) => readImportRows(sheet, userImportConfig);

export const parseUserImportFile = (file) => parseImportFile(file, userImportConfig);
