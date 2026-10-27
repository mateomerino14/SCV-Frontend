import {COLORS} from '../../constants';

const styles = {
  errorMsg: 'mt-3 text-xs font-inter italic text-center py-2 px-3 rounded-xl',
  successMsg: 'mt-3 text-sm font-inter text-center py-2 px-3 rounded-xl',
};

function InlineAlert({type = 'error', children}) {
  if (type === 'success') {
    return <p className={styles.successMsg} style={{color: COLORS.success, backgroundColor: COLORS.successBackground}}>{children}</p>;
  }
  return <p className={styles.errorMsg} style={{color: COLORS.primary, backgroundColor: COLORS.alertBackground}}>{children}</p>;
}

export default InlineAlert;