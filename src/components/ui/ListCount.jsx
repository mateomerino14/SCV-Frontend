import {COLORS} from '../../constants';

const styles = {
  text: 'text-xs font-inter mb-3',
};

function ListCount({shown, total, singular, plural}) {
  const noun = total === 1 ? singular : plural;
  return <p className={styles.text} style={{color: COLORS.labels}}>Mostrando {shown} de {total} {noun}</p>;
}

export default ListCount;
