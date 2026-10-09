import {Download} from 'lucide-react';
import {COLORS} from '../../constants';

const styles = {
  button: 'flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer mb-4',
};

function ExportButton({onClick, exporting = false, disabled = false, label = 'Exportar a Excel'}) {
  const inactive = disabled || exporting;
  return (
    <button className={styles.button} onClick={onClick} disabled={inactive}
      style={{backgroundColor: COLORS.secondary, color: COLORS.background, opacity: inactive ? 0.6 : 1, cursor: inactive ? 'default' : 'pointer'}}>
      <Download size={16} />
      {exporting ? 'Exportando...' : label}
    </button>
  );
}

export default ExportButton;
