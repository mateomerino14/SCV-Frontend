import {COLORS} from '../../constants';
import {pluralOf} from '../../utils/plural';

const styles = {
  text: 'text-xs font-inter mb-3',
};

function ListCount({shown, total, singular, plural}) {
  const noun = pluralOf(total, singular, plural);
  return <p className={styles.text} style={{color: COLORS.labels}}>Mostrando {shown} de {total} {noun}</p>;
}

export default ListCount;
