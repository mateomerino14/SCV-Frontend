import {COLORS} from '../../../constants';

const styles = {
  wrapper: "flex items-center justify-between p-4 rounded-2xl shadow-sm gap-3",
  left: "flex items-center gap-3",
  iconWrapper: "rounded-full p-2",
  label: "text-sm font-bold font-inter",
  description: "text-xs font-inter",
  toggle: "w-12 h-6 rounded-full relative cursor-pointer transition-colors shrink-0",
  toggleCircle: "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
};

// Opcion de ajustes con interruptor de encendido / apagado
function ConfigToggle({icon: Icon, label, description, checked, onChange}) {
  return (
    <div className={styles.wrapper} style={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.fields}`}}>
      <div className={styles.left}>
        <div className={styles.iconWrapper} style={{backgroundColor: COLORS.error}}>
          <Icon size={18} style={{color: COLORS.secondary}} />
        </div>
        <div>
          <p className={styles.label} style={{color: COLORS.text}}>{label}</p>
          {description && <p className={styles.description} style={{color: COLORS.labels}}>{description}</p>}
        </div>
      </div>
      <div className={styles.toggle} role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        style={{backgroundColor: checked ? COLORS.primary : COLORS.dataFields}}>
        <div className={styles.toggleCircle} style={{left: checked ? '28px' : '4px'}} />
      </div>
    </div>
  );
}

export default ConfigToggle;
