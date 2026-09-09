import {Pencil, Check, X} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  card: 'rounded-xl p-4 flex items-start gap-3 border h-full',
  iconWrapper: 'rounded-lg p-2 shrink-0',
  info: 'flex flex-col min-w-0 flex-1',
  label: 'text-xs font-inter uppercase',
  value: 'text-sm font-bold font-inter mt-0.5 break-words',
  editRow: 'flex items-center gap-2 mt-1',
  input: 'flex-1 border rounded-lg px-2 py-1.5 text-sm font-inter outline-none min-w-0',
  editBtn: 'shrink-0 cursor-pointer',
  actionsRow: 'flex items-center gap-1.5 shrink-0',
};

function ProfileField({icon: Icon, label, value, editing, editValue, onEditValueChange, onStartEdit, onSave, onCancel, saving, inputType = 'text', inputMode, maxLength}) {
  return (
    <div className={styles.card} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
      <div className={styles.iconWrapper} style={{backgroundColor: COLORS.error}}>
        <Icon size={16} style={{color: COLORS.primary}} />
      </div>
      <div className={styles.info}>
        <p className={styles.label} style={{color: COLORS.labels}}>{label}</p>
        {editing ? (
          <div className={styles.editRow}>
            <input type={inputType} inputMode={inputMode} maxLength={maxLength} className={styles.input}
              style={{borderColor: COLORS.dataFields, color: COLORS.text, backgroundColor: COLORS.background}}
              value={editValue} onChange={onEditValueChange} disabled={saving} autoFocus />
            <div className={styles.actionsRow}>
              <button className={styles.editBtn} onClick={onSave} disabled={saving}>
                <Check size={16} style={{color: '#2d7a3a'}} />
              </button>
              <button className={styles.editBtn} onClick={onCancel} disabled={saving}>
                <X size={16} style={{color: COLORS.secondary}} />
              </button>
            </div>
          </div>
        ) : (
          <p className={styles.value} style={{color: COLORS.text}}>{value || '—'}</p>
        )}
      </div>
      {!editing && (
        <button className={styles.editBtn} onClick={onStartEdit}>
          <Pencil size={14} style={{color: COLORS.primary}} />
        </button>
      )}
    </div>
  );
}

export default ProfileField;