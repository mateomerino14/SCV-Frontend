import {Pencil, Trash2} from 'lucide-react';
import {COLORS} from '../../constants';

const styles = {
  item: "flex flex-col gap-1 p-4 rounded-xl border-l-4",
  itemCompact: "rounded-xl p-3 flex flex-col gap-1",
  date: "text-xs font-inter",
  text: "text-sm font-inter leading-relaxed",
  textCompact: "text-sm font-inter leading-relaxed break-words",
  actionsRow: "flex gap-2 justify-end mt-1",
  actionBtn: "w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer",
};

function CommentCard({date, text, backgroundColor, borderColor, compact, onEdit, onDelete}) {
  if (compact) {
    return (
      <div className={styles.itemCompact} style={{backgroundColor}}>
        <p className={styles.date} style={{color: COLORS.backgroundHeader}}>{date}</p>
        <p className={styles.textCompact} style={{color: COLORS.background}}>{text}</p>
        {(onEdit || onDelete) && (
          <div className={styles.actionsRow}>
            {onEdit && (
              <div className={styles.actionBtn} style={{backgroundColor: COLORS.background}} onClick={onEdit}>
                <Pencil size={13} style={{color: COLORS.primary}} />
              </div>
            )}
            {onDelete && (
              <div className={styles.actionBtn} style={{backgroundColor: COLORS.background}} onClick={onDelete}>
                <Trash2 size={13} style={{color: COLORS.primary}} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.item} style={{backgroundColor, borderLeftColor: borderColor}}>
      <p className={styles.date} style={{color: COLORS.environmentTypesText}}>{date}</p>
      <p className={styles.text} style={{color: COLORS.text}}>{text}</p>
    </div>
  );
}

export default CommentCard;