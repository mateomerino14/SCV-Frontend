import {useState, useEffect} from 'react';
import InlineDropdown from '../../../components/ui/InlineDropdown';
import useSimpleSelector from '../../../hooks/shared/useSimpleSelector';
import {COLORS} from '../../../constants';
import {statusLabels} from '../../../constants/tripStatusLabels';

// Misma tarjeta de filtros que las bandejas de revision (ReviewFilters)
const styles = {
  wrapper: 'mb-5',
  card: 'rounded-2xl p-4 shadow-md',
  cardTitle: 'text-xs font-bold font-inter uppercase mb-3',
  grid: 'grid grid-cols-1 sm:grid-cols-2 gap-3',
  fieldLabel: 'text-xs font-inter uppercase mb-1',
};

const categories = [
  {value: 'TODOS', label: 'Todos', states: null},
  {value: 'BORRADOR', label: 'Borradores (sin enviar)', states: null},
  {
    value: 'PREVIO',
    label: 'Aprobación de Viaje',
    states: [
      {value: 'PREVIO', label: 'Todos los de esta categoría'},
      {value: 'EN_REVISION_VIAJE', label: statusLabels.EN_REVISION_VIAJE},
      {value: 'APROBADO_VIAJE', label: statusLabels.APROBADO_VIAJE},
      {value: 'EN_REVISION_TESORERO', label: statusLabels.EN_REVISION_TESORERO},
      {value: 'RECHAZADO_PREVIO', label: statusLabels.RECHAZADO},
    ],
  },
  {
    value: 'GASTOS',
    label: 'Rendición de Gastos',
    states: [
      {value: 'GASTOS', label: 'Todos los de esta categoría'},
      {value: 'EN_CURSO', label: statusLabels.EN_CURSO},
      {value: 'EN_REVISION', label: statusLabels.EN_REVISION},
      {value: 'EN_REVISION_APROBADOR', label: statusLabels.EN_REVISION_APROBADOR},
      {value: 'APROBADO_SUPERVISOR', label: statusLabels.APROBADO_SUPERVISOR},
      {value: 'APROBADO_FINAL', label: statusLabels.APROBADO_FINAL},
      {value: 'RECHAZADO_GASTOS', label: statusLabels.RECHAZADO},
    ],
  },
];

function findCategoryByValue(value) {
  for (const category of categories) {
    if (category.value === value) {
      return category;
    }
    if (category.states?.some((state) => state.value === value)) {
      return category;
    }
  }
  return categories[0];
}

function TripHistoryFilter({activeFilter, onChange}) {
  const categoryDropdown = useSimpleSelector();
  const stateDropdown = useSimpleSelector();
  const initialCategory = findCategoryByValue(activeFilter);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory.value);
  useEffect(() => {
    const category = findCategoryByValue(activeFilter);
    setSelectedCategory(category.value);
  }, [activeFilter]);
  const currentCategory = categories.find((category) => category.value === selectedCategory) || categories[0];
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    const category = categories.find((cat) => cat.value === value);
    if (!category?.states) {
      onChange(value);
    }
    else {
      onChange(category.states[0].value);
    }
  };
  const handleStateChange = (value) => {
    onChange(value);
  };

  const categoryOptions = categories.map((category) => ({value: category.value, label: category.label}));
  const stateLabel = currentCategory.states?.find((state) => state.value === activeFilter)?.label || currentCategory.states?.[0]?.label;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card} style={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.fields}`}}>
        <p className={styles.cardTitle} style={{color: COLORS.labels}}>Filtros de Búsqueda</p>
        <div className={styles.grid}>
          <div>
            <p className={styles.fieldLabel} style={{color: COLORS.labels}}>Etapa</p>
            <InlineDropdown wrapperRef={categoryDropdown.wrapperRef} triggerRef={categoryDropdown.triggerRef} open={categoryDropdown.open}
              opensUpward={categoryDropdown.opensUpward} onToggle={categoryDropdown.toggle} label={currentCategory.label}
              options={categoryOptions} selectedValue={selectedCategory}
              onSelect={(value) => {handleCategoryChange(value); categoryDropdown.close();}} />
          </div>
          {currentCategory.states && (
            <div>
              <p className={styles.fieldLabel} style={{color: COLORS.labels}}>Estado</p>
              <InlineDropdown wrapperRef={stateDropdown.wrapperRef} triggerRef={stateDropdown.triggerRef} open={stateDropdown.open}
                opensUpward={stateDropdown.opensUpward} onToggle={stateDropdown.toggle} label={stateLabel}
                options={currentCategory.states} selectedValue={activeFilter}
                onSelect={(value) => {handleStateChange(value); stateDropdown.close();}} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripHistoryFilter;