import {useState, useEffect} from 'react';
import {Plus, Pencil, Trash2} from 'lucide-react';
import {COLORS} from '../../../constants';
import {formatDateTime} from '../../../utils/dateFormatter';

const styles = {
  section: 'mb-4 mt-6',
  titleRow: 'flex items-center mb-3',
  title: 'text-sm font-semibold font-inter uppercase',
  buttonsRow: 'flex gap-2 ml-auto',
  actionBtn: 'w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer',
  item: 'flex flex-col gap-1 mb-3',
  bulletRow: 'flex items-center gap-2',
  bullet: 'w-2 h-2 rounded-full shrink-0',
  date: 'text-xs font-inter',
  text: 'text-sm font-inter leading-relaxed p-3 rounded-xl ml-4 break-words overflow-hidden',
};

function SelectableObservationsList({observations, canManage, onAdd, onEdit, onDelete, editingComment, deletingComment}) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (selected && !observations.some((observation) => observation.id_comentario === selected.id_comentario)) {
      setSelected(null);
      return;
    }
    if (selected) {
      const fresh = observations.find((observation) => observation.id_comentario === selected.id_comentario);
      if (fresh && fresh.descripcion !== selected.descripcion) {
        setSelected(fresh);
      }
    }
  }, [observations]);

  useEffect(() => {
    if (editingComment === null) {
      setSelected(null);
    }
  }, [editingComment]);

  useEffect(() => {
    if (deletingComment === null) {
      setSelected(null);
    }
  }, [deletingComment]);

  if (!canManage && observations.length === 0) {
    return null;
  }

  const handleSelect = (observation) => {
    if (!canManage) {
      return;
    }
    if (selected?.id_comentario === observation.id_comentario) {
      setSelected(null);
      return;
    }
    setSelected(observation);
  };

  let itemCursor = 'default';
  if (canManage) {
    itemCursor = 'pointer';
  }

  let editDeleteOpacity = 0.5;
  let editDeleteBackground = COLORS.dataFields;
  if (selected) {
    editDeleteOpacity = 1;
    editDeleteBackground = COLORS.secondary;
  }

  return (
    <div className={styles.section}>
      <div className={styles.titleRow}>
        <p className={styles.title} style={{color: COLORS.title}}>Observaciones</p>
        {canManage && (
          <div className={styles.buttonsRow}>
            <button className={styles.actionBtn} style={{backgroundColor: COLORS.secondary}} onClick={onAdd}>
              <Plus size={18} style={{color: COLORS.background}} />
            </button>
            <button className={styles.actionBtn} style={{backgroundColor: editDeleteBackground, opacity: editDeleteOpacity}}
              onClick={() => selected && onEdit(selected)} disabled={!selected}>
              <Pencil size={16} style={{color: COLORS.background}} />
            </button>
            <button className={styles.actionBtn} style={{backgroundColor: editDeleteBackground, opacity: editDeleteOpacity}}
              onClick={() => selected && onDelete(selected.id_comentario)} disabled={!selected}>
              <Trash2 size={16} style={{color: COLORS.background}} />
            </button>
          </div>
        )}
      </div>
      {observations.map((observation) => {
        const isSelected = selected?.id_comentario === observation.id_comentario;
        let bulletColor = COLORS.secondary;
        if (isSelected) {
          bulletColor = COLORS.primary;
        }
        let textBackground = COLORS.element;
        let textBorder = '2px solid transparent';
        if (isSelected) {
          textBackground = COLORS.backgroundHeader;
          textBorder = `2px solid ${COLORS.primary}`;
        }
        return (
          <div key={observation.id_comentario} className={styles.item} style={{cursor: itemCursor}} onClick={() => handleSelect(observation)}>
            <div className={styles.bulletRow}>
              <div className={styles.bullet} style={{backgroundColor: bulletColor}} />
              <p className={styles.date} style={{color: COLORS.labels}}>{formatDateTime(observation.fecha)}</p>
            </div>
            <div className={styles.text} style={{backgroundColor: textBackground, color: COLORS.text, border: textBorder}}>
              {observation.descripcion}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SelectableObservationsList;