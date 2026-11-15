import {pluralOf} from '../utils/plural';

const countLabel = (count, singular, plural) => `${count} ${pluralOf(count, singular, plural)}`;

const statusDetail = (row) => {
  if (row.estado) {
    return row.estado;
  }
  if (row.accion === 'Crear') {
    return 'Activo';
  }
  return 'Estado sin cambio';
};

const catalogResultText = (singular, plural) => (result) => {
  const parts = [`Se crearon ${countLabel(result.creados, singular, plural)}`, `se actualizaron ${result.actualizados}`];
  if (result.sinCambios > 0) {
    parts.push(`${result.sinCambios} ya estaban igual`);
  }
  return `${parts.join(', ')}.`;
};

export const userImportTexts = {
  title: 'Importar usuarios',
  subtitle: 'Carga varias personas a la vez desde Excel. Antes de crear nada se revisa cada fila y solo se crean las correctas.',
  templateHint: 'Trae las listas de cargos, secciones y roles del sistema.',
  fileHint: 'Excel (.xlsx), hasta 500 personas.',
  validLabel: (count) => countLabel(count, 'lista para crear', 'listas para crear'),
  confirmLabel: (count) => `Crear ${countLabel(count, 'usuario', 'usuarios')}`,
  resultText: (result) => `Se crearon ${countLabel(result.creados, 'usuario', 'usuarios')}. Cada uno recibirá por correo su contraseña temporal.`,
  rowTitle: (row) => row.nombre || 'Sin nombre',
  rowDetail: (row) => {
    let detail = `${row.email_corporativo || 'Sin correo'} · ${row.cargo || 'Sin cargo'} · ${row.rol || 'EMPLEADO'}`;
    if (row.correo_jefe) {
      detail += ` · Jefe: ${row.correo_jefe}`;
    }
    return detail;
  },
};

export const sectionImportTexts = {
  title: 'Importar secciones',
  subtitle: 'Carga o actualiza varias secciones a la vez desde Excel. Se reconocen por su código de Oracle: las nuevas se crean y las que ya existen se actualizan.',
  templateHint: 'Columnas: Sección Oracle, Sección y Estado. También sirve el Excel que exporta esta pantalla.',
  fileHint: 'Excel (.xlsx), hasta 500 secciones.',
  validLabel: (count) => countLabel(count, 'fila correcta', 'filas correctas'),
  confirmLabel: (count) => `Guardar ${countLabel(count, 'sección', 'secciones')}`,
  resultText: catalogResultText('sección', 'secciones'),
  rowTitle: (row) => `${row.codigo_seccion || '—'} · ${row.nombre || 'Sin nombre'}`,
  rowDetail: statusDetail,
};

export const positionImportTexts = {
  title: 'Importar cargos',
  subtitle: 'Carga o actualiza varios cargos a la vez desde Excel con su tipo de la escala de viáticos. Los que ya existen se reconocen por el nombre.',
  templateHint: 'Columnas: Cargo, Tipo de viático (A, B o C) y Estado. También sirve el Excel que exporta esta pantalla.',
  fileHint: 'Excel (.xlsx), hasta 500 cargos.',
  validLabel: (count) => countLabel(count, 'fila correcta', 'filas correctas'),
  confirmLabel: (count) => `Guardar ${countLabel(count, 'cargo', 'cargos')}`,
  resultText: catalogResultText('cargo', 'cargos'),
  rowTitle: (row) => row.nombre || 'Sin nombre',
  rowDetail: (row) => `Tipo ${row.tipo_viatico || '—'} · ${statusDetail(row)}`,
};
