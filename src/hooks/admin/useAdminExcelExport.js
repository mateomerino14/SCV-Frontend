import {useState} from 'react';
import ExcelJS from 'exceljs';
import {getUsers} from '../../services/admin/adminService';
import {addTableSheet, saveWorkbook, todayFileSuffix, amountFormat} from '../../utils/excelExport';
import {approvalPhaseStats, expensePhaseStats, rejectedStat} from '../../features/admin/constants/tripPhaseStats';

const statusText = (active) => {
  if (active === false) {
    return 'Suspendido';
  }
  return 'Activo';
};

const personName = (person) => {
  if (!person) {
    return '';
  }
  return `${person.nombre} ${person.apellido_paterno}`;
};

const countBy = (users, key) => {
  if (!Array.isArray(users)) {
    return {};
  }
  return users.reduce((counts, user) => {
    const id = user[key];
    counts[id] = (counts[id] || 0) + 1;
    return counts;
  }, {});
};

const periodText = (period) => {
  if (period?.fecha_inicio && period?.fecha_fin) {
    return `${period.fecha_inicio} al ${period.fecha_fin}`;
  }
  return 'Todo el historial';
};

function useAdminExcelExport() {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const runExport = async (buildWorkbook) => {
    setExporting(true);
    setExportError('');
    try {
      await buildWorkbook();
    }
    catch {
      setExportError('No se pudo generar el archivo de Excel. Intenta nuevamente.');
    }
    finally {
      setExporting(false);
    }
  };

  const exportUsers = (users) => runExport(async () => {
    const workbook = new ExcelJS.Workbook();
    addTableSheet(workbook, 'Usuarios', [
      {header: 'Nombre', key: 'nombre', width: 28},
      {header: 'Correo', key: 'correo', width: 32},
      {header: 'Teléfono', key: 'telefono', width: 14},
      {header: 'CI', key: 'ci', width: 14},
      {header: 'Dependencia Oracle', key: 'dependencia', width: 12},
      {header: 'Rol', key: 'rol', width: 16},
      {header: 'Cargo', key: 'cargo', width: 24},
      {header: 'Sección', key: 'seccion', width: 20},
      {header: 'Jefe directo', key: 'jefe', width: 26},
      {header: 'Estado', key: 'estado', width: 12},
    ], users.map((user) => ({
      nombre: personName(user),
      correo: user.email_corporativo,
      telefono: user.telefono || '',
      ci: user.carnet_identidad || '',
      dependencia: user.codigo_dependencia || '',
      rol: user.Rol?.nombre || '',
      cargo: user.Cargo?.nombre || '',
      seccion: user.Seccion?.nombre || '',
      jefe: personName(user.Jefe),
      estado: statusText(user.activo),
    })));
    await saveWorkbook(workbook, `Usuarios_${todayFileSuffix()}.xlsx`);
  });

  const exportPositions = (positions) => runExport(async () => {
    const users = await getUsers();
    const counts = countBy(users, 'id_cargo');
    const workbook = new ExcelJS.Workbook();
    addTableSheet(workbook, 'Cargos', [
      {header: 'Cargo', key: 'nombre', width: 30},
      {header: 'Tarifa diaria Bs', key: 'tarifaBs', width: 16, numFmt: amountFormat},
      {header: 'Tarifa diaria USD', key: 'tarifaUsd', width: 16, numFmt: amountFormat},
      {header: 'Usuarios', key: 'usuarios', width: 11},
      {header: 'Estado', key: 'estado', width: 12},
    ], positions.map((position) => ({
      nombre: position.nombre,
      tarifaBs: parseFloat(position.monto_diario) || 0,
      tarifaUsd: parseFloat(position.monto_diario_usd) || 0,
      usuarios: counts[position.id_cargo] || 0,
      estado: statusText(position.activo),
    })));
    await saveWorkbook(workbook, `Cargos_${todayFileSuffix()}.xlsx`);
  });

  const exportSections = (sections) => runExport(async () => {
    const users = await getUsers();
    const counts = countBy(users, 'id_seccion');
    const workbook = new ExcelJS.Workbook();
    addTableSheet(workbook, 'Secciones', [
      {header: 'Sección', key: 'nombre', width: 30},
      {header: 'Sección Oracle', key: 'codigoSeccion', width: 12},
      {header: 'Usuarios', key: 'usuarios', width: 11},
      {header: 'Estado', key: 'estado', width: 12},
    ], sections.map((section) => ({
      nombre: section.nombre,
      codigoSeccion: section.codigo_seccion || '',
      usuarios: counts[section.id_seccion] || 0,
      estado: statusText(section.activo),
    })));
    await saveWorkbook(workbook, `Secciones_${todayFileSuffix()}.xlsx`);
  });

  const exportDashboard = (data, period) => runExport(async () => {
    const workbook = new ExcelJS.Workbook();
    const phaseRow = (phase) => (stat) => ({fase: phase, estado: stat.label, cantidad: data?.[stat.key] || 0});
    addTableSheet(workbook, 'Indicadores', [
      {header: 'Indicador', key: 'indicador', width: 34},
      {header: 'Valor', key: 'valor', width: 22},
    ], [
      {indicador: 'Periodo (fecha de inicio del viaje)', valor: periodText(period)},
      {indicador: 'Usuarios', valor: data?.totalUsuarios || 0},
      {indicador: 'Usuarios activos', valor: data?.usuariosActivos || 0},
      {indicador: 'Cargos', valor: data?.totalCargos || 0},
      {indicador: 'Cargos activos', valor: data?.cargosActivos || 0},
    ]);
    addTableSheet(workbook, 'Viajes por estado', [
      {header: 'Fase', key: 'fase', width: 26},
      {header: 'Estado', key: 'estado', width: 26},
      {header: 'Viajes', key: 'cantidad', width: 10},
    ], [
      ...approvalPhaseStats.map(phaseRow('Aprobación del viaje')),
      ...expensePhaseStats.map(phaseRow('Rendición de gastos')),
      phaseRow('Rechazados')(rejectedStat),
    ]);
    addTableSheet(workbook, 'Viajes por sección', [
      {header: 'Sección', key: 'seccion', width: 26},
      {header: 'Viajes con fondos', key: 'cantidadViajes', width: 16},
      {header: 'Monto asignado Bs', key: 'montoAsignado', width: 18, numFmt: amountFormat},
      {header: 'Monto asignado USD', key: 'montoAsignadoUsd', width: 18, numFmt: amountFormat},
    ], data?.viajesPorSeccion || []);
    addTableSheet(workbook, 'Usuarios por rol', [
      {header: 'Rol', key: 'nombre', width: 22},
      {header: 'Usuarios', key: 'cantidad', width: 11},
    ], data?.usuariosPorRol || []);
    addTableSheet(workbook, 'Usuarios por sección', [
      {header: 'Sección', key: 'seccion', width: 26},
      {header: 'Usuarios', key: 'cantidad', width: 11},
    ], data?.usuariosPorSeccion || []);
    await saveWorkbook(workbook, `Resumen_General_${todayFileSuffix()}.xlsx`);
  });

  return {exporting, exportError, exportUsers, exportPositions, exportSections, exportDashboard};
}

export default useAdminExcelExport;
