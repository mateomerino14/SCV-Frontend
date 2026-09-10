import {MessageSquare} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  btn: 'w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer shrink-0 relative',
  badge: 'absolute -top-1 -right-1 rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center',
};

function ExpenseObsButton({count, accentColor, onClick}) {
  return (
    <button className={styles.btn} style={{backgroundColor: count > 0 ? COLORS.error : COLORS.backgroundHeader, margin: '0 auto'}} onClick={onClick}>
      <MessageSquare size={13} style={{color: count > 0 ? COLORS.secondary : accentColor}} />
      {count > 0 && <span className={styles.badge} style={{backgroundColor: COLORS.secondary, color: '#fff'}}>{count}</span>}
    </button>
  );
}

export default ExpenseObsButton;