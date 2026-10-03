import {COLORS} from '../../../constants';

const styles = {
  wrapper: 'border rounded-xl overflow-hidden mt-1',
  item: 'px-3 py-2 text-sm font-inter cursor-pointer',
};

// Muestra nombres ya registrados que coinciden con lo escrito, para no crear duplicados
function ExistingNameSuggestions({suggestions, onSelect}) {
  return (
    <div className={styles.wrapper} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
      {suggestions.slice(0, 4).map((suggestion) => (
        <div key={suggestion.id} className={styles.item} style={{color: COLORS.text, borderBottom: `1px solid ${COLORS.dataFields}`}}
          onMouseDown={() => onSelect(suggestion.nombre)}>
          {suggestion.nombre}
          <span className="text-xs ml-2" style={{color: COLORS.secondary}}>ya existe</span>
        </div>
      ))}
    </div>
  );
}

export default ExistingNameSuggestions;
