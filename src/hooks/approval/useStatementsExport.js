import {useState} from 'react';
import ExcelJS from 'exceljs';
import {getStatementsForExport} from '../../services/trip/tripService';
import {addStatementSheet} from '../../pages/hooks/useTripExcelExport';
import {addOracleSheets} from '../../utils/oracleExport';
import {addTableSheet, saveWorkbook, todayFileSuffix, amountFormat} from '../../utils/excelExport';
import {buildDayJustifications} from '../../utils/dayJustifications';
import {getStatusLabel} from '../../constants/tripStatusLabels';
import buildTripCode from '../../utils/tripCode';
import {summarizeStatement} from '../../utils/expenseCurrency';

const summaryColumns = [
  {header: 'Código', key: 'codigo', width: 14},
  {header: 'Empleado', key: 'empleado', width: 26},
  {header: 'Sección', key: 'seccion', width: 18},
  {header: 'Motivo', key: 'motivo', width: 28},
  {header: 'Destino', key: 'destino', width: 20},
  {header: 'Tipo', key: 'tipo', width: 13},
  {header: 'Inicio', key: 'inicio', width: 12},
  {header: 'Fin', key: 'fin', width: 12},
  {header: 'Estado', key: 'estado', width: 22},
  {header: 'Asignado Bs', key: 'asignadoBs', width: 14, numFmt: amountFormat, total: true},
  {header: 'Gastado Bs', key: 'gastadoBs', width: 14, numFmt: amountFormat, total: true},
  {header: 'Saldo Bs', key: 'saldoBs', width: 14, numFmt: amountFormat, total: true},
  {header: 'Asignado USD', key: 'asignadoUsd', width: 14, numFmt: amountFormat, total: true},
  {header: 'Gastado USD', key: 'gastadoUsd', width: 14, numFmt: amountFormat, total: true},
  {header: 'Saldo USD', key: 'saldoUsd', width: 14, numFmt: amountFormat, total: true},
];

const buildSummaryRow = ({viaje: trip, gastos: expenses}) => {
  const [[, assignedBs, assignedUsd], [, spentBs, spentUsd]] = summarizeStatement(trip, expenses).balanceRows;
  return {
    codigo: buildTripCode(trip),
    empleado: `${trip.Usuario?.nombre || ''} ${trip.Usuario?.apellido_paterno || ''}`.trim(),
    seccion: trip.Usuario?.Seccion?.nombre || '',
    motivo: trip.motivo,
    destino: trip.destino,
    tipo: trip.tipo,
    inicio: trip.fecha_inicio,
    fin: trip.fecha_fin,
    estado: getStatusLabel(trip.estado),
    asignadoBs: assignedBs,
    gastadoBs: spentBs,
    saldoBs: assignedBs - spentBs,
    asignadoUsd: assignedUsd,
    gastadoUsd: spentUsd,
    saldoUsd: assignedUsd - spentUsd,
  };
};

function useStatementsExport() {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const exportStatements = async (params, fileLabel = 'RENDICIONES') => {
    setExporting(true);
    setExportError('');
    const data = await getStatementsForExport(params);
    if (data.error) {
      setExportError(data.error);
      setExporting(false);
      return;
    }
    const statements = data.planillas || [];
    if (statements.length === 0) {
      setExportError('No hay viajes para exportar con los filtros actuales');
      setExporting(false);
      return;
    }
    const workbook = new ExcelJS.Workbook();
    addTableSheet(workbook, 'Resumen', summaryColumns, statements.map(buildSummaryRow));
    for (const statement of statements) {
      const {list} = buildDayJustifications(statement.comentarios);
      await addStatementSheet(workbook, statement.viaje, statement.gastos, list, buildTripCode(statement.viaje).replace('/', '-'), statement.firmas || {});
    }
    addOracleSheets(workbook, statements.map((statement) => ({trip: statement.viaje, expenses: statement.gastos})));
    await saveWorkbook(workbook, `${fileLabel}_${todayFileSuffix()}.xlsx`);
    setExporting(false);
  };

  return {exporting, exportError, exportStatements};
}

export default useStatementsExport;
