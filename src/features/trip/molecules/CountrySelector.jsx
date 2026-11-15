import SearchableSelector from '../../../components/ui/SearchableSelector';
import {countryRegions} from '../../../constants/countryClasses';

const countryOptions = countryRegions.flatMap((region) => region.paises.map((country) => ({
  value: country,
  label: country,
  description: `Clase ${region.clase} · ${region.region}`,
  searchText: `${country} ${region.region}`,
}))).sort((first, second) => first.label.localeCompare(second.label, 'es'));

function CountrySelector({value, onChange, error}) {
  return (
    <SearchableSelector label="País de Destino" required options={countryOptions} value={value} onChange={onChange}
      placeholder="Elige el país del viaje" searchPlaceholder="Busca el país o la región..." error={error} />
  );
}

export default CountrySelector;
