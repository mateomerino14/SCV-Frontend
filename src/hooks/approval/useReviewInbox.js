import {useState, useEffect} from 'react';
import {getEmployees} from '../../services/user/userService';
import {getSections} from '../../services/admin/adminService';
import useInbox from './useInbox';

const emptyFilters = {fecha_inicio: '', fecha_fin: '', id_empleado: '', id_seccion: ''};

function useReviewInbox(inboxName, initialTab, loadEmployees = getEmployees) {
  const [employees, setEmployees] = useState([]);
  const [sections, setSections] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [tab, setTab] = useState(initialTab);
  const inbox = useInbox(inboxName, appliedFilters, tab);

  useEffect(() => {
    loadEmployees().then((data) => {
      if (Array.isArray(data)) {
        setEmployees(data);
      }
    });
    getSections().then((data) => {
      if (Array.isArray(data)) {
        setSections(data);
      }
    });
  }, [loadEmployees]);

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  return {
    trips: inbox.trips,
    pagination: inbox.pagination,
    counts: inbox.counts,
    employees,
    sections,
    loading: inbox.loading,
    applyingFilters: inbox.loading,
    error: inbox.error,
    filters, setFilters,
    tab, setTab,
    applyFilters, clearFilters,
    reload: inbox.reload,
  };
}

export default useReviewInbox;
