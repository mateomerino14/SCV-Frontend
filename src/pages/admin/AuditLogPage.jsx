import {Download, LogIn, LogOut, KeyRound} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import PageHeader from '../../components/ui/PageHeader';
import AdminMenu from '../../layouts/menu/AdminMenu';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonList from '../../components/ui/SkeletonList';
import InlineDropdown from '../../components/ui/InlineDropdown';
import EmployeeDropdown from '../../components/ui/EmployeeDropdown';
import useSimpleSelector from '../../hooks/shared/useSimpleSelector';
import useAuditLog from '../../hooks/admin/useAuditLog';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  filtersCard: 'rounded-2xl p-4 mb-4 border',
  filtersGrid: 'grid grid-cols-2 gap-3 mb-3',
  fieldLabel: 'text-xs font-bold font-inter uppercase mb-1',
  dateInput: 'w-full p-2.5 rounded-xl text-sm font-inter outline-none border',
  buttonsRow: 'flex gap-2 mt-2',
  applyBtn: 'flex-1 py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer border-2',
  clearBtn: 'flex-1 py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer border-2',
  exportBtn: 'flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer mb-4',
  row: 'flex items-center gap-3 rounded-2xl p-3 mb-2',
  iconWrap: 'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
  rowInfo: 'flex flex-col flex-1 min-w-0',
  rowName: 'text-sm font-bold font-inter truncate',
  rowEmail: 'text-xs font-inter truncate',
  rowDate: 'text-xs font-inter text-right shrink-0',
};

const typeOptions = [
  {value: '', label: 'Todos los eventos'},
  {value: 'INGRESO', label: 'Ingreso'},
  {value: 'SALIDA', label: 'Salida'},
  {value: 'CAMBIO_CLAVE', label: 'Cambio de Contraseña'},
];

const typeIcon = {
  INGRESO: LogIn,
  SALIDA: LogOut,
  CAMBIO_CLAVE: KeyRound,
};

const typeColor = {
  INGRESO: '#155724',
  SALIDA: COLORS.labels,
  CAMBIO_CLAVE: COLORS.primary,
};

function AuditLogPage() {
  const {menuOpen, user, openMenu, closeMenu} = useMenu();
  const {
    audits, employees, loading, applyingFilters, error, filters, setFilters,
    applyFilters, clearFilters, exportToExcel, typeLabels,
  } = useAuditLog();
  const typeDropdown = useSimpleSelector();
  const employeeDropdown = useSimpleSelector();

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <Navbar text="Historial de Accesos" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <AdminMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <PageHeader title="Historial de Accesos" subtitle="Registro de ingresos, salidas y cambios de contraseña en el sistema." />

        <div className={styles.filtersCard} style={{backgroundColor: COLORS.backgroundHeader, borderColor: COLORS.dataFields}}>
          <div className={styles.filtersGrid}>
            <div>
              <p className={styles.fieldLabel} style={{color: COLORS.labels}}>Desde</p>
              <input type="date" className={styles.dateInput} value={filters.fecha_inicio}
                onChange={(event) => setFilters((prev) => ({...prev, fecha_inicio: event.target.value}))}
                style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields, color: COLORS.text}} />
            </div>
            <div>
              <p className={styles.fieldLabel} style={{color: COLORS.labels}}>Hasta</p>
              <input type="date" className={styles.dateInput} value={filters.fecha_fin}
                onChange={(event) => setFilters((prev) => ({...prev, fecha_fin: event.target.value}))}
                style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields, color: COLORS.text}} />
            </div>
          </div>
          <div className={styles.filtersGrid}>
            <div>
              <p className={styles.fieldLabel} style={{color: COLORS.labels}}>Evento</p>
              <InlineDropdown wrapperRef={typeDropdown.wrapperRef} triggerRef={typeDropdown.triggerRef} open={typeDropdown.open}
                opensUpward={typeDropdown.opensUpward} onToggle={typeDropdown.toggle}
                label={typeOptions.find((option) => option.value === filters.tipo)?.label || 'Todos los eventos'}
                options={typeOptions} selectedValue={filters.tipo}
                onSelect={(value) => {setFilters((prev) => ({...prev, tipo: value})); typeDropdown.close();}} />
            </div>
            <div>
              <p className={styles.fieldLabel} style={{color: COLORS.labels}}>Usuario</p>
              <EmployeeDropdown wrapperRef={employeeDropdown.wrapperRef} triggerRef={employeeDropdown.triggerRef} open={employeeDropdown.open}
                onToggle={employeeDropdown.toggle} employees={employees} selectedId={filters.id_usuario}
                onSelect={(id) => {setFilters((prev) => ({...prev, id_usuario: id})); employeeDropdown.close();}} />
            </div>
          </div>
          <div className={styles.buttonsRow}>
            <button className={styles.applyBtn} onClick={applyFilters} disabled={applyingFilters}
              style={{backgroundColor: COLORS.primary, borderColor: COLORS.primary, color: COLORS.background}}>
              {applyingFilters ? 'Aplicando...' : 'Aplicar Filtros'}
            </button>
            <button className={styles.clearBtn} onClick={clearFilters} disabled={applyingFilters}
              style={{backgroundColor: 'transparent', borderColor: COLORS.dataFields, color: COLORS.labels}}>
              Limpiar
            </button>
          </div>
        </div>

        <button className={styles.exportBtn} onClick={exportToExcel} disabled={loading || audits.length === 0}
          style={{backgroundColor: COLORS.secondary, color: COLORS.background, opacity: audits.length === 0 ? 0.6 : 1}}>
          <Download size={16} />
          Exportar a Excel
        </button>

        {error && <p className="text-xs font-inter italic text-center mb-3" style={{color: COLORS.secondary}}>{error}</p>}

        {loading && <SkeletonList count={5} />}

        {!loading && audits.map((audit) => {
          const Icon = typeIcon[audit.tipo] || LogIn;
          return (
            <div key={audit.id_auditoria} className={styles.row} style={{backgroundColor: COLORS.backgroundHeader}}>
              <div className={styles.iconWrap} style={{backgroundColor: COLORS.positionRole}}>
                <Icon size={16} style={{color: typeColor[audit.tipo] || COLORS.text}} />
              </div>
              <div className={styles.rowInfo}>
                <p className={styles.rowName} style={{color: COLORS.text}}>
                  {audit.Usuario ? `${audit.Usuario.nombre} ${audit.Usuario.apellido_paterno}` : 'Usuario desconocido'}
                  {' · '}
                  <span style={{color: typeColor[audit.tipo] || COLORS.text, fontWeight: 'bold'}}>{typeLabels[audit.tipo] || audit.tipo}</span>
                </p>
                <p className={styles.rowEmail} style={{color: COLORS.labels}}>{audit.Usuario?.email_corporativo || ''}</p>
              </div>
              <p className={styles.rowDate} style={{color: COLORS.labels}}>{new Date(audit.fecha).toLocaleString('es-BO')}</p>
            </div>
          );
        })}

        {!loading && audits.length === 0 && (
          <EmptyState title="Sin registros" subtitle="No se encontraron eventos con los filtros aplicados"
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="10" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                <path d="M16 10V16L20 19" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            } />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AuditLogPage;
