import {useState, useEffect} from 'react';
import HistoryDropdownSelector from '../molecules/HistoryDropdownSelector';

const styles = {
  wrapper: 'flex flex-col gap-2 mb-4',
  row: 'flex gap-2 flex-wrap',
};

const categories = [
  {value: 'TODOS', label: 'Todos', states: null},
  {value: 'BORRADOR', label: 'Sin Enviar', states: null},
  {
    value: 'PREVIO',
    label: 'Aprobación de Viaje',
    states: [
      {value: 'PREVIO', label: 'Todos los de esta categoría'},
      {value: 'EN_REVISION_VIAJE', label: 'En Revisión'},
      {value: 'APROBADO_VIAJE', label: 'Apr. Supervisor'},
      {value: 'EN_REVISION_TESORERO', label: 'Esperando Fondos'},
      {value: 'RECHAZADO_PREVIO', label: 'Rechazado'},
    ],
  },
  {
    value: 'GASTOS',
    label: 'Rendición de Gastos',
    states: [
      {value: 'GASTOS', label: 'Todos los de esta categoría'},
      {value: 'EN_CURSO', label: 'En Curso'},
      {value: 'EN_REVISION', label: 'En Revisión'},
      {value: 'APROBADO_SUPERVISOR', label: 'Apr. Supervisor'},
      {value: 'APROBADO_FINAL', label: 'Aprobado'},
      {value: 'RECHAZADO_GASTOS', label: 'Rechazado'},
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <HistoryDropdownSelector options={categories.map((category) => ({value: category.value, label: category.label}))}
          selectedValue={selectedCategory} onSelect={handleCategoryChange} />
        {currentCategory.states && (
          <HistoryDropdownSelector options={currentCategory.states} selectedValue={activeFilter} onSelect={handleStateChange} />
        )}
      </div>
    </div>
  );
}

export default TripHistoryFilter;