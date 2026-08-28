import {Info} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  wrapper: "flex gap-3 p-4 rounded-xl mb-4 shadow-sm",
  title: "text-sm font-bold font-inter uppercase mb-1",
  text: "text-sm font-inter",
};

function ReadingTip() {
  return (
    <div className={styles.wrapper}>
      <Info size={16} style={{color: COLORS.primary, flexShrink: 0, marginTop: 2}} />
      <div>
        <p className={styles.title} style={{color: COLORS.text}}>Consejo para una mejor lectura</p>
        <p className={styles.text} style={{color: COLORS.labels}}>
          Para facturas físicas, procure una iluminación central y evite sombras sobre el texto del RUT y el monto total.
        </p>
      </div>
    </div>
  );
}

export default ReadingTip;