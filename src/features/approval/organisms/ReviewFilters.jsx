import useSimpleSelector from '../../../hooks/shared/useSimpleSelector';
import EmployeeDropdown from '../../../components/ui/EmployeeDropdown';
import SectionDropdown from '../../../components/ui/SectionDropdown';
import DateRangeFilter from '../molecules/DateRangeFilter';
import StatusTabs from '../molecules/StatusTabs';
import {COLORS} from '../../../constants';

const styles = {
  wrapper: 'mb-5',
  card: 'rounded-2xl p-4 shadow-md',
  cardTitle: 'text-xs font-bold font-inter uppercase mb-3',
  employeeSection: 'mt-3',
  employeeLabel: 'text-xs font-inter uppercase mb-1',
  btnRow: 'flex gap-2 mt-3',
  btn: 'flex-1 py-2.5 rounded-xl text-sm font-bold font-nunito cursor-pointer border transition-colors text-center',
  divider: 'border-t mt-3 pt-3',
};

function ReviewFilters({filters, setFilters, statusFilter, setStatusFilter, onApply, onClear, employees = [], sections = [], tabs, hideStatusTabs = false, hideSectionFilter = false, applyingFilters}) {
  const employeeDropdown = useSimpleSelector();
  let applyLabel = 'Aplicar Filtros';
  if (applyingFilters) {
    applyLabel = 'Filtrando...';
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card} style={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.fields}`}}>
        <p className={styles.cardTitle} style={{color: COLORS.labels}}>Filtros de Búsqueda</p>
        <DateRangeFilter startDate={filters.fecha_inicio} endDate={filters.fecha_fin}
          onStartDateChange={(event) => setFilters((prev) => ({...prev, fecha_inicio: event.target.value}))}
          onEndDateChange={(event) => setFilters((prev) => ({...prev, fecha_fin: event.target.value}))} />
        {employees.length > 0 && (
          <div className={styles.employeeSection}>
            <p className={styles.employeeLabel} style={{color: COLORS.labels}}>Empleado</p>
            <EmployeeDropdown wrapperRef={employeeDropdown.wrapperRef} triggerRef={employeeDropdown.triggerRef} open={employeeDropdown.open}
              onToggle={employeeDropdown.toggle} employees={employees} selectedId={filters.id_empleado}
              onSelect={(id) => {setFilters((prev) => ({...prev, id_empleado: id})); employeeDropdown.close();}} />
          </div>
        )}
        {!hideSectionFilter && sections.length > 0 && (
          <div className={styles.employeeSection}>
            <p className={styles.employeeLabel} style={{color: COLORS.labels}}>Sección</p>
            <SectionDropdown sections={sections} selectedSection={filters.id_seccion}
              onSelect={(value) => setFilters((prev) => ({...prev, id_seccion: value}))} />
          </div>
        )}
        <div className={styles.btnRow}>
          <button className={styles.btn} style={{backgroundColor: applyingFilters ? COLORS.fields : COLORS.primary, borderColor: applyingFilters ? COLORS.fields : COLORS.primary, color: COLORS.background}}
            onClick={onApply} disabled={applyingFilters}>
            {applyLabel}
          </button>
          <button className={styles.btn} style={{backgroundColor: 'transparent', borderColor: COLORS.dataFields, color: COLORS.labels}} onClick={onClear}>Limpiar</button>
        </div>
        {!hideStatusTabs && tabs && (
          <div className={styles.divider} style={{borderColor: COLORS.dataFields}}>
            <StatusTabs tabs={tabs} activeTab={statusFilter} onChange={setStatusFilter} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewFilters;