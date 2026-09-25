import {useState, useEffect} from 'react';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import {getAudits} from '../../services/admin/adminService';
import {getEmployees} from '../../services/user/userService';

const typeLabels = {
  INGRESO: 'Ingreso',
  SALIDA: 'Salida',
  CAMBIO_CLAVE: 'Cambio de Contraseña',
};

function useAuditLog() {
  const [audits, setAudits] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingFilters, setApplyingFilters] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({tipo: '', id_usuario: '', fecha_inicio: '', fecha_fin: ''});

  const load = async (currentFilters = filters, showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    const data = await getAudits(currentFilters);
    setLoading(false);
    setApplyingFilters(false);
    if (data.error) {
      setError(data.error);
      return;
    }
    setAudits(data);
  };

  useEffect(() => {
    const start = async () => {
      await load(filters, true);
      const employeeData = await getEmployees();
      if (!employeeData.error) {
        setEmployees(employeeData);
      }
    };
    start();
  }, []);

  const applyFilters = async () => {
    setApplyingFilters(true);
    await load(filters, false);
  };

  const clearFilters = async () => {
    const emptyFilters = {tipo: '', id_usuario: '', fecha_inicio: '', fecha_fin: ''};
    setFilters(emptyFilters);
    setApplyingFilters(true);
    await load(emptyFilters, false);
  };

  const exportToExcel = async () => {
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
    audits.forEach((audit) => {
      sheet.addRow({
        fecha: new Date(audit.fecha).toLocaleString('es-BO'),
        usuario: audit.Usuario ? `${audit.Usuario.nombre} ${audit.Usuario.apellido_paterno}` : '',
        correo: audit.Usuario?.email_corporativo || '',
        evento: typeLabels[audit.tipo] || audit.tipo,
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Auditoria_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return {
    audits, employees, loading, applyingFilters, error,
    filters, setFilters,
    applyFilters, clearFilters, exportToExcel,
    typeLabels,
  };
}

export default useAuditLog;
