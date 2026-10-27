import {COLORS} from '../../constants';

const styles = {
  textarea: 'w-full border rounded-xl p-3 text-sm font-inter outline-none resize-none max-h-[140px] overflow-y-auto',
  errorMsg: 'text-xs font-inter italic text-center w-full mt-2',
};

function LimitedTextarea({value, onChange, rows = 4, placeholder, exceedsLimit, maxLength, error, borderColorOk = COLORS.onColorFill30}) {
  return (
    <div className="w-full flex flex-col gap-1">
      <textarea className={styles.textarea} rows={rows} maxLength={maxLength} value={value} placeholder={placeholder} onChange={onChange}
        style={{borderColor: exceedsLimit ? COLORS.secondary : borderColorOk, color: COLORS.text, backgroundColor: COLORS.background}} />
      {exceedsLimit && <p className={styles.errorMsg} style={{color: COLORS.background}}>El comentario no puede superar los {maxLength} caracteres</p>}
      {error && <p className={styles.errorMsg} style={{color: COLORS.background}}>{error}</p>}
    </div>
  );
}

export default LimitedTextarea;