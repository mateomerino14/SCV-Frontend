import {Search} from 'lucide-react';
import {COLORS} from '../../constants';

const styles = {
  wrapper: 'flex items-center gap-2 px-3 py-2 border-b',
  input: 'w-full text-sm font-inter outline-none bg-transparent',
};

function DropdownSearchInput({inputRef, value, onChange, placeholder}) {
  return (
    <div className={styles.wrapper} style={{borderColor: COLORS.dataFields}}>
      <Search size={14} style={{color: COLORS.labels, flexShrink: 0}} />
      <input ref={inputRef} className={styles.input} style={{color: COLORS.text}} type="text"
        placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}

export default DropdownSearchInput;