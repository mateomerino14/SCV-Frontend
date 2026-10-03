import {useState, useEffect, useRef} from 'react';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import {getAudits} from '../../services/admin/adminService';
import {getEmployees} from '../../services/user/userService';
import {getPresetRange, toDateText} from '../../utils/periodRange';

const typeLabels = {
  INGRESO: 'Ingreso',
  SALIDA: 'Salida',
  CAMBIO_CLAVE: 'Cambio de Contraseña',
};

const pageSize = 20;
const emptyFilters = {tipo: '', id_usuario: '', fecha_inicio: '', fecha_fin: ''};

const getInitialFilters = () => ({...emptyFilters, ...getPresetRange('mes')});

function useAuditLog() {
  const [audits, setAudits] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [applyingFilters, setApplyingFilters] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(getInitialFilters);
  const [preset, setPreset] = useState('mes');
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const appliedFiltersRef = useRef(filters);

  const load = async (currentFilters, currentPage, replace) => {
    const data = await getAudits(currentFilters, currentPage, pageSize);
    if (data.error) {
      setError(data.error);
      return;
    }
    setError('');
    appliedFiltersRef.current = currentFilters;
    setAppliedFilters(currentFilters);
    setPage(currentPage);
    setTotal(data.total || 0);
    if (replace) {
      setAudits(data.registros || []);
    }
    else {
      setAudits((prev) => [...prev, ...(data.registros || [])]);
    }
  };

  useEffect(() => {
    const start = async () => {
      await load(appliedFiltersRef.current, 1, true);
      setLoading(false);
      const employeeData = await getEmployees();
      if (!employeeData.error) {
        setEmployees(employeeData);
      }
    };
    start();
  }, []);

  const applyFilters = async () => {
    // Rango invertido: el filtro de fechas ya muestra el aviso, no se consulta
    if (filters.fecha_inicio && filters.fecha_fin && filters.fecha_inicio > filters.fecha_fin) {
      return;
    }
    setApplyingFilters(true);
    await load(filters, 1, true);
    setApplyingFilters(false);
  };

  const selectPreset = async (value) => {
    setPreset(value);
    if (value === 'rango') {
      return;
    }
    const nextFilters = {...filters, ...getPresetRange(value)};
    setFilters(nextFilters);
    setApplyingFilters(true);
    await load(nextFilters, 1, true);
    setApplyingFilters(false);
  };

  const clearFilters = async () => {
    const initialFilters = getInitialFilters();
    setFilters(initialFilters);
    setPreset('mes');
    setApplyingFilters(true);
    await load(initialFilters, 1, true);
    setApplyingFilters(false);
  };

  const loadMore = async () => {
    setLoadingMore(true);
    await load(appliedFiltersRef.current, page + 1, false);
    setLoadingMore(false);
  };

  const exportToExcel = async () => {
    setExporting(true);
    const allAudits = await getAudits(appliedFiltersRef.current);
    if (allAudits.error) {
      setError(allAudits.error);
      setExporting(false);
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Auditoría');
    sheet.columns = [
      {header: 'Fecha', key: 'fecha', width: 22},
      {header: 'Usuario', key: 'usuario', width: 30},
      {header: 'Correo', key: 'correo', width: 32},
      {header: 'Evento', key: 'evento', width: 22},
    ];
    sheet.getRow(1).font = {bold: true, color: {argb: 'FFFFFFFF'}};
    sheet.getRow(1).fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FF870002'}};
    allAudits.forEach((audit) => {
      sheet.addRow({
        fecha: new Date(audit.fecha).toLocaleString('es-BO'),
        usuario: audit.Usuario ? `${audit.Usuario.nombre} ${audit.Usuario.apellido_paterno}` : '',
        correo: audit.Usuario?.email_corporativo || '',
        evento: typeLabels[audit.tipo] || audit.tipo,
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Auditoria_${toDateText(new Date())}.xlsx`);
    setExporting(false);
  };

  return {
    audits, total, hasMorePages: audits.length < total, loadMore, loadingMore,
    employees, loading, applyingFilters, exporting, error,
    filters, setFilters, preset, selectPreset, appliedFilters,
    applyFilters, clearFilters, exportToExcel,
    typeLabels,
  };
}

export default useAuditLog;
