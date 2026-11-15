import {Pencil, Plus, Scale, Trash2} from 'lucide-react';
import {COLORS} from '../../../constants';
import {scaleRatesText} from '../../../utils/travelScaleText';

const styles = {
  card: 'rounded-2xl p-4 mb-5 flex flex-col gap-3',
  header: 'flex items-center gap-2',
  headerTitle: 'flex items-center gap-2 flex-1 min-w-0',
  addBtn: 'flex items-center gap-1 h-9 px-3 rounded-lg border-2 text-xs font-bold font-nunito cursor-pointer shrink-0',
  actions: 'flex gap-2 shrink-0',
  title: 'text-sm font-bold font-inter uppercase',
  hint: 'text-xs font-inter',
  row: 'rounded-xl p-3 flex items-center gap-3',
  badge: 'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-inter shrink-0',
  info: 'flex flex-col flex-1 min-w-0',
  name: 'text-sm font-bold font-inter',
  detail: 'text-xs font-inter',
  editBtn: 'w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer shrink-0',
  message: 'text-xs font-inter',
};

function TravelScaleCard({scale, loading, loadError, positionCounts = {}, onAdd, onEdit, onDelete}) {
  return (
    <div className={styles.card} style={{backgroundColor: COLORS.backgroundHeader}}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Scale size={18} style={{color: COLORS.primary}} />
          <p className={styles.title} style={{color: COLORS.text}}>Escala de Viáticos</p>
        </div>
        <button type="button" className={styles.addBtn} style={{borderColor: COLORS.secondary, color: COLORS.secondary, backgroundColor: COLORS.background}} onClick={onAdd}>
          <Plus size={14} />
          Agregar tipo
        </button>
      </div>
      <p className={styles.hint} style={{color: COLORS.labels}}>
        Clase 1: Europa, Asia, África y Norte América. Clase 2: Centro y Sud América y el Caribe. Cada cargo usa las tarifas de su tipo.
      </p>
      {loading && <p className={styles.message} style={{color: COLORS.labels}}>Cargando escala...</p>}
      {loadError && <p className={styles.message} style={{color: COLORS.fieldError}}>{loadError}</p>}
      {scale.map((row) => (
        <div key={row.tipo} className={styles.row} style={{backgroundColor: COLORS.background}}>
          <div className={styles.badge} style={{backgroundColor: COLORS.primary, color: COLORS.background}}>{row.tipo}</div>
          <div className={styles.info}>
            <p className={styles.name} style={{color: COLORS.text}}>{row.descripcion}</p>
            <p className={styles.detail} style={{color: COLORS.labels}}>{scaleRatesText(row)}</p>
            <p className={styles.detail} style={{color: COLORS.primary}}>Hospedaje: {row.hospedaje}</p>
            <p className={styles.detail} style={{color: COLORS.labels}}>
              {positionCounts[row.tipo] ? `${positionCounts[row.tipo]} cargo${positionCounts[row.tipo] === 1 ? '' : 's'}` : 'Sin cargos'}
            </p>
          </div>
          <div className={styles.actions}>
            {!positionCounts[row.tipo] && scale.length > 1 && (
              <button type="button" className={styles.editBtn} style={{backgroundColor: COLORS.error}} onClick={() => onDelete(row)} aria-label={`Eliminar tipo ${row.tipo}`}>
                <Trash2 size={14} style={{color: COLORS.secondary}} />
              </button>
            )}
            <button type="button" className={styles.editBtn} style={{backgroundColor: COLORS.primary}} onClick={() => onEdit(row)} aria-label={`Editar tipo ${row.tipo}`}>
              <Pencil size={14} style={{color: COLORS.background}} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TravelScaleCard;
