import {COLORS} from '../../constants';

const styles = {
  textarea: 'w-full border rounded-xl p-3 text-sm font-inter outline-none resize-none comment-scroll',
  errorMsg: 'text-xs font-inter italic text-center w-full mt-2',
};

function LimitedTextarea({value, onChange, rows = 4, placeholder, exceedsLimit, maxLength, error, borderColorOk = 'rgba(255,255,255,0.3)'}) {
  return (
    <div className="w-full flex flex-col gap-1">
      <style>{`
        textarea.comment-scroll {max-height: 140px !important; overflow-y: auto !important; scrollbar-width: thin !important; scrollbar-color: rgba(0, 0, 0, 0.25) transparent !important;}
        textarea.comment-scroll::-webkit-scrollbar { width: 5px !important; height: 5px !important;}
        textarea.comment-scroll::-webkit-scrollbar-track { background: transparent !important;}
        textarea.comment-scroll::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.25) !important; border-radius: 10px !important; border: none !important;}
        textarea.comment-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(0, 0, 0, 0.4) !important;}
      `}</style>
      <textarea className={styles.textarea} rows={rows} maxLength={maxLength} value={value} placeholder={placeholder} onChange={onChange}
        style={{borderColor: exceedsLimit ? COLORS.secondary : borderColorOk, color: COLORS.text, backgroundColor: COLORS.background}} />
      {exceedsLimit && <p className={styles.errorMsg} style={{color: COLORS.background}}>El comentario no puede superar los {maxLength} caracteres</p>}
      {error && <p className={styles.errorMsg} style={{color: COLORS.background}}>{error}</p>}
    </div>
  );
}

export default LimitedTextarea;